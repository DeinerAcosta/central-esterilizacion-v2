import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Database, Download, X, Search } from 'lucide-react';
import Swal from 'sweetalert2';

// 1. Estilos (misma carpeta)
import './HojasDeVida.css';

// 2. Componentes Genéricos (Subiendo desde hojas-vida -> screens -> src)
import { ModalNotchInput, ModalNotchSelect, ModalNotchFile, ModalNotchCustomSelect } from '../../components/ui/ModalNotch';

// 3. Vistas Modulares (Carpeta views al mismo nivel)
import { ListadoHV } from './views/ListadoHV';
import { InventarioHV } from './views/InventarioHV';
import { ControlBajas } from './views/ControlBajas';
import { FormularioHV } from './views/FormularioHV';

const HojasDeVidaScreen: React.FC = () => {
  const permisos = { puedeRegistrarContable: true };

  // 1. Estados Principales
  const [activeTab, setActiveTab] = useState<'hv' | 'inventario'>('hv');
  const [viewState, setViewState] = useState<'list' | 'create' | 'edit' | 'detail'>('list');
  const [isBajasOpen, setIsBajasOpen] = useState(false);
  const [isTrasladarOpen, setIsTrasladarOpen] = useState(false);
  const [isRCOpen, setIsRCOpen] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState<number | null>(null);
  const [selectedHVForRC, setSelectedHVForRC] = useState<any>(null);

  // 2. Catálogos
  const [especialidades, setEspecialidades] = useState<any[]>([]);
  const [subespecialidades, setSubs] = useState<any[]>([]);
  const [tipos, setTipos] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [propietarios, setPropietarios] = useState<any[]>([]);
  const [sedesDB, setSedesDB] = useState<any[]>([]);
  const [paises, setPaises] = useState<any[]>([]); 

  // 3. Filtros
  const [filterEsp, setFilterEsp] = useState('');
  const [filterSub, setFilterSub] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [searchHV, setSearchHV] = useState('');
  
  const [filterInvEsp, setFilterInvEsp] = useState('');
  const [filterInvSub, setFilterInvSub] = useState('');
  const [filterInvTipo, setFilterInvTipo] = useState('');
  const [searchInv, setSearchInv] = useState('');

  // 4. Datos de Tabla
  const [dataHV, setDataHV] = useState<any[]>([]);
  const [dataInv, setDataInv] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRec, setTotalRec] = useState(0);

  // 5. Estado Formulario
  const initForm = { id: null, codigo: '', especialidadId: '', subespecialidadId: '', tipoId: '', nombre: '', fabricante: '', paisOrigen: '', numeroSerie: '', registroInvima: '', proveedorId: '', material: '', materialOtro: '', esterilizacion: '', frecuenciaMantenimiento: '', observacionesTecnico: '', estadoActual: 'P. registrar', propietarioId: '', notasObservaciones: '', cicloEsterilizacion: '0', proximoMantenimiento: null, kit: null, costo: null, fechaCompra: null, iva: null, numeroFactura: null, vidaUtil: null };
  const [form, setForm] = useState<any>(initForm);
  const setF = (k: string, v: string) => setForm((p: any) => ({ ...p, [k]: v }));

  const [fotoFile, setFotoFile] = useState<File | string | null>(null);
  const [garantiaFile, setGarantiaFile] = useState<File | string | null>(null);
  const [invimaFile, setInvimaFile] = useState<File | string | null>(null);
  const [codigoFile, setCodigoFile] = useState<File | string | null>(null);

  // 6. Modal RC
  const [rcForm, setRcForm] = useState({ fechaCompra: '', costoAdquisicion: '', iva: '', numeroFactura: '', vidaUtil: '' });
  const setRC = (k: string, v: string) => setRcForm(p => ({ ...p, [k]: v }));
  const [facturaFile, setFacturaFile] = useState<File | null>(null);
  const facturaRef = useRef<HTMLInputElement>(null);

  // 7. Traslados
  const [transferType, setTransferType] = useState<'kit' | 'instrumento'>('kit');
  const [trasladoForm, setTrasladoForm] = useState({ sedeOrigenId: '', sedeDestinoId: '', fechaDevolucion: '' });
  const [inventarioOrigen, setInventarioOrigen] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [trasladoEsp, setTrasladoEsp] = useState('');
  const [trasladoSub, setTrasladoSub] = useState('');
  const [trasladoSearch, setTrasladoSearch] = useState('');
  const [trasladoTipo, setTrasladoTipo] = useState(''); 

  // 8. Bajas
  const [bajasData, setBajasData] = useState<any[]>([]);
  const [bajasLoading, setBajasLoading] = useState(false);
  const [bajasDesde, setBajasDesde] = useState('');
  const [bajasHasta, setBajasHasta] = useState('');
  const [bajasEsp, setBajasEsp] = useState('');
  const [bajasSub, setBajasSub] = useState('');
  const [bajasSearch, setBajasSearch] = useState('');
  const [bajasPage, setBajasPage] = useState(1);
  const [bajasTotalPages, setBajasTotalPages] = useState(1);

  const today = new Date().toISOString().split('T')[0];

  // ── EFECTOS Y FETCH ──
  useEffect(() => { fetchListas(); }, []);
  useEffect(() => { if (viewState === 'list' && activeTab === 'hv' && !isBajasOpen) fetchHV(); }, [page, searchHV, filterEstado, filterEsp, filterSub, activeTab, viewState, isBajasOpen]);
  useEffect(() => { if (viewState === 'list' && activeTab === 'inventario' && !isBajasOpen) fetchInv(); }, [filterInvEsp, filterInvSub, filterInvTipo, searchInv, activeTab, viewState, isBajasOpen]);
  useEffect(() => { if (isTrasladarOpen && trasladoForm.sedeOrigenId) fetchOrigenInv(); else { setInventarioOrigen([]); setSelectedItems([]); } }, [trasladoForm.sedeOrigenId, transferType, trasladoEsp, trasladoSub, trasladoTipo, isTrasladarOpen]);
  useEffect(() => { if (isBajasOpen) fetchBajas(); }, [isBajasOpen, bajasDesde, bajasHasta, bajasEsp, bajasSub, bajasSearch, bajasPage]);
  useEffect(() => { const fn = () => setOpenActionMenu(null); document.addEventListener('click', fn); return () => document.removeEventListener('click', fn); }, []);

  const fetchListas = async () => {
    try {
      const [rEsp, rSub, rTip, rSed, rProv, rUsers, rPaisesApi] = await Promise.all([
        fetch('http://localhost:4000/api/especialidades?estado=true'),
        fetch('http://localhost:4000/api/subespecialidades'),
        fetch('http://localhost:4000/api/tipos-subespecialidad'),
        fetch('http://localhost:4000/api/sedes?estado=true'),
        fetch('http://localhost:4000/api/proveedores'),
        fetch('http://localhost:4000/api/usuarios'),
        fetch('https://countriesnow.space/api/v0.1/countries')
      ]);

      setEspecialidades((await rEsp.json()).data || []);
      setSubs((await rSub.json()).data || []);
      setTipos((await rTip.json()).data || []);
      setSedesDB((await rSed.json()).data || []);
      
      const provs = (await rProv.json()).data || [];
      setProveedores(provs.filter((p: any) => p.tipo === 'Compras' || p.categoria === 'Compras'));
      
      const users = (await rUsers.json()).data || [];
      setPropietarios(users.filter((u: any) => u.esPropietario === true && u.estado));

      const jsonPaises = await rPaisesApi.json();
      if(jsonPaises && jsonPaises.data) {
        const sorted = jsonPaises.data.sort((a: any, b: any) => a.country.localeCompare(b.country));
        setPaises(sorted);
      }
    } catch (e) { console.error('fetchListas error:', e); }
  };

  const fetchHV = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page: String(page), search: searchHV });
      if (filterEstado) q.append('estado', filterEstado);
      if (filterEsp) q.append('especialidadId', filterEsp);
      if (filterSub) q.append('subespecialidadId', filterSub);
      const res = await fetch(`http://localhost:4000/api/hoja-vida?${q}`);
      const json = await res.json();
      setDataHV(json.data || []); setTotalPages(json.totalPages || 1); setTotalRec(json.total || 0);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchInv = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (filterInvEsp) q.append('especialidadId', filterInvEsp);
      if (filterInvSub) q.append('subespecialidadId', filterInvSub);
      if (filterInvTipo) q.append('tipoId', filterInvTipo);
      if (searchInv) q.append('search', searchInv);
      const res = await fetch(`http://localhost:4000/api/hoja-vida/inventario?${q}`);
      setDataInv((await res.json()).data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchBajas = async () => {
    setBajasLoading(true);
    try {
      const q = new URLSearchParams({ page: String(bajasPage) });
      if (bajasDesde) q.append('fechaDesde', bajasDesde);
      if (bajasHasta) q.append('fechaHasta', bajasHasta);
      if (bajasEsp) q.append('especialidadId', bajasEsp);
      if (bajasSub) q.append('subespecialidadId', bajasSub);
      if (bajasSearch) q.append('search', bajasSearch);
      const res = await fetch(`http://localhost:4000/api/hoja-vida/bajas?${q}`);
      const json = await res.json();
      setBajasData(json.data || []); setBajasTotalPages(json.totalPages || 1);
    } catch (e) { console.error(e); } finally { setBajasLoading(false); }
  };

  const fetchOrigenInv = async () => {
    try {
      const q = new URLSearchParams({ sedeId: trasladoForm.sedeOrigenId, tipoTraslado: transferType });
      if (trasladoEsp) q.append('especialidadId', trasladoEsp);
      if (trasladoSub) q.append('subespecialidadId', trasladoSub);
      if (trasladoTipo) q.append('tipoId', trasladoTipo);
      const res = await fetch(`http://localhost:4000/api/hoja-vida/inventario-sede?${q}`);
      setInventarioOrigen((await res.json()).data || []);
      setSelectedItems([]);
    } catch (e) { console.error(e); }
  };

  // ── UTILIDADES ──
  const validarArchivo = (e: React.ChangeEvent<HTMLInputElement>, setter: (f: File) => void, tipo: 'image' | 'pdf' | 'mixto') => {
    const file = e.target.files?.[0]; if (!file) return;
    if (tipo === 'image') {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) return Swal.fire('Error', 'Solo formato JPG o PNG.', 'warning');
      if (file.size > 2 * 1024 * 1024) return Swal.fire('Error', 'Máximo 2MB de peso.', 'warning');
    } else if (tipo === 'pdf') {
      if (file.type !== 'application/pdf') return Swal.fire('Error', 'Debe adjuntar un archivo en formato PDF.', 'warning');
    } else {
      if (!['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type)) return Swal.fire('Error', 'Solo formato PDF, JPG o PNG.', 'warning');
    }
    setter(file);
  };

  const handleBajaDateChange = (tipo: 'desde' | 'hasta', val: string) => {
    if (tipo === 'desde') { if (bajasHasta && val > bajasHasta) return Swal.fire('Aviso', 'La fecha "Desde" no puede ser mayor a "Hasta".', 'warning'); setBajasDesde(val); }
    else { if (val > today) return Swal.fire('Aviso', 'La fecha "Hasta" no puede ser mayor a hoy.', 'warning'); if (bajasDesde && val < bajasDesde) return Swal.fire('Aviso', 'La fecha "Hasta" no puede ser menor a "Desde".', 'warning'); setBajasHasta(val); }
  };

  const statusColor = (s: string) => {
    const m: Record<string, string> = { 'Habilitado': 'bg-emerald-50 text-emerald-600 border-emerald-200', 'P. registrar': 'bg-slate-100 text-slate-500 border-slate-200', 'Pendiente de registro': 'bg-slate-100 text-slate-500 border-slate-200', 'En mantenimiento': 'bg-amber-50 text-amber-600 border-amber-200', 'De baja': 'bg-red-50 text-red-700 border-red-200', 'Deshabilitado': 'bg-red-50 text-red-500 border-red-100' };
    return m[s] || 'bg-slate-50 text-slate-400 border-slate-100';
  };
  const kitColor = (i: number) => i % 3 === 0 ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : i % 3 === 1 ? 'bg-blue-50 text-blue-500 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-200';

  const getCodePreview = () => {
    const esp = especialidades.find(x => x.id == form.especialidadId)?.nombre || '';
    const sub = subespecialidades.find(x => x.id == form.subespecialidadId)?.nombre || '';
    const tip = tipos.find(x => x.id == form.tipoId)?.nombre || '';
    return { esp: esp ? esp.substring(0, 2).toUpperCase() : '  ', sub: sub ? sub.substring(0, 2).toUpperCase() : '  ', tip: tip ? tip.substring(0, 2).toUpperCase() : '  ' };
  };

  const resetView = () => { setViewState('list'); setForm(initForm); setFotoFile(null); setGarantiaFile(null); setInvimaFile(null); setCodigoFile(null); };

  const handleOpenDetail = (row: any) => { setForm(row); setFotoFile(row.fotoUrl || null); setGarantiaFile(row.garantiaUrl || null); setInvimaFile(row.registroInvimaUrl || null); setCodigoFile(row.codigoInstrumentoUrl || null); setViewState('detail'); setOpenActionMenu(null); };
  const handleOpenEdit = (row: any) => { setForm(row); setFotoFile(row.fotoUrl || null); setGarantiaFile(row.garantiaUrl || null); setInvimaFile(row.registroInvimaUrl || null); setCodigoFile(row.codigoInstrumentoUrl || null); setViewState('edit'); setOpenActionMenu(null); };

  const openRC = (row: any) => { setSelectedHVForRC(row); setRcForm({ fechaCompra: '', costoAdquisicion: '', iva: '', numeroFactura: '', vidaUtil: '' }); setFacturaFile(null); setIsRCOpen(true); setOpenActionMenu(null); };
  
  const handleCancelCreate = () => Swal.fire({ title: '¿Está seguro?', text: 'La información diligenciada no se guardará en el sistema', icon: 'warning', showCancelButton: true, confirmButtonColor: '#3b82f6', cancelButtonColor: '#94a3b8', confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar' }).then(r => { if (r.isConfirmed) resetView(); });
  const handleCancelRC = () => Swal.fire({ title: '¿Está seguro?', text: 'La información diligenciada no se guardará en el sistema', icon: 'warning', showCancelButton: true, confirmButtonColor: '#3b82f6', cancelButtonColor: '#94a3b8', confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar' }).then(r => { if (r.isConfirmed) setIsRCOpen(false); });
  const handleCancelTraslado = () => Swal.fire({ title: '¿Está seguro?', text: 'La información diligenciada no se guardará en el sistema', icon: 'warning', showCancelButton: true, confirmButtonColor: '#3b82f6', cancelButtonColor: '#94a3b8', confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar' }).then(r => { if (r.isConfirmed) setIsTrasladarOpen(false); });

  const downloadCSV = () => {
    const d = activeTab === 'hv' ? dataHV : dataInv; if (!d.length) return;
    const h = Object.keys(d[0]).join(',');
    const r = d.map((x: any) => Object.values({ ...x, kits: Array.isArray(x.kits) ? x.kits.join('|') : x.kits }).join(','));
    const blob = new Blob(['\uFEFF' + [h, ...r].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `Reporte_${activeTab}_${today}.csv`; document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const subespTieneTipos = tipos.filter(t => t.subespecialidadId === Number(form.subespecialidadId)).length > 0;
  const subespTrasladoTieneTipos = tipos.filter(t => t.subespecialidadId === Number(trasladoSub)).length > 0;

  const handleSave = async () => {
    const camposReq = ['nombre', 'especialidadId', 'subespecialidadId', 'fabricante', 'numeroSerie', 'registroInvima', 'proveedorId', 'paisOrigen', 'material', 'esterilizacion', 'frecuenciaMantenimiento', 'propietarioId'];
    if (subespTieneTipos) camposReq.push('tipoId');
    if (camposReq.some(k => !form[k])) return Swal.fire('Error', 'Es necesario el diligenciamiento de todos los campos obligatorios.', 'error');
    if (form.material === 'Otros' && !form.materialOtro) return Swal.fire('Error', 'Especifique el material en "¿Cuál?".', 'error');
    if (viewState === 'create' && (!fotoFile || !garantiaFile || !invimaFile || !codigoFile)) return Swal.fire('Error', 'Debe adjuntar Foto, Garantía, Registro INVIMA y Código del Instrumento.', 'error');
    try {
      const data = new FormData(); 
      Object.keys(form).forEach(k => { if (form[k] !== null && form[k] !== '') data.append(k, form[k]); });
      if (fotoFile instanceof File) data.append('foto', fotoFile); 
      if (garantiaFile instanceof File) data.append('garantia', garantiaFile); 
      if (invimaFile instanceof File) data.append('registroInvimaDoc', invimaFile); 
      if (codigoFile instanceof File) data.append('codigoInstrumentoDoc', codigoFile);
      const url = viewState === 'edit' ? `http://localhost:4000/api/hoja-vida/${form.id}` : 'http://localhost:4000/api/hoja-vida';
      const method = viewState === 'edit' ? 'PUT' : 'POST';
      const res = await fetch(url, { method, body: data }); 
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) throw new Error(`Error en el servidor. Verifica la ruta.`);
      const json = await res.json(); 
      if (!res.ok) throw new Error(json.msg || json.message || 'Error al guardar.');
      const mensajeExito = viewState === 'edit' ? 'Hoja de vida actualizada correctamente' : 'Se ha creado exitosamente';
      Swal.fire({ icon: 'success', title: 'Éxito', text: mensajeExito, timer: 2000, showConfirmButton: false });
      resetView(); fetchHV();
    } catch (e: any) { Swal.fire('Error', e.message, 'error'); }
  };

  const handleSaveRC = async () => {
    if (!rcForm.fechaCompra || !rcForm.costoAdquisicion || !rcForm.numeroFactura || !facturaFile) return Swal.fire('Error', 'Es necesario el diligenciamiento de todos los campos obligatorios.', 'error');
    try {
      const data = new FormData(); 
      Object.keys(rcForm).forEach(k => { if ((rcForm as any)[k]) data.append(k, (rcForm as any)[k]); });
      data.append('facturaDoc', facturaFile!);
      const res = await fetch(`http://localhost:4000/api/hoja-vida/${selectedHVForRC?.id}/contable`, { method: 'PUT', body: data }); 
      const json = await res.json(); 
      if (!res.ok) throw new Error(json.msg || json.message);
      Swal.fire({ icon: 'success', title: 'Éxito', text: 'Registro contable guardado correctamente', timer: 2000, showConfirmButton: false });
      setIsRCOpen(false); fetchHV();
    } catch (e: any) { Swal.fire('Error', e.message, 'error'); }
  };

  const changeStatus = (row: any, nuevoEstado: string) => {
    setOpenActionMenu(null);
    const accion = nuevoEstado === 'Habilitado' ? 'habilitará' : 'inhabilitará';
    Swal.fire({
      title: '¿Está seguro?',
      html: `Se <b>${accion}</b> la hoja de vida:<br/><span style="color:#475569;font-weight:600">${row.nombre}</span>`,
      icon: 'warning', showCancelButton: true, confirmButtonColor: '#3b82f6', cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, continuar', cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:4000/api/hoja-vida/${row.id}/estado`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado: nuevoEstado }) });
          const json = await res.json(); 
          if (!res.ok) throw new Error(json.msg || json.message);
          const msgExito = nuevoEstado === 'Habilitado' ? 'Hoja de vida habilitada correctamente' : 'Hoja de vida inhabilitada correctamente';
          Swal.fire({ icon: 'success', title: 'Éxito', text: msgExito, timer: 2000, showConfirmButton: false });
          fetchHV();
        } catch (e: any) { Swal.fire('Error', e.message, 'error'); }
      }
    });
  };

  const handleSaveTraslado = async () => {
    if (!trasladoForm.sedeOrigenId || !trasladoForm.sedeDestinoId || !trasladoForm.fechaDevolucion || selectedItems.length === 0) {
      return Swal.fire({ icon: 'error', title: 'Error', text: 'Es necesario completar correctamente la información para realizar el traslado.', confirmButtonColor: '#3b82f6' });
    }
    if (trasladoForm.sedeOrigenId === trasladoForm.sedeDestinoId) {
      return Swal.fire({ icon: 'error', title: 'Error', text: 'Es necesario completar correctamente la información para realizar el traslado.', confirmButtonColor: '#3b82f6' });
    }
    try {
      const res = await fetch('http://localhost:4000/api/hoja-vida/trasladar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...trasladoForm, tipoTraslado: transferType, items: transferType === 'kit' ? selectedItems.map((i: any) => i.id) : selectedItems }) });
      const json = await res.json(); 
      if (!res.ok) throw new Error(json.msg || json.message);
      Swal.fire({ icon: 'success', title: 'Éxito', text: 'Traslado realizado correctamente.', timer: 2000, showConfirmButton: false });
      setIsTrasladarOpen(false); setSelectedItems([]); fetchHV();
    } catch (e: any) { Swal.fire('Error', e.message, 'error'); }
  };

  // ── RENDERIZADO ──
  if (viewState !== 'list') {
    return <FormularioHV 
      viewState={viewState} form={form} setF={setF} fotoFile={fotoFile} setFotoFile={setFotoFile} 
      garantiaFile={garantiaFile} setGarantiaFile={setGarantiaFile} invimaFile={invimaFile} setInvimaFile={setInvimaFile} 
      codigoFile={codigoFile} setCodigoFile={setCodigoFile} especialidades={especialidades} subespecialidades={subespecialidades} 
      tipos={tipos} proveedores={proveedores} propietarios={propietarios} paises={paises} subespTieneTipos={subespTieneTipos} 
      cp={getCodePreview()} permisos={permisos} statusColor={statusColor} handleSave={handleSave} 
      handleCancelCreate={handleCancelCreate} resetView={resetView} validarArchivo={validarArchivo} 
    />;
  }

  if (isBajasOpen) {
    return <ControlBajas 
      setIsBajasOpen={setIsBajasOpen} bajasDesde={bajasDesde} setBajasDesde={setBajasDesde} bajasHasta={bajasHasta} 
      setBajasHasta={setBajasHasta} bajasEsp={bajasEsp} setBajasEsp={setBajasEsp} bajasSub={bajasSub} setBajasSub={setBajasSub} 
      bajasSearch={bajasSearch} setBajasSearch={setBajasSearch} handleBajaDateChange={handleBajaDateChange} 
      especialidades={especialidades} subespecialidades={subespecialidades} bajasLoading={bajasLoading} bajasData={bajasData} 
      bajasPage={bajasPage} setBajasPage={setBajasPage} bajasTotalPages={bajasTotalPages} today={today} 
    />;
  }

  return (
    <div className="hv-container h-full flex flex-col relative" onClick={() => setOpenActionMenu(null)}>
      <h1 className="text-3xl font-bold text-sky-500 mb-5">Hoja de vida</h1>

      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 flex-1 flex flex-col overflow-visible">
        <div className="flex border-b border-slate-100 flex-shrink-0">
          {(['hv', 'inventario'] as const).map(t => (
            <button key={t} onClick={() => { setActiveTab(t); setPage(1); }} className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === t ? 'text-sky-500 border-b-2 border-sky-400 bg-sky-50/30' : 'text-slate-400 hover:text-slate-500 hover:bg-slate-50'}`}>
              {t === 'hv' ? 'Hoja de vida' : 'Inventario'}
            </button>
          ))}
        </div>

        <div className="p-4 flex flex-wrap gap-3 items-center border-b border-slate-50 flex-shrink-0 bg-white">
          {activeTab === 'hv' ? (
            <>
              <ModalNotchSelect label="Especialidad" compact value={filterEsp} onChange={v => { setFilterEsp(v); setFilterSub(''); setPage(1); }} options={especialidades.map(e => ({ value: String(e.id), label: e.nombre }))} />
              <ModalNotchSelect label="Subespecialidad" compact disabled={!filterEsp} value={filterSub} onChange={v => { setFilterSub(v); setPage(1); }} options={subespecialidades.filter(s => s.especialidadId === Number(filterEsp)).map(s => ({ value: String(s.id), label: s.nombre }))} />
              <ModalNotchSelect label="Estado" compact value={filterEstado} onChange={v => { setFilterEstado(v); setPage(1); }} 
                options={[{ value: 'Habilitado', label: 'Habilitado' }, { value: 'Deshabilitado', label: 'Deshabilitado' }, { value: 'P. registrar', label: 'Pendiente de registro' }, { value: 'En mantenimiento', label: 'En mantenimiento' }]} 
              />
              <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                <input type="text" placeholder="Buscar por nombre..." value={searchHV} onChange={e => { setSearchHV(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')); setPage(1); }} style={{ width: '100%', height: 42, borderRadius: 30, border: '1.5px solid #e2e8f0', background: '#f8fafc', padding: '0 40px 0 16px', fontSize: 13, color: '#475569', outline: 'none' }} />
                <Search size={15} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#60a5fa' }} />
              </div>
              <button onClick={() => setViewState('create')} className="flex items-center gap-1.5 text-sky-500 font-bold text-sm hover:text-sky-600 px-4 py-2 rounded-lg hover:bg-sky-50 whitespace-nowrap ml-auto">
                Crear hoja de vida <PlusCircle size={16} />
              </button>
            </>
          ) : (
            <>
              <ModalNotchSelect label="Especialidad" compact value={filterInvEsp} onChange={v => { setFilterInvEsp(v); setFilterInvSub(''); setFilterInvTipo(''); setPage(1); }} options={especialidades.map(e => ({ value: String(e.id), label: e.nombre }))} />
              <ModalNotchSelect label="Subespecialidad" compact disabled={!filterInvEsp} value={filterInvSub} onChange={v => { setFilterInvSub(v); setFilterInvTipo(''); setPage(1); }} options={subespecialidades.filter(s => s.especialidadId === Number(filterInvEsp)).map(s => ({ value: String(s.id), label: s.nombre }))} />
              <ModalNotchSelect label="Tipo subespec." compact disabled={!filterInvSub || tipos.filter(t => t.subespecialidadId === Number(filterInvSub)).length === 0} value={filterInvTipo} onChange={v => { setFilterInvTipo(v); setPage(1); }} options={tipos.filter(t => t.subespecialidadId === Number(filterInvSub)).map(t => ({ value: String(t.id), label: t.nombre }))} />
              <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                <input type="text" placeholder="Buscar KIT..." value={searchInv} onChange={e => { setSearchInv(e.target.value.replace(/[^a-zA-Z0-9]/g, '')); setPage(1); }} style={{ width: '100%', height: 42, borderRadius: 30, border: '1.5px solid #e2e8f0', background: '#f8fafc', padding: '0 40px 0 16px', fontSize: 13, color: '#475569', outline: 'none' }} />
                <Search size={15} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#60a5fa' }} />
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <button onClick={() => setIsBajasOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 border border-sky-200 rounded-full text-sky-500 text-xs font-bold hover:bg-sky-50">Control de bajas</button>
                <button onClick={() => setIsTrasladarOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 border border-sky-200 rounded-full text-sky-500 text-xs font-bold hover:bg-sky-50">Trasladar</button>
                <button onClick={downloadCSV} className="flex items-center gap-1.5 px-3 py-1.5 text-sky-500 text-xs font-bold hover:text-sky-600"><Download size={12} /> Descargar</button>
              </div>
            </>
          )}
        </div>

        {activeTab === 'hv' ? (
          <ListadoHV data={dataHV} loading={loading} permisos={permisos} openActionMenu={openActionMenu} setOpenActionMenu={setOpenActionMenu} handleOpenDetail={handleOpenDetail} handleOpenEdit={handleOpenEdit} openRC={openRC} changeStatus={changeStatus} statusColor={statusColor} />
        ) : (
          <InventarioHV data={dataInv} loading={loading} kitColor={kitColor} />
        )}

        <div className="p-4 flex justify-between items-center text-xs text-slate-400 border-t border-slate-50">
          <span>Mostrando {activeTab === 'hv' ? dataHV.length : dataInv.length} de {totalRec} registros</span>
          <div className="flex items-center gap-3 font-medium text-sky-500">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Anterior</button>
            <span className="bg-sky-50 px-3 py-1 rounded text-sky-600 font-bold">Pág. {page} de {totalPages || 1}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}>Siguiente</button>
          </div>
        </div>
      </div>

      {/* ── MODAL REGISTRO CONTABLE (sin cambios) ── */}
      {isRCOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleCancelRC} />
          <div className="relative bg-white w-full max-w-[640px] rounded-[1.5rem] px-8 py-7 shadow-2xl">
            <h2 className="text-xl font-extrabold text-sky-500 text-center mb-6">Registro contable</h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <ModalNotchInput label="Fecha de compra" type="date" required value={rcForm.fechaCompra} onChange={v => setRC('fechaCompra', v)} />
              <ModalNotchInput label="Costo de adquisición" charType="number" required value={rcForm.costoAdquisicion} onChange={v => setRC('costoAdquisicion', v)} />
              <ModalNotchInput label="IVA (%)" charType="number" value={rcForm.iva} onChange={v => setRC('iva', v)} />
              <ModalNotchInput label="No. Factura" required value={rcForm.numeroFactura} onChange={v => setRC('numeroFactura', v)} />
              <ModalNotchInput label="Vida útil (años)" charType="number" value={rcForm.vidaUtil} onChange={v => setRC('vidaUtil', v)} />
              <div>
                <input type="file" className="hidden" ref={facturaRef} accept=".pdf" onChange={e => { const f = e.target.files?.[0]; if (f) setFacturaFile(f); }} />
                <ModalNotchFile label="Factura (PDF)" required file={facturaFile} onClick={() => facturaRef.current?.click()} />
              </div>
            </div>
            <div className="flex justify-center gap-6">
              <button className="hv-cancel-btn" onClick={handleCancelRC}>Cancelar</button>
              <button className="hv-save-btn" onClick={handleSaveRC}>Guardar y Habilitar</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          MODAL — TRASLADAR  (igual al Figma)
          Orden: título → filtros → radio → tabla → sedes → fechas → botones
          ══════════════════════════════════════════════════════ */}
      {isTrasladarOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6">
          <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" onClick={handleCancelTraslado} />
          <div className="relative bg-white w-full max-w-[680px] rounded-2xl shadow-2xl overflow-hidden">

            {/* Encabezado: X izquierda, título centrado */}
            <div className="relative flex items-center justify-center px-6 pt-5 pb-4 border-b border-slate-100">
              <button
                onClick={handleCancelTraslado}
                className="absolute left-5 text-slate-400 hover:text-red-500 transition-colors p-1"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-extrabold text-sky-500">Trasladar</h2>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">

              {/* 1 — Filtros: Especialidad / Subespecialidad / Tipo */}
              <div className="grid grid-cols-3 gap-3">
                <ModalNotchSelect
                  label="Especialidad" compact
                  value={trasladoEsp}
                  onChange={v => { setTrasladoEsp(v); setTrasladoSub(''); setTrasladoTipo(''); }}
                  options={especialidades.map(x => ({ value: String(x.id), label: x.nombre }))}
                />
                <ModalNotchSelect
                  label="Subespecialidad" compact
                  disabled={!trasladoEsp}
                  value={trasladoSub}
                  onChange={v => { setTrasladoSub(v); setTrasladoTipo(''); }}
                  options={subespecialidades.filter(s => s.especialidadId === Number(trasladoEsp)).map(x => ({ value: String(x.id), label: x.nombre }))}
                />
                <ModalNotchSelect
                  label="Tipo" compact
                  disabled={!trasladoSub || !subespTrasladoTieneTipos}
                  value={trasladoTipo}
                  onChange={setTrasladoTipo}
                  options={tipos.filter(t => t.subespecialidadId === Number(trasladoSub)).map(t => ({ value: String(t.id), label: t.nombre }))}
                />
              </div>

              {/* 2 — ¿Qué desea transferir? */}
              <div className="flex items-center gap-8">
                <span className="text-sm font-bold text-slate-700 whitespace-nowrap">¿Qué desea transferir?</span>
                {(['kit', 'instrumento'] as const).map(t => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer"
                    onClick={() => { setTransferType(t); setSelectedItems([]); setTrasladoSearch(''); }}>
                    <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-colors ${transferType === t ? 'border-sky-500' : 'border-slate-300'}`}>
                      {transferType === t && <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />}
                    </div>
                    <span className="text-sm font-medium text-slate-600">{t === 'kit' ? 'KIT' : 'Instrumento'}</span>
                  </label>
                ))}
              </div>

              {/* 3 — Tabla KITs / Instrumentos disponibles */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                {/* cabecera de la tabla */}
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
                  <span className="text-slate-700 text-xs font-bold">
                    {transferType === 'kit' ? 'KITs disponibles' : 'Instrumentos disponibles'}
                  </span>
                  {transferType === 'instrumento' && (
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text" placeholder="Buscar..." value={trasladoSearch}
                        onChange={e => setTrasladoSearch(e.target.value)}
                        style={{ height: 28, borderRadius: 20, border: '1.5px solid #e2e8f0', background: '#fff', padding: '0 28px 0 10px', fontSize: 12, color: '#475569', outline: 'none', width: 160 }}
                      />
                      <Search size={13} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                    </div>
                  )}
                </div>

                {/* filas */}
                <div className="max-h-[190px] overflow-y-auto divide-y divide-slate-50">
                  {inventarioOrigen.length === 0 ? (
                    <div className="py-7 text-center text-slate-400 text-sm">
                      {trasladoForm.sedeOrigenId
                        ? 'No hay elementos disponibles en esta sede.'
                        : 'Seleccione una sede origen para ver disponibilidad.'}
                    </div>
                  ) : transferType === 'kit' ? (
                    inventarioOrigen.map((item: any) => {
                      const sel = !!selectedItems.find((i: any) => i.id === item.id);
                      return (
                        <div key={item.id}
                          className={`flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer ${sel ? 'bg-sky-50/50' : 'hover:bg-slate-50'}`}
                          onClick={() => setSelectedItems(sel ? selectedItems.filter((i: any) => i.id !== item.id) : [...selectedItems, { id: item.id }])}>
                          <input type="checkbox" checked={sel} readOnly className="w-4 h-4 accent-sky-500 cursor-pointer" />
                          <span className="text-slate-700 text-sm font-semibold flex-1">{item.nombre}</span>
                          <span className="text-slate-400 text-xs font-mono border border-slate-200 px-2 py-0.5 rounded bg-white">{item.codigoKit}</span>
                        </div>
                      );
                    })
                  ) : (
                    inventarioOrigen
                      .filter((i: any) =>
                        !trasladoSearch ||
                        i.nombre?.toLowerCase().includes(trasladoSearch.toLowerCase()) ||
                        i.codigo?.toLowerCase().includes(trasladoSearch.toLowerCase())
                      )
                      .map((item: any) => {
                        const selItem = selectedItems.find((i: any) => i.id === item.id);
                        const sel = !!selItem;
                        return (
                          <div key={item.id} className={`flex items-center justify-between px-4 py-2.5 transition-colors ${sel ? 'bg-sky-50/50' : 'hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-3 flex-1">
                              <input type="checkbox" checked={sel} className="w-4 h-4 accent-sky-500 cursor-pointer"
                                onChange={() => setSelectedItems(sel ? selectedItems.filter((i: any) => i.id !== item.id) : [...selectedItems, { id: item.id, nombre: item.nombre, cantidad: 1 }])} />
                              <div>
                                <p className="text-slate-700 text-sm font-semibold">{item.nombre}</p>
                                <p className="text-slate-400 text-[11px] font-mono">{item.codigo}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mr-1">
                              <div className="flex flex-col items-center">
                                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wide">Disponible</span>
                                <span className="text-slate-600 font-bold bg-slate-100 rounded-full px-2.5 py-0.5 text-xs mt-0.5">{item.qty || 1}</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-[9px] uppercase font-bold text-sky-500 tracking-wide">Solicitar</span>
                                <input type="number" disabled={!sel} min="1" max={item.qty || 1}
                                  value={selItem?.cantidad || ''}
                                  onChange={e => {
                                    let q = parseInt(e.target.value) || 1;
                                    if (q > (item.qty || 1)) q = (item.qty || 1);
                                    if (q < 1) q = 1;
                                    setSelectedItems(selectedItems.map((i: any) => i.id === item.id ? { ...i, cantidad: q } : i));
                                  }}
                                  className="w-14 h-7 border border-sky-200 bg-white rounded-lg text-center text-sm font-bold text-sky-600 outline-none mt-0.5 disabled:opacity-40 disabled:bg-slate-50 disabled:border-slate-200 disabled:text-slate-400"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>

              {/* 4 — Sede origen / Sede destino */}
              <div className="grid grid-cols-2 gap-4">
                <ModalNotchSelect
                  label="Sede origen" required
                  value={trasladoForm.sedeOrigenId}
                  onChange={v => setTrasladoForm({ ...trasladoForm, sedeOrigenId: v })}
                  options={sedesDB.map(s => ({ value: String(s.id), label: s.nombre }))}
                />
                <ModalNotchSelect
                  label="Sede destino" required
                  value={trasladoForm.sedeDestinoId}
                  onChange={v => setTrasladoForm({ ...trasladoForm, sedeDestinoId: v })}
                  options={sedesDB.map(s => ({ value: String(s.id), label: s.nombre }))}
                />
              </div>

              {/* 5 — Fecha traslado / Fecha devolución */}
              <div className="grid grid-cols-2 gap-4">
                <ModalNotchInput label="Fecha traslado" type="date" disabled value={today} onChange={() => {}} />
                <ModalNotchInput label="Fecha devolución" type="date" required min={today}
                  value={trasladoForm.fechaDevolucion}
                  onChange={v => setTrasladoForm({ ...trasladoForm, fechaDevolucion: v })}
                />
              </div>

              {/* 6 — Botones */}
              <div className="flex justify-center gap-8 pb-1">
                <button className="hv-cancel-btn" onClick={handleCancelTraslado}>Cancelar</button>
                <button className="hv-save-btn" onClick={handleSaveTraslado}>Guardar</button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HojasDeVidaScreen;