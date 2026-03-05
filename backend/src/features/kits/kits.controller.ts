import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getKits = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const search = req.query.search as string || '';
    const estadoFiltro = req.query.estado as string;

    const whereClause: any = {
      codigoKit: { contains: search }
    };

    if (estadoFiltro === 'true') whereClause.estado = 'Habilitado';
    if (estadoFiltro === 'false') whereClause.estado = 'Deshabilitado';

    const [total, kits] = await Promise.all([
      prisma.kit.count({ where: whereClause }),
      prisma.kit.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: { 
          especialidad: true, 
          subespecialidad: true,
          instrumentos: {
            include: { instrumento: true } 
          }
        },
        orderBy: { id: 'desc' }
      })
    ]);

    const dataFormateada = kits.map(k => ({
        ...k,
        instrumentos: k.instrumentos.map((ik: any) => ik.instrumento)
    }));

    res.json({ data: dataFormateada, total, totalPages: Math.ceil(total / limit), currentPage: page });
  } catch (error) {
    console.error("Error al obtener kits:", error);
    res.status(500).json({ msg: "Error al obtener kits" });
  }
};

export const createKit = async (req: Request, res: Response) => {
  try {
    const { especialidadId, subespecialidadId, tipoSubespecialidadId, numeroKit, codKit, instrumentosIds } = req.body;

    const nuevoKit = await prisma.kit.create({
      data: { 
        codigoKit: codKit, 
        nombre: `Kit ${codKit}`, 
        numeroKit: Number(numeroKit), 
        especialidadId: Number(especialidadId), 
        subespecialidadId: Number(subespecialidadId),
        tipoSubespecialidad: String(tipoSubespecialidadId), 
        
        // MAGIA DE PRISMA: Crea el Kit e inserta sus instrumentos en la tabla intermedia
        instrumentos: {
            create: instrumentosIds.map((id: number) => ({
                instrumentoId: id
            }))
        }
      }
    });

    res.status(201).json({ msg: "Kit creado correctamente", data: nuevoKit });
  } catch (error: any) {
    console.error("Error al crear kit:", error);
    if (error.code === 'P2002') return res.status(400).json({ msg: "El código de este Kit ya existe. Intente con otro consecutivo." });
    res.status(500).json({ msg: "Error al crear el kit" });
  }
};

export const updateKit = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { instrumentosIds } = req.body;
        await prisma.instrumentoEnKit.deleteMany({
            where: { kitId: Number(id) }
        });
        await prisma.kit.update({
            where: { id: Number(id) },
            data: {
                instrumentos: {
                    create: instrumentosIds.map((instId: number) => ({
                        instrumentoId: instId
                    }))
                }
            }
        });

        res.json({ msg: "Kit actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar kit:", error);
        res.status(500).json({ msg: "Error al actualizar el kit" });
    }
};

export const toggleEstadoKit = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        await prisma.kit.update({
            where: { id: Number(id) },
            data: { 
                estado: estado ? "Habilitado" : "Deshabilitado" 
            }
        });

        res.json({ msg: "Estado actualizado correctamente" });
    } catch (error) {
        console.error("Error al cambiar estado:", error);
        res.status(500).json({ msg: "Error al cambiar el estado del kit" });
    }
};