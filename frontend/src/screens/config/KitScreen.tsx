import React, { useState, useEffect, useRef } from 'react';
import {
  Search, PlusCircle, ChevronDown, ChevronLeft, ChevronRight,
  ArrowLeftCircle, Eye, Ban, Edit,
  CheckCircle, X, Info, Calendar, ChevronsLeft, ChevronsRight
} from 'lucide-react';

/* ════════════════════════════════════════════════════════
   ESTILOS GLOBALES
   ════════════════════════════════════════════════════════ */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { font-family: 'Inter', sans-serif; box-sizing: border-box; }

  /* Select simple de Estado (pill sin label) */
  .k-pill {
    height: 40px; border-radius: 999px;
    border: 1.5px solid #d1d5db; background: #fff;
    padding: 0 36px 0 18px; font-size: 13px; color: #374151;
    outline: none; appearance: none; cursor: pointer;
    transition: border-color .2s;
  }
  .k-pill:focus    { border-color: #38bdf8; }
  .k-pill:disabled { background: #f8fafc; color: #9ca3af; cursor: not-allowed; }

  /* Input búsqueda */
  .k-search {
    width: 100%; height: 40px; border-radius: 999px;
    border: 1.5px solid #d1d5db; background: #fff;
    padding: 0 40px 0 18px; font-size: 13px; color: #374151;
    outline: none; transition: border-color .2s;
  }
  .k-search:focus       { border-color: #38bdf8; }
  .k-search::placeholder { color: #9ca3af; }

  /* Scrollbar oculto */
  .ns::-webkit-scrollbar { display: none; }
  .ns { -ms-overflow-style: none; scrollbar-width: none; }
`;

/* ── Estilos fijos de tabla ── */
const TH: React.CSSProperties = { padding: '12px 16px', fontSize: 12.5, fontWeight: 700, color: '#6b7280', whiteSpace: 'nowrap', textAlign: 'left' };
const TD: React.CSSProperties = { padding: '11px 16px', fontSize: 13, color: '#374151', fontWeight: 500, whiteSpace: 'nowrap' };

/* ════════════════════════════════════════════════════════
   SUB-COMPONENTES
   ════════════════════════════════════════════════════════ */

/* ── Círculo de letra ── */
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

/* ── Grupo de círculos ── */
const CodeGroup: React.FC<{ chars: string[]; label: string }> = ({ chars, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
    <div style={{ display: 'flex', gap: 5 }}>
      {chars.map((c, i) => <Circle key={i} char={c} />)}
    </div>
    <span style={{ fontSize: 10, color: '#9ca3af', whiteSpace: 'nowrap' }}>{label}</span>
  </div>
);

/* ── Select con notch label flotante ── */
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
        <option value="">Seleccionar...</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <label style={{
        position: 'absolute', left: 16, top: 0,
        transform: 'translateY(-50%)',
        fontSize: 10.5, fontWeight: 600, pointerEvents: 'none',
        color: foc ? '#38bdf8' : required ? '#ef4444' : '#6b7280',
        background: bg, padding: '0 4px', whiteSpace: 'nowrap',
      }}>
        {label}{required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af' }} />
    </div>
  );
};

/* ── Input read-only con notch label ── */
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

/* ════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ════════════════════════════════════════════════════════ */
const KitScreen: React.FC = () => {
  const [view, setView]                 = useState<'list' | 'create' | 'edit' | 'details'>('list');
  const [alertOpen, setAlertOpen]       = useState(false);
  const [alertType, setAlertType]       = useState<'duplicate' | 'cancel' | 'error' | 'success'>('duplicate');
  const [alertMsg, setAlertMsg]         = useState('');
  const [statusAlert, setStatusAlert]   = useState(false);
  const [itemToggle, setItemToggle]     = useState<any>(null);
  const [selectedKit, setSelectedKit]   = useState<any>(null);
  const [menuIdx, setMenuIdx]           = useState<number | null>(null);
  const menuRef                         = useRef<HTMLDivElement>(null);

  /* ── Datos ── */
  const [kitsData, setKitsData]         = useState<any[]>([]);
  const [especialidades, setEsps]       = useState<any[]>([]);
  const [subs, setSubs]                 = useState<any[]>([]);
  const [tipos, setTipos]               = useState<any[]>([]);
  const [instrBase, setInstrBase]       = useState<any[]>([]);
  const [available, setAvailable]       = useState<any[]>([]);
  const [added, setAdded]               = useState<any[]>([]);

  /* ── Paginación ── */
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [totalRec, setTotalRec]         = useState(0);

  /* ── Filtros lista ── */
  const [search, setSearch]             = useState('');
  const [estFilter, setEstFilter]       = useState('');
  const [listEsp, setListEsp]           = useState('');
  const [listSub, setListSub]           = useState('');

  /* ── Filtros panel derecho ── */
  const [iSearch, setISearch]           = useState('');
  const [iTipo, setITipo]               = useState('');

  const initForm = { especialidadId: '', subespecialidadId: '', tipoSubespecialidadId: '', numeroKit: '', codKit: '' };
  const [form, setForm]                 = useState<any>(initForm);

  const today = new Date().toISOString().split('T')[0];

  /* ── Effects ── */
  useEffect(() => { fetchEsps(); fetchInstr(); }, []);
  useEffect(() => { fetchKits(); }, [search, estFilter, listEsp, listSub, page]);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuIdx(null); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  /* ── Fetch Kits ── */
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
      const espNom = especialidades.find(e => String(e.id) === String(form.especialidadId))?.nombre || 'XX';
      const subNom = subs.find(s => String(s.id) === String(form.subespecialidadId))?.nombre || 'XX';
      const esp = espNom.substring(0, 2).toUpperCase();
      const sub = subNom.substring(0, 2).toUpperCase();
      const num = Math.floor(Math.random() * 99).toString().padStart(2, '0');
      setForm((p: any) => ({ ...p, numeroKit: num, codKit: `${esp}${sub}${value}${num}` }));
      const filtrados = instrBase.filter(i =>
        String(i.especialidadId) === String(form.especialidadId) &&
        String(i.subespecialidadId) === String(form.subespecialidadId)
      );
      setAvailable(filtrados);
      setAdded([]);
    }
  };

  const handleAdd = (item: any) => {
    if (added.some(a => a.id === item.id)) {
      showAlert('duplicate', 'Este instrumento ya se encuentra agregado.'); return;
    }
    setAdded([...added, item]);
    setAvailable(available.filter(i => i.id !== item.id));
  };

  const handleRemove = (item: any) => {
    setAvailable([...available, item]);
    setAdded(added.filter(i => i.id !== item.id));
  };

  const showAlert = (type: typeof alertType, msg: string) => { setAlertType(type); setAlertMsg(msg); setAlertOpen(true); };

  const handleSave = async () => {
    if (view === 'create' && (!form.especialidadId || !form.subespecialidadId || !form.tipoSubespecialidadId || added.length === 0)) {
      showAlert('error', 'Es necesario el diligenciamiento de todos los campos obligatorios y la adición de al menos un instrumento al kit.'); return;
    }
    if (view === 'edit' && added.length === 0) {
      showAlert('error', 'No es posible guardar los cambios. Verifique los instrumentos asociados.'); return;
    }
    try {
      const res = await fetch(
        view === 'create' ? 'http://localhost:4000/api/kits' : `http://localhost:4000/api/kits/${selectedKit.id}`,
        { method: view === 'create' ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, instrumentosIds: added.map(i => i.id) }) }
      );
      if (!res.ok) throw new Error();
      showAlert('success', view === 'create' ? 'Se ha creado exitosamente.' : 'Se ha actualizado exitosamente.');
    } catch { showAlert('error', 'Ocurrió un error al procesar la solicitud.'); }
  };

  const confirmToggle = async () => {
    if (!itemToggle) return;
    try {
      await fetch(`http://localhost:4000/api/kits/${itemToggle.id}/estado`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: itemToggle.estado === 'Habilitado' ? 'Deshabilitado' : 'Habilitado' })
      });
      setStatusAlert(false); fetchKits();
    } catch { }
  };

  const handleCancel = () => {
    if (view === 'details') { setView('list'); return; }
    showAlert('cancel', view === 'create'
      ? 'La información diligenciada no se guardará en el sistema.'
      : 'Los cambios realizados no se guardarán en el sistema.');
  };

  const openView = async (type: 'create' | 'edit' | 'details', kit: any = null) => {
    setSelectedKit(kit); setMenuIdx(null); setAdded([]); setISearch(''); setITipo('');
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

  /* ── Letras del código kit ── */
  const cod    = form?.codKit || '';
  const espLet = cod.length >= 2 ? [cod[0], cod[1]] : ['–', '–'];
  const subLet = cod.length >= 4 ? [cod[2], cod[3]] : ['–', '–'];
  const tipNom = tipos?.find(t => String(t.id) === String(form.tipoSubespecialidadId))?.nombre || '';
  const tipLet = tipNom.length >= 2 ? [tipNom[0].toUpperCase(), tipNom[1].toUpperCase()] : ['–', '–'];
  const kitNum = form?.numeroKit || '';
  const kitLet = kitNum.length >= 2 ? [kitNum[0], kitNum[1]] : kitNum.length === 1 ? [kitNum[0], '–'] : ['–', '–'];

  /* ── Instrumentos filtrados panel derecho ── */
  const tiposDisp = [...new Set(available.map((i: any) => i.tipo?.nombre || i.material).filter(Boolean))];
  const instrFilt = available.filter((i: any) =>
    (!iSearch || i.nombre?.toLowerCase().includes(iSearch.toLowerCase()) || i.codigo?.toLowerCase().includes(iSearch.toLowerCase())) &&
    (!iTipo   || i.tipo?.nombre === iTipo || i.material === iTipo)
  );

  /* ── Modal genérico ── */
  const Overlay: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
        onClick={alertType === 'cancel' ? () => setAlertOpen(false) : undefined} />
      <div style={{ position: 'relative', background: '#fff', width: '100%', maxWidth: 400, borderRadius: 28, padding: '36px 32px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        {children}
      </div>
    </div>
  );

  /* ── Botón de menú contextual ── */
  const MBtn = ({ onClick, color = '#374151', icon, label }: any) => (
    <button onClick={onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12.5, color, fontWeight: 600 }}
      onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
      onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
      {icon}{label}
    </button>
  );

  /* ════════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{G}</style>
      <div className="ns" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        onClick={() => setMenuIdx(null)}>

        {/* ══════════ VISTA LISTA ══════════ */}
        {view === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 18 }}>

            {/* Título — mismo estilo que "Hoja de vida" */}
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#0ea5e9', margin: 0 }}>Kit</h1>

            {/* Barra de filtros — igual al Figma */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>

              {/* Estado: pill simple sin notch label */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <select value={estFilter} onChange={e => { setEstFilter(e.target.value); setPage(1); }} className="k-pill" style={{ minWidth: 130 }}>
                  <option value="">Estado</option>
                  <option value="Habilitado">Habilitado</option>
                  <option value="Deshabilitado">Deshabilitado</option>
                </select>
                <ChevronDown size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af' }} />
              </div>

              {/* Especialidad: con notch label */}
              <NotchSel
                label="Especialidad"
                value={listEsp}
                onChange={v => { setListEsp(v); setListSub(''); setPage(1); }}
                options={especialidades.map(e => ({ value: e.id, label: e.nombre }))}
                width={210}
              />

              {/* Subespecialidad: con notch label */}
              <NotchSel
                label="Subespecialidad"
                value={listSub}
                onChange={v => { setListSub(v); setPage(1); }}
                options={subs.map(s => ({ value: s.id, label: s.nombre }))}
                disabled={!listEsp}
                width={220}
              />

              {/* Buscador */}
              <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
                <input
                  type="text" placeholder="Buscar por numero"
                  value={search}
                  onChange={e => { setSearch(e.target.value.replace(/[^a-zA-Z0-9]/g, '')); setPage(1); }}
                  className="k-search"
                />
                <Search size={16} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#38bdf8', pointerEvents: 'none' }} />
              </div>

              {/* Crear kit */}
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
                      <tr key={row.id}
                        style={{ borderBottom: '1px solid #f9fafb', transition: 'background .12s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                        <td style={{ ...TD, color: '#9ca3af' }}>{row.id}</td>
                        <td style={TD}>{row.especialidad?.nombre || 'N/A'}</td>
                        <td style={TD}>{row.subespecialidad?.nombre || 'N/A'}</td>
                        <td style={TD}>{row.tipo?.nombre || row.tipoSubespecialidad || 'N/A'}</td>
                        <td style={TD}>{row.numeroKit || row.numero || '00'}</td>
                        <td style={TD}>{row.instrumentos?.length ?? 0}</td>
                        <td style={{ ...TD, fontWeight: 700, color: '#0369a1' }}>{row.codigoKit || row.codigo}</td>
                        <td style={{ ...TD, textAlign: 'right' }}>
                          <span style={{
                            padding: '4px 14px', borderRadius: 999, fontSize: 11.5, fontWeight: 700,
                            ...(row.estado === 'Habilitado'
                              ? { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }
                              : { background: '#fff1f2', color: '#ef4444', border: '1px solid #fecaca' })
                          }}>{row.estado}</span>
                        </td>
                        {/* Menú de acción */}
                        <td style={{ padding: '11px 12px', textAlign: 'right', position: 'relative' }} onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => setMenuIdx(menuIdx === i ? null : i)}
                            style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', transition: 'all .15s' }}
                            onMouseEnter={e => { (e.currentTarget as any).style.borderColor = '#38bdf8'; (e.currentTarget as any).style.color = '#38bdf8'; }}
                            onMouseLeave={e => { (e.currentTarget as any).style.borderColor = '#e5e7eb'; (e.currentTarget as any).style.color = '#9ca3af'; }}>
                            <Info size={13} />
                          </button>
                          {menuIdx === i && (
                            <div ref={menuRef} style={{ position: 'absolute', right: 40, top: 6, width: 170, background: '#fff', borderRadius: 14, boxShadow: '0 8px 28px rgba(0,0,0,0.12)', border: '1px solid #f3f4f6', zIndex: 9999, paddingTop: 4, paddingBottom: 4, overflow: 'hidden' }}>
                              <MBtn icon={<Eye size={13} />} label="Ver detalle" onClick={() => openView('details', row)} />
                              {row.estado === 'Habilitado' && <MBtn icon={<Edit size={13} />} label="Editar" onClick={() => openView('edit', row)} />}
                              <div style={{ height: 1, background: '#f3f4f6', margin: '3px 12px' }} />
                              <MBtn
                                icon={row.estado === 'Habilitado' ? <Ban size={13} /> : <CheckCircle size={13} />}
                                label={row.estado === 'Habilitado' ? 'Deshabilitar' : 'Habilitar'}
                                color={row.estado === 'Habilitado' ? '#ef4444' : '#16a34a'}
                                onClick={() => { setItemToggle(row); setStatusAlert(true); setMenuIdx(null); }}
                              />
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>Mostrando {kitsData.length} de {totalRec} registros</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0ea5e9', fontWeight: 600 }}>
                  <button onClick={() => setPage(1)} disabled={page === 1} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: page === 1 ? 0.35 : 1 }}><ChevronsLeft size={16} /></button>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: page === 1 ? 0.35 : 1 }}><ChevronLeft size={16} /></button>
                  <span style={{ background: '#f0f9ff', padding: '3px 14px', borderRadius: 8, fontSize: 12, color: '#0369a1', fontWeight: 700 }}>Pág. {page} de {totalPages || 1}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: page >= totalPages ? 0.35 : 1 }}><ChevronRight size={16} /></button>
                  <button onClick={() => setPage(totalPages)} disabled={page >= totalPages} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: page >= totalPages ? 0.35 : 1 }}><ChevronsLeft size={16} style={{ transform: 'scaleX(-1)' }} /></button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ CREAR / EDITAR / DETALLE ══════════ */}
        {view !== 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 14, minHeight: 0 }}>

            {/* Encabezado con flecha + título */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <button onClick={handleCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0ea5e9', display: 'flex', alignItems: 'center', padding: 0 }}>
                <ChevronLeft size={30} strokeWidth={2.5} />
              </button>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0ea5e9', margin: 0 }}>
                {view === 'create' ? 'Crear Kit' : view === 'edit' ? 'Editar Kit' : 'Detalles del Kit'}
              </h1>
            </div>

            {/* ── Bloque Código Kit ── */}
            <div style={{
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              border: '1px solid #bae6fd', borderRadius: 18,
              padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap', flexShrink: 0,
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0369a1', flexShrink: 0 }}>Código Kit</span>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <CodeGroup chars={espLet} label="(Especialidad)" />
                <CodeGroup chars={subLet} label="(Subespecialidad)" />
                <CodeGroup chars={tipLet} label="(Tipo Subespecialidad)" />
                <CodeGroup chars={kitLet} label="(Kit)" />
              </div>
            </div>

            {/* ── UNA SOLA FILA: todos los controles ── */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', flexShrink: 0 }}>

              {/* Especialidad* */}
              <NotchSel
                label="Especialidad" required={view === 'create'}
                value={form.especialidadId}
                onChange={v => onFormChange('especialidadId', v)}
                options={especialidades.map(e => ({ value: e.id, label: e.nombre }))}
                disabled={view !== 'create'}
                width={162} height={44}
              />

              {/* Sub-especialidad* */}
              <NotchSel
                label="Sub-especialidad" required={view === 'create'}
                value={form.subespecialidadId}
                onChange={v => onFormChange('subespecialidadId', v)}
                options={subs.map(s => ({ value: s.id, label: s.nombre }))}
                disabled={view !== 'create' || !form.especialidadId}
                width={188} height={44}
              />

              {/* T. Sub-especialidad */}
              <NotchSel
                label="T. Sub-especialidad" required={view === 'create'}
                value={form.tipoSubespecialidadId}
                onChange={v => onFormChange('tipoSubespecialidadId', v)}
                options={tipos.map(t => ({ value: t.id, label: t.nombre }))}
                disabled={view !== 'create' || !form.subespecialidadId}
                width={178} height={44}
              />

              {/* No. Kit — caja pequeña */}
              <NotchInput label="No. Kit" value={form.numeroKit || ''} width={74} center />

              {/* Fecha Creación */}
              <NotchInput
                label="Creación"
                value={view === 'create' ? today : (selectedKit?.createdAt?.split('T')[0] || today)}
                width={148}
                icon={<Calendar size={14} />}
              />

              {/* Tipo de instrumento — visible solo en crear/editar */}
              {view !== 'details' && (
                <NotchSel
                  label="Tipo de instrumento"
                  value={iTipo}
                  onChange={setITipo}
                  options={tiposDisp.map(t => ({ value: t, label: t }))}
                  width={190} height={44}
                />
              )}

              {/* Buscar por nombre */}
              {view !== 'details' && (
                <div style={{ position: 'relative', flex: 1, minWidth: 160 }}>
                  <input
                    type="text" placeholder="Buscar por nombre"
                    value={iSearch} onChange={e => setISearch(e.target.value)}
                    style={{
                      width: '100%', height: 44, borderRadius: 999,
                      border: '1.5px solid #d1d5db', background: '#fff',
                      padding: '0 40px 0 18px', fontSize: 13, color: '#374151',
                      outline: 'none', fontFamily: 'Inter, sans-serif',
                    }}
                  />
                  <Search size={15} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#38bdf8', pointerEvents: 'none' }} />
                </div>
              )}
            </div>

            {/* ── Dos paneles 50/50 ── */}
            <div style={{ display: 'flex', gap: 14, flex: 1, minHeight: 0 }}>

              {/* Panel izquierdo — "Añadir al Kit" */}
              <div style={{ flex: 1, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0, minWidth: 0, boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                <div style={{ background: 'linear-gradient(90deg, #dbeafe 0%, #bae6fd 100%)', padding: '11px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #bfdbfe', flexShrink: 0 }}>
                  <span style={{ fontWeight: 700, color: '#1e40af', fontSize: 13 }}>
                    {view === 'details' ? 'Instrumentos del Kit' : 'Añadir al Kit'}
                  </span>
                  <span style={{ background: '#fff', borderRadius: 999, padding: '2px 12px', fontSize: 11, color: '#6b7280', border: '1px solid #e5e7eb', fontWeight: 600 }}>
                    {added.length} items
                  </span>
                </div>
                <div style={{ overflowY: 'auto', flex: 1 }} className="ns">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #f3f4f6', background: '#f8fafc' }}>
                        {view !== 'details' && <th style={{ ...TH, width: 46 }}></th>}
                        <th style={TH}>Código</th>
                        <th style={TH}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            C. Instrumento <ChevronRight size={11} style={{ transform: 'rotate(90deg)', color: '#9ca3af' }} />
                          </span>
                        </th>
                        <th style={TH}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            Nombre <ChevronRight size={11} style={{ transform: 'rotate(90deg)', color: '#9ca3af' }} />
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {added.length === 0 ? (
                        <tr><td colSpan={view !== 'details' ? 4 : 3} style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af', fontSize: 13 }}>Sin instrumentos agregados</td></tr>
                      ) : added.map((item, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                          onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                          {view !== 'details' && (
                            <td style={{ padding: '8px 8px 8px 12px' }}>
                              {/* botón → mover al panel derecho */}
                              <button onClick={() => handleRemove(item)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', transition: 'all .15s' }}
                                onMouseEnter={e => { (e.currentTarget as any).style.background = '#fef2f2'; (e.currentTarget as any).style.color = '#ef4444'; (e.currentTarget as any).style.borderColor = '#fecaca'; }}
                                onMouseLeave={e => { (e.currentTarget as any).style.background = '#fff'; (e.currentTarget as any).style.color = '#9ca3af'; (e.currentTarget as any).style.borderColor = '#e5e7eb'; }}>
                                <ChevronRight size={14} />
                              </button>
                            </td>
                          )}
                          <td style={{ ...TD, color: '#0369a1', fontWeight: 700 }}>{item.codigo}</td>
                          <td style={TD}>{item.numeroSerie || 'N/A'}</td>
                          <td style={TD}>{item.nombre}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Panel derecho — "Instrumentos filtrados" (solo crear/editar) */}
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
                          <th style={TH}>Código</th>
                          <th style={TH}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              C. Instrumento <ChevronRight size={11} style={{ transform: 'rotate(90deg)', color: '#9ca3af' }} />
                            </span>
                          </th>
                          <th style={TH}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              Nombre <ChevronRight size={11} style={{ transform: 'rotate(90deg)', color: '#9ca3af' }} />
                            </span>
                          </th>
                          <th style={{ ...TH, width: 40 }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {instrFilt.length === 0 ? (
                          <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af', fontSize: 13 }}>No hay instrumentos disponibles</td></tr>
                        ) : instrFilt.map((item: any, i: number) => (
                          <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                            {/* botón ← agregar al kit */}
                            <td style={{ padding: '8px 8px 8px 12px' }}>
                              <button onClick={() => handleAdd(item)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', transition: 'all .15s' }}
                                onMouseEnter={e => { (e.currentTarget as any).style.background = '#eff6ff'; (e.currentTarget as any).style.color = '#3b82f6'; (e.currentTarget as any).style.borderColor = '#bfdbfe'; }}
                                onMouseLeave={e => { (e.currentTarget as any).style.background = '#fff'; (e.currentTarget as any).style.color = '#9ca3af'; (e.currentTarget as any).style.borderColor = '#e5e7eb'; }}>
                                <ArrowLeftCircle size={15} strokeWidth={1.5} />
                              </button>
                            </td>
                            <td style={{ ...TD, color: '#0369a1', fontWeight: 700 }}>{item.codigo}</td>
                            <td style={TD}>{item.numeroSerie || 'N/A'}</td>
                            <td style={TD}>{item.nombre}</td>
                            {/* lupa al final de cada fila */}
                            <td style={{ padding: '8px 12px 8px 4px', textAlign: 'right' }}>
                              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: 0, display: 'flex', alignItems: 'center', transition: 'color .15s' }}
                                onMouseEnter={e => ((e.currentTarget as any).style.color = '#38bdf8')}
                                onMouseLeave={e => ((e.currentTarget as any).style.color = '#cbd5e1')}>
                                <Search size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Botones Cancelar / Guardar en la parte baja del panel derecho */}
                  <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', gap: 12, background: '#fafafa', flexShrink: 0 }}>
                    <button onClick={handleCancel} style={{ padding: '9px 22px', borderRadius: 999, border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13, color: '#6b7280' }}>
                      Cancelar
                    </button>
                    <button onClick={handleSave} style={{ padding: '9px 28px', borderRadius: 999, border: 'none', cursor: 'pointer', background: 'linear-gradient(90deg, #3b82f6 0%, #34d399 100%)', color: '#fff', fontWeight: 700, fontSize: 13, boxShadow: '0 4px 14px rgba(59,130,246,0.28)' }}>
                      {view === 'edit' ? 'Actualizar Kit' : 'Guardar Kit'}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-start', paddingTop: 4 }}>
                  <button onClick={() => setView('list')} style={{ padding: '9px 26px', borderRadius: 999, border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13, color: '#6b7280' }}>
                    Volver al listado
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ MODAL ALERTA ══ */}
        {alertOpen && (
          <Overlay>
            <div style={{ width: 60, height: 60, borderRadius: '50%', margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: alertType === 'success' ? '#d1fae5' : alertType === 'error' ? '#fee2e2' : '#fef3c7', color: alertType === 'success' ? '#059669' : alertType === 'error' ? '#ef4444' : '#d97706' }}>
              {alertType === 'success' ? <CheckCircle size={30} /> : alertType === 'error' ? <X size={30} /> : <span style={{ fontSize: 26, fontWeight: 900 }}>!</span>}
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 8 }}>
              {alertType === 'duplicate' ? '¡Alerta!' : alertType === 'cancel' ? '¿Está seguro?' : alertType === 'error' ? 'Error' : 'Éxito'}
            </h3>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 28, lineHeight: 1.55 }}>{alertMsg}</p>
            {alertType === 'cancel' ? (
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setAlertOpen(false)} style={{ flex: 1, padding: '11px 0', borderRadius: 999, border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#6b7280' }}>Cancelar</button>
                <button onClick={() => { setAlertOpen(false); setView('list'); fetchKits(); }} style={{ flex: 1, padding: '11px 0', borderRadius: 999, border: 'none', background: '#3b82f6', cursor: 'pointer', fontWeight: 700, fontSize: 14, color: '#fff' }}>Aceptar</button>
              </div>
            ) : (
              <button
                onClick={() => { setAlertOpen(false); if (alertType === 'success') { setView('list'); fetchKits(); } }}
                style={{ width: '100%', padding: '11px 0', borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14, color: '#fff', background: alertType === 'error' ? '#ef4444' : alertType === 'success' ? '#10b981' : '#3b82f6' }}>
                Aceptar
              </button>
            )}
          </Overlay>
        )}

        {/* ══ MODAL CAMBIO DE ESTADO ══ */}
        {statusAlert && itemToggle && (
          <Overlay>
            <div style={{ width: 60, height: 60, borderRadius: '50%', margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fef3c7', color: '#d97706', fontSize: 26, fontWeight: 900 }}>!</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 8 }}>¿Está seguro?</h3>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 28, lineHeight: 1.55 }}>
              Se <b>{itemToggle.estado === 'Habilitado' ? 'deshabilitará' : 'habilitará'}</b> el kit:<br />
              <span style={{ fontWeight: 700, color: '#374151' }}>{itemToggle.codigoKit || itemToggle.codigo}</span>
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStatusAlert(false)} style={{ flex: 1, padding: '11px 0', borderRadius: 999, border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#6b7280' }}>Cancelar</button>
              <button onClick={confirmToggle} style={{ flex: 1, padding: '11px 0', borderRadius: 999, border: 'none', background: '#3b82f6', cursor: 'pointer', fontWeight: 700, fontSize: 14, color: '#fff' }}>Confirmar</button>
            </div>
          </Overlay>
        )}

      </div>
    </>
  );
};

export default KitScreen;