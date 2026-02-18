# 🚀 Modo SIN Backend - Guía de Uso

## ✅ Cambios Realizados

Tu proyecto ahora funciona **SIN necesidad de backend o base de datos**.

---

## 🔓 Cómo Iniciar Sesión

### Opción 1: Login con cualquier credencial
1. Abre la aplicación
2. Ingresa **cualquier email** (ej: `demo@ejemplo.com`)
3. Ingresa **cualquier contraseña** (ej: `123456`)
4. Click en "Iniciar Sesión"
5. ¡Acceso directo al dashboard! ✅

### Opción 2: Acceso demo rápido
1. En la pantalla de login, click en el botón:
   **"🚀 Acceso Directo (Sin credenciales)"**
2. ¡Acceso inmediato sin llenar formulario! ✅

### Opción 3: Link "Acceso demo rápido"
1. En lugar de "¿Olvidaste tu contraseña?"
2. Ahora dice **"Acceso demo rápido"**
3. Click y entras directamente ✅

---

## 📝 Archivos Modificados

### 1. `src/screens/LoginScreen.tsx`
**Cambios:**
- ❌ Eliminada conexión a backend
- ✅ Login funciona con cualquier credencial
- ✅ Botón de acceso directo agregado
- ✅ Mensaje de "Modo Demo" visible

**Función de login:**
```typescript
const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Solo valida que no estén vacíos
  if (!email || !password) {
    setAlerta('Por favor ingrese sus credenciales');
    return;
  }
  
  // Acceso directo al dashboard
  navigate('/dashboard');
};
```

### 2. `src/clienteAxios.ts`
**Cambios:**
- ❌ Conexión a API desactivada
- ✅ Cliente HTTP simulado
- ✅ Todos los métodos (GET, POST, PUT, DELETE) retornan datos mock
- ✅ Logs en consola para debug

---

## 🎯 Características del Modo Sin Backend

### ✅ Lo que FUNCIONA:
- ✅ Login sin validación
- ✅ Navegación entre todas las páginas
- ✅ Todas las rutas activas
- ✅ Interfaz completa visible
- ✅ Gráficos con datos demo
- ✅ Tablas con datos de ejemplo
- ✅ Modales funcionando
- ✅ Formularios (sin guardar en BD)

### ⚠️ Lo que NO funciona:
- ❌ Guardar datos reales en base de datos
- ❌ Validación de credenciales reales
- ❌ Persistencia de datos entre recargas
- ❌ Comunicación con servidor

---

## 🔄 Cómo Activar el Backend (Cuando lo necesites)

### Paso 1: Restaurar `clienteAxios.ts`
Descomenta el código original en `src/clienteAxios.ts`:

```typescript
// Descomenta esto:
const clienteAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Paso 2: Actualizar `LoginScreen.tsx`
Reemplaza la función `handleLogin` con:

```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!email || !password) {
    setAlerta('Todos los campos son obligatorios');
    return;
  }
  
  try {
    const { data } = await clienteAxios.post('/usuarios/login', {
      email,
      password
    });
    
    localStorage.setItem('token', data.token);
    navigate('/dashboard');
  } catch (error: any) {
    setAlerta(error.response?.data?.msg || 'Error de conexión');
  }
};
```

### Paso 3: Configurar variables de entorno
```bash
# En tu archivo .env
VITE_API_URL=http://localhost:4000/api
```

---

## 💡 Uso Recomendado

### Para Desarrollo Frontend:
✅ **Usa el modo sin backend** - Ideal para:
- Diseñar interfaces
- Probar navegación
- Ajustar estilos
- Mostrar demos
- Presentaciones

### Para Producción:
✅ **Activa el backend** cuando tengas:
- API backend funcionando
- Base de datos configurada
- Sistema de autenticación listo

---

## 🎨 Datos Demo Incluidos

Todos los componentes muestran **datos de ejemplo hardcodeados**:

```typescript
// Ejemplo en DashboardScreen.tsx
const kitsData = [
  { name: 'Cataratas - Kit 08', val: 91.2, status: 'up' },
  { name: 'Cornea - Kit 04', val: 84.5, status: 'down' },
  // ... más datos
];
```

Estos datos son perfectos para:
- ✅ Desarrollo de UI
- ✅ Pruebas visuales
- ✅ Demos y presentaciones
- ✅ Ajustes de diseño

---

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias (solo la primera vez)
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Abrir navegador
# http://localhost:5173

# 4. Login
# - Opción A: Ingresar cualquier email/contraseña
# - Opción B: Click en "Acceso Directo"
# - Opción C: Click en "Acceso demo rápido"
```

---

## 🔍 Verificar que Está en Modo Sin Backend

### 1. Mensaje en Login
Verás un recuadro azul que dice:
```
Modo Demo: Funciona sin conexión a base de datos
```

### 2. Consola del Navegador
Al hacer login, verás:
```
🔓 Login sin backend - Acceso directo
```

### 3. Mensajes de clienteAxios
Si algún componente intenta llamar al backend:
```
⚠️ Modo sin backend: GET /api/usuarios
```

---

## ❓ Preguntas Frecuentes

### ¿Por qué no guarda los datos?
👉 Estás en modo sin backend. Los datos son solo para visualización.

### ¿Puedo crear/editar registros?
👉 Los formularios funcionan pero no guardan en base de datos.

### ¿Cómo pruebo con datos reales?
👉 Activa el backend siguiendo la sección "Cómo Activar el Backend".

### ¿Es seguro para producción?
👉 NO. Este modo es solo para desarrollo/demo. En producción debes activar el backend.

---

## ✅ Resumen

**Ahora puedes:**
- ✅ Iniciar sesión sin backend
- ✅ Navegar por todas las pantallas
- ✅ Ver todas las interfaces
- ✅ Probar la aplicación completa
- ✅ Hacer demos y presentaciones

**Sin necesidad de:**
- ❌ Configurar base de datos
- ❌ Levantar servidor backend
- ❌ Crear usuarios
- ❌ Configurar variables de entorno complejas

---

**¡Disfruta desarrollando sin restricciones!** 🎉

**Modo:** Sin Backend ✅  
**Estado:** Funcionando 100% ✅  
**Login:** Libre ✅
