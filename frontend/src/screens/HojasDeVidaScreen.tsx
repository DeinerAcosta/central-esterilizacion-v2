import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, PlusCircle, Info, ChevronLeft, ChevronRight, ChevronDown, Download, 
  ArrowRightLeft, X, Calendar, Paperclip, Image as ImageIcon,
  Database, ChevronsLeft, ChevronsRight, FileText, MoreVertical, CheckCircle, Ban, DollarSign
} from 'lucide-react';
import Swal from 'sweetalert2';

// --- Componentes UI Reutilizables ---
interface HVNotchSelectProps { id: string; label: string; value: string; onChange: (v: string) => void; options: { value: string | number; label: string }[]; compact?: boolean; disabled?: boolean; }
const HVNotchSelect: React.FC<HVNotchSelectProps> = ({ id, label, value, onChange, options, compact = true, disabled = false }) => {
  const [focused, setFocused] = useState(false);
  const bg = focused ? '#fff' : '#f8fafc';
  return (
    <div style={{ position: 'relative', flexShrink: 0, opacity: disabled ? 0.6 : 1 }}>
      <select id={id} value={value} onChange={e => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} disabled={disabled}
        style={{ height: compact ? 42 : 48, borderRadius: 30, border: `1.5px solid ${focused ? '#3b82f6' : '#d1d5db'}`, background: bg, padding: compact ? '10px 36px 0 16px' : '14px 36px 0 16px', fontSize: 13, color: value === '' ? '#9ca3af' : '#334155', outline: 'none', appearance: 'none' as const, boxSizing: 'border-box' as const, minWidth: 160, transition: 'border-color 0.2s', fontFamily: 'Inter, sans-serif', cursor: disabled ? 'not-allowed' : 'pointer' }}>
        <option value="" style={{ color: '#9ca3af' }}>Seleccionar...</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <label htmlFor={id} style={{ position: 'absolute', left: 18, top: 0, transform: 'translateY(-50%)', fontSize: 10.5, color: focused ? '#3b82f6' : '#6b7280', pointerEvents: 'none', background: bg, padding: '0 4px', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', transition: 'color 0.18s' }}>{label}</label>
      <ChevronDown size={14} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af' }} />
    </div>
  );
};

const ModalSelect: React.FC<any> = ({ label, required, value, onChange, children, disabled }) => (
  <div className="relative">
    <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 z-10">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
    <div className="relative">
      <select disabled={disabled} value={value} onChange={e => onChange(e.target.value)} className={`w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 outline-none focus:border-blue-400 transition-all text-sm appearance-none ${disabled ? 'bg-slate-50 cursor-not-allowed' : 'cursor-pointer bg-white'}`}>{children}</select>
      <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16} />
    </div>
  </div>
);

const ModalInput: React.FC<any> = ({ label, required, type = 'text', placeholder = '', disabled, value, onChange, min, max }) => (
  <div className="relative">
    <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 z-10">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
    <div className="relative">
      <input type={type} placeholder={placeholder} disabled={disabled} value={value} onChange={e => onChange(e.target.value)} min={min} max={max} className={`w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-sm ${disabled ? 'bg-slate-50 cursor-not-allowed text-slate-400' : 'bg-white'}`} />
      {type === 'date' && <Calendar className="absolute right-4 top-3 text-slate-400 pointer-events-none" size={18} />}
    </div>
  </div>
);

const HojasDeVidaScreen: React.FC = () => {
  // Simulamos los permisos del usuario logueado para mostrar/ocultar contabilidad
  const userPermissions = { puedeRegistrarContable: true };

  // --- ESTADOS DE NAVEGACIÓN (Corregidos) ---
  const [activeTab, setActiveTab]             = useState<'hv' | 'inventario'>('hv');
  const [isCreating, setIsCreating]           = useState(false);
  const [isBajasOpen, setIsBajasOpen]         = useState(false);
  const [viewDetailInst, setViewDetailInst]   = useState<any>(null); // Maneja la vista de detalle
  const [isTrasladarOpen, setIsTrasladarOpen] = useState(false);

  const [especialidades, setEspecialidades]   = useState<any[]>([]);
  const [subespecialidades, setSubespecialidades] = useState<any[]>([]);
  const [tipos, setTipos]                     = useState<any[]>([]);
  const [proveedores, setProveedores]         = useState<any[]>([]);
  const [propietarios, setPropietarios]       = useState<any[]>([]);
  const [kitsDB, setKitsDB]                   = useState<any[]>([]);
  const [sedesDB, setSedesDB]                 = useState<any[]>([]);

  const [filterEsp, setFilterEsp]             = useState('');
  const [filterSub, setFilterSub]             = useState('');
  const [filterEstado, setFilterEstado]       = useState('');
  const [searchHV, setSearchHV]               = useState('');
  
  const [filterInvEsp, setFilterInvEsp]       = useState('');
  const [filterInvSub, setFilterInvSub]       = useState('');
  const [filterInvTipo, setFilterInvTipo]     = useState('');
  const [searchInv, setSearchInv]             = useState('');

  const [dataHV, setDataHV]                   = useState<any[]>([]);
  const [dataInventario, setDataInventario]   = useState<any[]>([]);
  const [loading, setLoading]                 = useState(false);
  const [currentPage, setCurrentPage]         = useState(1);
  const [totalPages, setTotalPages]           = useState(1);
  const [totalRecords, setTotalRecords]       = useState(0);

  // Menú de acciones en grilla
  const [openActionMenuId, setOpenActionMenuId] = useState<number | null>(null);

  // --- ESTADOS: REGISTRO CONTABLE ---
  const [isContableOpen, setIsContableOpen] = useState(false);
  const [instToRegister, setInstToRegister] = useState<any>(null);
  const [contableForm, setContableForm] = useState({ fechaCompra: '', costo: '', iva: '', numeroFactura: '', vidaUtil: '' });
  const [facturaFile, setFacturaFile] = useState<File | null>(null);
  const facturaRef = useRef<HTMLInputElement>(null);

  const initialFormState = {
    especialidadId: '', subespecialidadId: '', tipoId: '', proveedorId: '', kitId: '', sedeId: '',
    nombre: '', fabricante: '', paisOrigen: '', numeroSerie: '', registroInvima: '',
    material: '', materialOtro: '', esterilizacion: '', frecuenciaMantenimiento: '',
    observacionesTecnico: '', estadoActual: 'P. registrar',
    propietarioId: '', notasObservaciones: '', cicloEsterilizacion: '0'
  };
  const [formData, setFormData] = useState<any>(initialFormState);

  const [fotoFile, setFotoFile]         = useState<File | null>(null);
  const [garantiaFile, setGarantiaFile] = useState<File | null>(null);
  const [invimaFile, setInvimaFile]     = useState<File | null>(null);
  const [codigoFile, setCodigoFile]     = useState<File | null>(null);
  const fotoRef    = useRef<HTMLInputElement>(null);
  const garantiaRef = useRef<HTMLInputElement>(null);
  const invimaRef   = useRef<HTMLInputElement>(null);
  const codigoRef   = useRef<HTMLInputElement>(null);

  const [transferType, setTransferType] = useState<'kit' | 'instrumento'>('kit');
  const [trasladoForm, setTrasladoForm] = useState({ sedeOrigenId: '', sedeDestinoId: '', fechaDevolucion: '' });
  const [inventarioOrigen, setInventarioOrigen] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [trasladoEsp, setTrasladoEsp]   = useState('');
  const [trasladoSub, setTrasladoSub]   = useState('');
  const [trasladoTipo, setTrasladoTipo] = useState('');
  const [trasladoSearch, setTrasladoSearch] = useState('');

  const [bajasData, setBajasData]           = useState<any[]>([]);
  const [bajasLoading, setBajasLoading]     = useState(false);
  const [bajasDesde, setBajasDesde]         = useState('');
  const [bajasHasta, setBajasHasta]         = useState('');
  const [bajasEsp, setBajasEsp]             = useState('');
  const [bajasSub, setBajasSub]             = useState('');
  const [bajasSearch, setBajasSearch]       = useState('');
  const [bajasPage, setBajasPage]           = useState(1);
  const [bajasTotalPages, setBajasTotalPages] = useState(1);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => { fetchListas(); }, []);
  
  useEffect(() => { 
    if(activeTab === 'hv' && !isCreating && !isBajasOpen && !viewDetailInst) fetchHojasVida(); 
  }, [currentPage, searchHV, filterEstado, filterEsp, filterSub, activeTab, isCreating, isBajasOpen, viewDetailInst]);
  
  useEffect(() => {
    if (activeTab === 'inventario' && !isCreating && !isBajasOpen && !viewDetailInst) fetchInventario();
  }, [filterInvEsp, filterInvSub, filterInvTipo, searchInv, activeTab, isCreating, isBajasOpen, viewDetailInst]);
  
  useEffect(() => {
    if (isTrasladarOpen && trasladoForm.sedeOrigenId) fetchInventarioOrigen();
    else { setInventarioOrigen([]); setSelectedItems([]); }
  }, [trasladoForm.sedeOrigenId, transferType, trasladoEsp, trasladoSub, trasladoTipo, isTrasladarOpen]);
  
  useEffect(() => {
    if (isBajasOpen) fetchBajas();
  }, [isBajasOpen, bajasDesde, bajasHasta, bajasEsp, bajasSub, bajasSearch, bajasPage]);

  // Cerrar popover de acciones al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => setOpenActionMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchListas = async () => {
    try {
      const resEsp   = await fetch('http://localhost:4000/api/especialidades'); setEspecialidades((await resEsp.json()).data || []);
      const resSub   = await fetch('http://localhost:4000/api/subespecialidades'); setSubespecialidades((await resSub.json()).data || []);
      const resTipos = await fetch('http://localhost:4000/api/tipos-subespecialidad'); setTipos((await resTipos.json()).data || []);
      const resKits  = await fetch('http://localhost:4000/api/kits'); setKitsDB((await resKits.json()).data || []);
      const resSedes = await fetch('http://localhost:4000/api/sedes'); setSedesDB((await resSedes.json()).data || []);
      
      const resProv = await fetch('http://localhost:4000/api/proveedores'); 
      const provs = (await resProv.json()).data || [];
      setProveedores(provs.filter((p:any) => p.tipo?.toLowerCase() === 'compras' || p.tipo?.toLowerCase() === 'mantenimiento y compras')); 
      
      const resUsers = await fetch('http://localhost:4000/api/usuarios'); 
      const users = (await resUsers.json()).data || [];
      setPropietarios(users.filter((u:any) => u.esPropietario === true));
    } catch (error) { console.error('Error cargando listas', error); }
  };

  const fetchHojasVida = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ page: String(currentPage), search: searchHV });
      if (filterEstado) query.append('estado', filterEstado);
      if (filterEsp) query.append('especialidadId', filterEsp);
      if (filterSub) query.append('subespecialidadId', filterSub);

      const res  = await fetch(`http://localhost:4000/api/hoja-vida?${query.toString()}`);
      const json = await res.json();
      setDataHV(json.data || []); setTotalPages(json.totalPages || 1); setTotalRecords(json.total || 0);
    } catch (error) { console.error('Error obteniendo hojas de vida', error); }
    finally { setLoading(false); }
  };

  const fetchInventario = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filterInvEsp) query.append('especialidadId', filterInvEsp);
      if (filterInvSub) query.append('subespecialidadId', filterInvSub);
      if (filterInvTipo) query.append('tipoId', filterInvTipo);
      if (searchInv) query.append('search', searchInv);
      const res = await fetch(`http://localhost:4000/api/hoja-vida/inventario?${query.toString()}`);
      const json = await res.json();
      setDataInventario(json.data || []);
    } catch (error) { console.error('Error obteniendo inventario', error); } 
    finally { setLoading(false); }
  };

  const fetchBajas = async () => {
    setBajasLoading(true);
    try {
      const query = new URLSearchParams({ page: String(bajasPage) });
      if (bajasDesde) query.append('fechaDesde', bajasDesde);
      if (bajasHasta) query.append('fechaHasta', bajasHasta);
      if (bajasEsp) query.append('especialidadId', bajasEsp);
      if (bajasSub) query.append('subespecialidadId', bajasSub);
      if (bajasSearch) query.append('search', bajasSearch);
      const res = await fetch(`http://localhost:4000/api/hoja-vida/bajas?${query.toString()}`);
      const json = await res.json();
      setBajasData(json.data || []); setBajasTotalPages(json.totalPages || 1);
    } catch (error) { console.error('Error al obtener bajas', error); }
    finally { setBajasLoading(false); }
  };

  // --- ACCIONES EN LA GRILLA ---
  const toggleActionMenu = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setOpenActionMenuId(openActionMenuId === id ? null : id);
  };

  const openDetail = (inst: any) => {
    setViewDetailInst(inst); // Correctamente asigna el estado para abrir la vista
  };

  const changeStatus = async (id: number, nuevoEstado: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/hoja-vida/${id}/estado`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado: nuevoEstado })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.msg);
      Swal.fire('Éxito', `El instrumento ahora está ${nuevoEstado}`, 'success');
      fetchHojasVida();
    } catch (error: any) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  const handleOpenRegistroContable = (inst: any) => {
    setInstToRegister(inst);
    setContableForm({ fechaCompra: '', costo: '', iva: '', numeroFactura: '', vidaUtil: '' });
    setFacturaFile(null);
    setIsContableOpen(true);
  };

  const handleSaveRegistroContable = async () => {
    if (!contableForm.fechaCompra || !contableForm.costo || !contableForm.numeroFactura || !facturaFile) {
      return Swal.fire('Atención', 'Diligencie todos los campos y suba el PDF de la factura.', 'warning');
    }
    try {
      const data = new FormData();
      Object.keys(contableForm).forEach(key => { if((contableForm as any)[key]) data.append(key, (contableForm as any)[key]) });
      data.append('facturaDoc', facturaFile);

      const res = await fetch(`http://localhost:4000/api/hoja-vida/${instToRegister.id}/contable`, { method: 'PUT', body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.msg);

      Swal.fire('Éxito', 'Registro contable guardado. Instrumento Habilitado.', 'success');
      setIsContableOpen(false); setInstToRegister(null);
      fetchHojasVida();
    } catch (error: any) { Swal.fire('Error', error.message, 'error'); }
  };

  const handleBajaDateChange = (type: 'desde' | 'hasta', value: string) => {
    if (type === 'desde') {
      if (bajasHasta && value > bajasHasta) return Swal.fire('Aviso', 'La fecha "Desde" no puede ser mayor que la fecha "Hasta".', 'warning');
      setBajasDesde(value);
    } else {
      if (value > today) return Swal.fire('Aviso', 'La fecha "Hasta" no puede ser mayor a hoy.', 'warning');
      if (bajasDesde && value < bajasDesde) return Swal.fire('Aviso', 'La fecha "Hasta" no puede ser menor que la fecha "Desde".', 'warning');
      setBajasHasta(value);
    }
  };

  // --- LÓGICA DE TRASLADOS ---
  const fetchInventarioOrigen = async () => {
    try {
      const query = new URLSearchParams({
        sedeId: trasladoForm.sedeOrigenId, tipoTraslado: transferType,
        ...(trasladoEsp && { especialidadId: trasladoEsp }),
        ...(trasladoSub && { subespecialidadId: trasladoSub }),
        ...(trasladoTipo && { tipoId: trasladoTipo }),
      });
      const res = await fetch(`http://localhost:4000/api/hoja-vida/inventario-sede?${query.toString()}`);
      setInventarioOrigen((await res.json()).data || []); setSelectedItems([]);
    } catch(err) { console.error("Error al obtener inventario", err); }
  };

  const toggleItemSelection = (item: any) => {
    if (transferType === 'kit') {
      const exists = selectedItems.find(i => i.id === item.id);
      if (exists) setSelectedItems(selectedItems.filter(i => i.id !== item.id));
      else setSelectedItems([...selectedItems, { id: item.id }]);
    } else {
      const exists = selectedItems.find(i => i.nombre === item.name);
      if (exists) setSelectedItems(selectedItems.filter(i => i.nombre !== item.name));
      else setSelectedItems([...selectedItems, { nombre: item.name, cantidad: 1 }]);
    }
  };

  const updateItemQuantity = (name: string, val: string, maxQty: number) => {
    let qty = parseInt(val) || 0;
    if (qty > maxQty) qty = maxQty;
    if (qty < 1) qty = 1;
    setSelectedItems(selectedItems.map(i => i.nombre === name ? { ...i, cantidad: qty } : i));
  };

  const handleSaveTraslado = async () => {
    if (!trasladoForm.sedeOrigenId || !trasladoForm.sedeDestinoId || !trasladoForm.fechaDevolucion) return Swal.fire('Atención', 'Debe diligenciar Sede origen, Sede destino y Fecha de devolución.', 'warning');
    if (trasladoForm.sedeOrigenId === trasladoForm.sedeDestinoId) return Swal.fire('Atención', 'La sede origen y destino no pueden ser la misma.', 'warning');
    if (selectedItems.length === 0) return Swal.fire('Atención', 'Debe seleccionar al menos un elemento para trasladar.', 'warning');
    const payload = {
      sedeOrigenId: trasladoForm.sedeOrigenId, sedeDestinoId: trasladoForm.sedeDestinoId,
      fechaDevolucion: trasladoForm.fechaDevolucion, tipoTraslado: transferType,
      items: transferType === 'kit' ? selectedItems.map(i => i.id) : selectedItems
    };
    try {
      const res = await fetch('http://localhost:4000/api/hoja-vida/trasladar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.msg);
      Swal.fire('Éxito', 'Traslado ejecutado correctamente', 'success');
      setIsTrasladarOpen(false); setTrasladoForm({ sedeOrigenId: '', sedeDestinoId: '', fechaDevolucion: '' }); setSelectedItems([]); fetchHojasVida();
    } catch(err:any) { Swal.fire('Error', err.message || 'Error al ejecutar traslado', 'error'); }
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>, setter: any, type: 'foto'|'pdf'|'mixto') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === 'foto' || type === 'mixto') {
      if (type === 'foto' && !['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) return Swal.fire('Error', 'Debe ser JPG o PNG.', 'warning');
      if (file.size > 2 * 1024 * 1024) return Swal.fire('Error', 'La foto no debe superar los 2MB.', 'warning');
    }
    if (type === 'pdf' && file.type !== 'application/pdf') return Swal.fire('Error', 'El documento debe ser formato PDF.', 'warning');
    setter(file);
  };

  const handleSave = async () => {
    if (!formData.nombre || !formData.numeroSerie || !formData.registroInvima || !formData.material || !formData.esterilizacion || !formData.frecuenciaMantenimiento || !formData.propietarioId || !formData.especialidadId) {
      Swal.fire('Campos incompletos', 'Debe diligenciar todos los campos obligatorios (*).', 'error'); return;
    }
    if (formData.material === 'Otros' && !formData.materialOtro) {
       return Swal.fire('Campos incompletos', 'Especifique el material en el campo "¿Cuál?".', 'error');
    }
    if (!fotoFile || !garantiaFile || !invimaFile || !codigoFile) {
      Swal.fire('Archivos faltantes', 'Debe subir la Foto, Garantía, Registro INVIMA y Código Instrumento.', 'error'); return;
    }
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => { if(formData[key]) data.append(key, formData[key]) });
      if (fotoFile) data.append('foto', fotoFile);
      if (garantiaFile) data.append('garantia', garantiaFile);
      if (invimaFile) data.append('registroInvimaDoc', invimaFile);
      if (codigoFile) data.append('codigoInstrumentoDoc', codigoFile);
      const res  = await fetch('http://localhost:4000/api/hoja-vida', { method: 'POST', body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.msg);
      Swal.fire({ icon: 'success', title: '¡Éxito!', text: 'Hoja de vida creada correctamente', timer: 2000, showConfirmButton: false });
      setIsCreating(false); setFormData(initialFormState);
      setFotoFile(null); setGarantiaFile(null); setInvimaFile(null); setCodigoFile(null);
      fetchHojasVida();
    } catch (error: any) { Swal.fire('Error', error.message || 'Error al guardar', 'error'); }
  };

  const handleCancelCreate = () => {
    Swal.fire({ title: '¿Está seguro?', text: 'La información diligenciada no se guardará en el sistema.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#3b82f6', cancelButtonColor: '#94a3b8', confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar' })
    .then(result => {
      if (result.isConfirmed) {
        setIsCreating(false); setFormData(initialFormState);
        setFotoFile(null); setGarantiaFile(null); setInvimaFile(null); setCodigoFile(null);
      }
    });
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Habilitado':       return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'P. registrar':     return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'En mantenimiento': return 'bg-purple-50 text-purple-500 border-purple-100';
      case 'De baja':          return 'bg-red-50 text-red-800 border-red-200';
      case 'Deshabilitado':    return 'bg-red-50 text-red-500 border-red-100';
      default:                 return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  const getKitColor = (idx: number) => idx % 3 === 0 ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : (idx % 3 === 1 ? 'bg-red-50 text-red-500 border-red-100' : 'bg-blue-50 text-blue-500 border-blue-100');

  const downloadCSV = () => {
    const d = activeTab === 'hv' ? dataHV : dataInventario;
    if (d.length === 0) return;
    const headers = Object.keys(d[0]).join(',');
    const rows    = d.map((r: any) => Object.values({ ...r, kits: Array.isArray(r.kits) ? r.kits.join('|') : r.kits }).join(','));
    const blob    = new Blob(['\uFEFF' + [headers, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url     = URL.createObjectURL(blob);
    const a       = document.createElement('a');
    a.href = url; a.download = `Reporte_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const truncateFileName = (file: File | null, defaultText: string) => (!file) ? defaultText : (file.name.length > 15 ? file.name.substring(0, 15) + '...' : file.name);

  const getPreviewCode = () => {
    const esp = especialidades.find(e => e.id == formData.especialidadId)?.nombre || 'XX';
    const sub = subespecialidades.find(s => s.id == formData.subespecialidadId)?.nombre || 'XX';
    const tip = tipos.find(t => t.id == formData.tipoId)?.nombre || 'XX';
    return {
      esp: esp.substring(0, 2).toUpperCase(),
      sub: sub.substring(0, 2).toUpperCase(),
      tip: tip.substring(0, 2).toUpperCase()
    };
  };
  const preview = getPreviewCode();

  const sharedStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    .hv-save-btn { padding: 11px 48px; border-radius: 30px; border: none; cursor: pointer; background: linear-gradient(90deg, #60a5fa 0%, #34d399 100%); color: #fff; font-weight: 700; font-size: 14px; font-family: 'Inter', sans-serif; box-shadow: 0 4px 14px rgba(96,165,250,0.4); transition: opacity 0.2s, transform 0.15s; }
    .hv-save-btn:hover { opacity: 0.9; transform: translateY(-1px); }
    .hv-cancel-btn { background: none; border: none; cursor: pointer; font-size: 14px; font-weight: 600; color: #64748b; font-family: 'Inter', sans-serif; transition: color 0.2s; padding: 0; }
    .hv-cancel-btn:hover { color: #ef4444; }
    .hv-search-icon { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #60a5fa; }
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;

  /* ═══════════════════════════════════════════════════════
     VISTA: DETALLE (Con restricción de Registro Contable)
     ═══════════════════════════════════════════════════════ */
  if (viewDetailInst) {
    return (
      <>
        <style>{sharedStyles}</style>
        <div className="space-y-5 h-full flex flex-col font-sans overflow-y-auto hide-scrollbar pb-10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                    <button onClick={() => setViewDetailInst(null)} className="text-blue-500 hover:text-blue-700 bg-slate-50 p-2 rounded-full"><ChevronLeft size={24} /></button>
                    <h1 className="text-2xl font-bold text-slate-800">Detalle de Instrumento <span className="text-blue-500 ml-2 font-mono">{viewDetailInst.codigo}</span></h1>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(viewDetailInst.estado)}`}>{viewDetailInst.estado}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Info Técnica y Fabricación */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                      <h3 className="font-bold text-slate-800 border-b pb-2 mb-4">Información Técnica y Fabricación</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                          <div><p className="text-[10px] text-slate-400 uppercase font-bold">Nombre</p><p className="text-sm font-medium text-slate-700">{viewDetailInst.nombre}</p></div>
                          <div><p className="text-[10px] text-slate-400 uppercase font-bold">Serie / INVIMA</p><p className="text-sm font-medium text-slate-700">{viewDetailInst.numeroSerie} <br/><span className="text-xs text-slate-400">{viewDetailInst.registroInvima}</span></p></div>
                          <div><p className="text-[10px] text-slate-400 uppercase font-bold">Fabricante / Origen</p><p className="text-sm font-medium text-slate-700">{viewDetailInst.fabricante} <br/><span className="text-xs text-slate-400">{viewDetailInst.paisOrigen}</span></p></div>
                          <div><p className="text-[10px] text-slate-400 uppercase font-bold">Material</p><p className="text-sm font-medium text-slate-700">{viewDetailInst.material} {viewDetailInst.materialOtro ? `(${viewDetailInst.materialOtro})`:''}</p></div>
                          <div><p className="text-[10px] text-slate-400 uppercase font-bold">Esterilización</p><p className="text-sm font-medium text-slate-700">{viewDetailInst.esterilizacion}</p></div>
                          <div><p className="text-[10px] text-slate-400 uppercase font-bold">Kit Asignado</p><p className="text-sm font-medium text-slate-700">{viewDetailInst.kit ? viewDetailInst.kit.codigoKit : <span className="text-slate-400 italic">Suelto</span>}</p></div>
                      </div>
                  </div>

                  {/* Mantenimiento y Uso (Separados como solicitaste) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                        <h3 className="font-bold text-slate-800 border-b pb-2 mb-4">Mantenimiento y calibración</h3>
                        <div className="space-y-4">
                            <div><p className="text-[10px] text-slate-400 uppercase font-bold">Frecuencia Preventiva</p><p className="text-sm font-medium text-slate-700">{viewDetailInst.frecuenciaMantenimiento}</p></div>
                            <div><p className="text-[10px] text-slate-400 uppercase font-bold">Próximo Mantenimiento</p><p className="text-sm font-medium text-slate-700">{viewDetailInst.proximoMantenimiento ? new Date(viewDetailInst.proximoMantenimiento).toLocaleDateString() : 'Pendiente de cálculo'}</p></div>
                            <div><p className="text-[10px] text-slate-400 uppercase font-bold">Observaciones del Técnico</p><p className="text-sm font-medium text-slate-700">{viewDetailInst.observacionesTecnico || 'Sin observaciones'}</p></div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                        <h3 className="font-bold text-slate-800 border-b pb-2 mb-4">Uso y trazabilidad</h3>
                        <div className="space-y-4">
                            <div><p className="text-[10px] text-slate-400 uppercase font-bold">Estado actual</p><p className="text-sm font-medium text-slate-700">{viewDetailInst.estadoActual}</p></div>
                            <div><p className="text-[10px] text-slate-400 uppercase font-bold">Ciclo de esterilización</p><p className="text-sm font-medium text-slate-700">{viewDetailInst.cicloEsterilizacion} ciclos</p></div>
                            <div><p className="text-[10px] text-slate-400 uppercase font-bold">Propietario</p><p className="text-sm font-medium text-slate-700">{viewDetailInst.propietario?.nombre} {viewDetailInst.propietario?.apellido}</p></div>
                            <div><p className="text-[10px] text-slate-400 uppercase font-bold">Notas y observaciones</p><p className="text-sm font-medium text-slate-700">{viewDetailInst.notasObservaciones || 'Sin notas'}</p></div>
                        </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm h-fit">
                    <h3 className="font-bold text-slate-800 border-b pb-2 mb-4">Documentos Adjuntos</h3>
                    <div className="space-y-3">
                        {['Foto', 'Garantía', 'Registro INVIMA', 'Cód. Instrumento'].map((doc, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <span className="text-xs font-medium text-slate-600 flex items-center gap-2"><FileText size={14} className="text-blue-400"/> {doc}</span>
                                <button className="text-[10px] bg-white border border-slate-200 px-3 py-1 rounded-full text-blue-500 font-bold hover:bg-blue-50 transition-colors shadow-sm">Ver</button>
                            </div>
                        ))}
                    </div>
                </div>

                {userPermissions.puedeRegistrarContable && (
                    <div className="lg:col-span-3 bg-emerald-50/30 rounded-2xl border border-emerald-100 p-6 shadow-sm relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400" />
                         <div className="flex items-center gap-2 border-b border-emerald-100 pb-2 mb-5">
                            <DollarSign size={18} className="text-emerald-500" />
                            <h3 className="font-bold text-emerald-800">Registro Contable Privado</h3>
                         </div>
                         {viewDetailInst.costo ? (
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                <div><p className="text-[10px] text-emerald-600/70 uppercase font-bold">F. Compra</p><p className="text-sm font-bold text-emerald-900">{new Date(viewDetailInst.fechaCompra).toLocaleDateString()}</p></div>
                                <div><p className="text-[10px] text-emerald-600/70 uppercase font-bold">Costo Adquisición</p><p className="text-sm font-bold text-emerald-900">$ {viewDetailInst.costo.toLocaleString()}</p></div>
                                <div><p className="text-[10px] text-emerald-600/70 uppercase font-bold">IVA</p><p className="text-sm font-bold text-emerald-900">{viewDetailInst.iva ? `${viewDetailInst.iva}%` : 'N/A'}</p></div>
                                <div><p className="text-[10px] text-emerald-600/70 uppercase font-bold">No. Factura</p><p className="text-sm font-bold text-emerald-900">{viewDetailInst.numeroFactura}</p></div>
                                <div><p className="text-[10px] text-emerald-600/70 uppercase font-bold">Factura Adjunta</p><button className="mt-1 text-xs bg-white border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full font-bold shadow-sm hover:bg-emerald-50">Ver Documento</button></div>
                            </div>
                         ) : (
                             <p className="text-sm text-emerald-600/60 italic font-medium">El instrumento aún no posee información contable registrada. (Se requiere para Habilitar)</p>
                         )}
                    </div>
                )}
            </div>
        </div>
      </>
    )
  }

  /* ═══════════════════════════════════════════════════════
     VISTA: CREAR HOJA DE VIDA 
     ═══════════════════════════════════════════════════════ */
  if (isCreating) {
    return (
      <>
        <style>{sharedStyles}</style>
        <div className="space-y-5 h-full flex flex-col font-sans overflow-y-auto hide-scrollbar pb-10">

          {/* Encabezado */}
          <div className="flex items-center gap-3">
            <button onClick={handleCancelCreate} className="text-blue-500 hover:text-blue-700 transition-colors">
              <ChevronLeft size={28} strokeWidth={2.5} />
            </button>
            <h1 className="text-3xl font-bold text-slate-800">Crear hoja de vida</h1>
          </div>

          {/* Foto + Requisitos */}
          <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6 flex flex-col lg:flex-row items-start gap-8">
            <div className="flex items-center gap-5 flex-shrink-0">
              <div>
                <h3 className="text-base font-bold text-blue-500">Foto Instrumento</h3>
                <p className="text-xs text-slate-400 mt-1">Mín. 400x400 px | Máx. 2MB</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 overflow-hidden flex-shrink-0">
                {fotoFile ? <img src={URL.createObjectURL(fotoFile)} alt="preview" className="w-full h-full object-cover" /> : <ImageIcon size={22} />}
              </div>
              <div className="flex flex-col gap-1.5">
                <input type="file" className="hidden" ref={fotoRef} accept="image/png, image/jpeg" onChange={e => handleFileSelection(e, setFotoFile, 'foto')} />
                <button onClick={() => fotoRef.current?.click()} className="px-4 py-1.5 rounded-full border border-cyan-400 text-cyan-500 text-xs font-bold hover:bg-cyan-50 transition-colors whitespace-nowrap">Subir foto</button>
                <button onClick={() => setFotoFile(null)} className="text-slate-400 text-xs font-semibold hover:text-red-500 transition-colors text-center">Eliminar</button>
              </div>
            </div>

            <div className="hidden lg:block w-px self-stretch bg-slate-100 flex-shrink-0" />

            <div className="flex-1 w-full">
              <p className="text-sm font-bold text-slate-700 mb-4">Requisitos:</p>
              <input type="file" className="hidden" ref={garantiaRef} accept=".pdf" onChange={e => handleFileSelection(e, setGarantiaFile, 'pdf')} />
              <input type="file" className="hidden" ref={invimaRef}   accept=".pdf" onChange={e => handleFileSelection(e, setInvimaFile, 'pdf')} />
              <input type="file" className="hidden" ref={codigoRef}   accept=".pdf,image/*" onChange={e => handleFileSelection(e, setCodigoFile, 'mixto')} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Garantía (PDF)', ref: garantiaRef, file: garantiaFile, setter: setGarantiaFile },
                  { label: 'R. INVIMA (PDF)', ref: invimaRef,   file: invimaFile,   setter: setInvimaFile   },
                  { label: 'Cód. Instrumento (PDF/IMG)', ref: codigoRef, file: codigoFile, setter: setCodigoFile   },
                ].map((item, i) => (
                  <div key={i} className="relative cursor-pointer" onClick={() => item.ref.current?.click()}>
                    <label className="absolute -top-2.5 left-4 bg-white px-1 text-[10px] font-bold text-slate-500 z-10 cursor-pointer">
                      {item.label}<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <div className={`w-full h-11 border rounded-full flex items-center px-4 text-xs transition-colors group ${item.file ? 'border-blue-400 bg-blue-50 text-blue-600' : 'border-slate-300 bg-white text-slate-400 hover:border-blue-300'}`}>
                      <span className="truncate flex-1">{truncateFileName(item.file, 'Subir Documento')}</span>
                      <Paperclip size={14} className="ml-2 flex-shrink-0 text-slate-400 group-hover:text-blue-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Datos básicos */}
          <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-800 mb-5">Datos básicos del Instrumento</h3>

            <div className="flex flex-col md:flex-row items-center gap-6 mb-7 bg-slate-50/60 rounded-2xl px-6 py-4 border border-slate-100">
              <span className="text-blue-500 font-bold text-sm whitespace-nowrap flex-shrink-0">Código Instrumento</span>
              <div className="flex gap-6 overflow-x-auto pb-1 hide-scrollbar">
                {[
                  { chars: preview.esp.split(''), label: '[Especialidad]' },
                  { chars: preview.sub.split(''), label: '[Subespecialidad]' },
                  { chars: preview.tip.split(''), label: '[Tipo Subespecialidad]' },
                  { chars: ['-','-','-','-'],      label: '[Consecutivo]' },
                ].map((g, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div className="flex gap-1.5">
                      {g.chars.map((c, j) => (
                        <div key={j} className={`w-9 h-9 rounded-full border flex items-center justify-center text-xs font-bold bg-white ${c === 'X' || c === '-' ? 'border-slate-300 text-slate-400' : 'border-cyan-400 text-cyan-500'}`}>{c}</div>
                      ))}
                    </div>
                    <span className="text-[9px] text-slate-400 whitespace-nowrap">{g.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-5 gap-y-7 mb-7">
              <ModalInput label="Nombre" required value={formData.nombre} onChange={(v:any) => setFormData({ ...formData, nombre: v })} placeholder="Nombre del instrumento" />
              <ModalSelect label="Especialidad" required value={formData.especialidadId} onChange={(v:any) => setFormData({ ...formData, especialidadId: v })}>
                <option value="">Seleccionar...</option>{especialidades.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
              </ModalSelect>
              <ModalSelect label="Subespecialidad" required disabled={!formData.especialidadId} value={formData.subespecialidadId} onChange={(v:any) => setFormData({ ...formData, subespecialidadId: v })}>
                <option value="">Seleccionar...</option>{subespecialidades.filter(s=>s.especialidadId === Number(formData.especialidadId)).map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </ModalSelect>
              <ModalSelect label="Tipo de subespecialidad" required disabled={!formData.subespecialidadId} value={formData.tipoId} onChange={(v:any) => setFormData({ ...formData, tipoId: v })}>
                <option value="">Seleccionar...</option>{tipos.filter(t=>t.subespecialidadId === Number(formData.subespecialidadId)).map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </ModalSelect>
              <ModalInput label="KIT" disabled placeholder="Asignado en módulo Kit" value="" onChange={()=>{}} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-5 gap-y-7">
              <ModalInput label="Fabricante" required value={formData.fabricante} onChange={(v:any) => setFormData({ ...formData, fabricante: v })} />
              <ModalInput label="No. de serie" required value={formData.numeroSerie} onChange={(v:any) => setFormData({ ...formData, numeroSerie: v })} />
              <ModalInput label="No. registro INVIMA" required value={formData.registroInvima} onChange={(v:any) => setFormData({ ...formData, registroInvima: v })} />
              <ModalSelect label="Proveedor (Compras)" required value={formData.proveedorId} onChange={(v:any) => setFormData({ ...formData, proveedorId: v })}>
                <option value="">Seleccionar...</option>{proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </ModalSelect>
              <ModalSelect label="País origen" required value={formData.paisOrigen} onChange={(v:any) => setFormData({ ...formData, paisOrigen: v })}>
                <option value="">Seleccionar...</option>
                <option value="Colombia">Colombia</option>
                <option value="Estados Unidos">Estados Unidos</option>
                <option value="Alemania">Alemania</option>
              </ModalSelect>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Características técnicas */}
            <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6">
              <h3 className="text-base font-bold text-slate-800 mb-5">Características técnicas</h3>
              <div className="flex flex-col gap-6">
                <ModalSelect label="Material del instrumento" required value={formData.material} onChange={(v:any) => setFormData({ ...formData, material: v, materialOtro: '' })}>
                  <option value="">Seleccionar...</option>
                  <option value="Titanium">Titanium</option>
                  <option value="Acero Inoxidable">Acero inoxidable</option>
                  <option value="Carburo de Tungsteno">Carburo de tungsteno</option>
                  <option value="Otros">Otros</option>
                </ModalSelect>
                {formData.material === 'Otros' && <ModalInput label="¿Cuál?" required value={formData.materialOtro} onChange={(v:any) => setFormData({ ...formData, materialOtro: v })} />}
                <ModalSelect label="Esterilización compatible" required value={formData.esterilizacion} onChange={(v:any) => setFormData({ ...formData, esterilizacion: v })}>
                  <option value="">Seleccionar...</option>
                  <option value="Vapor">Vapor</option>
                  <option value="Gas">Gas</option>
                  <option value="Ambas">Ambas</option>
                </ModalSelect>
              </div>
            </div>
            
            {/* Mantenimiento y calibración (SEPARADO) */}
            <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6">
              <h3 className="text-base font-bold text-slate-800 mb-5">Mantenimiento y calibración</h3>
              <div className="flex flex-col gap-6">
                <ModalSelect label="Frecuencia preventiva" required value={formData.frecuenciaMantenimiento} onChange={(v:any) => setFormData({ ...formData, frecuenciaMantenimiento: v })}>
                  <option value="">Seleccionar...</option><option value="Diario">Diario</option><option value="Semanal">Semanal</option><option value="Quincenal">Quincenal</option><option value="Mensual">Mensual</option><option value="Bimensual">Bimensual</option><option value="Trimestral">Trimestral</option><option value="Cuatrimestral">Cuatrimestral</option><option value="Semestral">Semestral</option><option value="Anual">Anual</option>
                </ModalSelect>
                <ModalInput label="Fecha de mantenimiento" disabled value="" onChange={() => {}} placeholder="Calculada por el sistema" />
                <ModalInput label="Observaciones del técnico" value={formData.observacionesTecnico} onChange={(v:any) => setFormData({ ...formData, observacionesTecnico: v })} placeholder="Máx 500 caracteres" />
              </div>
            </div>

            {/* Uso y trazabilidad (SEPARADO) */}
            <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6">
              <h3 className="text-base font-bold text-slate-800 mb-5">Uso y trazabilidad</h3>
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                    <ModalSelect label="Estado actual" disabled value={formData.estadoActual} onChange={() => {}}>
                        <option value="P. registrar">P. registrar</option>
                    </ModalSelect>
                    <ModalInput label="Ciclo de esterilización" disabled value={formData.cicloEsterilizacion} onChange={() => {}} placeholder="0" />
                </div>
                <ModalSelect label="Propietario" required value={formData.propietarioId} onChange={(v:any) => setFormData({ ...formData, propietarioId: v })}>
                  <option value="">Seleccionar...</option>{propietarios.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>)}
                </ModalSelect>
                <ModalInput label="Notas y observaciones" value={formData.notasObservaciones} onChange={(v:any) => setFormData({ ...formData, notasObservaciones: v })} placeholder="Máx 500 caracteres" />
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center gap-6 py-4">
            <button className="hv-cancel-btn" onClick={handleCancelCreate}>Cancelar</button>
            <button className="hv-save-btn" onClick={handleSave}>Guardar Hoja de Vida</button>
          </div>
        </div>
      </>
    );
  }

  /* ═══════════════════════════════════════════════════════
     VISTA: CONTROL DE BAJAS
     ═══════════════════════════════════════════════════════ */
  if (isBajasOpen) {
    return (
      <>
        <style>{sharedStyles}</style>
        <div className="space-y-5 h-full flex flex-col font-sans overflow-y-auto hide-scrollbar pb-10">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => setIsBajasOpen(false)} className="text-blue-500 hover:text-blue-700 transition-colors"><ChevronLeft size={28} strokeWidth={2.5} /></button>
            <Database size={28} className="text-red-500" />
            <h1 className="text-3xl font-bold text-slate-800">Control de Bajas</h1>
          </div>
          <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6 flex flex-wrap gap-5 items-end">
            <div className="w-40">
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-2">Desde (Fecha Baja)</label>
              <input type="date" value={bajasDesde} max={bajasHasta || today} onChange={e => handleBajaDateChange('desde', e.target.value)} className="w-full h-11 border border-slate-300 rounded-full px-4 text-sm outline-none text-slate-600 focus:border-blue-400" />
            </div>
            <div className="w-40">
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-2">Hasta (Fecha Baja)</label>
              <input type="date" value={bajasHasta} min={bajasDesde} max={today} onChange={e => handleBajaDateChange('hasta', e.target.value)} className="w-full h-11 border border-slate-300 rounded-full px-4 text-sm outline-none text-slate-600 focus:border-blue-400" />
            </div>
            <div className="w-48 relative">
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-2">Especialidad</label>
              <select value={bajasEsp} onChange={e => setBajasEsp(e.target.value)} className="w-full h-11 border border-slate-300 rounded-full px-4 text-sm outline-none text-slate-600 appearance-none bg-white cursor-pointer"><option value="">Todas...</option>{especialidades.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}</select>
              <ChevronDown className="absolute right-4 top-[32px] text-slate-400 pointer-events-none" size={14} />
            </div>
            <div className="w-48 relative">
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-2">Subespecialidad</label>
              <select value={bajasSub} onChange={e => setBajasSub(e.target.value)} disabled={!bajasEsp} className="w-full h-11 border border-slate-300 rounded-full px-4 text-sm outline-none text-slate-600 appearance-none bg-white cursor-pointer disabled:opacity-50"><option value="">Todas...</option>{subespecialidades.filter(s=>s.especialidadId===Number(bajasEsp)).map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}</select>
              <ChevronDown className="absolute right-4 top-[32px] text-slate-400 pointer-events-none" size={14} />
            </div>
            <div className="flex-1 relative min-w-[200px]">
              <input type="text" placeholder="Buscar por nombre o código..." value={bajasSearch} onChange={e => setBajasSearch(e.target.value)} className="w-full h-11 border border-slate-300 rounded-full px-4 pr-10 text-sm outline-none text-slate-600 focus:border-blue-400" />
              <Search className="absolute right-4 top-3.5 text-blue-400" size={18} />
            </div>
          </div>
          <div className="flex-1 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="bg-red-50 text-red-800 font-bold border-b border-red-100">
                  <tr>
                    <th className="px-6 py-4 whitespace-nowrap">Fecha de Baja</th>
                    <th className="px-6 py-4 whitespace-nowrap">Instrumento</th>
                    <th className="px-6 py-4 whitespace-nowrap">Código</th>
                    <th className="px-6 py-4 whitespace-nowrap">Especialidad</th>
                    <th className="px-6 py-4 whitespace-nowrap">Subespecialidad</th>
                    <th className="px-6 py-4 whitespace-nowrap">Kit Perteneciente</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bajasLoading ? (
                    <tr><td colSpan={6} className="text-center py-10 text-slate-400">Buscando registros...</td></tr>
                  ) : bajasData.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-10 text-slate-400">No se encontraron instrumentos dados de baja.</td></tr>
                  ) : bajasData.map((row: any) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-red-500 font-bold">{new Date(row.updatedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-slate-700 font-bold">{row.nombre}</td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs font-bold">{row.codigo}</td>
                      <td className="px-6 py-4 text-slate-500">{row.especialidad?.nombre}</td>
                      <td className="px-6 py-4 text-slate-500">{row.subespecialidad?.nombre}</td>
                      <td className="px-6 py-4 text-slate-500">{row.kit?.codigoKit || <span className="text-xs text-slate-400 italic">Suelto</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 flex justify-between items-center text-xs text-slate-400 border-t border-slate-50">
              <span>Pág. {bajasPage} de {bajasTotalPages}</span>
              <div className="flex items-center gap-3 font-medium text-blue-500">
                <button onClick={() => setBajasPage(1)} disabled={bajasPage === 1} className="hover:text-blue-700 disabled:text-slate-300"><ChevronsLeft size={15} /></button>
                <button onClick={() => setBajasPage(p => Math.max(1, p - 1))} disabled={bajasPage === 1} className="hover:text-blue-700 disabled:text-slate-300"><ChevronLeft size={15} /></button>
                <span className="bg-blue-50 px-3 py-1 rounded text-blue-600 font-bold">{bajasPage} / {bajasTotalPages || 1}</span>
                <button onClick={() => setBajasPage(p => Math.min(bajasTotalPages, p + 1))} disabled={bajasPage === bajasTotalPages || bajasTotalPages === 0} className="hover:text-blue-700 disabled:text-slate-300"><ChevronRight size={15} /></button>
                <button onClick={() => setBajasPage(bajasTotalPages)} disabled={bajasPage === bajasTotalPages || bajasTotalPages === 0} className="hover:text-blue-700 disabled:text-slate-300"><ChevronsRight size={15} /></button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ═══════════════════════════════════════════════════════
     VISTA: PRINCIPAL (Listado de Grillas con Tabs)
     ═══════════════════════════════════════════════════════ */
  return (
    <>
      <style>{sharedStyles}</style>
      <div className="space-y-6 h-full flex flex-col font-sans relative">
        <h1 className="text-3xl font-bold text-blue-500">Hoja de vida</h1>
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden">
          
          <div className="flex w-full border-b border-slate-100">
            <button onClick={() => setActiveTab('hv')} className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'hv' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-50/30' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>Hoja de vida</button>
            <button onClick={() => setActiveTab('inventario')} className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'inventario' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-50/30' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>Inventario</button>
          </div>

          <div className="px-4 py-3 flex flex-col md:flex-row gap-3 justify-between items-center border-b border-slate-50">
            {activeTab === 'hv' ? (
              <>
                <div className="flex gap-3 flex-1 w-full items-center flex-wrap">
                  <HVNotchSelect id="hv-esp" label="Especialidad" value={filterEsp} onChange={setFilterEsp} options={especialidades.map(e => ({ value: String(e.id), label: e.nombre }))} />
                  <HVNotchSelect id="hv-sub" label="Subespecialidad" disabled={!filterEsp} value={filterSub} onChange={setFilterSub} options={subespecialidades.filter(s=>s.especialidadId===Number(filterEsp)).map(s => ({ value: String(s.id), label: s.nombre }))} />
                  <HVNotchSelect id="hv-estado" label="Estado" value={filterEstado} onChange={setFilterEstado} options={[{ value: 'Habilitado', label: 'Habilitado' }, { value: 'Deshabilitado', label: 'Deshabilitado' }, { value: 'P. registrar', label: 'P. registrar' }, { value: 'En mantenimiento', label: 'En mantenimiento' }, { value: 'De baja', label: 'De baja' }]} />
                  <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                    <input type="text" placeholder="Buscar por nombre..." value={searchHV} onChange={e => setSearchHV(e.target.value)} style={{ width: '100%', height: 42, borderRadius: 30, border: '1.5px solid #e2e8f0', background: '#f8fafc', padding: '0 40px 0 18px', fontSize: 13, color: '#475569', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'Inter,sans-serif', transition: 'border-color 0.2s' }} onFocus={e => (e.target.style.borderColor = '#3b82f6')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                    <Search className="hv-search-icon" size={17} />
                  </div>
                </div>
                <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 text-blue-500 font-bold text-sm hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap">Crear hoja de vida <PlusCircle size={18} /></button>
              </>
            ) : (
              <>
                <div className="flex gap-3 flex-1 w-full items-center flex-wrap">
                  <HVNotchSelect id="inv-esp" label="Especialidad" value={filterInvEsp} onChange={setFilterInvEsp} options={especialidades.map(e => ({ value: String(e.id), label: e.nombre }))} />
                  <HVNotchSelect id="inv-sub" label="Subespecialidad" disabled={!filterInvEsp} value={filterInvSub} onChange={setFilterInvSub} options={subespecialidades.filter(s=>s.especialidadId===Number(filterInvEsp)).map(s => ({ value: String(s.id), label: s.nombre }))} />
                  <HVNotchSelect id="inv-tipo" label="Tipo subespecialidad" disabled={!filterInvSub || tipos.filter(t=>t.subespecialidadId===Number(filterInvSub)).length === 0} value={filterInvTipo} onChange={setFilterInvTipo} options={tipos.filter(t=>t.subespecialidadId===Number(filterInvSub)).map(t => ({ value: String(t.id), label: t.nombre }))} />
                  
                  <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                    <input type="text" placeholder="Buscar por KIT..." value={searchInv} onChange={e => setSearchInv(e.target.value)} style={{ width: '100%', height: 42, borderRadius: 30, border: '1.5px solid #e2e8f0', background: '#f8fafc', padding: '0 40px 0 18px', fontSize: 13, color: '#475569', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'Inter,sans-serif', transition: 'border-color 0.2s' }} onFocus={e => (e.target.style.borderColor = '#3b82f6')} onBlur={e => (e.target.style.borderColor = '#e2e8f0')} />
                    <Search className="hv-search-icon" size={17} />
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => setIsBajasOpen(true)} className="flex items-center gap-1.5 px-4 py-2 border border-blue-200 rounded-full text-blue-500 text-xs font-bold hover:bg-blue-50 transition-colors whitespace-nowrap">Control de bajas <Database size={13} /></button>
                  <button onClick={() => setIsTrasladarOpen(true)} className="flex items-center gap-1.5 px-4 py-2 border border-blue-200 rounded-full text-blue-500 text-xs font-bold hover:bg-blue-50 transition-colors whitespace-nowrap">Trasladar <ArrowRightLeft size={13} /></button>
                  <button onClick={downloadCSV} className="flex items-center gap-1.5 px-4 py-2 text-blue-500 text-xs font-bold hover:text-blue-600 transition-colors whitespace-nowrap">Descargar <Download size={13} /></button>
                </div>
              </>
            )}
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm text-left">
              {activeTab === 'hv' ? (
                <>
                  <thead className="bg-slate-50/50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-4 whitespace-nowrap">Código</th>
                      <th className="px-5 py-4 whitespace-nowrap">C. Instrumento</th>
                      <th className="px-5 py-4 whitespace-nowrap">Nombre</th>
                      <th className="px-5 py-4 whitespace-nowrap">Especialidad</th>
                      <th className="px-5 py-4 whitespace-nowrap">Subespecialidad</th>
                      <th className="px-5 py-4 whitespace-nowrap">Tipo</th>
                      <th className="px-5 py-4 text-center whitespace-nowrap">KIT</th>
                      <th className="px-5 py-4 whitespace-nowrap">F. mtto</th>
                      <th className="px-5 py-4 whitespace-nowrap">F. creación</th>
                      <th className="px-5 py-4 text-center whitespace-nowrap">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      <tr><td colSpan={11} className="text-center py-10 text-slate-400">Cargando hojas de vida...</td></tr>
                    ) : dataHV.length === 0 ? (
                      <tr><td colSpan={11} className="text-center py-10 text-slate-400">No hay registros encontrados.</td></tr>
                    ) : dataHV.map((row: any) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4 text-slate-500 font-medium">{row.id}</td>
                        <td className="px-5 py-4 font-mono text-xs font-bold text-blue-500">{row.codigo}</td>
                        <td className="px-5 py-4 text-slate-600 font-medium whitespace-nowrap">{row.nombre}</td>
                        <td className="px-5 py-4 text-slate-500">{row.especialidad?.nombre}</td>
                        <td className="px-5 py-4 text-slate-500">{row.subespecialidad?.nombre}</td>
                        <td className="px-5 py-4 text-slate-500">{row.tipo?.nombre}</td>
                        <td className="px-5 py-4 text-center text-slate-500 font-medium">{row.kit?.codigoKit || '-'}</td>
                        <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{row.fechaMantenimientoRef ? new Date(row.fechaMantenimientoRef).toLocaleDateString() : '-'}</td>
                        <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{new Date(row.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${getStatusColor(row.estado)}`}>{row.estado}</span>
                        </td>
                        <td className="px-4 py-4 text-center relative">
                          <button onClick={(e) => toggleActionMenu(e, row.id)} className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors mx-auto">
                            <MoreVertical size={16} />
                          </button>
                          
                          {openActionMenuId === row.id && (
                            <div className="absolute right-8 top-8 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 flex flex-col text-left overflow-hidden">
                              <button onClick={() => openDetail(row)} className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-500 flex items-center gap-2"><Info size={13}/> Ver detalle</button>
                              
                              {row.estado === 'P. registrar' && userPermissions.puedeRegistrarContable && (
                                 <button onClick={() => handleOpenRegistroContable(row)} className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 flex items-center gap-2"><DollarSign size={13}/> Registrar</button>
                              )}
                              {row.estado === 'Habilitado' && (
                                 <button onClick={() => changeStatus(row.id, 'Deshabilitado')} className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-500 flex items-center gap-2"><Ban size={13}/> Deshabilitar</button>
                              )}
                              {row.estado === 'Deshabilitado' && (
                                 <button onClick={() => changeStatus(row.id, 'Habilitado')} className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-500 flex items-center gap-2"><CheckCircle size={13}/> Habilitar</button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </>
              ) : (
                <>
                  <thead className="bg-blue-50 text-slate-700 font-bold">
                    <tr>
                      <th className="px-6 py-4">Especialidad</th>
                      <th className="px-6 py-4">Subespecialidad</th>
                      <th className="px-6 py-4">Tipo subespecialidad</th>
                      <th className="px-6 py-4">Kits Asignados</th>
                      <th className="px-6 py-4 text-center">Cant. Total Instrumentos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      <tr><td colSpan={5} className="text-center py-10 text-slate-400">Cargando inventario...</td></tr>
                    ) : dataInventario.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-10 text-slate-400">No hay instrumentos en el inventario.</td></tr>
                    ) : dataInventario.map(row => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-slate-500">{row.esp}</td>
                        <td className="px-6 py-4 text-slate-500">{row.sub}</td>
                        <td className="px-6 py-4 text-slate-500">{row.tipo}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {row.kits.length === 0 ? <span className="text-xs text-slate-400 italic">Sueltos</span> : row.kits.map((k:string, i:number) => (
                              <span key={i} className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getKitColor(i)}`}>{k}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-slate-600 font-medium">{row.cant}</td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}
            </table>
          </div>

          <div className="p-4 flex justify-between items-center text-xs text-slate-400 border-t border-slate-50">
            <span>Pág. {currentPage} de {totalPages} ({totalRecords} encontrados)</span>
            <div className="flex items-center gap-3 font-medium text-blue-500">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="hover:text-blue-700 disabled:text-slate-300"><ChevronsLeft size={15} /></button>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="hover:text-blue-700 disabled:text-slate-300"><ChevronLeft size={15} /></button>
              <span className="bg-blue-50 px-3 py-1 rounded text-blue-600 font-bold">{currentPage} / {totalPages || 1}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="hover:text-blue-700 disabled:text-slate-300"><ChevronRight size={15} /></button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0} className="hover:text-blue-700 disabled:text-slate-300"><ChevronsRight size={15} /></button>
            </div>
          </div>
        </div>

        {/* ══ MODAL TRASLADAR ══ */}
        {isTrasladarOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6 font-sans">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsTrasladarOpen(false)} />
            <div className="relative bg-white w-full max-w-[700px] rounded-[30px] shadow-2xl flex flex-col p-8">
              <div className="text-center mb-6 relative">
                <h2 className="text-2xl font-extrabold text-blue-500 mb-4">Trasladar Inventario</h2>
                <div className="w-full h-px bg-slate-100" />
                <button onClick={() => setIsTrasladarOpen(false)} className="absolute right-0 top-0 text-slate-400 hover:text-red-500 transition-colors"><X size={24}/></button>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 mb-6">
                <ModalSelect label="Sede origen" required value={trasladoForm.sedeOrigenId} onChange={(v:any) => setTrasladoForm({...trasladoForm, sedeOrigenId: v})}><option value="">Seleccione Sede Origen...</option>{sedesDB.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}</ModalSelect>
                <ModalSelect label="Sede destino" required value={trasladoForm.sedeDestinoId} onChange={(v:any) => setTrasladoForm({...trasladoForm, sedeDestinoId: v})}><option value="">Seleccione Sede Destino...</option>{sedesDB.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}</ModalSelect>
                <ModalInput label="Fecha traslado" type="date" disabled value={today} onChange={()=>{}} />
                <ModalInput label="Fecha devolución" type="date" required min={today} value={trasladoForm.fechaDevolucion} onChange={(v:any) => setTrasladoForm({...trasladoForm, fechaDevolucion: v})} />
              </div>
              <div className="w-full h-px bg-slate-100 mb-6" />
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-6">
                  <span className="text-sm font-bold text-slate-800">¿Qué desea transferir?</span>
                  {(['kit', 'instrumento'] as const).map(t => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                      <div onClick={() => { setTransferType(t); setSelectedItems([]); }} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${transferType === t ? 'border-cyan-400' : 'border-slate-300'}`}>{transferType === t && <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />}</div>
                      <span className="text-sm text-slate-500 capitalize">{t === 'kit' ? 'KIT' : 'Instrumento Suelto'}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mb-4">
                <div className="flex-1 relative"><select value={trasladoEsp} onChange={e => setTrasladoEsp(e.target.value)} className="w-full h-10 border border-slate-300 rounded-full px-4 text-slate-500 text-sm outline-none appearance-none bg-white cursor-pointer"><option value="">Especialidad...</option>{especialidades.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}</select><ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={14} /></div>
                <div className="flex-1 relative"><select value={trasladoSub} onChange={e => setTrasladoSub(e.target.value)} className="w-full h-10 border border-slate-300 rounded-full px-4 text-slate-500 text-sm outline-none appearance-none bg-white cursor-pointer"><option value="">Subespecialidad...</option>{subespecialidades.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}</select><ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={14} /></div>
              </div>
              {transferType === 'instrumento' && (<div className="relative mb-4"><input type="text" placeholder="Buscar por nombre..." value={trasladoSearch} onChange={e => setTrasladoSearch(e.target.value)} className="w-full h-10 bg-slate-50 border border-slate-200 rounded-full pl-4 pr-10 text-sm text-slate-600 outline-none focus:ring-1 focus:ring-blue-100" /><Search className="absolute right-3 top-2.5 text-blue-400" size={18} /></div>)}
              <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                {trasladoForm.sedeOrigenId === '' ? ( <div className="p-6 text-center text-slate-400 text-sm">Seleccione una Sede de Origen para ver su inventario.</div> ) : (
                  <>
                    <div className="bg-blue-50/50 px-4 py-3 border-b border-slate-100 flex items-center">
                      <span className="text-slate-700 text-sm font-bold flex-1">{transferType === 'kit' ? 'Kits Disponibles' : 'Instrumentos Disponibles'}</span>
                      {transferType === 'instrumento' && (<div className="flex gap-8 text-slate-700 text-sm font-bold mr-6"><span className="w-16 text-center">En Sede</span><span className="w-24 text-center">A Mover</span></div>)}
                    </div>
                    <div className="max-h-[180px] overflow-y-auto relative min-h-[50px]">
                      {inventarioOrigen.length === 0 ? ( <div className="p-4 text-center text-slate-400 text-sm">No hay resultados en esta Sede.</div> ) : ( transferType === 'kit' ? ( inventarioOrigen.map((item) => { const isSelected = !!selectedItems.find(i => i.id === item.id); return ( <div key={item.id} className="flex items-center gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50"><input type="checkbox" checked={isSelected} onChange={() => toggleItemSelection(item)} className="w-5 h-5 rounded border-slate-300 text-blue-500 cursor-pointer" /><span className="text-slate-600 text-sm font-bold">{item.nombre}</span><span className="text-slate-400 text-xs ml-auto font-mono">{item.codigoKit}</span></div> ) }) ) : ( inventarioOrigen.filter(i => i.name.toLowerCase().includes(trasladoSearch.toLowerCase())).map((item, idx) => { const selItem = selectedItems.find(i => i.nombre === item.name); const isSelected = !!selItem; return ( <div key={idx} className="flex items-center justify-between px-4 py-3 border-b border-slate-50 hover:bg-slate-50"><div className="flex items-center gap-3 flex-1"><input type="checkbox" checked={isSelected} onChange={() => toggleItemSelection(item)} className="w-5 h-5 rounded border-slate-300 text-blue-500 cursor-pointer" /><span className="text-slate-600 text-sm font-medium">{item.name}</span></div><div className="flex items-center gap-8 mr-2"><span className="w-16 text-center text-slate-400 text-xs font-bold bg-slate-100 rounded-full py-1">{item.qty} disp.</span><input type="number" disabled={!isSelected} min="1" max={item.qty} value={selItem?.cantidad || ''} onChange={e => updateItemQuantity(item.name, e.target.value, item.qty)} className="w-20 h-8 border border-slate-400 rounded-lg text-center text-sm text-slate-600 outline-none focus:border-blue-400 disabled:bg-slate-50 disabled:border-slate-200" /></div></div> ) }) ) )}
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-center gap-10">
                <button className="hv-cancel-btn" onClick={() => setIsTrasladarOpen(false)}>Cancelar</button>
                <button className="hv-save-btn" onClick={handleSaveTraslado}>Confirmar Traslado</button>
              </div>
            </div>
          </div>
        )}

        {/* ══ NUEVO: MODAL REGISTRO CONTABLE (Abre desde tabla) ══ */}
        {isContableOpen && instToRegister && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-6 font-sans">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsContableOpen(false)} />
            <div className="relative bg-white w-full max-w-[600px] rounded-[30px] shadow-2xl flex flex-col p-8">
              <div className="text-center mb-6 relative">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign size={24} className="text-emerald-500" />
                  <h2 className="text-2xl font-extrabold text-emerald-600">Registro Contable</h2>
                </div>
                <p className="text-sm text-slate-500">Completar para habilitar el instrumento <span className="font-bold">{instToRegister.codigo}</span></p>
                <div className="w-full h-px bg-slate-100 mt-4" />
                <button onClick={() => setIsContableOpen(false)} className="absolute right-0 top-0 text-slate-400 hover:text-red-500 transition-colors"><X size={24}/></button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-7 mb-8">
                <ModalInput label="Fecha de compra" required type="date" value={contableForm.fechaCompra} onChange={(v:any) => setContableForm({...contableForm, fechaCompra: v})} />
                <ModalInput label="Costo Adquisición (COP)" required type="number" min="1" placeholder="Ej: 1500000" value={contableForm.costo} onChange={(v:any) => setContableForm({...contableForm, costo: v})} />
                <ModalInput label="IVA (%)" type="number" min="0" placeholder="Ej: 19" value={contableForm.iva} onChange={(v:any) => setContableForm({...contableForm, iva: v})} />
                <ModalInput label="No. de Factura" required value={contableForm.numeroFactura} onChange={(v:any) => setContableForm({...contableForm, numeroFactura: v})} />
                <ModalInput label="Vida útil esperada (Años)" type="number" min="1" placeholder="Ej: 5" value={contableForm.vidaUtil} onChange={(v:any) => setContableForm({...contableForm, vidaUtil: v})} />
                
                <div className="relative cursor-pointer" onClick={() => facturaRef.current?.click()}>
                  <label className="absolute -top-2.5 left-4 bg-white px-1 text-[10px] font-bold text-slate-500 z-10 cursor-pointer">Factura PDF<span className="text-red-500 ml-0.5">*</span></label>
                  <input type="file" className="hidden" ref={facturaRef} accept=".pdf" onChange={e => handleFileSelection(e, setFacturaFile, 'pdf')} />
                  <div className={`w-full h-11 border rounded-full flex items-center px-4 text-xs transition-colors group ${facturaFile ? 'border-emerald-400 bg-emerald-50 text-emerald-600' : 'border-slate-300 bg-white text-slate-400 hover:border-emerald-300'}`}>
                    <span className="truncate flex-1">{truncateFileName(facturaFile, 'Subir PDF')}</span><Paperclip size={14} className="ml-2 flex-shrink-0 text-slate-400 group-hover:text-emerald-500" />
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-10">
                <button className="hv-cancel-btn" onClick={() => setIsContableOpen(false)}>Cancelar</button>
                <button className="px-8 py-3 rounded-full font-bold text-white shadow-md transition-transform hover:-translate-y-0.5" style={{ background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)' }} onClick={handleSaveRegistroContable}>
                  Registrar y Habilitar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default HojasDeVidaScreen;