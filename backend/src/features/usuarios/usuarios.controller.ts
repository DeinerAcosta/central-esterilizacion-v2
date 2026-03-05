import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();


export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const search = req.query.search as string || '';
    const estadoFiltro = req.query.estado as string;
    const limit = 10;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      OR: [
        { nombre: { contains: search } },
        { usuario: { contains: search } }
      ]
    };
    
    if (estadoFiltro === 'true') whereClause.estado = true;
    if (estadoFiltro === 'false') whereClause.estado = false;

    const [total, usuarios] = await Promise.all([
      prisma.usuario.count({ where: whereClause }),
      prisma.usuario.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: [{ estado: 'desc' }, { createdAt: 'desc' }] // Habilitados primero
      })
    ]);

    res.json({ data: usuarios, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Error en getUsuarios:", error);
    res.status(500).json({ msg: "Error al obtener usuarios" });
  }
};

// 2. CREAR USUARIO
export const createUsuario = async (req: Request, res: Response) => {
  try {
    // Nota: El Frontend ya NO debe enviar el campo 'usuario' (Usuario Login) según el documento.
    let { codigo, nombre, apellido, empresa, cargo, email, password, rol, esPropietario, estado, permisos } = req.body;

    // Validación de contraseña flexible (Min 8, mayúscula, minúscula, número)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ msg: "La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número." });
    }

    // Regla: Añadir columna "Código" que viene por defecto.
    if (!codigo || codigo.trim() === '') {
      const count = await prisma.usuario.count();
      const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
      codigo = `USR-${count + 1}-${randomPart}`;
    }

    // Regla (implícita por BD): Como el documento pide quitar el "Usuario Login" del front, 
    // pero la BD requiere un 'usuario' único para iniciar sesión, lo autogeneramos a partir del email.
    // Ej: si el email es 'juan.perez@clinica.com', el usuario será 'juan.perez'
    let usuarioGenerado = req.body.usuario; 
    if (!usuarioGenerado || usuarioGenerado.trim() === '') {
       usuarioGenerado = email.split('@')[0];
       // Para asegurar que sea único en caso de que existan dos correos parecidos, 
       // añadimos un random si ya existe alguien con ese usuario.
       const existe = await prisma.usuario.findUnique({ where: { usuario: usuarioGenerado }});
       if(existe) {
          usuarioGenerado = `${usuarioGenerado}${Math.floor(Math.random() * 1000)}`;
       }
    }

    const hashed = await bcrypt.hash(password, 10);
    
    const nuevo = await prisma.usuario.create({
      data: { 
        codigo, // <--- Aquí pasamos el código para evitar el error de Prisma
        nombre,
        apellido,
        empresa,
        cargo,
        usuario: usuarioGenerado, // Guardamos el usuario generado automáticamente
        email,
        rol,
        esPropietario: Boolean(esPropietario),
        estado: estado !== undefined ? Boolean(estado) : true,
        password: hashed,
        permisos: permisos || {} 
      }
    });

    res.status(201).json({ msg: "Usuario creado correctamente", data: nuevo });
  } catch (error: any) {
    console.error("Error al crear usuario:", error); 
    if (error.code === 'P2002') return res.status(400).json({ msg: "El correo electrónico ya está registrado." });
    res.status(500).json({ msg: "Error al crear el usuario en la Base de Datos" });
  }
};

// 3. EDITAR USUARIO (NUEVO)
export const updateUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { codigo, nombre, apellido, empresa, cargo, email, password, rol, esPropietario, estado, permisos } = req.body;

    const dataToUpdate: any = {
        nombre,
        apellido,
        empresa,
        cargo,
        email,
        rol,
        esPropietario: Boolean(esPropietario),
        estado: Boolean(estado),
        permisos: permisos || {}
    };

    // Si mandan un código en la edición, lo actualizamos. 
    if (codigo) dataToUpdate.codigo = codigo;

    // Si el usuario escribió una nueva contraseña en editar, la validamos y encriptamos
    if (password && password.trim() !== '') {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
          return res.status(400).json({ msg: "La nueva contraseña debe tener mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número." });
        }
        dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    await prisma.usuario.update({
        where: { id: Number(id) },
        data: dataToUpdate
    });

    res.json({ msg: "Usuario actualizado correctamente" });
  } catch (error: any) {
    console.error("Error al actualizar usuario:", error);
    if (error.code === 'P2002') return res.status(400).json({ msg: "El correo ya está registrado a otra persona." });
    res.status(500).json({ msg: "Error al actualizar el usuario." });
  }
};

// 4. CAMBIAR ESTADO (NUEVO)
export const toggleEstadoUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    await prisma.usuario.update({
      where: { id: Number(id) },
      data: { estado: Boolean(estado) }
    });

    res.json({ msg: "Estado actualizado correctamente" });
  } catch (error) {
    console.error("Error al cambiar estado:", error);
    res.status(500).json({ msg: "Error al cambiar el estado del usuario." });
  }
};