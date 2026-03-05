import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { enviarCorreoProvisional, enviarCorreoConfirmacionCambio } from '../../services/email.service';

const prisma = new PrismaClient();

export const loginUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, usuario, password } = req.body;

    const identificador = email || usuario;

    if (!identificador || !password) {
      res.status(400).json({ msg: 'Por favor ingrese su usuario/correo y contraseña' });
      return;
    }

    const user = await prisma.usuario.findFirst({
      where: {
        OR: [
          { email: identificador },
          { usuario: identificador }
        ]
      }
    });

    if (!user) {
      res.status(401).json({ msg: 'El usuario o correo ingresado no está registrado en el sistema' });
      return;
    }

    // Nota: Si en el futuro implementan encriptación (ej. bcrypt), cambiar esta línea
    // por algo como: const isValid = await bcrypt.compare(password, user.password);
    if (password !== user.password) {
      res.status(401).json({ msg: 'Usuario o contraseña incorrectos' });
      return;
    }

    if (!user.estado) {
      res.status(403).json({ msg: 'Usuario inactivo. Contacte al administrador.' });
      return;
    }

    res.json({
      msg: 'Login exitoso',
      usuario: {
        id: user.id,
        nombre: user.nombre,
        usuario: user.usuario,
        email: user.email,
        rol: user.rol,
        esPasswordProvisional: user.esPasswordProvisional 
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

export const recuperarPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. CAPTURAMOS CUALQUIERA DE LAS DOS FORMAS EN QUE EL FRONTEND PUEDA ENVIARLO
    const valorIngresado = req.body.email || req.body.usuario;

    if (!valorIngresado) {
      res.status(400).json({ msg: 'Por favor ingrese su usuario o correo electrónico' });
      return;
    }

    // 2. Limpiamos espacios en blanco accidentales
    const identificador = String(valorIngresado).trim();

    // 3. Hacemos que busque igual que el login
    const usuario = await prisma.usuario.findFirst({
      where: {
        OR: [
          { email: identificador },
          { usuario: identificador }
        ]
      }
    });

    if (!usuario) {
      res.status(404).json({ msg: 'El correo ingresado no está registrado en el sistema' });
      return;
    }

    // Regla de negocio 1: Generar contraseña provisional de mínimo 8 caracteres, alfanumérica
    const numeroAleatorio = Math.floor(Math.random() * 10);
    const textoAleatorio = Math.random().toString(36).slice(-6).toUpperCase();
    const tempPass = `T${numeroAleatorio}${textoAleatorio}`;

    // Validación extra: Asegurarnos de que el usuario encontrado SÍ tiene un correo guardado
    const correoDestino = usuario.email ? usuario.email.trim() : "";
    
    if (!correoDestino) {
      res.status(500).json({ msg: "El usuario encontrado no tiene un correo válido registrado en la base de datos." });
      return;
    }

    // Regla de negocio 8: Intentamos enviar el correo PRIMERO.
    try {
      // Pasamos el correoDestino validado para evitar el error "No recipients defined"
      await enviarCorreoProvisional(correoDestino, tempPass, usuario.nombre, usuario.usuario);
    } catch (emailError) {
      // Si el correo falla, NO actualizamos la base de datos y mostramos el mensaje exacto
      res.status(500).json({ msg: "Ha ocurrido un error al enviar el correo. Intente nuevamente más tarde." });
      return;
    }

    // Si el correo se envió con éxito, AHORA SÍ activamos la contraseña provisional en la BD.
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        password: tempPass,
        esPasswordProvisional: true
      }
    });

    res.json({ msg: "Se ha enviado una contraseña provisional a su correo electrónico" });

  } catch (error) {
    console.error('Error en recuperación:', error);
    res.status(500).json({ msg: "Ocurrió un error al procesar la solicitud." });
  }
};

export const cambiarPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, passwordActual, nuevaPassword } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    // Mensaje exacto de validación cuando no coinciden (Criterio 7)
    if (!usuario || passwordActual !== usuario.password) {
      res.status(400).json({ msg: "La contraseña no coinciden" });
      return;
    }

    if (nuevaPassword === passwordActual) {
      res.status(400).json({ msg: "La nueva contraseña no puede ser igual a la contraseña provisional" });
      return;
    }

    // Criterio 7: Mensaje literal si falta longitud
    if (nuevaPassword.length < 8) {
      res.status(400).json({ msg: "Falta caracteres" });
      return;
    }

    // Criterio 7: Mensaje literal si falta seguridad (no tiene letras y números)
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9]).+$/;
    if (!regex.test(nuevaPassword)) {
      res.status(400).json({ msg: "Falta seguridad en la contraseña" });
      return;
    }

    await prisma.usuario.update({
      where: { email },
      data: {
        password: nuevaPassword,
        esPasswordProvisional: false 
      }
    });

    // Se envía en segundo plano para no bloquear la respuesta
    enviarCorreoConfirmacionCambio(email).catch(err => console.error(err));

    res.json({ msg: "Contraseña actualizada exitosamente." });

  } catch (error) {
    console.error("❌ Error CRÍTICO al cambiar la contraseña:", error); 
    // Mensaje exacto en caso de error interno (Regla 8 de Cambio de Password)
    res.status(500).json({ msg: "Ocurrió un error al actualizar la contraseña. Intente nuevamente." });
  }
};