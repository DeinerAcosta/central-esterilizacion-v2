import React, { useState, useEffect, useRef } from 'react';
import {
  Search, PlusCircle, ChevronLeft, ChevronRight, ChevronDown, Download,
  ArrowRightLeft, X, Calendar, Paperclip, Image as ImageIcon,
  Database, ChevronsLeft, ChevronsRight, MoreVertical, Eye, Edit, FileText,
  DollarSign
} from 'lucide-react';
import Swal from 'sweetalert2';

/* ══════════════════════════════════════════════════════════
   ESTILOS GLOBALES
   ══════════════════════════════════════════════════════════ */
const sharedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { font-family: 'Inter', sans-serif; box-sizing: border-box; }

  .hv-save-btn {
    padding: 11px 48px; border-radius: 30px; border: none; cursor: pointer;
    background: linear-gradient(90deg, #3b82f6 0%, #34d399 100%);
    color: #fff; font-weight: 700; font-size: 14px;
    box-shadow: 0 4px 14px rgba(59,130,246,0.35);
    transition: opacity 0.2s, transform 0.15s;
  }
  .hv-save-btn:hover { opacity: 0.9; transform: translateY(-1px); }

  .hv-cancel-btn {
    background: none; border: none; cursor: pointer;
    font-size: 14px; font-weight: 600; color: #64748b;
    transition: color 0.2s; padding: 0;
  }
  .hv-cancel-btn:hover { color: #ef4444; }

  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

/* ══════════════════════════════════════════════════════════
   COMPONENTES NOTCH — diseño IDÉNTICO a InsumosScreen
   ══════════════════════════════════════════════════════════ */

/* ── Input: label flota al recibir foco o tener valor ── */
interface ModalNotchInputProps {
  id?: string; label: string; value: string | number | null;
  disabled?: boolean; required?: boolean; type?: string;
  min?: string; max?: string;
  onChange: (value: string) => void;
}
const ModalNotchInput: React.FC<ModalNotchInputProps> = ({
  id, label, value, disabled = false, required = false,
  type = 'text', min, max, onChange
}) => {
  const [focused, setFocused] = useState(false);
  const safeValue = value === null || value === undefined ? '' : String(value);
  // Igual que InsumosScreen: sube cuando hay valor o está enfocado
  const active = focused || safeValue.length > 0;

  const blockNonNumeric = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type !== 'number') return;
    const allowed = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'];
    if (allowed.includes(e.key) || e.ctrlKey || e.metaKey) return;
    if (!/^\d$/.test(e.key) && e.key !== '.') e.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    if (type === 'number') v = v.replace(/[^0-9.]/g, '');
    onChange(v);
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        id={id}
        type={type === 'number' ? 'text' : type}
        inputMode={type === 'number' ? 'decimal' : undefined}
        value={safeValue}
        disabled={disabled}
        placeholder=""
        min={type === 'date' ? min : undefined}
        max={type === 'date' ? max : undefined}
        onChange={handleChange}
        onKeyDown={blockNonNumeric}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', height: 48, borderRadius: 30,
          border: `1.5px solid ${focused ? '#3b82f6' : '#d1d5db'}`,
          background: disabled ? '#f8fafc' : '#fff',
          /* padding dinámico igual que Insumos */
          padding: active ? '14px 16px 0 16px' : '0 16px',
          fontSize: 13.5, color: disabled ? '#94a3b8' : '#334155',
          outline: 'none', boxSizing: 'border-box',
          transition: 'border-color 0.2s, padding 0.18s',
          fontFamily: 'Inter, sans-serif',
          cursor: disabled ? 'not-allowed' : 'text',
        } as React.CSSProperties}
      />
      <label htmlFor={id} style={{
        position: 'absolute',
        left: 18,
        /* flota al top cuando active, igual que Insumos */
        top: active ? 0 : '50%',
        transform: 'translateY(-50%)',
        fontSize: active ? 10.5 : 13,
        color: focused ? '#3b82f6' : (active ? '#6b7280' : '#9ca3af'),
        pointerEvents: 'none',
        transition: 'all 0.18s ease',
        background: disabled ? '#f8fafc' : '#fff',
        padding: '0 4px',
        fontFamily: 'Inter, sans-serif',
        whiteSpace: 'nowrap',
      }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: 1 }}>*</span>}
      </label>
      {type === 'date' && (
        <Calendar size={16} style={{
          position: 'absolute', right: 14, top: '50%',
          transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af'
        }} />
      )}
    </div>
  );
};

/* ── Select: label SIEMPRE fijo en el borde superior (igual que Insumos) ── */
interface ModalNotchSelectProps {
  id?: string; label: string; value: string | number | null;
  disabled?: boolean; required?: boolean; compact?: boolean;
  onChange: (value: string) => void;
  options: { value: string | number; label: string }[];
}
const ModalNotchSelect: React.FC<ModalNotchSelectProps> = ({
  id, label, value, disabled = false, required = false,
  compact = false, onChange, options
}) => {
  const [focused, setFocused] = useState(false);
  const safeValue = value === null || value === undefined ? '' : String(value);
  const bgColor = disabled ? '#f8fafc' : (compact ? (focused ? '#fff' : '#f8fafc') : '#fff');

  return (
    <div style={{ position: 'relative' }}>
      <select
        id={id}
        value={safeValue}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          height: compact ? 42 : 48,
          borderRadius: 30,
          border: `1.5px solid ${focused ? '#3b82f6' : '#d1d5db'}`,
          background: bgColor,
          /* padding-top para que el valor no tape el label */
          padding: compact ? '10px 36px 0 16px' : '14px 36px 0 16px',
          fontSize: compact ? 13 : 13.5,
          color: safeValue === '' ? '#9ca3af' : (disabled ? '#94a3b8' : '#334155'),
          outline: 'none',
          appearance: 'none' as const,
          boxSizing: 'border-box' as const,
          transition: 'border-color 0.2s',
          fontFamily: 'Inter, sans-serif',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <option value="" style={{ color: '#9ca3af' }}>Seleccionar...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {/* Label siempre fijo en el borde superior — igual que Insumos */}
      <label htmlFor={id} style={{
        position: 'absolute',
        left: 18, top: 0,
        transform: 'translateY(-50%)',
        fontSize: 10.5,
        color: focused ? '#3b82f6' : '#6b7280',
        pointerEvents: 'none',
        background: bgColor,
        padding: '0 4px',
        fontFamily: 'Inter, sans-serif',
        whiteSpace: 'nowrap',
        transition: 'color 0.18s',
      }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: 1 }}>*</span>}
      </label>

      <ChevronDown size={15} style={{
        position: 'absolute', right: 14, top: '50%',
        transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af'
      }} />
    </div>
  );
};

/* ── File Picker con estilo Notch ── */
interface ModalNotchFileProps {
  label: string; required?: boolean;
  file: File | string | null; onClick: () => void; disabled?: boolean;
}
const ModalNotchFile: React.FC<ModalNotchFileProps> = ({ label, required, file, onClick, disabled }) => {
  const isString = typeof file === 'string';
  const name = isString
    ? 'Ver Documento'
    : (file ? ((file as File).name.length > 22 ? (file as File).name.slice(0, 22) + '…' : (file as File).name) : 'Subir archivo');
  const hasFile = file !== null && file !== '';
  const bgColor = hasFile && !disabled ? '#eff6ff' : (disabled ? '#f8fafc' : '#fff');

  return (
    <div style={{ position: 'relative', cursor: disabled ? 'not-allowed' : 'pointer' }}
      onClick={!disabled ? onClick : undefined}>
      <div style={{
        width: '100%', height: 48, borderRadius: 30,
        border: `1.5px solid ${hasFile && !disabled ? '#3b82f6' : '#d1d5db'}`,
        background: bgColor,
        padding: '14px 36px 0 16px',
        display: 'flex', alignItems: 'flex-end', paddingBottom: 6,
        boxSizing: 'border-box',
      }}>
        <span style={{
          flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          fontSize: 13.5, fontFamily: 'Inter, sans-serif',
          color: hasFile && !disabled ? '#2563eb' : (disabled ? '#94a3b8' : '#9ca3af'),
          fontWeight: hasFile ? 500 : 400,
          textDecoration: isString ? 'underline' : 'none',
        }}>
          {name}
        </span>
        <Paperclip size={14} style={{
          position: 'absolute', right: 14, top: '50%',
          transform: 'translateY(-50%)', pointerEvents: 'none',
          color: hasFile && !disabled ? '#3b82f6' : '#d1d5db'
        }} />
      </div>
      {/* Label igual que select: siempre fijo en borde */}
      <label style={{
        position: 'absolute', left: 18, top: 0,
        transform: 'translateY(-50%)',
        fontSize: 10.5,
        color: hasFile && !disabled ? '#3b82f6' : '#6b7280',
        pointerEvents: 'none',
        background: bgColor,
        padding: '0 4px',
        fontFamily: 'Inter, sans-serif',
        whiteSpace: 'nowrap',
      }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: 1 }}>*</span>}
      </label>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ══════════════════════════════════════════════════════════ */
const HojasDeVidaScreen: React.FC = () => {
  const permisos = { puedeRegistrarContable: true };

  const [activeTab, setActiveTab]             = useState<'hv' | 'inventario'>('hv');
  const [viewState, setViewState]             = useState<'list'|'create'|'edit'|'detail'>('list');
  const [isBajasOpen, setIsBajasOpen]         = useState(false);
  const [isTrasladarOpen, setIsTrasladarOpen] = useState(false);
  const [isRCOpen, setIsRCOpen]               = useState(false);
  const [openActionMenu, setOpenActionMenu]   = useState<number | null>(null);
  const [selectedHVForRC, setSelectedHVForRC] = useState<any>(null);

  const [especialidades, setEspecialidades]   = useState<any[]>([]);
  const [subespecialidades, setSubs]          = useState<any[]>([]);
  const [tipos, setTipos]                     = useState<any[]>([]);
  const [proveedores, setProveedores]         = useState<any[]>([]);
  const [propietarios, setPropietarios]       = useState<any[]>([]);
  const [sedesDB, setSedesDB]                 = useState<any[]>([]);

  const [filterEsp, setFilterEsp]         = useState('');
  const [filterSub, setFilterSub]         = useState('');
  const [filterEstado, setFilterEstado]   = useState('');
  const [searchHV, setSearchHV]           = useState('');
  const [filterInvEsp, setFilterInvEsp]   = useState('');
  const [filterInvSub, setFilterInvSub]   = useState('');
  const [filterInvTipo, setFilterInvTipo] = useState('');
  const [searchInv, setSearchInv]         = useState('');

  const [dataHV, setDataHV]         = useState<any[]>([]);
  const [dataInv, setDataInv]       = useState<any[]>([]);
  const [loading, setLoading]       = useState(false);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRec, setTotalRec]     = useState(0);

  const initForm = {
    id: null, codigo: '',
    especialidadId: '', subespecialidadId: '', tipoId: '',
    nombre: '', fabricante: '', paisOrigen: '', numeroSerie: '', registroInvima: '',
    proveedorId: '', material: '', materialOtro: '', esterilizacion: '',
    frecuenciaMantenimiento: '', observacionesTecnico: '',
    estadoActual: 'P. registrar', propietarioId: '', notasObservaciones: '',
    cicloEsterilizacion: '0', proximoMantenimiento: null,
    kit: null, costo: null, fechaCompra: null, iva: null, numeroFactura: null, vidaUtil: null
  };
  const [form, setForm]   = useState<any>(initForm);
  const setF = (k: string, v: string) => setForm((p: any) => ({ ...p, [k]: v }));

  const [fotoFile, setFotoFile]         = useState<File | string | null>(null);
  const [garantiaFile, setGarantiaFile] = useState<File | string | null>(null);
  const [invimaFile, setInvimaFile]     = useState<File | string | null>(null);
  const [codigoFile, setCodigoFile]     = useState<File | string | null>(null);
  const fotoRef     = useRef<HTMLInputElement>(null);
  const garantiaRef = useRef<HTMLInputElement>(null);
  const invimaRef   = useRef<HTMLInputElement>(null);
  const codigoRef   = useRef<HTMLInputElement>(null);

  const [rcForm, setRcForm]       = useState({ fechaCompra: '', costoAdquisicion: '', iva: '', numeroFactura: '', vidaUtil: '' });
  const setRC = (k: string, v: string) => setRcForm(p => ({ ...p, [k]: v }));
  const [facturaFile, setFacturaFile] = useState<File | null>(null);
  const facturaRef                    = useRef<HTMLInputElement>(null);

  const [transferType, setTransferType]         = useState<'kit' | 'instrumento'>('kit');
  const [trasladoForm, setTrasladoForm]         = useState({ sedeOrigenId: '', sedeDestinoId: '', fechaDevolucion: '' });
  const [inventarioOrigen, setInventarioOrigen] = useState<any[]>([]);
  const [selectedItems, setSelectedItems]       = useState<any[]>([]);
  const [trasladoEsp, setTrasladoEsp]           = useState('');
  const [trasladoSub, setTrasladoSub]           = useState('');
  const [trasladoSearch, setTrasladoSearch]     = useState('');

  const [bajasData, setBajasData]               = useState<any[]>([]);
  const [bajasLoading, setBajasLoading]         = useState(false);
  const [bajasDesde, setBajasDesde]             = useState('');
  const [bajasHasta, setBajasHasta]             = useState('');
  const [bajasEsp, setBajasEsp]                 = useState('');
  const [bajasSub, setBajasSub]                 = useState('');
  const [bajasSearch, setBajasSearch]           = useState('');
  const [bajasPage, setBajasPage]               = useState(1);
  const [bajasTotalPages, setBajasTotalPages]   = useState(1);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => { fetchListas(); }, []);
  useEffect(() => { if (viewState==='list' && activeTab==='hv' && !isBajasOpen) fetchHV(); },        [page, searchHV, filterEstado, filterEsp, filterSub, activeTab, viewState, isBajasOpen]);
  useEffect(() => { if (viewState==='list' && activeTab==='inventario' && !isBajasOpen) fetchInv(); },[filterInvEsp, filterInvSub, filterInvTipo, searchInv, activeTab, viewState, isBajasOpen]);
  useEffect(() => { if (isTrasladarOpen && trasladoForm.sedeOrigenId) fetchOrigenInv(); else { setInventarioOrigen([]); setSelectedItems([]); } }, [trasladoForm.sedeOrigenId, transferType, trasladoEsp, trasladoSub, isTrasladarOpen]);
  useEffect(() => { if (isBajasOpen) fetchBajas(); }, [isBajasOpen, bajasDesde, bajasHasta, bajasEsp, bajasSub, bajasSearch, bajasPage]);
  useEffect(() => {
    const fn = () => setOpenActionMenu(null);
    document.addEventListener('click', fn);
    return () => document.removeEventListener('click', fn);
  }, []);

  const fetchListas = async () => {
    try {
      const [rEsp,rSub,rTip,rSed,rProv,rUsers] = await Promise.all([
        fetch('http://localhost:4000/api/especialidades'),
        fetch('http://localhost:4000/api/subespecialidades'),
        fetch('http://localhost:4000/api/tipos-subespecialidad'),
        fetch('http://localhost:4000/api/sedes'),
        fetch('http://localhost:4000/api/proveedores'),
        fetch('http://localhost:4000/api/usuarios'),
      ]);
      setEspecialidades((await rEsp.json()).data||[]);
      setSubs((await rSub.json()).data||[]);
      setTipos((await rTip.json()).data||[]);
      setSedesDB((await rSed.json()).data||[]);
      const provs = (await rProv.json()).data||[];
      // Solo proveedores tipo "Compras" — igual que Insumos
      setProveedores(provs.filter((p:any)=>
        p.tipo==='Compras'||p.tipoProveedor==='Compras'||p.categoria==='Compras'||p.tipo_proveedor==='Compras'
      ));
      const users = (await rUsers.json()).data||[];
      setPropietarios(users.filter((u:any)=>u.esPropietario===true && u.estado));
    } catch(e){ console.error(e); }
  };

  const fetchHV = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page: String(page), search: searchHV });
      if (filterEstado) q.append('estado', filterEstado);
      if (filterEsp)    q.append('especialidadId', filterEsp);
      if (filterSub)    q.append('subespecialidadId', filterSub);
      const res  = await fetch(`http://localhost:4000/api/hoja-vida?${q}`);
      const json = await res.json();
      setDataHV(json.data||[]); setTotalPages(json.totalPages||1); setTotalRec(json.total||0);
    } catch(e){ console.error(e); } finally { setLoading(false); }
  };

  const fetchInv = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (filterInvEsp)  q.append('especialidadId', filterInvEsp);
      if (filterInvSub)  q.append('subespecialidadId', filterInvSub);
      if (filterInvTipo) q.append('tipoId', filterInvTipo);
      if (searchInv)     q.append('search', searchInv);
      const res = await fetch(`http://localhost:4000/api/hoja-vida/inventario?${q}`);
      setDataInv((await res.json()).data||[]);
    } catch(e){ console.error(e); } finally { setLoading(false); }
  };

  const fetchBajas = async () => {
    setBajasLoading(true);
    try {
      const q = new URLSearchParams({ page: String(bajasPage) });
      if (bajasDesde)  q.append('fechaDesde', bajasDesde);
      if (bajasHasta)  q.append('fechaHasta', bajasHasta);
      if (bajasEsp)    q.append('especialidadId', bajasEsp);
      if (bajasSub)    q.append('subespecialidadId', bajasSub);
      if (bajasSearch) q.append('search', bajasSearch);
      const res  = await fetch(`http://localhost:4000/api/hoja-vida/bajas?${q}`);
      const json = await res.json();
      setBajasData(json.data||[]); setBajasTotalPages(json.totalPages||1);
    } catch(e){ console.error(e); } finally { setBajasLoading(false); }
  };

  const fetchOrigenInv = async () => {
    try {
      const q = new URLSearchParams({ sedeId: trasladoForm.sedeOrigenId, tipoTraslado: transferType });
      if (trasladoEsp) q.append('especialidadId', trasladoEsp);
      if (trasladoSub) q.append('subespecialidadId', trasladoSub);
      const res = await fetch(`http://localhost:4000/api/hoja-vida/inventario-sede?${q}`);
      setInventarioOrigen((await res.json()).data||[]); setSelectedItems([]);
    } catch(e){ console.error(e); }
  };

  const handleBajaDateChange = (tipo: 'desde'|'hasta', val: string) => {
    if (tipo==='desde') {
      if (bajasHasta && val > bajasHasta) return Swal.fire('Aviso','La fecha "Desde" no puede ser mayor a "Hasta".','warning');
      setBajasDesde(val);
    } else {
      if (val > today) return Swal.fire('Aviso','La fecha "Hasta" no puede ser mayor a hoy.','warning');
      if (bajasDesde && val < bajasDesde) return Swal.fire('Aviso','La fecha "Hasta" no puede ser menor a "Desde".','warning');
      setBajasHasta(val);
    }
  };

  const validarArchivo = (e: React.ChangeEvent<HTMLInputElement>, setter: (f: File)=>void, tipo: 'image'|'pdf'|'mixto') => {
    const file = e.target.files?.[0]; if (!file) return;
    if (tipo==='image') {
      if (!['image/jpeg','image/png','image/jpg'].includes(file.type)) return Swal.fire('Error','Solo formato JPG o PNG.','warning');
      if (file.size>2*1024*1024) return Swal.fire('Error','Máximo 2MB de peso.','warning');
    } else if (tipo==='pdf') {
      if (file.type!=='application/pdf') return Swal.fire('Error','Debe adjuntar un archivo en formato PDF.','warning');
    } else {
      if (!['image/jpeg','image/png','image/jpg','application/pdf'].includes(file.type))
        return Swal.fire('Error','Solo formato PDF, JPG o PNG.','warning');
    }
    setter(file);
  };

  const subespTieneTipos = tipos.filter(t=>t.subespecialidadId===Number(form.subespecialidadId)).length > 0;

  const handleSave = async () => {
    const camposReq = ['nombre','especialidadId','subespecialidadId','fabricante','numeroSerie',
      'registroInvima','proveedorId','paisOrigen','material','esterilizacion',
      'frecuenciaMantenimiento','propietarioId'];
    if (subespTieneTipos) camposReq.push('tipoId');
    if (camposReq.some(k=>!form[k]))
      return Swal.fire('Error','Es necesario el diligenciamiento de todos los campos obligatorios.','error');
    if (form.material==='Otros'&&!form.materialOtro)
      return Swal.fire('Error','Especifique el material en "¿Cuál?".','error');
    if (viewState==='create' && (!fotoFile||!garantiaFile||!invimaFile||!codigoFile))
      return Swal.fire('Error','Debe adjuntar Foto, Garantía, Registro INVIMA y Código del Instrumento.','error');
    try {
      const data = new FormData();
      Object.keys(form).forEach(k=>{ if(form[k]) data.append(k, form[k]); });
      if (fotoFile     instanceof File) data.append('foto', fotoFile);
      if (garantiaFile instanceof File) data.append('garantia', garantiaFile);
      if (invimaFile   instanceof File) data.append('registroInvimaDoc', invimaFile);
      if (codigoFile   instanceof File) data.append('codigoInstrumentoDoc', codigoFile);
      const url    = viewState==='edit' ? `http://localhost:4000/api/hoja-vida/${form.id}` : 'http://localhost:4000/api/hoja-vida';
      const method = viewState==='edit' ? 'PUT' : 'POST';
      const res    = await fetch(url, { method, body: data });
      const json   = await res.json(); if (!res.ok) throw new Error(json.msg);
      Swal.fire({ icon:'success', title:'Éxito', text:`Se ha ${viewState==='edit'?'actualizado':'creado'} exitosamente.`, timer:2000, showConfirmButton:false });
      setViewState('list'); setForm(initForm);
      setFotoFile(null); setGarantiaFile(null); setInvimaFile(null); setCodigoFile(null);
      fetchHV();
    } catch(e:any){ Swal.fire('Error', e.message, 'error'); }
  };

  const handleCancelCreate = () =>
    Swal.fire({ title:'¿Está seguro?', text:'La información diligenciada no se guardará en el sistema.', icon:'warning',
      showCancelButton:true, confirmButtonColor:'#3b82f6', cancelButtonColor:'#94a3b8',
      confirmButtonText:'Aceptar', cancelButtonText:'Cancelar' })
    .then(r=>{ if(r.isConfirmed){ setViewState('list'); setForm(initForm); setFotoFile(null); setGarantiaFile(null); setInvimaFile(null); setCodigoFile(null); }});

  const openRC = (row: any) => {
    setSelectedHVForRC(row);
    setRcForm({ fechaCompra:'', costoAdquisicion:'', iva:'', numeroFactura:'', vidaUtil:'' });
    setFacturaFile(null); setIsRCOpen(true); setOpenActionMenu(null);
  };

  const handleSaveRC = async () => {
    if (!rcForm.fechaCompra||!rcForm.costoAdquisicion||!rcForm.numeroFactura||!facturaFile)
      return Swal.fire('Error','Es necesario el diligenciamiento de todos los campos obligatorios.','error');
    if (Number(rcForm.costoAdquisicion)<=0)
      return Swal.fire('Error','El costo de adquisición debe ser mayor a cero y positivo.','error');
    try {
      const data = new FormData();
      Object.keys(rcForm).forEach(k=>{ if((rcForm as any)[k]) data.append(k,(rcForm as any)[k]); });
      data.append('facturaDoc', facturaFile!);
      const res  = await fetch(`http://localhost:4000/api/hoja-vida/${selectedHVForRC?.id}/contable`, { method:'PUT', body:data });
      const json = await res.json(); if(!res.ok) throw new Error(json.msg);
      Swal.fire({ icon:'success', title:'Éxito', text:'Registro contable guardado correctamente', timer:2000, showConfirmButton:false });
      setIsRCOpen(false); fetchHV();
    } catch(e:any){ Swal.fire('Error', e.message, 'error'); }
  };

  const handleCancelRC = () =>
    Swal.fire({ title:'¿Está seguro?', text:'La información diligenciada no se guardará en el sistema.', icon:'warning',
      showCancelButton:true, confirmButtonColor:'#3b82f6', cancelButtonColor:'#94a3b8',
      confirmButtonText:'Aceptar', cancelButtonText:'Cancelar' })
    .then(r=>{ if(r.isConfirmed) setIsRCOpen(false); });

  const changeStatus = async (id: number, nuevoEstado: string) => {
    try {
      const res  = await fetch(`http://localhost:4000/api/hoja-vida/${id}/estado`, {
        method:'PATCH', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ estado: nuevoEstado })
      });
      const json = await res.json(); if(!res.ok) throw new Error(json.msg);
      Swal.fire({ icon:'success', title:'Éxito', text:`Hoja de vida ${nuevoEstado.toLowerCase()} correctamente`, timer:2000, showConfirmButton:false });
      setOpenActionMenu(null); fetchHV();
    } catch(e:any){ Swal.fire('Error', e.message, 'error'); }
  };

  const handleSaveTraslado = async () => {
    if (!trasladoForm.sedeOrigenId||!trasladoForm.sedeDestinoId||!trasladoForm.fechaDevolucion)
      return Swal.fire('Atención','Complete Sede origen, destino y Fecha devolución.','warning');
    if (trasladoForm.sedeOrigenId===trasladoForm.sedeDestinoId)
      return Swal.fire('Atención','Sede origen y destino no pueden ser la misma.','warning');
    if (selectedItems.length===0) return Swal.fire('Atención','Seleccione al menos un elemento.','warning');
    try {
      const res  = await fetch('http://localhost:4000/api/hoja-vida/trasladar', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ ...trasladoForm, tipoTraslado:transferType, items: transferType==='kit'?selectedItems.map((i:any)=>i.id):selectedItems })
      });
      const json = await res.json(); if(!res.ok) throw new Error(json.msg);
      Swal.fire('Éxito','Traslado ejecutado correctamente','success');
      setIsTrasladarOpen(false); setTrasladoForm({ sedeOrigenId:'', sedeDestinoId:'', fechaDevolucion:'' }); setSelectedItems([]); fetchHV();
    } catch(e:any){ Swal.fire('Error', e.message, 'error'); }
  };

  const handleOpenDetail = (row: any) => {
    setForm(row); setFotoFile(row.fotoUrl||null); setGarantiaFile(row.garantiaUrl||null);
    setInvimaFile(row.registroInvimaUrl||null); setCodigoFile(row.codigoInstrumentoUrl||null);
    setViewState('detail'); setOpenActionMenu(null);
  };
  const handleOpenEdit = (row: any) => {
    setForm(row); setFotoFile(row.fotoUrl||null); setGarantiaFile(row.garantiaUrl||null);
    setInvimaFile(row.registroInvimaUrl||null); setCodigoFile(row.codigoInstrumentoUrl||null);
    setViewState('edit'); setOpenActionMenu(null);
  };

  // CSV — usa dataInv (no dataInventario)
  const downloadCSV = () => {
    const d = activeTab==='hv' ? dataHV : dataInv; if (!d.length) return;
    const h = Object.keys(d[0]).join(',');
    const r = d.map((x:any)=>Object.values({ ...x, kits: Array.isArray(x.kits)?x.kits.join('|'):x.kits }).join(','));
    const blob = new Blob(['\uFEFF'+[h,...r].join('\n')], { type:'text/csv;charset=utf-8;' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `Reporte_${activeTab}_${today}.csv`; document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const statusColor = (s: string) => {
    const m: Record<string,string> = {
      'Habilitado':       'bg-emerald-50 text-emerald-600 border-emerald-200',
      'P. registrar':     'bg-slate-100 text-slate-500 border-slate-200',
      'En mantenimiento': 'bg-amber-50 text-amber-600 border-amber-200',
      'De baja':          'bg-red-50 text-red-700 border-red-200',
      'Deshabilitado':    'bg-red-50 text-red-500 border-red-100',
    };
    return m[s]||'bg-slate-50 text-slate-400 border-slate-100';
  };
  const kitColor = (i: number) => i%3===0?'bg-yellow-50 text-yellow-600 border-yellow-200':i%3===1?'bg-blue-50 text-blue-500 border-blue-100':'bg-emerald-50 text-emerald-600 border-emerald-200';

  // Code preview
  const getCodePreview = () => {
    const esp = especialidades.find(x=>x.id==form.especialidadId)?.nombre||'';
    const sub = subespecialidades.find(x=>x.id==form.subespecialidadId)?.nombre||'';
    const tip = tipos.find(x=>x.id==form.tipoId)?.nombre||'';
    return {
      esp: esp ? esp.substring(0,2).toUpperCase() : '  ',
      sub: sub ? sub.substring(0,2).toUpperCase() : '  ',
      tip: tip ? tip.substring(0,2).toUpperCase() : '  ',
    };
  };
  const cp = getCodePreview();

  const resetView = () => {
    setViewState('list'); setForm(initForm);
    setFotoFile(null); setGarantiaFile(null); setInvimaFile(null); setCodigoFile(null);
  };

  /* ══════════════════════════════════════════════════════════
     VISTA: CREAR / EDITAR / DETALLE
     ══════════════════════════════════════════════════════════ */
  if (viewState==='create' || viewState==='edit' || viewState==='detail') {
    const isView = viewState==='detail';
    const isEdit = viewState==='edit';
    const title  = isView ? 'Detalle de hoja de vida' : (isEdit ? 'Editar hoja de vida' : 'Crear hoja de vida');

    return (
      <>
        <style>{sharedStyles}</style>
        <div className="h-full flex flex-col overflow-y-auto hide-scrollbar pb-12">
          <div className="flex items-center gap-2 mb-5">
            <button onClick={resetView} className="text-sky-500 hover:text-sky-700 p-1 transition-colors">
              <ChevronLeft size={26} strokeWidth={2.5}/>
            </button>
            <h1 className="text-2xl font-bold text-sky-500">{title}</h1>
            {(isView||isEdit) && <span className={`ml-4 px-3 py-1 rounded-full text-xs font-bold border ${statusColor(form.estado)}`}>{form.estado}</span>}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">

            {/* ── Foto + Requisitos ── */}
            <div className="flex flex-col lg:flex-row items-start gap-6 p-6 border-b border-slate-100">
              <div className="flex items-center gap-4 flex-shrink-0">
                <div>
                  <p className="font-bold text-sky-500 text-sm">
                    Foto Instrumento{!isView && <span className="text-red-500 ml-1">*</span>}
                  </p>
                  {!isView && <p className="text-[11px] text-slate-400 mt-0.5">Mín. 400×400 px &nbsp;|&nbsp; Máx. 2MB</p>}
                </div>
                <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 flex-shrink-0">
                  {typeof fotoFile==='string'
                    ? <img src={fotoFile} alt="" className="w-full h-full object-cover"/>
                    : fotoFile ? <img src={URL.createObjectURL(fotoFile as File)} alt="" className="w-full h-full object-cover"/>
                    : <ImageIcon size={24} className="text-slate-300"/>}
                </div>
                {!isView && (
                  <div className="flex flex-col gap-1.5">
                    <input type="file" className="hidden" ref={fotoRef} accept=".jpg,.jpeg,.png" onChange={e=>validarArchivo(e,setFotoFile,'image')}/>
                    <button onClick={()=>fotoRef.current?.click()} className="px-4 py-1.5 rounded-full border-2 border-sky-400 text-sky-500 text-xs font-bold hover:bg-sky-50 transition-colors">Subir foto</button>
                    <button onClick={()=>{setFotoFile(null);if(fotoRef.current)fotoRef.current.value='';}} className="text-slate-400 text-xs font-semibold hover:text-red-400 text-center transition-colors">Eliminar</button>
                  </div>
                )}
              </div>

              <div className="hidden lg:block w-px self-stretch bg-slate-100"/>

              <div className="flex-1 w-full">
                <p className="font-semibold text-slate-700 text-sm mb-4">Requisitos documentales:</p>
                {!isView && (
                  <>
                    <input type="file" className="hidden" ref={garantiaRef} accept=".pdf" onChange={e=>validarArchivo(e,setGarantiaFile,'pdf')}/>
                    <input type="file" className="hidden" ref={invimaRef}   accept=".pdf" onChange={e=>validarArchivo(e,setInvimaFile,'pdf')}/>
                    <input type="file" className="hidden" ref={codigoRef}   accept=".pdf,image/jpeg,image/png" onChange={e=>validarArchivo(e,setCodigoFile,'mixto')}/>
                  </>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <ModalNotchFile label="Garantía (Solo PDF)"         required={!isView} disabled={isView} file={garantiaFile} onClick={()=>!isView&&garantiaRef.current?.click()}/>
                  <ModalNotchFile label="Registro INVIMA (Solo PDF)"  required={!isView} disabled={isView} file={invimaFile}   onClick={()=>!isView&&invimaRef.current?.click()}/>
                  <ModalNotchFile label="Cód. Instrumento (PDF/IMG)"  required={!isView} disabled={isView} file={codigoFile}   onClick={()=>!isView&&codigoRef.current?.click()}/>
                </div>
              </div>
            </div>

            {/* ── Datos básicos ── */}
            <div className="p-6 border-b border-slate-100">
              <p className="font-bold text-slate-800 text-sm mb-5">Datos básicos del Instrumento</p>

              {/* Código preview */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 bg-slate-50 rounded-xl px-5 py-3.5 border border-slate-100">
                <span className="text-sky-500 font-bold text-sm flex-shrink-0">Código Instrumento</span>
                {!isView && !isEdit ? (
                  <div className="flex items-center gap-4 flex-wrap">
                    {[
                      { chars: cp.esp.split(''), sub: '(Especialidad)' },
                      { chars: cp.sub.split(''), sub: '(Subespecialidad)' },
                      { chars: !subespTieneTipos ? ['-','-'] : cp.tip.split(''), sub: '(Tipo Subespecialidad)' },
                      { chars: ['0','0','0','0'], sub: '(Consecutivo)' },
                    ].map((g,i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className="flex gap-1">
                          {g.chars.map((c,j) => (
                            <div key={j} style={{
                              width:34, height:34, borderRadius:'50%',
                              border: `1.5px solid ${['0','-',' '].includes(c)?'#d1d5db':'#38bdf8'}`,
                              display:'flex', alignItems:'center', justifyContent:'center',
                              fontSize:12, fontWeight:700,
                              color: ['0','-',' '].includes(c)?'#94a3b8':'#0ea5e9', background:'#fff'
                            }}>{c}</div>
                          ))}
                        </div>
                        <span style={{fontSize:10, color:'#94a3b8', whiteSpace:'nowrap'}}>{g.sub}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-lg font-mono font-bold text-slate-700 tracking-widest">{form.codigo}</div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
                <ModalNotchInput  label="Nombre"                required={!isView} disabled={isView} value={form.nombre}          onChange={v=>setF('nombre',v)}/>
                <ModalNotchSelect label="Especialidad"          required={!isView} disabled={isView} value={form.especialidadId}  onChange={v=>{setF('especialidadId',v);setF('subespecialidadId','');setF('tipoId','');}} options={especialidades.map(e=>({value:String(e.id),label:e.nombre}))}/>
                <ModalNotchSelect label="Subespecialidad"       required={!isView} disabled={isView||!form.especialidadId} value={form.subespecialidadId} onChange={v=>{setF('subespecialidadId',v);setF('tipoId','');}} options={subespecialidades.filter(s=>s.especialidadId===Number(form.especialidadId)).map(s=>({value:String(s.id),label:s.nombre}))}/>
                <ModalNotchSelect label="Tipo de subespecialidad" required={!isView&&subespTieneTipos} disabled={isView||!form.subespecialidadId||(!isView&&!subespTieneTipos)} value={form.tipoId} onChange={v=>setF('tipoId',v)} options={tipos.filter(t=>t.subespecialidadId===Number(form.subespecialidadId)).map(t=>({value:String(t.id),label:t.nombre}))}/>
                <ModalNotchInput  label="KIT" disabled value={isView||isEdit ? (form.kit?.codigoKit||'No asignado') : 'Asignación en TM Kit'} onChange={()=>{}}/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <ModalNotchInput  label="Fabricante"            required={!isView} disabled={isView} value={form.fabricante}      onChange={v=>setF('fabricante',v)}/>
                <ModalNotchInput  label="No. de serie"          required={!isView} disabled={isView} value={form.numeroSerie}     onChange={v=>setF('numeroSerie',v)}/>
                <ModalNotchInput  label="No. registro INVIMA"   required={!isView} disabled={isView} value={form.registroInvima}  onChange={v=>setF('registroInvima',v)}/>
                <ModalNotchSelect label="Proveedor (Compras)"   required={!isView} disabled={isView} value={form.proveedorId}    onChange={v=>setF('proveedorId',v)}    options={proveedores.map(p=>({value:String(p.id),label:p.nombre}))}/>
                <ModalNotchSelect label="País origen"           required={!isView} disabled={isView} value={form.paisOrigen}     onChange={v=>setF('paisOrigen',v)}     options={['Colombia','Estados Unidos','Alemania','China','Japón','Francia','España','México','Brasil'].map(p=>({value:p,label:p}))}/>
              </div>
            </div>

            {/* ── Características técnicas ── */}
            <div className="p-6 border-b border-slate-100">
              <p className="font-bold text-slate-800 text-sm mb-5">Características técnicas</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ModalNotchSelect label="Material del instrumento"  required={!isView} disabled={isView} value={form.material}      onChange={v=>{setF('material',v);setF('materialOtro','');}} options={[{value:'Titanium',label:'Titanium'},{value:'Acero inoxidable',label:'Acero inoxidable'},{value:'Carburo de tungsteno',label:'Carburo de tungsteno'},{value:'Otros',label:'Otros'}]}/>
                {form.material==='Otros' && (
                  <ModalNotchInput label="¿Cuál?" required={!isView} disabled={isView} value={form.materialOtro} onChange={v=>setF('materialOtro',v)}/>
                )}
                <ModalNotchSelect label="Esterilización compatible" required={!isView} disabled={isView} value={form.esterilizacion} onChange={v=>setF('esterilizacion',v)} options={[{value:'Vapor',label:'Vapor'},{value:'Gas',label:'Gas'},{value:'Ambas',label:'Ambas'}]}/>
              </div>
            </div>

            {/* ── Mantenimiento y Uso (dos columnas) ── */}
            <div className="p-6 border-b border-slate-100">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div>
                  <p className="font-bold text-slate-800 text-sm mb-5">Mantenimiento y calibración</p>
                  <div className="flex flex-col gap-4">
                    <ModalNotchSelect label="Frecuencia preventiva" required={!isView} disabled={isView} value={form.frecuenciaMantenimiento} onChange={v=>setF('frecuenciaMantenimiento',v)} options={['Diario','Semanal','Quincenal','Mensual','Bimensual','Trimestral','Cuatrimestral','Semestral','Anual'].map(x=>({value:x,label:x}))}/>
                    <ModalNotchInput  label="Fecha de mantenimiento" disabled value={isView||isEdit ? (form.proximoMantenimiento ? new Date(form.proximoMantenimiento).toLocaleDateString() : 'Pendiente') : 'Calculado automático (Post-ciclo)'} onChange={()=>{}}/>
                    <ModalNotchInput  label="Observaciones del técnico" disabled={isView} value={form.observacionesTecnico||''} onChange={v=>setF('observacionesTecnico',v)}/>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm mb-5">Uso y trazabilidad</p>
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <ModalNotchInput label="Estado actual"          disabled value={form.estadoActual||'P. registrar'} onChange={()=>{}}/>
                      <ModalNotchInput label="Ciclo de esterilización" disabled type="number" value={form.cicloEsterilizacion?.toString()||'0'} onChange={()=>{}}/>
                    </div>
                    <ModalNotchSelect label="Propietario" required={!isView} disabled={isView} value={form.propietarioId} onChange={v=>setF('propietarioId',v)} options={propietarios.map(p=>({value:String(p.id),label:`${p.nombre} ${p.apellido}`}))}/>
                    <ModalNotchInput  label="Notas y observaciones" disabled={isView} value={form.notasObservaciones||''} onChange={v=>setF('notasObservaciones',v)}/>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Registro Contable (solo Ver Detalle) ── */}
            {isView && permisos.puedeRegistrarContable && (
              <div className="p-6 bg-emerald-50/40 rounded-b-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-400"/>
                <p className="font-bold text-emerald-800 text-sm mb-5 flex items-center gap-2">
                  <DollarSign size={16} className="text-emerald-500"/> Registro Contable Privado
                </p>
                {form.costo ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ModalNotchInput label="Fecha de compra"    disabled value={new Date(form.fechaCompra).toLocaleDateString()} onChange={()=>{}}/>
                    <ModalNotchInput label="Costo adquisición"  disabled value={`$ ${form.costo.toLocaleString()}`}              onChange={()=>{}}/>
                    <ModalNotchInput label="IVA"                disabled value={form.iva ? `${form.iva}%` : 'N/A'}              onChange={()=>{}}/>
                    <ModalNotchInput label="No. Factura"        disabled value={form.numeroFactura||''}                          onChange={()=>{}}/>
                  </div>
                ) : (
                  <p className="text-sm text-emerald-600/70 italic font-medium">El instrumento aún no posee información contable registrada.</p>
                )}
              </div>
            )}

            {/* ── Botones ── */}
            <div className="flex justify-end items-center gap-6 p-5">
              {!isView && <button className="hv-cancel-btn" onClick={handleCancelCreate}>Cancelar</button>}
              {!isView && <button className="hv-save-btn"   onClick={handleSave}>Guardar</button>}
              {isView  && <button onClick={resetView} style={{ padding:'10px 40px', borderRadius:30, background:'#f1f5f9', border:'none', cursor:'pointer', fontWeight:700, color:'#475569', fontSize:14 }}>Volver al listado</button>}
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ══ VISTA: CONTROL DE BAJAS ══ */
  if (isBajasOpen) return (
    <>
      <style>{sharedStyles}</style>
      <div className="h-full flex flex-col overflow-y-auto hide-scrollbar pb-10 gap-4">
        <div className="flex items-center gap-2">
          <button onClick={()=>setIsBajasOpen(false)} className="text-sky-500 hover:text-sky-700 p-1"><ChevronLeft size={26} strokeWidth={2.5}/></button>
          <Database size={22} className="text-red-400"/>
          <h1 className="text-xl font-bold text-slate-800">Control de Bajas</h1>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
          {/* Fechas con mismo estilo notch que la barra de filtros */}
          {([{lbl:'Desde',val:bajasDesde,idx:0},{lbl:'Hasta',val:bajasHasta,idx:1}] as any[]).map(f=>(
            <div key={f.lbl} style={{ position:'relative', width:148 }}>
              <input type="date" value={f.val} max={f.idx===1?today:undefined}
                onChange={e=>handleBajaDateChange(f.idx===0?'desde':'hasta',e.target.value)}
                style={{ width:'100%', height:42, borderRadius:30, border:'1.5px solid #d1d5db', background:'#f8fafc', padding:'10px 16px 0 16px', fontSize:13, color:'#334155', outline:'none', boxSizing:'border-box', fontFamily:'Inter,sans-serif' }}
                onFocus={e=>e.currentTarget.style.borderColor='#3b82f6'}
                onBlur={e=>e.currentTarget.style.borderColor='#d1d5db'}/>
              <span style={{ position:'absolute', left:16, top:0, transform:'translateY(-50%)', fontSize:10.5, color:'#6b7280', background:'#f8fafc', padding:'0 4px', fontFamily:'Inter,sans-serif', whiteSpace:'nowrap' }}>{f.lbl}</span>
            </div>
          ))}
          <ModalNotchSelect label="Especialidad"   compact value={bajasEsp} onChange={v=>{setBajasEsp(v);setBajasSub('');}} options={especialidades.map(x=>({value:String(x.id),label:x.nombre}))}/>
          <ModalNotchSelect label="Subespecialidad" compact disabled={!bajasEsp} value={bajasSub} onChange={setBajasSub} options={subespecialidades.filter(s=>s.especialidadId===Number(bajasEsp)).map(x=>({value:String(x.id),label:x.nombre}))}/>
          <div style={{ position:'relative', flex:1, minWidth:140 }}>
            <input type="text" placeholder="Buscar..." value={bajasSearch} onChange={e=>setBajasSearch(e.target.value)}
              style={{ width:'100%', height:42, borderRadius:30, border:'1.5px solid #d1d5db', background:'#f8fafc', padding:'0 36px 0 16px', fontSize:13, color:'#475569', outline:'none', boxSizing:'border-box', fontFamily:'Inter,sans-serif' }}
              onFocus={e=>e.currentTarget.style.borderColor='#3b82f6'} onBlur={e=>e.currentTarget.style.borderColor='#d1d5db'}/>
            <Search size={14} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', color:'#60a5fa', pointerEvents:'none' }}/>
          </div>
        </div>
        <div className="flex-1 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-red-50 text-red-700 border-b border-red-100 sticky top-0">
                <tr>{['Fecha de Baja','Instrumento','Código','Especialidad','Subespecialidad','Kit Perteneciente'].map(h=>(
                  <th key={h} className="px-5 py-3 whitespace-nowrap text-xs font-bold">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {bajasLoading
                  ? <tr><td colSpan={6} className="text-center py-10 text-slate-400">Buscando...</td></tr>
                  : bajasData.length===0
                    ? <tr><td colSpan={6} className="text-center py-10 text-slate-400">No se encontraron instrumentos dados de baja.</td></tr>
                    : bajasData.map((r:any)=>(
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 text-red-500 font-bold text-xs">{new Date(r.updatedAt).toLocaleDateString()}</td>
                        <td className="px-5 py-3 text-slate-700 font-medium text-xs">{r.nombre}</td>
                        <td className="px-5 py-3 font-mono text-xs font-bold text-slate-500">{r.codigo}</td>
                        <td className="px-5 py-3 text-slate-500 text-xs">{r.especialidad?.nombre}</td>
                        <td className="px-5 py-3 text-slate-500 text-xs">{r.subespecialidad?.nombre}</td>
                        <td className="px-5 py-3 text-slate-500 text-xs">{r.kit?.codigoKit||<span className="text-slate-300 italic">Suelto</span>}</td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
          <div className="p-3 flex justify-between items-center text-xs text-slate-400 border-t border-slate-50">
            <span>Pág. {bajasPage} de {bajasTotalPages}</span>
            <div className="flex items-center gap-1.5 text-sky-500">
              <button onClick={()=>setBajasPage(1)}                              disabled={bajasPage===1}            className="disabled:text-slate-300"><ChevronsLeft size={15}/></button>
              <button onClick={()=>setBajasPage(p=>Math.max(1,p-1))}            disabled={bajasPage===1}            className="disabled:text-slate-300"><ChevronLeft size={15}/></button>
              <span className="bg-sky-50 px-2.5 py-1 rounded text-sky-600 font-bold">{bajasPage}/{bajasTotalPages||1}</span>
              <button onClick={()=>setBajasPage(p=>Math.min(bajasTotalPages,p+1))} disabled={bajasPage===bajasTotalPages} className="disabled:text-slate-300"><ChevronRight size={15}/></button>
              <button onClick={()=>setBajasPage(bajasTotalPages)}               disabled={bajasPage===bajasTotalPages} className="disabled:text-slate-300"><ChevronsRight size={15}/></button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  /* ══ VISTA PRINCIPAL (GRILLA) ══ */
  return (
    <>
      <style>{sharedStyles}</style>
      <div className="h-full flex flex-col relative" onClick={()=>setOpenActionMenu(null)}>
        <h1 className="text-3xl font-bold text-sky-500 mb-5">Hoja de vida</h1>

        <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 flex-1 flex flex-col overflow-visible">

          {/* Tabs */}
          <div className="flex border-b border-slate-100 flex-shrink-0">
            {(['hv','inventario'] as const).map(t=>(
              <button key={t} onClick={()=>setActiveTab(t)}
                className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab===t?'text-sky-500 border-b-2 border-sky-400 bg-sky-50/30':'text-slate-400 hover:text-slate-500 hover:bg-slate-50'}`}>
                {t==='hv'?'Hoja de vida':'Inventario'}
              </button>
            ))}
          </div>

          {/* Barra de filtros — usa ModalNotchSelect compact, igual que Insumos */}
          <div className="px-4 py-3 flex flex-wrap gap-3 items-center border-b border-slate-50 flex-shrink-0">
            {activeTab==='hv' ? (
              <>
                <ModalNotchSelect label="Especialidad"   compact value={filterEsp}    onChange={v=>{setFilterEsp(v);setFilterSub('');}} options={especialidades.map(e=>({value:String(e.id),label:e.nombre}))}/>
                <ModalNotchSelect label="Subespecialidad" compact disabled={!filterEsp} value={filterSub}    onChange={setFilterSub}      options={subespecialidades.filter(s=>s.especialidadId===Number(filterEsp)).map(s=>({value:String(s.id),label:s.nombre}))}/>
                <ModalNotchSelect label="Estado"          compact value={filterEstado} onChange={setFilterEstado} options={[{value:'Habilitado',label:'Habilitado'},{value:'Deshabilitado',label:'Deshabilitado'},{value:'P. registrar',label:'P. registrar'},{value:'En mantenimiento',label:'En mantenimiento'},{value:'De baja',label:'De baja'}]}/>
                {/* Input búsqueda igual que Insumos */}
                <div style={{ position:'relative', flex:1, minWidth:160 }}>
                  <input type="text" placeholder="Buscar por nombre..." value={searchHV} onChange={e=>{setSearchHV(e.target.value);setPage(1);}}
                    style={{ width:'100%', height:42, borderRadius:30, border:'1.5px solid #e2e8f0', background:'#f8fafc', padding:'0 40px 0 16px', fontSize:13, color:'#475569', outline:'none', boxSizing:'border-box', fontFamily:'Inter,sans-serif', transition:'border-color 0.2s' }}
                    onFocus={e=>e.currentTarget.style.borderColor='#3b82f6'} onBlur={e=>e.currentTarget.style.borderColor='#e2e8f0'}/>
                  <Search size={15} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', color:'#60a5fa', pointerEvents:'none' }}/>
                </div>
                <button onClick={()=>{ setViewState('create'); setForm(initForm); setFotoFile(null); setGarantiaFile(null); setInvimaFile(null); setCodigoFile(null); }}
                  className="flex items-center gap-1.5 text-sky-500 font-bold text-sm hover:text-sky-600 px-4 py-2 rounded-lg hover:bg-sky-50 transition-colors whitespace-nowrap ml-auto">
                  Crear hoja de vida <PlusCircle size={16}/>
                </button>
              </>
            ) : (
              <>
                <ModalNotchSelect label="Especialidad"      compact value={filterInvEsp}  onChange={v=>{setFilterInvEsp(v);setFilterInvSub('');setFilterInvTipo('');}} options={especialidades.map(e=>({value:String(e.id),label:e.nombre}))}/>
                <ModalNotchSelect label="Subespecialidad"   compact disabled={!filterInvEsp} value={filterInvSub}  onChange={v=>{setFilterInvSub(v);setFilterInvTipo('');}} options={subespecialidades.filter(s=>s.especialidadId===Number(filterInvEsp)).map(s=>({value:String(s.id),label:s.nombre}))}/>
                <ModalNotchSelect label="Tipo subespec."    compact disabled={!filterInvSub||tipos.filter(t=>t.subespecialidadId===Number(filterInvSub)).length===0} value={filterInvTipo} onChange={setFilterInvTipo} options={tipos.filter(t=>t.subespecialidadId===Number(filterInvSub)).map(t=>({value:String(t.id),label:t.nombre}))}/>
                <div style={{ position:'relative', flex:1, minWidth:140 }}>
                  <input type="text" placeholder="Buscar por KIT..." value={searchInv} onChange={e=>setSearchInv(e.target.value)}
                    style={{ width:'100%', height:42, borderRadius:30, border:'1.5px solid #e2e8f0', background:'#f8fafc', padding:'0 40px 0 16px', fontSize:13, color:'#475569', outline:'none', boxSizing:'border-box', fontFamily:'Inter,sans-serif', transition:'border-color 0.2s' }}
                    onFocus={e=>e.currentTarget.style.borderColor='#3b82f6'} onBlur={e=>e.currentTarget.style.borderColor='#e2e8f0'}/>
                  <Search size={15} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', color:'#60a5fa', pointerEvents:'none' }}/>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <button onClick={()=>setIsBajasOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 border border-sky-200 rounded-full text-sky-500 text-xs font-bold hover:bg-sky-50 whitespace-nowrap">Control de bajas <Database size={11}/></button>
                  <button onClick={()=>setIsTrasladarOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 border border-sky-200 rounded-full text-sky-500 text-xs font-bold hover:bg-sky-50 whitespace-nowrap">Trasladar <ArrowRightLeft size={11}/></button>
                  <button onClick={downloadCSV} className="flex items-center gap-1.5 px-3 py-1.5 text-sky-500 text-xs font-bold hover:text-sky-600 whitespace-nowrap"><Download size={12}/> Descargar</button>
                </div>
              </>
            )}
          </div>

          {/* Tabla */}
          <div className="flex-1 overflow-visible relative" style={{ zIndex:10 }}>
            <table className="w-full text-left" style={{ fontSize:12.5 }}>
              {activeTab==='hv' ? (
                <>
                  <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-100 sticky top-0 z-10">
                    <tr>
                      {['Código','C. Instrumento','Nombre','Especialidad','Subespecialidad','Tipo subespecialidad','KIT','F. mtto','F. creación','Estado',''].map((h,i)=>(
                        <th key={i} className={`px-4 py-3 whitespace-nowrap text-xs font-bold ${h==='KIT'?'text-center':''}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading
                      ? <tr><td colSpan={11} className="text-center py-10 text-slate-400">Cargando datos...</td></tr>
                      : dataHV.length===0
                        ? <tr><td colSpan={11} className="text-center py-10 text-slate-400">No se encontraron registros.</td></tr>
                        : dataHV.map((row:any, idx:number)=>(
                          <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-4 text-slate-400 text-xs">{row.id}</td>
                            <td className="px-4 py-4 font-mono text-xs font-bold text-sky-500">{row.codigo}</td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200 flex items-center justify-center">
                                  {row.fotoUrl ? <img src={row.fotoUrl} alt="" className="w-full h-full object-cover"/> : <ImageIcon size={11} className="text-slate-300"/>}
                                </div>
                                <span className="text-slate-500 font-medium whitespace-nowrap">{row.nombre}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-slate-500 text-xs">{row.especialidad?.nombre}</td>
                            <td className="px-4 py-4 text-slate-500 text-xs">{row.subespecialidad?.nombre}</td>
                            <td className="px-4 py-4 text-slate-500 text-xs">{row.tipo?.nombre}</td>
                            <td className="px-4 py-4 text-center text-slate-500 text-xs font-medium">{row.kit?.codigoKit||'–'}</td>
                            <td className="px-4 py-4 text-slate-400 text-xs whitespace-nowrap">{row.fechaMantenimientoRef?new Date(row.fechaMantenimientoRef).toLocaleDateString():'–'}</td>
                            <td className="px-4 py-4 text-slate-400 text-xs whitespace-nowrap">{row.createdAt?new Date(row.createdAt).toLocaleDateString():'–'}</td>
                            <td className="px-4 py-4">
                              <span className={`px-3 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap ${statusColor(row.estado)}`}>{row.estado}</span>
                            </td>
                            <td className="px-2 py-4 text-right relative" onClick={e=>e.stopPropagation()}>
                              <button onClick={()=>setOpenActionMenu(openActionMenu===idx?null:idx)}
                                className={`p-1 rounded-full transition-colors ${openActionMenu===idx?'bg-blue-50 text-blue-500':'text-slate-300 hover:text-blue-500 hover:bg-slate-50'}`}>
                                <MoreVertical size={18}/>
                              </button>
                              {openActionMenu===idx && (
                                <div className="absolute right-8 w-44 bg-white rounded-lg shadow-xl border border-slate-100 py-1"
                                  style={{ zIndex:9999, top: idx > dataHV.length-3 ? 'auto' : 8, bottom: idx > dataHV.length-3 ? '100%' : 'auto' }}>
                                  <button onClick={()=>handleOpenDetail(row)} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 font-medium"><Eye size={14}/> Ver detalle</button>
                                  {['Habilitado','P. registrar','En mantenimiento'].includes(row.estado) && (
                                    <button onClick={()=>handleOpenEdit(row)} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 font-medium"><Edit size={14}/> Editar</button>
                                  )}
                                  {row.estado==='P. registrar' && permisos.puedeRegistrarContable && (
                                    <button onClick={()=>openRC(row)} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 font-medium"><FileText size={14}/> Registrar</button>
                                  )}
                                  {(row.estado==='Habilitado'||row.estado==='Deshabilitado') && (
                                    <>
                                      <div className="h-px bg-slate-100 mx-2 my-1"/>
                                      {row.estado==='Habilitado'
                                        ? <button onClick={()=>changeStatus(row.id,'Deshabilitado')} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 font-medium"><span className="w-3 h-3 rounded-full bg-red-400 flex-shrink-0"/> Deshabilitar</button>
                                        : <button onClick={()=>changeStatus(row.id,'Habilitado')}    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-emerald-600 hover:bg-emerald-50 font-medium"><span className="w-3 h-3 rounded-full bg-emerald-400 flex-shrink-0"/> Habilitar</button>
                                      }
                                    </>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                    }
                  </tbody>
                </>
              ) : (
                <>
                  <thead className="bg-sky-50/40 text-slate-600 border-b border-slate-100 sticky top-0 z-10">
                    <tr>{['Especialidad','Subespecialidad','Tipo subespecialidad','Kits Asignados','Cantidad Total'].map(h=>(
                      <th key={h} className="px-5 py-3 whitespace-nowrap text-xs font-bold">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading
                      ? <tr><td colSpan={5} className="text-center py-10 text-slate-400">Cargando datos...</td></tr>
                      : dataInv.length===0
                        ? <tr><td colSpan={5} className="text-center py-10 text-slate-400">No hay instrumentos en inventario.</td></tr>
                        : dataInv.map((row:any)=>(
                          <tr key={row.id} className="hover:bg-slate-50/50">
                            <td className="px-5 py-4 text-slate-500 text-xs">{row.esp}</td>
                            <td className="px-5 py-4 text-slate-500 text-xs">{row.sub}</td>
                            <td className="px-5 py-4 text-slate-500 text-xs">{row.tipo}</td>
                            <td className="px-5 py-4">
                              <div className="flex flex-wrap gap-1">
                                {!row.kits?.length
                                  ? <span className="text-xs text-slate-300 italic">Sueltos</span>
                                  : row.kits.map((k:string,i:number)=>(
                                    <span key={i} className={`px-2 py-0.5 rounded border text-[10px] font-bold ${kitColor(i)}`}>{k}</span>
                                  ))}
                              </div>
                            </td>
                            <td className="px-5 py-4 text-slate-700 font-bold text-xs text-center">{row.cant}</td>
                          </tr>
                        ))
                    }
                  </tbody>
                </>
              )}
            </table>
          </div>

          {/* Paginación */}
          <div className="mt-auto p-4 flex justify-between items-center text-xs text-slate-400 border-t border-slate-50">
            <span>Mostrando {dataHV.length} de {totalRec} registros</span>
            <div className="flex items-center gap-3 font-medium text-sky-500">
              <button onClick={()=>setPage(1)}                              disabled={page===1}                    className="hover:text-sky-700 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronsLeft size={16}/></button>
              <button onClick={()=>setPage(p=>Math.max(1,p-1))}            disabled={page===1}                    className="hover:text-sky-700 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronLeft size={16}/></button>
              <span className="bg-sky-50 px-3 py-1 rounded text-sky-600 font-bold">Pág. {page} de {totalPages||1}</span>
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))}   disabled={page===totalPages||totalPages===0} className="hover:text-sky-700 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronRight size={16}/></button>
              <button onClick={()=>setPage(totalPages)}                    disabled={page===totalPages||totalPages===0} className="hover:text-sky-700 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronsRight size={16}/></button>
            </div>
          </div>
        </div>

        {/* ══ MODAL TRASLADAR ══ */}
        {isTrasladarOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6">
            <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" onClick={()=>setIsTrasladarOpen(false)}/>
            <div className="relative bg-white w-full max-w-[680px] rounded-2xl shadow-2xl p-7">
              <div className="text-center mb-5 relative">
                <h2 className="text-xl font-extrabold text-sky-500">Trasladar Inventario</h2>
                <button onClick={()=>setIsTrasladarOpen(false)} className="absolute right-0 top-0 text-slate-400 hover:text-red-400"><X size={22}/></button>
              </div>
              <div className="h-px bg-slate-100 mb-5"/>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <ModalNotchSelect label="Sede origen"     required value={trasladoForm.sedeOrigenId}   onChange={v=>setTrasladoForm({...trasladoForm,sedeOrigenId:v})}   options={sedesDB.map(s=>({value:String(s.id),label:s.nombre}))}/>
                <ModalNotchSelect label="Sede destino"    required value={trasladoForm.sedeDestinoId}  onChange={v=>setTrasladoForm({...trasladoForm,sedeDestinoId:v})}  options={sedesDB.map(s=>({value:String(s.id),label:s.nombre}))}/>
                <ModalNotchInput  label="Fecha traslado"  type="date" disabled value={today} onChange={()=>{}}/>
                <ModalNotchInput  label="Fecha devolución" type="date" required min={today} value={trasladoForm.fechaDevolucion} onChange={v=>setTrasladoForm({...trasladoForm,fechaDevolucion:v})}/>
              </div>
              <div className="h-px bg-slate-100 mb-4"/>
              <div className="flex items-center gap-5 mb-4">
                <span className="text-sm font-bold text-slate-700">¿Qué desea transferir?</span>
                {(['kit','instrumento'] as const).map(t=>(
                  <label key={t} className="flex items-center gap-2 cursor-pointer" onClick={()=>{setTransferType(t);setSelectedItems([]);}}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${transferType===t?'border-sky-400':'border-slate-300'}`}>
                      {transferType===t && <div className="w-2 h-2 rounded-full bg-sky-400"/>}
                    </div>
                    <span className="text-sm text-slate-500">{t==='kit'?'KIT':'Instrumento Suelto'}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mb-3">
                <ModalNotchSelect label="Especialidad"    compact value={trasladoEsp} onChange={setTrasladoEsp} options={especialidades.map(x=>({value:String(x.id),label:x.nombre}))}/>
                <ModalNotchSelect label="Subespecialidad" compact value={trasladoSub} onChange={setTrasladoSub} options={subespecialidades.map(x=>({value:String(x.id),label:x.nombre}))}/>
              </div>
              {transferType==='instrumento' && (
                <div style={{ position:'relative', marginBottom:12 }}>
                  <input type="text" placeholder="Buscar instrumento..." value={trasladoSearch} onChange={e=>setTrasladoSearch(e.target.value)}
                    style={{ width:'100%', height:40, borderRadius:30, border:'1.5px solid #e2e8f0', background:'#f8fafc', padding:'0 36px 0 16px', fontSize:13, color:'#475569', outline:'none', boxSizing:'border-box', fontFamily:'Inter,sans-serif' }}/>
                  <Search size={15} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', color:'#60a5fa' }}/>
                </div>
              )}
              <div className="border border-slate-200 rounded-xl overflow-hidden mb-5">
                {!trasladoForm.sedeOrigenId
                  ? <div className="p-4 text-center text-slate-400 text-sm">Seleccione una Sede de Origen.</div>
                  : (
                    <>
                      <div className="bg-sky-50/40 px-4 py-2.5 border-b border-slate-100">
                        <span className="text-slate-700 text-sm font-bold">{transferType==='kit'?'Kits Disponibles':'Instrumentos Disponibles'}</span>
                      </div>
                      <div className="max-h-[150px] overflow-y-auto">
                        {inventarioOrigen.length===0
                          ? <div className="p-4 text-center text-slate-400 text-sm">Sin resultados.</div>
                          : transferType==='kit'
                            ? inventarioOrigen.map((item:any)=>{
                                const sel = !!selectedItems.find((i:any)=>i.id===item.id);
                                return (
                                  <div key={item.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-50 hover:bg-slate-50">
                                    <input type="checkbox" checked={sel} onChange={()=>setSelectedItems(sel?selectedItems.filter((i:any)=>i.id!==item.id):[...selectedItems,{id:item.id}])} className="w-4 h-4 cursor-pointer"/>
                                    <span className="text-slate-600 text-sm font-bold flex-1">{item.nombre}</span>
                                    <span className="text-slate-400 text-xs font-mono">{item.codigoKit}</span>
                                  </div>
                                );
                              })
                            : inventarioOrigen.filter((i:any)=>i.name?.toLowerCase().includes(trasladoSearch.toLowerCase())).map((item:any,idx:number)=>{
                                const selItem = selectedItems.find((i:any)=>i.nombre===item.name);
                                const sel     = !!selItem;
                                return (
                                  <div key={idx} className="flex items-center justify-between px-4 py-2.5 border-b border-slate-50 hover:bg-slate-50">
                                    <div className="flex items-center gap-3 flex-1">
                                      <input type="checkbox" checked={sel} onChange={()=>setSelectedItems(sel?selectedItems.filter((i:any)=>i.nombre!==item.name):[...selectedItems,{nombre:item.name,cantidad:1}])} className="w-4 h-4 cursor-pointer"/>
                                      <span className="text-slate-600 text-sm">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4 mr-2">
                                      <span className="text-slate-400 text-xs bg-slate-100 rounded-full px-2 py-0.5">{item.qty} disp.</span>
                                      <input type="number" disabled={!sel} min="1" max={item.qty} value={selItem?.cantidad||''} onChange={e=>{let q=parseInt(e.target.value)||1;if(q>item.qty)q=item.qty;if(q<1)q=1;setSelectedItems(selectedItems.map((i:any)=>i.nombre===item.name?{...i,cantidad:q}:i));}} className="w-16 h-7 border border-slate-300 rounded-lg text-center text-sm outline-none disabled:opacity-40"/>
                                    </div>
                                  </div>
                                );
                              })
                        }
                      </div>
                    </>
                  )
                }
              </div>
              <div className="flex justify-center gap-10">
                <button className="hv-cancel-btn" onClick={()=>setIsTrasladarOpen(false)}>Cancelar</button>
                <button className="hv-save-btn"   onClick={handleSaveTraslado}>Confirmar Traslado</button>
              </div>
            </div>
          </div>
        )}

        {/* ══ MODAL REGISTRO CONTABLE ══ */}
        {isRCOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleCancelRC}/>
            <div className="relative bg-white w-full max-w-[640px] rounded-[1.5rem] px-8 py-7 shadow-2xl" style={{ display:'flex', flexDirection:'column', gap:0, fontFamily:'Inter,sans-serif' }}>
              <h2 style={{ textAlign:'center', fontSize:21, fontWeight:700, color:'#3b82f6', margin:'0 0 4px' }}>Registro contable</h2>
              {selectedHVForRC && (
                <p style={{ textAlign:'center', fontSize:12, color:'#94a3b8', margin:'0 0 20px' }}>
                  {selectedHVForRC.nombre} – <span style={{ fontFamily:'monospace' }}>{selectedHVForRC.codigo}</span>
                </p>
              )}
              <div style={{ height:1, background:'#f1f5f9', marginBottom:24 }}/>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, marginBottom:14 }}>
                <ModalNotchInput label="Fecha de compra"       type="date"   required value={rcForm.fechaCompra}      onChange={v=>setRC('fechaCompra',v)}/>
                <ModalNotchInput label="Costo de adquisición"  type="number" required value={rcForm.costoAdquisicion}  onChange={v=>setRC('costoAdquisicion',v)}/>
                <ModalNotchInput label="IVA (%)"               type="number"          value={rcForm.iva}               onChange={v=>setRC('iva',v)}/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, marginBottom:32 }}>
                <ModalNotchInput label="No. Factura" required value={rcForm.numeroFactura} onChange={v=>setRC('numeroFactura',v)}/>
                <div>
                  <input type="file" className="hidden" ref={facturaRef} accept=".pdf"
                    onChange={e=>{ const f=e.target.files?.[0]; if(!f) return; if(f.type!=='application/pdf') return Swal.fire('Error','Debe adjuntar un archivo en formato PDF.','warning'); setFacturaFile(f); }}/>
                  <ModalNotchFile label="Adjuntar factura (PDF)" required file={facturaFile} onClick={()=>facturaRef.current?.click()}/>
                </div>
                <ModalNotchInput label="Vida útil estimada (años)" type="number" value={rcForm.vidaUtil} onChange={v=>setRC('vidaUtil',v)}/>
              </div>
              <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:44 }}>
                <button className="hv-cancel-btn" onClick={handleCancelRC}>Cancelar</button>
                <button className="hv-save-btn"   onClick={handleSaveRC}>Guardar y Habilitar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HojasDeVidaScreen;