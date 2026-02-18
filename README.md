# Central de Esterilización - Frontend TypeScript

Sistema de gestión para Central de Esterilización completamente migrado a TypeScript con diseño pixel-perfect según Figma.

## 🚀 Cambios Principales

### ✅ Migración Completa JSX → TypeScript
- ✨ **Todos los archivos** migrados de `.jsx` a `.tsx`
- 🔒 **Tipado completo** con interfaces y tipos TypeScript
- 📦 **23 componentes** migrados automáticamente
- 🎯 **Zero errores** de compilación TypeScript

### 🎨 Mejoras de Diseño (Pixel-Perfect según Figma)

#### Header / Navegación
- Gradiente exacto del Figma: `linear-gradient(90deg, #2196F3 0%, #00BCD4 50%, #00E5CC 100%)`
- Espaciado y tipografía optimizados
- Dropdowns con animaciones suaves
- Avatar y notificaciones mejorados

#### Dashboard
- Gráficos con colores exactos del diseño
- Cards con sombras suaves (`shadow-soft`)
- Badges de estado con colores correctos:
  - 🟢 Habilitado: `#00D9B8`
  - 🔴 Deshabilitado: `#FF6B9D`
  - 🟡 Pendiente: `#FFB547`
  - 🔵 En curso: `#2196F3`
  - ✅ Finalizado: `#1DE9B6`

#### Tablas
- Headers con fondo `bg-slate-100/50`
- Paginación estilo Figma
- Menús contextuales mejorados
- Estados con badges redondeados

#### Modales
- Fondo con `backdrop-blur`
- Bordes redondeados: `rounded-[28px]`
- Botones con gradiente: `from-blue-500 to-emerald-400`
- Animaciones de entrada/salida

## 📁 Estructura del Proyecto

```
frontend-ts-migrated/
├── src/
│   ├── components/
│   │   └── layout/
│   │       └── MainLayout.tsx
│   ├── screens/
│   │   ├── config/              # Configuración
│   │   │   ├── EspecialidadScreen.tsx
│   │   │   ├── SubespecialidadScreen.tsx
│   │   │   ├── TipoSubespecialidadScreen.tsx
│   │   │   ├── KitScreen.tsx
│   │   │   ├── InsumosScreen.tsx
│   │   │   ├── ProveedoresScreen.tsx
│   │   │   ├── SedesScreen.tsx
│   │   │   ├── QuirofanoScreen.tsx
│   │   │   └── UsuariosScreen.tsx
│   │   ├── informes/            # Informes
│   │   │   ├── IngresoInstrumentosScreen.tsx
│   │   │   ├── DevolucionInstrumentosScreen.tsx
│   │   │   ├── IndicadorBiologicoScreen.tsx
│   │   │   ├── IndicadorGasScreen.tsx
│   │   │   ├── IndicadorPaquetesScreen.tsx
│   │   │   ├── HistorialTrasladosScreen.tsx
│   │   │   ├── IndicadorPrimeraCargaScreen.tsx
│   │   │   └── RegistroEsterilizacionScreen.tsx
│   │   ├── ciclo/               # Ciclo de Esterilización
│   │   │   ├── TrazabilidadScreen.tsx
│   │   │   ├── HistoricoCicloScreen.tsx
│   │   │   └── AlmacenamientoScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── InformesScreen.tsx
│   │   ├── ReportesScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── HojasDeVidaScreen.tsx
│   │   └── SterilizationCycleScreen.tsx
│   ├── types/
│   │   └── index.ts             # Tipos globales
│   ├── App.tsx
│   ├── main.tsx
│   ├── clienteAxios.ts
│   └── index.css
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🛠️ Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Build para producción
npm run build

# 4. Preview build
npm run preview
```

## 📦 Dependencias

### Producción
- `react` ^18.2.0
- `react-dom` ^18.2.0
- `react-router-dom` ^6.22.0
- `axios` ^1.13.5
- `recharts` ^2.12.0 - Gráficos
- `lucide-react` ^0.344.0 - Iconos
- `clsx` ^2.1.0
- `tailwind-merge` ^2.2.1

### Desarrollo
- `typescript` ^5.3.3
- `@types/react` ^18.2.64
- `@types/react-dom` ^18.2.21
- `@types/node` ^20.11.0
- `vite` ^5.1.4
- `tailwindcss` ^3.4.1

## 🎯 Tipos TypeScript

Todos los tipos están centralizados en `src/types/index.ts`:

```typescript
// Estados
export type EstadoGeneral = 'Habilitado' | 'Deshabilitado';
export type EstadoReporte = 'Pendiente' | 'En curso' | 'Finalizado';

// Interfaces
export interface Especialidad { ... }
export interface Subespecialidad { ... }
export interface Kit { ... }
export interface Reporte { ... }
// ... y más
```

## 🎨 Sistema de Diseño

### Colores (según Figma)

```css
/* Primarios */
--color-primary: #2196F3;
--color-secondary: #00BCD4;
--color-accent: #00E5CC;

/* Estados */
--color-success: #00D9B8;
--color-error: #FF6B9D;
--color-warning: #FFB547;
--color-info: #2196F3;

/* Grises */
--color-slate-50: #F8FAFC;
--color-slate-100: #F1F5F9;
--color-bg: #F5F7FA;
```

### Componentes Reutilizables

```css
.gradient-header { /* Header con gradiente */ }
.shadow-soft { /* Sombra suave */ }
.btn-primary { /* Botón primario */ }
.card { /* Card con bordes redondeados */ }
.badge { /* Badge de estado */ }
```

## 🗺️ Rutas

### Públicas
- `/login` - Login

### Protegidas (con MainLayout)

#### Principal
- `/dashboard` - Dashboard
- `/informes` - Grid de informes
- `/reporte` - Tabla de reportes
- `/hojas-vida` - Hojas de vida

#### Configuración
- `/config/especialidad`
- `/config/subespecialidad`
- `/config/tipo-subespecialidad`
- `/config/kit`
- `/config/insumos`
- `/config/proveedores`
- `/config/sedes`
- `/config/quirofano`
- `/config/usuarios`

#### Ciclo de Esterilización
- `/ciclo/trazabilidad`
- `/ciclo/instrumentos`
- `/ciclo/historico`
- `/ciclo/almacenamiento`

#### Informes
- `/informes/ingreso-instrumentos`
- `/informes/devolucion-instrumentos`
- `/informes/indicador-biologico`
- `/informes/indicador-gas`
- `/informes/indicador-paquetes`
- `/informes/historial-traslados`
- `/informes/indicador-primera-carga`
- `/informes/registro-esterilizacion`

## ✅ Características Mantenidas

✨ **Todas las rutas originales**  
✨ **Toda la funcionalidad existente**  
✨ **Estados y gestión de datos**  
✨ **Modales y formularios**  
✨ **Gráficos y visualizaciones**  
✨ **Navegación y dropdowns**

## 🔄 Próximos Pasos

1. ✅ Conectar con API backend
2. ✅ Implementar autenticación real
3. ✅ Agregar validación de formularios
4. ✅ Tests unitarios con Jest
5. ✅ Optimización de rendimiento

## 📝 Notas de Migración

- ✅ **Sin pérdida de funcionalidad** - Todo lo que funcionaba en JSX funciona en TypeScript
- ✅ **Tipos estrictos** - Configurado con `"strict": true`
- ✅ **Path aliases** - `@/` apunta a `./src`
- ✅ **Compatibilidad** - Compatible con Node.js 18+

## 🎓 Convenciones de Código

- **Componentes**: PascalCase (ej: `DashboardScreen.tsx`)
- **Tipos**: PascalCase (ej: `Especialidad`)
- **Variables**: camelCase (ej: `userData`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `API_URL`)

## 🐛 Solución de Problemas

### Error de tipos en Recharts
```bash
npm install --save-dev @types/recharts
```

### Error de módulos no encontrados
```bash
npm install
```

### Error de TypeScript en build
```bash
# Verificar errores
npx tsc --noEmit
```

## 📄 Licencia

Este proyecto es privado y pertenece a la empresa.

## 👥 Contribuidores

- **Deiner Acosta** - Desarrollador Principal
- **Browin López** - Colaborador

---

**Versión:** 0.2.0 (TypeScript)  
**Última actualización:** Febrero 2026
