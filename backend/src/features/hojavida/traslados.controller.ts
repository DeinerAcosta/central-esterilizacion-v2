import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. Obtener inventario disponible por Sede (Para llenar el modal al elegir origen)
export const getInventarioPorSede = async (req: Request, res: Response) => {
  try {
    const { sedeId, tipoTraslado, especialidadId, subespecialidadId, tipoId } = req.query;

    if (!sedeId) return res.status(400).json({ msg: "Debe seleccionar una sede origen" });

    // Filtros dinámicos basados en lo que seleccione el usuario
    const whereClause: any = { sedeId: Number(sedeId), estado: "Habilitado" };
    if (especialidadId) whereClause.especialidadId = Number(especialidadId);
    if (subespecialidadId) whereClause.subespecialidadId = Number(subespecialidadId);
    if (tipoId) whereClause.tipoId = Number(tipoId); // En Kits es un String, pero lo manejamos así por simplicidad

    if (tipoTraslado === 'kit') {
      // Buscar Kits en esta sede
      const kits = await prisma.kit.findMany({ where: whereClause });
      return res.json({ data: kits });
    } else {
      // Buscar Instrumentos SUELTOS en esta sede (que no estén en un kit, si así lo deseas, o todos)
      // Agrupamos para decir "Hay 25 Pinzas Iris"
      const instrumentos = await prisma.hojaVidaInstrumento.groupBy({
        by: ['nombre'],
        where: whereClause,
        _count: { id: true }
      });
      
      const formateados = instrumentos.map(i => ({
        name: i.nombre,
        qty: i._count.id
      }));
      return res.json({ data: formateados });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener el inventario de la sede" });
  }
};

// 2. Ejecutar el Traslado
export const ejecutarTraslado = async (req: Request, res: Response) => {
  try {
    const { sedeOrigenId, sedeDestinoId, fechaDevolucion, tipoTraslado, items } = req.body;

    if (!sedeOrigenId || !sedeDestinoId || !items || items.length === 0) {
      return res.status(400).json({ msg: "Faltan datos para realizar el traslado." });
    }

    if (sedeOrigenId === sedeDestinoId) {
      return res.status(400).json({ msg: "La sede origen no puede ser la misma que la de destino." });
    }

    if (tipoTraslado === 'kit') {
      // Actualizar todos los kits seleccionados
      await prisma.kit.updateMany({
        where: { id: { in: items.map(Number) }, sedeId: Number(sedeOrigenId) },
        data: { sedeId: Number(sedeDestinoId) }
      });
      // Opcional: También actualizar los instrumentos dentro de esos kits
    } else {
      // Mover instrumentos específicos por nombre y cantidad
      // (Esta es una lógica simplificada. Si dicen "Mover 3 Pinzas", buscamos 3 pinzas en esa sede y las movemos)
      for (const item of items) {
        const instsToMove = await prisma.hojaVidaInstrumento.findMany({
          where: { nombre: item.nombre, sedeId: Number(sedeOrigenId), estado: "Habilitado" },
          take: Number(item.cantidad)
        });

        const idsToMove = instsToMove.map(i => i.id);
        if (idsToMove.length > 0) {
          await prisma.hojaVidaInstrumento.updateMany({
            where: { id: { in: idsToMove } },
            data: { sedeId: Number(sedeDestinoId) }
          });
        }
      }
    }

    res.json({ msg: "Traslado ejecutado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al ejecutar el traslado" });
  }
};