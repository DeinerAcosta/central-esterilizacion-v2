import React, { useState, useEffect, useRef } from 'react';
import {
  Search, PlusCircle, ChevronDown, ChevronLeft, ChevronRight,
  ArrowLeftCircle, Eye, Ban, Edit, Image as ImageIcon,
  CheckCircle, X, Calendar, ChevronsLeft, ChevronsRight, Info, Paperclip
} from 'lucide-react';
import Swal from 'sweetalert2';

/* ════════════════════════════════════════════════════════
   ESTILOS GLOBALES
   ════════════════════════════════════════════════════════ */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { font-family: 'Inter', sans-serif; box-sizing: border-box; }

  .k-pill {
    height: 40px; border-radius: 999px;
    border: 1.5px solid #d1d5db; background: #fff;
    padding: 0 36px 0 18px; font-size: 13px; color: #374151;
    outline: none; appearance: none; cursor: pointer;
    transition: border-color .2s;
  }
  .k-pill:focus    { border-color: #38bdf8; }
  .k-pill:invalid  { color: #9ca3af; }
  .k-pill:valid    { color: #374151; }
  .k-pill:disabled { background: #f8fafc; color: #9ca3af; cursor: not-allowed; }

  .k-search {
    width: 100%; height: 40px; border-radius: 999px;
    border: 1.5px solid #d1d5db; background: #fff;
    padding: 0 40px 0 18px; font-size: 13px; color: #374151;
    outline: none; transition: border-color .2s;
  }
  .k-search:focus        { border-color: #38bdf8; }
  .k-search::placeholder { color: #9ca3af; }

  .ns::-webkit-scrollbar { display: none; }
  .ns { -ms-overflow-style: none; scrollbar-width: none; }

  .hv-modal-scroll::-webkit-scrollbar { width: 5px; }
  .hv-modal-scroll::-webkit-scrollbar-track { background: transparent; }
  .hv-modal-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
`;

const TH: React.CSSProperties = { padding: '12px 16px', fontSize: 12.5, fontWeight: 700, color: '#6b7280', whiteSpace: 'nowrap', textAlign: 'left' };
const TD: React.CSSProperties = { padding: '11px 16px', fontSize: 13, color: '#374151', fontWeight: 500, whiteSpace: 'nowrap' };

/* ════════════════════════════════════════════════════════
   SUB-COMPONENTES
   ════════════════════════════════════════════════════════ */

const Circle: React.FC<{ char: string }> = ({ char }) => {
  const active = char !== '–';
  return (
    <div style={{
      width: 34, height: 34, borderRadius: '50%',
      border: `1.5px solid ${active ? '#06b6d4' : '#e5e7eb'}`,
      background: active ? '#ecfeff' : '#f9fafb',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, fontWeight: 700, color: active ? '#0891b2' : '#9ca3af',
    }}>{char}</div>
  );
};

const CodeGroup: React.FC<{ chars: string[]; label: string }> = ({ chars, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
    <div style={{ display: 'flex', gap: 5 }}>
      {chars.map((c, i) => <Circle key={i} char={c} />)}
    </div>
    <span style={{ fontSize: 10, color: '#9ca3af', whiteSpace: 'nowrap' }}>{label}</span>
  </div>
);

interface NS {
  label: string; required?: boolean; value: string;
  onChange: (v: string) => void;
  options: { value: string | number; label: string }[];
  disabled?: boolean; width?: number | string; height?: number;
}
const NotchSel: React.FC<NS> = ({ label, required, value, onChange, options, disabled, width = 'auto', height = 40 }) => {
  const [foc, setFoc] = useState(false);
  const bg = disabled ? '#f8fafc' : '#fff';
  const pt = height === 44 ? '12px 36px 0 18px' : '0 36px 0 18px';
  return (
    <div style={{ position: 'relative', width, flexShrink: 0 }}>
      <select
        value={value || ''} onChange={e => onChange(e.target.value)} disabled={disabled}
        onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
        style={{
          width: '100%', height, borderRadius: 999,
          border: `1.5px solid ${foc ? '#38bdf8' : '#d1d5db'}`,
          background: bg, padding: pt, fontSize: 13,
          color: value ? '#374151' : '#9ca3af',
          outline: 'none', appearance: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: 'Inter, sans-serif', transition: 'border-color .2s',
        }}
      >
        <option value="" disabled hidden>Seleccionar</option>
        <option value="">Seleccionar...</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <label style={{
        position: 'absolute', left: 16, top: 0,
        transform: 'translateY(-50%)',
        fontSize: 10.5, fontWeight: 600, pointerEvents: 'none',
        color: foc ? '#38bdf8' : '#6b7280',
        background: bg, padding: '0 4px', whiteSpace: 'nowrap',
      }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
      </label>
      <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af' }} />
    </div>
  );
};

const NotchInput: React.FC<{ label: string; value: string; width?: number | string; center?: boolean; icon?: React.ReactNode }> = ({ label, value, width = 'auto', center, icon }) => (
  <div style={{ position: 'relative', width, flexShrink: 0 }}>
    <input value={value} readOnly disabled style={{
      width: '100%', height: 44, borderRadius: 999,
      border: '1.5px solid #d1d5db', background: '#f8fafc',
      padding: center ? '12px 36px 0 0' : '12px 36px 0 18px',
      paddingLeft: center ? 0 : 18,
      textAlign: center ? 'center' : 'left',
      fontSize: 13, color: '#374151', fontWeight: 700,
      outline: 'none', fontFamily: 'Inter, sans-serif',
    }} />
    <label style={{
      position: 'absolute',
      left: center ? '50%' : 16, top: 0,
      transform: center ? 'translate(-50%, -50%)' : 'translateY(-50%)',
      fontSize: 10.5, fontWeight: 600, pointerEvents: 'none',
      color: '#6b7280', background: '#f8fafc', padding: '0 4px', whiteSpace: 'nowrap',
    }}>{label}</label>
    {icon && <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>{icon}</span>}
  </div>
);

/* ── Campo read-only para el modal HV (sin fondo gris, más limpio) ── */
const HVField: React.FC<{ label: string; value?: string; icon?: React.ReactNode; hasChevron?: boolean }> = ({ label, value, icon, hasChevron }) => (
  <div style={{ position: 'relative' }}>
    <div style={{
      width: '100%', height: 44, borderRadius: 999,
      border: '1.5px solid #d1d5db', background: '#f8fafc',
      padding: '14px 38px 0 18px',
      fontSize: 13, color: value ? '#374151' : '#9ca3af', fontWeight: 500,
      display: 'flex', alignItems: 'flex-end', overflow: 'hidden',
    }}>
      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1 }}>
        {value || '—'}
      </span>
    </div>
    <label style={{
      position: 'absolute', left: 16, top: 0,
      transform: 'translateY(-50%)', fontSize: 10.5, fontWeight: 600,
      color: '#6b7280', pointerEvents: 'none',
      background: '#f8fafc', padding: '0 4px', whiteSpace: 'nowrap',
    }}>{label}</label>
    {icon && <span style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', display: 'flex' }}>{icon}</span>}
    {hasChevron && !icon && <ChevronDown size={14} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />}
  </div>
);

/* ── Campo de documento (PDF) para Requisitos ── */
const DocField: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div style={{ position: 'relative' }}>
    <div style={{
      width: '100%', height: 44, borderRadius: 999,
      border: '1.5px solid #d1d5db', background: '#f8fafc',
      padding: '14px 38px 0 18px',
      fontSize: 13, color: value ? '#374151' : '#9ca3af', fontWeight: 500,
      display: 'flex', alignItems: 'flex-end', overflow: 'hidden',
    }}>
      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1 }}>
        {value ? value.split('/').pop() || 'Documento.pdf' : 'Sin documento'}
      </span>
    </div>
    <label style={{
      position: 'absolute', left: 16, top: 0,
      transform: 'translateY(-50%)', fontSize: 10.5, fontWeight: 600,
      color: '#6b7280', pointerEvents: 'none',
      background: '#f8fafc', padding: '0 4px', whiteSpace: 'nowrap',
    }}>{label}</label>
    <Paperclip size={14} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
  </div>
);

/* ── Toggle read-only ── */
const ReadToggle: React.FC<{ value?: boolean; label: string }> = ({ value, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 8 }}>
    <div style={{
      width: 44, height: 24, borderRadius: 12, flexShrink: 0,
      background: value ? '#3b82f6' : '#e5e7eb',
      position: 'relative', transition: 'background .2s',
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 2,
        left: value ? 22 : 2, transition: 'left .2s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
      }} />
    </div>
    <span style={{ fontSize: 13, color: '#374151', fontWeight: 500, whiteSpace: 'nowrap' }}>{label}</span>
  </div>
);

/* ── Título de sección ── */
const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b', marginBottom: 14, marginTop: 4 }}>{title}</div>
);

/* ════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ════════════════════════════════════════════════════════ */
const KitScreen: React.FC = () => {
  const [view, setView]               = useState<'list' | 'create' | 'edit' | 'details'>('list');
  const [selectedKit, setSelectedKit] = useState<any>(null);
  const [menuIdx, setMenuIdx]         = useState<number | null>(null);
  const menuRef                       = useRef<HTMLDivElement>(null);

  /* ── Datos ── */
  const [kitsData, setKitsData]   = useState<any[]>([]);
  const [especialidades, setEsps] = useState<any[]>([]);
  const [subs, setSubs]           = useState<any[]>([]);
  const [tipos, setTipos]         = useState<any[]>([]);
  const [instrBase, setInstrBase] = useState<any[]>([]);
  const [available, setAvailable] = useState<any[]>([]);
  const [added, setAdded]         = useState<any[]>([]);

  /* ── Paginación ── */
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRec, setTotalRec]     = useState(0);

  /* ── Filtros lista ── */
  const [search, setSearch]       = useState('');
  const [estFilter, setEstFilter] = useState('');
  const [listEsp, setListEsp]     = useState('');
  const [listSub, setListSub]     = useState('');

  /* ── Filtros panel derecho ── */
  const [iSearch, setISearch] = useState('');

  /* ── Modal Detalles de Instrumento (Hoja de Vida) ── */
  const [isDetailOpen, setIsDetailOpen]   = useState(false);
  const [detailInstr, setDetailInstr]     = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const initForm = { especialidadId: '', subespecialidadId: '', tipoSubespecialidadId: '', numeroKit: '', codKit: '' };
  const [form, setForm] = useState<any>(initForm);

  const today = new Date().toISOString().split('T')[0];

  /* ── Effects ── */
  useEffect(() => { fetchEsps(); fetchInstr(); }, []);
  useEffect(() => { fetchKits(); }, [search, estFilter, listEsp, listSub, page]);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuIdx(null); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  /* ── Fetches ── */
  const fetchKits = async () => {
    try {
      const q = new URLSearchParams({ page: String(page), search, estado: estFilter });
      if (listEsp) q.append('especialidadId', listEsp);
      if (listSub) q.append('subespecialidadId', listSub);
      const j = await (await fetch(`http://localhost:4000/api/kits?${q}`)).json();
      setKitsData(j.data || []);
      setTotalPages(j.totalPages || 1);
      setTotalRec(j.total || 0);
    } catch { }
  };

  const fetchEsps = async () => {
    try { setEsps((await (await fetch('http://localhost:4000/api/especialidades?estado=true')).json()).data || []); } catch { }
  };

  const fetchInstr = async () => {
    try {
      const j = await (await fetch('http://localhost:4000/api/hoja-vida?estado=Habilitado&limit=1000')).json();
      setInstrBase(j.data || []);
    } catch { }
  };

  /* ── Cambio de selects del formulario ── */
  const onFormChange = async (name: string, value: string) => {
    setForm((p: any) => ({ ...p, [name]: value }));

    if (name === 'especialidadId') {
      try {
        setSubs((await (await fetch(`http://localhost:4000/api/subespecialidades?especialidadId=${value}`)).json()).data || []);
        setTipos([]);
        setForm((p: any) => ({ ...p, subespecialidadId: '', tipoSubespecialidadId: '', codKit: '', numeroKit: '' }));
      } catch { }
    }
    if (name === 'subespecialidadId') {
      try {
        setTipos((await (await fetch(`http://localhost:4000/api/tipos-subespecialidad?subespecialidadId=${value}`)).json()).data || []);
        setForm((p: any) => ({ ...p, tipoSubespecialidadId: '', codKit: '', numeroKit: '' }));
      } catch { }
    }
    if (name === 'tipoSubespecialidadId') {
      const espObj = especialidades.find(e => String(e.id) === String(form.especialidadId));
      const subObj = subs.find(s => String(s.id) === String(form.subespecialidadId));
      const tipObj = tipos.find(t => String(t.id) === String(value));
      const esp = espObj?.nombre ? espObj.nombre.substring(0, 2).toUpperCase() : 'XX';
      const sub = subObj?.nombre ? subObj.nombre.substring(0, 2).toUpperCase() : 'XX';
      const tip = tipObj?.nombre ? tipObj.nombre.substring(0, 2).toUpperCase() : 'XX';
      const num = Math.floor(Math.random() * 99).toString().padStart(2, '0');
      setForm((p: any) => ({ ...p, numeroKit: num, codKit: `${esp}${sub}${tip}${num}` }));
      const filtrados = instrBase.filter(i =>
        String(i.especialidadId) === String(form.especialidadId) &&
        String(i.subespecialidadId) === String(form.subespecialidadId)
      );
      setAvailable(filtrados);
      setAdded([]);
    }
  };

  /* ── Instrumentos ── */
  const handleAdd = (item: any) => {
    if (added.some(a => a.id === item.id)) {
      Swal.fire({ icon: 'warning', title: '¡Alerta!', text: 'Este instrumento ya se encuentra agregado.', confirmButtonColor: '#3b82f6' });
      return;
    }
    setAdded([...added, item]);
    setAvailable(available.filter(i => i.id !== item.id));
  };

  const handleRemove = (item: any) => {
    setAvailable([...available, item]);
    setAdded(added.filter(i => i.id !== item.id));
  };

  /* ── Guardar ── */
  const handleSave = async () => {
    if (view === 'create' && (!form.especialidadId || !form.subespecialidadId || !form.tipoSubespecialidadId || added.length === 0)) {
      Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Es necesario el diligenciamiento de todos los campos obligatorios y la adición de al menos un instrumento al kit.', confirmButtonColor: '#3b82f6' });
      return;
    }
    if (view === 'edit' && added.length === 0) {
      Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'No es posible guardar los cambios. Verifique los instrumentos asociados.', confirmButtonColor: '#3b82f6' });
      return;
    }
    try {
      const res = await fetch(
        view === 'create' ? 'http://localhost:4000/api/kits' : `http://localhost:4000/api/kits/${selectedKit.id}`,
        { method: view === 'create' ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, instrumentosIds: added.map(i => i.id) }) }
      );
      if (!res.ok) throw new Error();
      Swal.fire({ icon: 'success', title: '¡Éxito!', text: view === 'create' ? 'Se ha creado exitosamente.' : 'Se ha actualizado exitosamente.', timer: 2000, showConfirmButton: false })
        .then(() => { setView('list'); fetchKits(); });
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Ocurrió un error al procesar la solicitud.', confirmButtonColor: '#ef4444' });
    }
  };

  /* ── Cambio de estado ── */
  const handleToggleStatus = (row: any) => {
    setMenuIdx(null);
    const accion = row.estado === 'Habilitado' ? 'deshabilitará' : 'habilitará';
    Swal.fire({
      title: '¿Está seguro?',
      html: `Se <b>${accion}</b> el kit:<br/><span style="color:#1e293b;font-weight:800">${row.codigoKit || row.codigo}</span>`,
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#3b82f6', cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, continuar', cancelButtonText: 'Cancelar',
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          await fetch(`http://localhost:4000/api/kits/${row.id}/estado`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: row.estado === 'Habilitado' ? 'Deshabilitado' : 'Habilitado' })
          });
          Swal.fire({ icon: 'success', title: 'Estado actualizado', text: `El kit ha sido ${row.estado === 'Habilitado' ? 'deshabilitado' : 'habilitado'}.`, timer: 1500, showConfirmButton: false });
          fetchKits();
        } catch {
          Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cambiar el estado del kit.', confirmButtonColor: '#ef4444' });
        }
      }
    });
  };

  /* ── Cancelar crear/editar ── */
  const handleCancel = () => {
    if (view === 'details') { setView('list'); return; }
    Swal.fire({
      title: '¿Está seguro?',
      text: view === 'create' ? 'La información diligenciada no se guardará en el sistema.' : 'Los cambios realizados no se guardarán en el sistema.',
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#3b82f6', cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar',
    }).then(result => { if (result.isConfirmed) { setView('list'); fetchKits(); } });
  };

  /* ── Abrir vista ── */
  const openView = async (type: 'create' | 'edit' | 'details', kit: any = null) => {
    setSelectedKit(kit); setMenuIdx(null); setAdded([]); setISearch('');
    if (type === 'create') {
      setForm(initForm); setSubs([]); setTipos([]); setAvailable([]);
    } else {
      setForm({ especialidadId: kit.especialidadId, subespecialidadId: kit.subespecialidadId, tipoSubespecialidadId: kit.tipoId || kit.tipoSubespecialidadId, numeroKit: kit.numeroKit || kit.numero, codKit: kit.codigoKit || kit.codigo });
      try {
        setSubs((await (await fetch(`http://localhost:4000/api/subespecialidades?especialidadId=${kit.especialidadId}`)).json()).data || []);
        setTipos((await (await fetch(`http://localhost:4000/api/tipos-subespecialidad?subespecialidadId=${kit.subespecialidadId}`)).json()).data || []);
      } catch { }
      const itemsKit = kit.instrumentos || [];
      setAdded(itemsKit);
      setAvailable(instrBase.filter(i => String(i.especialidadId) === String(kit.especialidadId) && !itemsKit.some((a: any) => a.id === i.id)));
    }
    setView(type);
  };

  /* ── Abrir detalle de instrumento (hoja de vida completa) ── */
  const openDetailModal = async (item: any) => {
    setDetailInstr(item);   // muestra datos básicos de inmediato
    setIsDetailOpen(true);
    setDetailLoading(true);
    try {
      const j = await (await fetch(`http://localhost:4000/api/hoja-vida/${item.id}`)).json();
      setDetailInstr(j);
    } catch { /* usa datos básicos */ }
    finally { setDetailLoading(false); }
  };

  /* ── Letras del código kit ── */
  const cod    = form?.codKit || '';
  const espLet = cod.length >= 2 ? [cod[0], cod[1]] : ['–', '–'];
  const subLet = cod.length >= 4 ? [cod[2], cod[3]] : ['–', '–'];
  const tipNom = tipos?.find(t => String(t.id) === String(form.tipoSubespecialidadId))?.nombre || '';
  const tipLet = tipNom.length >= 2 ? [tipNom[0].toUpperCase(), tipNom[1].toUpperCase()] : ['–', '–'];
  const kitNum = form?.numeroKit || '';
  const kitLet = kitNum.length >= 2 ? [kitNum[0], kitNum[1]] : kitNum.length === 1 ? [kitNum[0], '–'] : ['–', '–'];

  /* ── Instrumentos filtrados panel derecho ── */
  const instrFilt = available.filter((i: any) =>
    (!iSearch || i.nombre?.toLowerCase().includes(iSearch.toLowerCase()) || i.codigo?.toLowerCase().includes(iSearch.toLowerCase()))
  );

  /* ── Botón de menú contextual ── */
  const MBtn = ({ onClick, color = '#374151', icon, label }: any) => (
    <button onClick={onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12.5, color, fontWeight: 600 }}
      onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
      onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
      {icon}{label}
    </button>
  );

  return (
    <>
      <style>{G}</style>
      <div className="ns" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        onClick={() => setMenuIdx(null)}>

        {/* ══════════ VISTA LISTA ══════════ */}
        {view === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 18 }}>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#0ea5e9', margin: 0 }}>Kit</h1>

            {/* Barra de filtros */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <select value={estFilter} onChange={e => { setEstFilter(e.target.value); setPage(1); }} className="k-pill" style={{ minWidth: 130 }} required>
                  <option value="" disabled hidden>Estado</option>
                  <option value="">Todos</option>
                  <option value="Habilitado">Habilitado</option>
                  <option value="Deshabilitado">Deshabilitado</option>
                </select>
                <ChevronDown size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af' }} />
              </div>
              <NotchSel label="Especialidad" value={listEsp} onChange={v => { setListEsp(v); setListSub(''); setPage(1); }} options={especialidades.map(e => ({ value: e.id, label: e.nombre }))} width={210} />
              <NotchSel label="Subespecialidad" value={listSub} onChange={v => { setListSub(v); setPage(1); }} options={subs.map(s => ({ value: s.id, label: s.nombre }))} disabled={!listEsp} width={220} />
              <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
                <input type="text" placeholder="Buscar por numero de kit" value={search} onChange={e => { setSearch(e.target.value.replace(/[^a-zA-Z0-9]/g, '')); setPage(1); }} className="k-search" />
                <Search size={16} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#38bdf8', pointerEvents: 'none' }} />
              </div>
              <button onClick={() => openView('create')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#0ea5e9', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', padding: '0 4px', flexShrink: 0 }}>
                Crear kit <PlusCircle size={18} strokeWidth={2.2} />
              </button>
            </div>

            {/* Tabla */}
            <div style={{ flex: 1, background: '#fff', borderRadius: 20, border: '1px solid #f1f5f9', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
              <div style={{ overflow: 'auto', flex: 1 }} className="ns">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid #f3f4f6', background: '#f8fafc' }}>
                      <th style={TH}>Código</th>
                      <th style={TH}>Especialidad</th>
                      <th style={TH}>Subespecialidad</th>
                      <th style={TH}>Tipo de subespecialidad</th>
                      <th style={TH}>Numero</th>
                      <th style={TH}>Cantidad</th>
                      <th style={TH}>Código de Kit</th>
                      <th style={{ ...TH, textAlign: 'right' }}>Estado</th>
                      <th style={{ ...TH, width: 52 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {kitsData.length === 0 ? (
                      <tr><td colSpan={9} style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af', fontSize: 14 }}>No se encontraron registros.</td></tr>
                    ) : kitsData.map((row, i) => (
                      <tr key={row.id} style={{ borderBottom: '1px solid #f9fafb', transition: 'background .12s' }} onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')} onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                        <td style={{ ...TD, color: '#9ca3af' }}>{row.id}</td>
                        <td style={TD}>{row.especialidad?.nombre || 'N/A'}</td>
                        <td style={TD}>{row.subespecialidad?.nombre || 'N/A'}</td>
                        <td style={TD}>{row.tipo?.nombre || row.tipoSubespecialidad || 'N/A'}</td>
                        <td style={TD}>{row.numeroKit || row.numero || '00'}</td>
                        <td style={TD}>{row.instrumentos?.length ?? 0}</td>
                        <td style={{ ...TD, fontWeight: 700, color: '#0369a1' }}>{row.codigoKit || row.codigo}</td>
                        <td style={{ ...TD, textAlign: 'right' }}>
                          <span style={{ padding: '4px 14px', borderRadius: 999, fontSize: 11.5, fontWeight: 700, ...(row.estado === 'Habilitado' ? { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' } : { background: '#fff1f2', color: '#ef4444', border: '1px solid #fecaca' }) }}>{row.estado}</span>
                        </td>
                        <td style={{ padding: '11px 12px', textAlign: 'right', position: 'relative' }} onClick={e => e.stopPropagation()}>
                          <button onClick={() => setMenuIdx(menuIdx === i ? null : i)} style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', transition: 'all .15s' }} onMouseEnter={e => { (e.currentTarget as any).style.borderColor = '#38bdf8'; (e.currentTarget as any).style.color = '#38bdf8'; }} onMouseLeave={e => { (e.currentTarget as any).style.borderColor = '#e5e7eb'; (e.currentTarget as any).style.color = '#9ca3af'; }}>
                            <Info size={13} />
                          </button>
                          {menuIdx === i && (
                            <div ref={menuRef} style={{ position: 'absolute', right: 40, top: 6, width: 170, background: '#fff', borderRadius: 14, boxShadow: '0 8px 28px rgba(0,0,0,0.12)', border: '1px solid #f3f4f6', zIndex: 9999, paddingTop: 4, paddingBottom: 4, overflow: 'hidden' }}>
                              <MBtn icon={<Eye size={13} />} label="Ver detalle" onClick={() => openView('details', row)} />
                              {row.estado === 'Habilitado' && <MBtn icon={<Edit size={13} />} label="Editar" onClick={() => openView('edit', row)} />}
                              <div style={{ height: 1, background: '#f3f4f6', margin: '3px 12px' }} />
                              <MBtn icon={row.estado === 'Habilitado' ? <Ban size={13} /> : <CheckCircle size={13} />} label={row.estado === 'Habilitado' ? 'Deshabilitar' : 'Habilitar'} color={row.estado === 'Habilitado' ? '#ef4444' : '#16a34a'} onClick={() => handleToggleStatus(row)} />
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>Mostrando {kitsData.length} de {totalRec} registros</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0ea5e9', fontWeight: 600 }}>
                  <button onClick={() => setPage(1)} disabled={page === 1} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: page === 1 ? 0.35 : 1 }}><ChevronsLeft size={16} /></button>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: page === 1 ? 0.35 : 1 }}><ChevronLeft size={16} /></button>
                  <span style={{ background: '#f0f9ff', padding: '3px 14px', borderRadius: 8, fontSize: 12, color: '#0369a1', fontWeight: 700 }}>Pág. {page} de {totalPages || 1}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: page >= totalPages ? 0.35 : 1 }}><ChevronRight size={16} /></button>
                  <button onClick={() => setPage(totalPages)} disabled={page >= totalPages} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: page >= totalPages ? 0.35 : 1 }}><ChevronsRight size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ CREAR / EDITAR / DETALLE ══════════ */}
        {view !== 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 14, minHeight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <button onClick={handleCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0ea5e9', display: 'flex', alignItems: 'center', padding: 0 }}>
                <ChevronLeft size={30} strokeWidth={2.5} />
              </button>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0ea5e9', margin: 0 }}>
                {view === 'create' ? 'Crear Kit' : view === 'edit' ? 'Editar Kit' : 'Detalles del Kit'}
              </h1>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', border: '1px solid #bae6fd', borderRadius: 18, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap', flexShrink: 0 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0369a1', flexShrink: 0 }}>Código Kit</span>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <CodeGroup chars={espLet} label="(Especialidad)" />
                <CodeGroup chars={subLet} label="(Subespecialidad)" />
                <CodeGroup chars={tipLet} label="(Tipo Subespecialidad)" />
                <CodeGroup chars={kitLet} label="(Kit)" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', flexShrink: 0 }}>
              <NotchSel label="Especialidad" required={view === 'create'} value={form.especialidadId} onChange={v => onFormChange('especialidadId', v)} options={especialidades.map(e => ({ value: e.id, label: e.nombre }))} disabled={view !== 'create'} width={162} height={44} />
              <NotchSel label="Sub-especialidad" required={view === 'create'} value={form.subespecialidadId} onChange={v => onFormChange('subespecialidadId', v)} options={subs.map(s => ({ value: s.id, label: s.nombre }))} disabled={view !== 'create' || !form.especialidadId} width={188} height={44} />
              <NotchSel label="T. Sub-especialidad" required={view === 'create'} value={form.tipoSubespecialidadId} onChange={v => onFormChange('tipoSubespecialidadId', v)} options={tipos.map(t => ({ value: t.id, label: t.nombre }))} disabled={view !== 'create' || !form.subespecialidadId} width={178} height={44} />
              <NotchInput label="No. Kit" value={form.numeroKit || ''} width={74} center />
              <NotchInput label="Creación" value={view === 'create' ? today : (selectedKit?.createdAt?.split('T')[0] || today)} width={148} icon={<Calendar size={14} />} />
              {view !== 'details' && (
                <div style={{ position: 'relative', flex: 1, minWidth: 160 }}>
                  <input type="text" placeholder="Buscar instrumento por nombre o código..." value={iSearch} onChange={e => setISearch(e.target.value)} style={{ width: '100%', height: 44, borderRadius: 999, border: '1.5px solid #d1d5db', background: '#fff', padding: '0 40px 0 18px', fontSize: 13, color: '#374151', outline: 'none' }} />
                  <Search size={15} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#38bdf8', pointerEvents: 'none' }} />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 14, flex: 1, minHeight: 0 }}>
              {/* Panel izquierdo */}
              <div style={{ flex: 1, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0, minWidth: 0, boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                <div style={{ background: 'linear-gradient(90deg, #dbeafe 0%, #bae6fd 100%)', padding: '11px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #bfdbfe', flexShrink: 0 }}>
                  <span style={{ fontWeight: 700, color: '#1e40af', fontSize: 13 }}>{view === 'details' ? 'Instrumentos del Kit' : 'Añadir al Kit'}</span>
                  <span style={{ background: '#fff', borderRadius: 999, padding: '2px 12px', fontSize: 11, color: '#6b7280', border: '1px solid #e5e7eb', fontWeight: 600 }}>{added.length} items</span>
                </div>
                <div style={{ overflowY: 'auto', flex: 1 }} className="ns">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #f3f4f6', background: '#f8fafc' }}>
                        {view !== 'details' && <th style={{ ...TH, width: 46 }}></th>}
                        <th style={TH}>Item</th>
                        <th style={TH}>Código</th>
                        <th style={TH}>C. Instrumento</th>
                        <th style={TH}>Nombre</th>
                        <th style={{ ...TH, width: 40 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {added.length === 0 ? (
                        <tr><td colSpan={view !== 'details' ? 6 : 5} style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af', fontSize: 13 }}>Sin instrumentos agregados</td></tr>
                      ) : added.map((item, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }} onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')} onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                          {view !== 'details' && (
                            <td style={{ padding: '8px 8px 8px 12px' }}>
                              <button onClick={() => handleRemove(item)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }} onMouseEnter={e => { (e.currentTarget as any).style.background = '#fef2f2'; (e.currentTarget as any).style.color = '#ef4444'; (e.currentTarget as any).style.borderColor = '#fecaca'; }} onMouseLeave={e => { (e.currentTarget as any).style.background = '#fff'; (e.currentTarget as any).style.color = '#9ca3af'; (e.currentTarget as any).style.borderColor = '#e5e7eb'; }}>
                                <ChevronRight size={14} />
                              </button>
                            </td>
                          )}
                          <td style={{ padding: '8px 16px' }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                              {item.fotoUrl ? <img src={item.fotoUrl.startsWith('http') ? item.fotoUrl : `http://localhost:4000${item.fotoUrl}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={14} color="#94a3b8" />}
                            </div>
                          </td>
                          <td style={{ ...TD, color: '#0369a1', fontWeight: 700 }}>{item.codigo}</td>
                          <td style={TD}>{item.numeroSerie || 'N/A'}</td>
                          <td style={TD}>{item.nombre}</td>
                          <td style={{ padding: '8px 12px 8px 4px', textAlign: 'right' }}>
                            <button onClick={() => openDetailModal(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: 0, display: 'flex', alignItems: 'center' }} onMouseEnter={e => ((e.currentTarget as any).style.color = '#38bdf8')} onMouseLeave={e => ((e.currentTarget as any).style.color = '#cbd5e1')}>
                              <Search size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Panel derecho */}
              {view !== 'details' ? (
                <div style={{ flex: 1, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0, minWidth: 0, boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                  <div style={{ background: 'linear-gradient(90deg, #bae6fd 0%, #dbeafe 100%)', padding: '11px 18px', borderBottom: '1px solid #bfdbfe', flexShrink: 0 }}>
                    <span style={{ fontWeight: 700, color: '#0369a1', fontSize: 13 }}>Instrumentos filtrados</span>
                  </div>
                  <div style={{ overflowY: 'auto', flex: 1 }} className="ns">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #f3f4f6', background: '#f8fafc' }}>
                          <th style={{ ...TH, width: 46 }}></th>
                          <th style={TH}>Item</th>
                          <th style={TH}>Código</th>
                          <th style={TH}>C. Instrumento</th>
                          <th style={TH}>Nombre</th>
                          <th style={{ ...TH, width: 40 }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {instrFilt.length === 0 ? (
                          <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af', fontSize: 13 }}>No hay instrumentos disponibles</td></tr>
                        ) : instrFilt.map((item: any, i: number) => (
                          <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }} onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')} onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                            <td style={{ padding: '8px 8px 8px 12px' }}>
                              <button onClick={() => handleAdd(item)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }} onMouseEnter={e => { (e.currentTarget as any).style.background = '#eff6ff'; (e.currentTarget as any).style.color = '#3b82f6'; (e.currentTarget as any).style.borderColor = '#bfdbfe'; }} onMouseLeave={e => { (e.currentTarget as any).style.background = '#fff'; (e.currentTarget as any).style.color = '#9ca3af'; (e.currentTarget as any).style.borderColor = '#e5e7eb'; }}>
                                <ArrowLeftCircle size={15} strokeWidth={1.5} />
                              </button>
                            </td>
                            <td style={{ padding: '8px 16px' }}>
                              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {item.fotoUrl ? <img src={item.fotoUrl.startsWith('http') ? item.fotoUrl : `http://localhost:4000${item.fotoUrl}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={14} color="#94a3b8" />}
                              </div>
                            </td>
                            <td style={{ ...TD, color: '#0369a1', fontWeight: 700 }}>{item.codigo}</td>
                            <td style={TD}>{item.numeroSerie || 'N/A'}</td>
                            <td style={TD}>{item.nombre}</td>
                            <td style={{ padding: '8px 12px 8px 4px', textAlign: 'right' }}>
                              <button onClick={() => openDetailModal(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: 0, display: 'flex', alignItems: 'center' }} onMouseEnter={e => ((e.currentTarget as any).style.color = '#38bdf8')} onMouseLeave={e => ((e.currentTarget as any).style.color = '#cbd5e1')}>
                                <Search size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', gap: 12, background: '#fafafa', flexShrink: 0 }}>
                    <button onClick={handleCancel} style={{ padding: '9px 22px', borderRadius: 999, border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13, color: '#6b7280' }}>Cancelar</button>
                    <button onClick={handleSave} style={{ padding: '9px 28px', borderRadius: 999, border: 'none', cursor: 'pointer', background: 'linear-gradient(90deg, #3b82f6 0%, #34d399 100%)', color: '#fff', fontWeight: 700, fontSize: 13, boxShadow: '0 4px 14px rgba(59,130,246,0.28)' }}>{view === 'edit' ? 'Actualizar Kit' : 'Guardar Kit'}</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-start', paddingTop: 4 }}>
                  <button onClick={() => setView('list')} style={{ padding: '9px 26px', borderRadius: 999, border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13, color: '#6b7280' }}>Volver al listado</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            MODAL HOJA DE VIDA DEL INSTRUMENTO
            ══════════════════════════════════════════════════ */}
        {isDetailOpen && detailInstr && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }} onClick={() => setIsDetailOpen(false)} />

            <div className="hv-modal-scroll" style={{
              position: 'relative', background: '#fff', width: '100%', maxWidth: 1060,
              borderRadius: 24, padding: '32px 36px 28px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
              maxHeight: '92vh', overflowY: 'auto',
              display: 'flex', flexDirection: 'column', gap: 22,
            }}>

              {/* ── Loading ── */}
              {detailLoading && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #38bdf8, #3b82f6)', borderRadius: '24px 24px 0 0', animation: 'none', opacity: 0.7 }} />
              )}

              {/* ══ BLOQUE 1: Foto + Requisitos ══ */}
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

                {/* Foto instrumento */}
                <div style={{
                  minWidth: 220, background: '#f8fafc',
                  border: '1.5px dashed #cbd5e1', borderRadius: 16,
                  padding: '18px 20px', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 10,
                }}>
                  <span style={{ fontWeight: 700, color: '#3b82f6', fontSize: 14 }}>Foto Instrumento</span>
                  <div style={{ width: 90, height: 90, borderRadius: 14, overflow: 'hidden', background: '#e2e8f0', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {detailInstr.fotoUrl
                      ? <img src={detailInstr.fotoUrl.startsWith('http') ? detailInstr.fotoUrl : `http://localhost:4000${detailInstr.fotoUrl}`} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <ImageIcon size={32} color="#94a3b8" />
                    }
                  </div>
                  <span style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>Mín. 400 x 400 píxeles | Máx. 2MB</span>
                </div>

                {/* Requisitos */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#374151', marginBottom: 14 }}>Requisitos:</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <DocField label="Garantía" value={detailInstr.garantia || detailInstr.garantiaUrl} />
                    <DocField label="Registro INVIMA" value={detailInstr.registroInvimaDoc || detailInstr.registroInvimaUrl} />
                    <DocField label="Código" value={detailInstr.codigoDoc || detailInstr.codigoUrl} />
                    <DocField label="Código" value={detailInstr.codigoDoc2 || detailInstr.documentoAdicional} />
                  </div>
                </div>
              </div>

              {/* ══ BLOQUE 2: Datos básicos del instrumento ══ */}
              <div>
                <SectionTitle title="Datos básicos del Instrumento" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
                  <HVField label="Nombre" value={detailInstr.nombre} />
                  <HVField label="Especialidad"          value={detailInstr.especialidad?.nombre || detailInstr.especialidadNombre} hasChevron />
                  <HVField label="Subespecialidad"       value={detailInstr.subespecialidad?.nombre || detailInstr.subespecialidadNombre} hasChevron />
                  <HVField label="Tipo de subespecialidad" value={detailInstr.tipoSubespecialidad?.nombre || detailInstr.tipo?.nombre || detailInstr.tipoNombre} hasChevron />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 12 }}>
                  <HVField label="Fabricante"           value={detailInstr.fabricante} />
                  <HVField label="No. de serie"         value={detailInstr.numeroSerie} />
                  <HVField label="No. registro INVIMA"  value={detailInstr.registroInvima || detailInstr.noRegistroInvima} />
                  <HVField label="Proveedor / Distribuidor" value={detailInstr.proveedor?.nombre || detailInstr.proveedorNombre} hasChevron />
                  <HVField label="País origen"          value={detailInstr.paisOrigen || detailInstr.pais} hasChevron />
                </div>
              </div>

              {/* ══ BLOQUE 3: Características técnicas ══ */}
              <div>
                <SectionTitle title="Características técnicas" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto 1fr', gap: 12, alignItems: 'end' }}>
                  <HVField label="Material del instrumento"   value={detailInstr.material} hasChevron />
                  <HVField label="Esterilización compatible"  value={detailInstr.esterilizacion || detailInstr.tipoEsterilizacion} hasChevron />
                  <ReadToggle
                    value={!!(detailInstr.compatibleOtrosEquipos || detailInstr.compatibleOtros)}
                    label="Compatible con otros equipos"
                  />
                  <HVField label="¿Cuál?" value={detailInstr.cual || detailInstr.equipoCompatible} />
                </div>
              </div>

              {/* ══ BLOQUE 4: Mantenimiento y calibración ══ */}
              <div>
                <SectionTitle title="Mantenimiento y calibración" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 12 }}>
                  <HVField label="Frecuencia preventivo"    value={detailInstr.frecuenciaPreventivo || detailInstr.frecuencia} hasChevron />
                  <HVField label="Fecha de mantenimiento"   value={detailInstr.fechaMantenimiento || detailInstr.fechaMant} icon={<Calendar size={14} />} />
                  <HVField label="Observaciones del técnico" value={detailInstr.observacionesTecnico || detailInstr.observaciones} />
                </div>
              </div>

              {/* ══ BLOQUE 5: Uso y trazabilidad ══ */}
              <div>
                <SectionTitle title="Uso y trazabilidad" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
                  <HVField label="Área / Servicio asignado" value={detailInstr.areaServicio || detailInstr.area} hasChevron />
                  <HVField label="Estado actual"            value={detailInstr.estadoActual || detailInstr.estado} hasChevron />
                  <HVField label="Ciclo de esterilización"  value={String(detailInstr.cicloEsterilizacion ?? detailInstr.ciclo ?? '')} />
                  <HVField label="Propietario"              value={detailInstr.propietario?.nombre || detailInstr.propietarioNombre} hasChevron />
                </div>
                <HVField label="Notas y observaciones" value={detailInstr.notas || detailInstr.notasObservaciones || detailInstr.descripcion} />
              </div>

              {/* ══ BOTÓN CANCELAR ══ */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setIsDetailOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#64748b', padding: '6px 4px', transition: 'color .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default KitScreen;