// ============================================
// TIPOS GLOBALES - CENTRAL DE ESTERILIZACIÓN
// ============================================

// Estados comunes
export type EstadoGeneral = 'Habilitado' | 'Deshabilitado';
export type EstadoReporte = 'Pendiente' | 'En curso' | 'Finalizado';

// ============================================
// CONFIGURACIÓN
// ============================================

export interface Especialidad {
  id: number;
  codigo: string;
  nombre: string;
  status: EstadoGeneral;
}

export interface Subespecialidad {
  id: number;
  codigo: string;
  especialidad: string;
  subespecialidad: string;
  status: EstadoGeneral;
}

export interface TipoSubespecialidad {
  id: number;
  especialidad: string;
  subespecialidad: string;
  tipoSubespecialidad: string;
  status: EstadoGeneral;
}

export interface Kit {
  id: number;
  codigo: string;
  especialidad: string;
  subespecialidad: string;
  tipoSubespecialidad: string;
  numero: number;
  codigoKit: string;
  status: EstadoGeneral;
}

export interface Proveedor {
  id: number;
  codigo: string;
  nombre: string;
  telefono: string;
  email: string;
  status: EstadoGeneral;
}

export interface Insumo {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  stock: number;
  status: EstadoGeneral;
}

export interface Sede {
  id: number;
  codigo: string;
  nombre: string;
  ciudad: string;
  status: EstadoGeneral;
}

export interface Quirofano {
  id: number;
  codigo: string;
  nombre: string;
  sede: string;
  capacidad: number;
  status: EstadoGeneral;
}

export interface Usuario {
  id: number;
  codigo: string;
  nombre: string;
  email: string;
  rol: string;
  status: EstadoGeneral;
}

// ============================================
// REPORTES
// ============================================

export interface Reporte {
  id: number;
  date: string;
  instrument: string;
  spec: string;
  kit: string;
  user: string;
  type: string;
  provider: string;
  obs: string;
  status: EstadoReporte;
  code?: string;
  lot?: string;
  resp?: string;
}

// ============================================
// DASHBOARD
// ============================================

export interface TimeProcessData {
  name: string;
  min: number;
  max: number;
  avg: number;
}

export interface RejectionData {
  name: string;
  value: number;
  color: string;
}

export interface RepetitionData {
  name: string;
  value: number;
}

export interface CycleData {
  name: string;
  value: number;
}

export interface KitUtilizationData {
  name: string;
  val: number;
  status: 'up' | 'down';
}

export interface ConsumptionData {
  month: string;
  current: number;
  previous: number;
}

// ============================================
// COMPONENTES COMUNES
// ============================================

export interface NavItemProps {
  to: string;
  icon?: React.ComponentType<{ size?: number }>;
  label: string;
  dropdownItems?: { label: string; to: string }[];
  name?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface FormFieldProps {
  label: string;
  placeholder?: string;
  value?: string | number;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  type?: 'text' | 'number' | 'date' | 'email' | 'tel';
  required?: boolean;
  isSelect?: boolean;
  readOnly?: boolean;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export interface BadgeProps {
  status: EstadoGeneral | EstadoReporte;
  children?: React.ReactNode;
}

// ============================================
// INFORMES
// ============================================

export interface InformeOption {
  title: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  to: string;
}

// ============================================
// CICLO DE ESTERILIZACIÓN
// ============================================

export interface CicloEsterilizacion {
  id: number;
  fecha: string;
  instrumento: string;
  especialidad: string;
  kit: string;
  estado: EstadoReporte;
  responsable: string;
}

export interface HojaVida {
  id: number;
  instrumento: string;
  codigo: string;
  fechaIngreso: string;
  proveedor: string;
  mantenimientos: number;
  status: EstadoGeneral;
}
