import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// 1. OBTENER HOJAS DE VIDA (Para la grilla)
// ==========================================
export const getHojasVida = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const search = req.query.search as string || '';

    const whereClause: any = {
      OR: [
        { codigo: { contains: search } },
        { numeroSerie: { contains: search } },
        { fabricante: { contains: search } },
        { nombre: { contains: search } }
      ]
    };

    if (req.query.estado) whereClause.estado = String(req.query.estado);
    if (req.query.especialidadId) whereClause.especialidadId = Number(req.query.especialidadId);
    if (req.query.subespecialidadId) whereClause.subespecialidadId = Number(req.query.subespecialidadId);

    const [total, hojas] = await Promise.all([
      prisma.hojaVidaInstrumento.count({ where: whereClause }),
      prisma.hojaVidaInstrumento.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          especialidad: true,
          subespecialidad: true,
          tipo: true,
          proveedor: true,
          kit: true,
          sede: true,
          propietario: { select: { nombre: true, apellido: true } }
        },
        orderBy: {
            estado: 'desc' 
        }
      })
    ]);

    res.json({ data: hojas, total, totalPages: Math.ceil(total / limit), currentPage: page });
  } catch (error) {
    console.error("❌ Error al obtener hojas de vida:", error);
    res.status(500).json({ msg: "Error al obtener las hojas de vida" });
  }
};

// ==========================================
// 2. CREAR HOJA DE VIDA (Estricto a Requerimientos)
// ==========================================
export const createHojaVida = async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    
    const fotoUrl = files?.['foto'] ? `/uploads/${files['foto'][0].filename}` : null;
    const garantiaUrl = files?.['garantia'] ? `/uploads/${files['garantia'][0].filename}` : null;
    const registroInvimaUrl = files?.['registroInvimaDoc'] ? `/uploads/${files['registroInvimaDoc'][0].filename}` : null;
    const codigoInstrumentoUrl = files?.['codigoInstrumentoDoc'] ? `/uploads/${files['codigoInstrumentoDoc'][0].filename}` : null;

    if (!fotoUrl || !garantiaUrl || !registroInvimaUrl || !codigoInstrumentoUrl) {
      return res.status(400).json({ msg: "Faltan archivos adjuntos obligatorios (Foto, Garantía, INVIMA, Cód. Instrumento)." });
    }

    const {
      nombre, especialidadId, subespecialidadId, tipoId, proveedorId,
      fabricante, paisOrigen, numeroSerie, registroInvima,
      material, materialOtro, esterilizacion, 
      frecuenciaMantenimiento, observacionesTecnico,
      propietarioId, notasObservaciones
    } = req.body;

    if (!nombre || !especialidadId || !subespecialidadId || !tipoId || !numeroSerie || !registroInvima || !proveedorId || !material || !esterilizacion || !frecuenciaMantenimiento || !propietarioId) {
      return res.status(400).json({ msg: "Faltan campos obligatorios en el formulario." });
    }

    const esp = await prisma.especialidad.findUnique({ where: { id: Number(especialidadId) } });
    const sub = await prisma.subespecialidad.findUnique({ where: { id: Number(subespecialidadId) } });
    const tipo = await prisma.tipoSubespecialidad.findUnique({ where: { id: Number(tipoId) } });

    if (!esp || !sub || !tipo) return res.status(400).json({ msg: "Especialidad, subespecialidad o tipo inválidos" });

    const prefijo = `${esp.nombre.substring(0, 2).toUpperCase()}${sub.nombre.substring(0, 2).toUpperCase()}${tipo.nombre.substring(0, 2).toUpperCase()}`;
    const count = await prisma.hojaVidaInstrumento.count();
    const codigoGenerado = `${prefijo}-${String(count + 1).padStart(4, '0')}`; 

    const nuevaHoja = await prisma.hojaVidaInstrumento.create({
      data: {
        codigo: codigoGenerado,
        nombre: String(nombre), 
        especialidadId: Number(especialidadId),
        subespecialidadId: Number(subespecialidadId),
        tipoId: Number(tipoId),
        proveedorId: Number(proveedorId),
        
        fabricante: String(fabricante),
        paisOrigen: String(paisOrigen),
        numeroSerie: String(numeroSerie),
        registroInvima: String(registroInvima),
        
        material: String(material),
        materialOtro: material === 'Otros' ? materialOtro : null,
        esterilizacion: String(esterilizacion),
        
        frecuenciaMantenimiento: String(frecuenciaMantenimiento),
        observacionesTecnico: observacionesTecnico || null,
        
        propietarioId: Number(propietarioId),
        notasObservaciones: notasObservaciones || null,
        
        estadoActual: "P. registrar",
        cicloEsterilizacion: 0,
        estado: "P. registrar", 

        fotoUrl, garantiaUrl, registroInvimaUrl, codigoInstrumentoUrl
      }
    });

    res.status(201).json({ msg: "Hoja de vida creada exitosamente en estado 'P. registrar'", data: nuevaHoja });
  } catch (error: any) {
    console.error("❌ Error al crear hoja de vida:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ msg: "El número de serie o Registro INVIMA ya está registrado en otro instrumento." });
    }
    res.status(500).json({ msg: "Error interno al guardar la hoja de vida" });
  }
};

// ==========================================
// 3. REGISTRAR INFORMACIÓN CONTABLE (Para Habilitar)
// ==========================================
export const registrarContable = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // VALIDACIÓN DE NEGOCIO: No re-registrar
    const instExistente = await prisma.hojaVidaInstrumento.findUnique({ where: { id: Number(id) } });
    if (!instExistente) return res.status(404).json({ msg: "Instrumento no encontrado" });
    if (instExistente.costo !== null || instExistente.estado !== "P. registrar") {
      return res.status(400).json({ msg: "El instrumento ya cuenta con un registro contable activo." });
    }

    // ✅ FIX: Se asegura de leer "costoAdquisicion" que es la variable que envía el frontend
    const { fechaCompra, costoAdquisicion, iva, numeroFactura, vidaUtil } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const facturaUrl = files?.['facturaDoc'] ? `/uploads/${files['facturaDoc'][0].filename}` : null;

    if (!fechaCompra || !costoAdquisicion || !numeroFactura || !facturaUrl) {
      return res.status(400).json({ msg: "Faltan campos obligatorios para el registro contable" });
    }

    const hoja = await prisma.hojaVidaInstrumento.update({
      where: { id: Number(id) },
      data: {
        fechaCompra: new Date(fechaCompra),
        costo: parseFloat(costoAdquisicion), // Se guarda en el campo 'costo' de la BD
        iva: iva ? parseFloat(iva) : null,
        numeroFactura: String(numeroFactura),
        vidaUtil: vidaUtil ? parseFloat(vidaUtil) : null,
        facturaUrl,
        estado: "Habilitado",       
        estadoActual: "Habilitado"
      }
    });

    res.json({ msg: "Registro contable exitoso. El instrumento ahora está Habilitado.", data: hoja });
  } catch (error) {
    res.status(500).json({ msg: "Error al registrar datos contables" });
  }
};

// ==========================================
// 3.1 CAMBIAR ESTADO RÁPIDO (Habilitar/Deshabilitar)
// ==========================================
export const patchEstadoHojaVida = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // "Habilitado", "Deshabilitado", "En mantenimiento", "De baja"

    if (!estado) return res.status(400).json({ msg: "Debe enviar el estado" });

    const inst = await prisma.hojaVidaInstrumento.findUnique({ where: { id: Number(id) }});
    if (!inst) return res.status(404).json({ msg: "Instrumento no encontrado" });

    // Regla de Negocio: No habilitar si no tiene contabilidad (evita saltarse el paso de P. registrar)
    if (estado === 'Habilitado' && !inst.costo) {
       return res.status(400).json({ msg: "No se puede habilitar un instrumento sin su registro contable." });
    }

    const hoja = await prisma.hojaVidaInstrumento.update({
      where: { id: Number(id) },
      data: { estado: estado, estadoActual: estado }
    });

    res.json({ msg: `Estado actualizado correctamente a ${estado}`, data: hoja });
  } catch (error) {
    res.status(500).json({ msg: "Error al cambiar el estado" });
  }
};

// ==========================================
// 4. OBTENER INVENTARIO AGRUPADO
// ==========================================
export const getInventario = async (req: Request, res: Response) => {
  try {
    const { especialidadId, subespecialidadId, tipoId, search } = req.query;

    // ✅ FIX: Trae Habilitados y Deshabilitados según Criterio de Aceptación
    const whereClause: any = { 
      estado: { in: ["Habilitado", "Deshabilitado"] } 
    }; 
    
    if (especialidadId) whereClause.especialidadId = Number(especialidadId);
    if (subespecialidadId) whereClause.subespecialidadId = Number(subespecialidadId);
    if (tipoId) whereClause.tipoId = Number(tipoId);
    
    if (search) {
      whereClause.OR = [
        { nombre: { contains: String(search) } },
        { kit: { codigoKit: { contains: String(search) } } }
      ];
    }

    const instrumentos = await prisma.hojaVidaInstrumento.findMany({
      where: whereClause,
      include: {
        especialidad: true,
        subespecialidad: true,
        tipo: true,
        kit: true
      },
      // ✅ FIX: Ordena los habilitados de primero
      orderBy: {
        estado: 'asc'
      }
    });

    const agrupado: Record<string, any> = {};

    instrumentos.forEach(inst => {
      const key = `${inst.especialidadId}-${inst.subespecialidadId}-${inst.tipoId}`;
      if (!agrupado[key]) {
        agrupado[key] = {
          id: key,
          esp: inst.especialidad?.nombre || 'N/A',
          sub: inst.subespecialidad?.nombre || 'N/A',
          tipo: inst.tipo?.nombre || 'N/A',
          cant: 0,
          kits: new Set<string>() 
        };
      }
      
      agrupado[key].cant += 1;
      
      if (inst.kit?.codigoKit) {
        agrupado[key].kits.add(inst.kit.codigoKit);
      }
    });

    const resultado = Object.values(agrupado).map(item => ({
      ...item,
      kits: Array.from(item.kits)
    }));

    res.json({ data: resultado });
  } catch (error) {
    console.error("❌ Error al obtener inventario:", error);
    res.status(500).json({ msg: "Error al obtener el inventario agrupado" });
  }
};

// ==========================================
// 5. OBTENER CONTROL DE BAJAS
// ==========================================
export const getControlBajas = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const { fechaDesde, fechaHasta, especialidadId, subespecialidadId, search } = req.query;

    const whereClause: any = { estado: "De baja" };

    if (especialidadId) whereClause.especialidadId = Number(especialidadId);
    if (subespecialidadId) whereClause.subespecialidadId = Number(subespecialidadId);
    
    if (search) {
      whereClause.OR = [
        { nombre: { contains: String(search) } },
        { codigo: { contains: String(search) } }
      ];
    }

    if (fechaDesde && fechaHasta) {
      whereClause.updatedAt = {
        gte: new Date(`${fechaDesde}T00:00:00.000Z`),
        lte: new Date(`${fechaHasta}T23:59:59.999Z`)
      };
    }

    const [total, bajas] = await Promise.all([
      prisma.hojaVidaInstrumento.count({ where: whereClause }),
      prisma.hojaVidaInstrumento.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          especialidad: true,
          subespecialidad: true,
          kit: true
        },
        orderBy: { updatedAt: 'desc' } 
      })
    ]);

    res.json({ data: bajas, total, totalPages: Math.ceil(total / limit), currentPage: page });
  } catch (error) {
    console.error("❌ Error al obtener control de bajas:", error);
    res.status(500).json({ msg: "Error al obtener control de bajas" });
  }
};

// ==========================================
// 6. EDITAR HOJA DE VIDA
// ==========================================
export const updateHojaVida = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    // 1. Validar que la hoja de vida exista
    const instExistente = await prisma.hojaVidaInstrumento.findUnique({ where: { id: Number(id) } });
    if (!instExistente) return res.status(404).json({ msg: "Instrumento no encontrado" });

    // 2. Preparamos los datos de texto a actualizar
    const updateData: any = {
      nombre: data.nombre || instExistente.nombre,
      especialidadId: data.especialidadId ? Number(data.especialidadId) : instExistente.especialidadId,
      subespecialidadId: data.subespecialidadId ? Number(data.subespecialidadId) : instExistente.subespecialidadId,
      tipoId: data.tipoId ? Number(data.tipoId) : instExistente.tipoId,
      
      fabricante: data.fabricante || instExistente.fabricante,
      numeroSerie: data.numeroSerie || instExistente.numeroSerie,
      registroInvima: data.registroInvima || instExistente.registroInvima,
      proveedorId: data.proveedorId ? Number(data.proveedorId) : instExistente.proveedorId,
      paisOrigen: data.paisOrigen || instExistente.paisOrigen,
      
      material: data.material || instExistente.material,
      materialOtro: data.material === 'Otros' ? data.materialOtro : null,
      esterilizacion: data.esterilizacion || instExistente.esterilizacion,
      
      frecuenciaMantenimiento: data.frecuenciaMantenimiento || instExistente.frecuenciaMantenimiento,
      observacionesTecnico: data.observacionesTecnico || null,
      
      propietarioId: data.propietarioId ? Number(data.propietarioId) : instExistente.propietarioId,
      notasObservaciones: data.notasObservaciones || null,
    };

    // 3. Si vienen archivos nuevos en la petición, los actualizamos
    if (files?.['foto']?.[0]) updateData.fotoUrl = `/uploads/${files['foto'][0].filename}`;
    if (files?.['garantia']?.[0]) updateData.garantiaUrl = `/uploads/${files['garantia'][0].filename}`;
    if (files?.['registroInvimaDoc']?.[0]) updateData.registroInvimaUrl = `/uploads/${files['registroInvimaDoc'][0].filename}`;
    if (files?.['codigoInstrumentoDoc']?.[0]) updateData.codigoInstrumentoUrl = `/uploads/${files['codigoInstrumentoDoc'][0].filename}`;

    // 4. Ejecutar la actualización en la base de datos con Prisma
    const hojaActualizada = await prisma.hojaVidaInstrumento.update({
      where: { id: Number(id) },
      data: updateData
    });

    res.status(200).json({ 
      msg: 'Hoja de vida actualizada exitosamente', 
      data: hojaActualizada 
    });

  } catch (error: any) {
    console.error("❌ Error al actualizar hoja de vida:", error);
    // Verificamos si es error de duplicado de código/serie/invima
    if (error.code === 'P2002') {
      return res.status(400).json({ msg: 'El Número de Serie o Registro INVIMA ingresado ya está en uso.' });
    }
    res.status(500).json({ msg: "Error interno al actualizar la hoja de vida" });
  }
};