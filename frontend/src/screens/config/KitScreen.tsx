import React, { useState, useEffect, useRef } from 'react';
import {
  Search, PlusCircle, ChevronDown, ChevronLeft, ChevronRight,
  ArrowLeftCircle, ArrowRightCircle, Eye, Ban, Edit,
  CheckCircle, X, Info, Calendar
} from 'lucide-react';

/* ══════════════════════════════════════════════════════════
   ESTILOS GLOBALES — fiel al Figma
   ══════════════════════════════════════════════════════════ */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { font-family: 'Inter', sans-serif; box-sizing: border-box; }

  .kp {
    height: 40px; border-radius: 999px;
    border: 1.5px solid #d1d5db; background: #fff;
    padding: 0 36px 0 18px; font-size: 13px; color: #374151;
    outline: none; appearance: none; cursor: pointer;
    transition: border-color .2s; font-family: 'Inter', sans-serif;
  }
  .kp:focus   { border-color: #06b6d4; }
  .kp:disabled{ background:#f8fafc; color:#9ca3af; cursor:not-allowed; }

  .kfs {
    width:100%; height:42px; border-radius:999px;
    border:1.5px solid #d1d5db; background:#fff;
    padding:0 36px 0 16px; font-size:13px; color:#374151;
    outline:none; appearance:none; cursor:pointer;
    transition:border-color .2s; font-family:'Inter',sans-serif;
  }
  .kfs:focus   { border-color:#06b6d4; }
  .kfs:disabled{ background:#f8fafc; color:#9ca3af; cursor:not-allowed; }

  .ks {
    width:100%; height:40px; border-radius:999px;
    border:1.5px solid #d1d5db; background:#fff;
    padding:0 40px 0 18px; font-size:13px; color:#374151;
    outline:none; transition:border-color .2s; font-family:'Inter',sans-serif;
  }
  .ks:focus { border-color:#06b6d4; }
  .ks::placeholder { color:#9ca3af; }

  .noscroll::-webkit-scrollbar { display:none; }
  .noscroll { -ms-overflow-style:none; scrollbar-width:none; }
`;

const thS: React.CSSProperties = {
  padding:'12px 16px', fontSize:12.5, fontWeight:700, color:'#6b7280', whiteSpace:'nowrap', textAlign:'left'
};
const tdS: React.CSSProperties = {
  padding:'12px 16px', fontSize:13, color:'#374151', fontWeight:500, whiteSpace:'nowrap'
};

/* ── Círculo individual ── */
const LetterCircle: React.FC<{ char: string; active: boolean }> = ({ char, active }) => (
  <div style={{
    width:34, height:34, borderRadius:'50%', flexShrink:0,
    border:`1.5px solid ${active ? '#06b6d4' : '#e5e7eb'}`,
    background: active ? '#ecfeff' : '#f9fafb',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:13, fontWeight:700, color: active ? '#0891b2' : '#9ca3af',
  }}>{char}</div>
);

/* ── Grupo de círculos + label ── */
const CodeGroup: React.FC<{ chars: string[]; label: string }> = ({ chars, label }) => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
    <div style={{ display:'flex', gap:5 }}>
      {chars.map((c,i) => <LetterCircle key={i} char={c} active={c !== '–'} />)}
    </div>
    <span style={{ fontSize:10, color:'#9ca3af', whiteSpace:'nowrap' }}>{label}</span>
  </div>
);

/* ── Pill select con label flotante (formulario) ── */
interface FormPillProps {
  label: string; required?: boolean; value: string;
  onChange: (v:string) => void; options: {value:string|number; label:string}[];
  disabled?: boolean; width?: number|string;
}
const FormPill: React.FC<FormPillProps> = ({ label, required, value, onChange, options, disabled, width='auto' }) => (
  <div style={{ position:'relative', width, flexShrink:0 }}>
    <select value={value} onChange={e=>onChange(e.target.value)} disabled={disabled} className="kfs" style={{ width:'100%' }}>
      <option value="">Seleccionar</option>
      {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    <label style={{
      position:'absolute', left:16, top:0, transform:'translateY(-50%)',
      fontSize:10.5, fontWeight:600, pointerEvents:'none',
      color: required ? '#ef4444' : '#6b7280',
      background: disabled ? '#f8fafc' : '#fff', padding:'0 4px', whiteSpace:'nowrap',
    }}>
      {label}{required && '*'}
    </label>
    <ChevronDown size={14} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'#9ca3af' }}/>
  </div>
);

/* ══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ══════════════════════════════════════════════════════════ */
const KitScreen: React.FC = () => {
  const [view, setView]                           = useState<'list'|'create'|'edit'|'details'>('list');
  const [isAlertOpen, setIsAlertOpen]             = useState(false);
  const [alertType, setAlertType]                 = useState<'duplicate'|'cancel'|'error'|'success'>('duplicate');
  const [alertMsg, setAlertMsg]                   = useState('');
  const [isStatusAlertOpen, setIsStatusAlertOpen] = useState(false);
  const [itemToToggle, setItemToToggle]           = useState<any>(null);
  const [selectedKit, setSelectedKit]             = useState<any>(null);
  const [openMenuIndex, setOpenMenuIndex]         = useState<number|null>(null);
  const menuRef                                   = useRef<HTMLDivElement>(null);

  const [kitsData, setKitsData]                   = useState<any[]>([]);
  const [especialidades, setEspecialidades]       = useState<any[]>([]);
  const [subespecialidades, setSubespecialidades] = useState<any[]>([]);
  const [tiposSub, setTiposSub]                   = useState<any[]>([]);
  const [instrumentosBase, setInstrumentosBase]   = useState<any[]>([]);
  const [availableInstruments, setAvailableInstruments] = useState<any[]>([]);
  const [addedItems, setAddedItems]               = useState<any[]>([]);

  const [searchTerm, setSearchTerm]   = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [listEsp, setListEsp]         = useState('');
  const [listSub, setListSub]         = useState('');
  const [instrSearch, setInstrSearch] = useState('');
  const [instrFecha, setInstrFecha]   = useState('');
  const [instrTipo, setInstrTipo]     = useState('');

  const initialForm = { especialidadId:'', subespecialidadId:'', tipoSubespecialidadId:'', numeroKit:'', codKit:'' };
  const [formData, setFormData] = useState<any>(initialForm);

  useEffect(() => { fetchKits(); fetchMaestras(); fetchInstrumentos(); }, [searchTerm, statusFilter, listEsp, listSub]);
  useEffect(() => {
    const fn = (e:MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuIndex(null); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const fetchKits = async () => {
    try {
      const q = new URLSearchParams({ search:searchTerm, estado:statusFilter });
      if (listEsp) q.append('especialidadId', listEsp);
      if (listSub) q.append('subespecialidadId', listSub);
      const res  = await fetch(`http://localhost:4000/api/kits?${q}`);
      setKitsData((await res.json()).data || []);
    } catch(e){ console.error(e); }
  };

  const fetchMaestras = async () => {
    try { setEspecialidades((await (await fetch('http://localhost:4000/api/especialidades?estado=true')).json()).data || []); } catch(e){}
  };

  const fetchInstrumentos = async () => {
    try { setInstrumentosBase((await (await fetch('http://localhost:4000/api/insumos-quirurgicos?estado=true')).json()).data || []); } catch(e){}
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLSelectElement|HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p:any) => ({ ...p, [name]: value }));
    if (name==='especialidadId') {
      try {
        setSubespecialidades((await (await fetch(`http://localhost:4000/api/subespecialidades?especialidadId=${value}`)).json()).data || []);
        setTiposSub([]);
        setFormData((p:any) => ({ ...p, subespecialidadId:'', tipoSubespecialidadId:'', codKit:'', numeroKit:'' }));
      } catch(e){}
    }
    if (name==='subespecialidadId') {
      try {
        setTiposSub((await (await fetch(`http://localhost:4000/api/tipos-subespecialidad?subespecialidadId=${value}`)).json()).data || []);
        setFormData((p:any) => ({ ...p, tipoSubespecialidadId:'', codKit:'', numeroKit:'' }));
      } catch(e){}
    }
    if (name==='tipoSubespecialidadId' && formData.especialidadId && formData.subespecialidadId) {
      const esp = especialidades.find(e=>e.id==formData.especialidadId)?.nombre.substring(0,2).toUpperCase() || 'XX';
      const sub = subespecialidades.find(s=>s.id==formData.subespecialidadId)?.nombre.substring(0,2).toUpperCase() || 'XX';
      const num = Math.floor(Math.random()*99).toString().padStart(2,'0');
      setFormData((p:any) => ({ ...p, numeroKit:num, codKit:`${esp}${sub}${value}${num}` }));
      setAvailableInstruments(instrumentosBase);
    }
  };

  const handleAddItem    = (item:any) => {
    if (addedItems.some(a=>a.id===item.id)) { setAlertMsg('Este instrumento ya se encuentra agregado'); setAlertType('duplicate'); setIsAlertOpen(true); return; }
    setAddedItems([...addedItems, item]); setAvailableInstruments(availableInstruments.filter(i=>i.id!==item.id));
  };
  const handleRemoveItem = (item:any) => { setAvailableInstruments([...availableInstruments, item]); setAddedItems(addedItems.filter(i=>i.id!==item.id)); };

  const handleSave = async () => {
    if (!formData.especialidadId||!formData.subespecialidadId||!formData.tipoSubespecialidadId||addedItems.length===0) {
      setAlertMsg('Es necesario el diligenciamiento de todos los campos obligatorios y la adición de al menos un instrumento al kit.'); setAlertType('error'); setIsAlertOpen(true); return;
    }
    try {
      const res = await fetch(view==='create'?'http://localhost:4000/api/kits':`http://localhost:4000/api/kits/${selectedKit.id}`, {
        method: view==='create'?'POST':'PUT', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ ...formData, instrumentosIds: addedItems.map(i=>i.id) })
      });
      if (!res.ok) throw new Error();
      setAlertMsg(view==='create'?'Se ha creado exitosamente.':'Se ha actualizado exitosamente.'); setAlertType('success'); setIsAlertOpen(true); fetchKits();
    } catch { setAlertMsg('Ocurrió un error al procesar la solicitud.'); setAlertType('error'); setIsAlertOpen(true); }
  };

  const confirmToggleStatus = async () => {
    if (!itemToToggle) return;
    try { await fetch(`http://localhost:4000/api/kits/${itemToToggle.id}/estado`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({estado:itemToToggle.estado==='Deshabilitado'})}); setIsStatusAlertOpen(false); fetchKits(); } catch(e){}
  };

  const handleCancelClick = () => {
    if (view==='details') setView('list');
    else { setAlertMsg('La información diligenciada no se guardará en el sistema.'); setAlertType('cancel'); setIsAlertOpen(true); }
  };

  const openView = async (type:'create'|'edit'|'details', kit:any=null) => {
    setSelectedKit(kit); setOpenMenuIndex(null); setAddedItems([]); setInstrSearch(''); setInstrFecha(''); setInstrTipo('');
    if (type==='create') { setFormData(initialForm); setSubespecialidades([]); setTiposSub([]); setAvailableInstruments(instrumentosBase); }
    else {
      setFormData({ especialidadId:kit.especialidadId, subespecialidadId:kit.subespecialidadId, tipoSubespecialidadId:kit.tipoSubespecialidad, numeroKit:kit.numeroKit, codKit:kit.codigoKit });
      try {
        setSubespecialidades((await (await fetch(`http://localhost:4000/api/subespecialidades?especialidadId=${kit.especialidadId}`)).json()).data||[]);
        setTiposSub((await (await fetch(`http://localhost:4000/api/tipos-subespecialidad?subespecialidadId=${kit.subespecialidadId}`)).json()).data||[]);
      } catch(e){}
      setAddedItems(kit.instrumentos||[]);
      setAvailableInstruments(instrumentosBase.filter(i=>!(kit.instrumentos||[]).some((a:any)=>a.id===i.id)));
    }
    setView(type);
  };

  /* Letras individuales del Código Kit */
  const cod    = formData.codKit || '';
  const espLet = cod.length>=2 ? [cod[0],cod[1]] : ['–','–'];
  const subLet = cod.length>=4 ? [cod[2],cod[3]] : ['–','–'];
  const tipNom = tiposSub.find(t=>String(t.id)===String(formData.tipoSubespecialidadId))?.nombre || '';
  const tipLet = tipNom.length>=2 ? [tipNom[0].toUpperCase(),tipNom[1].toUpperCase()] : tipNom.length===1 ? [tipNom[0].toUpperCase(),'–'] : ['–','–'];
  const kitNum = formData.numeroKit || '';
  const kitLet = kitNum.length>=2 ? [kitNum[0],kitNum[1]] : kitNum.length===1 ? [kitNum[0],'–'] : ['–','–'];

  const filteredInstruments = availableInstruments.filter(i=>
    (!instrSearch || i.nombre?.toLowerCase().includes(instrSearch.toLowerCase()) || i.codigo?.toLowerCase().includes(instrSearch.toLowerCase())) &&
    (!instrTipo   || i.tipo===instrTipo)
  );

  const MenuBtn = ({ onClick, color='#374151', icon, label }: any) => (
    <button onClick={onClick} style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'10px 16px', border:'none', background:'none', cursor:'pointer', fontSize:12.5, color, fontWeight:600, textAlign:'left' }}
      onMouseEnter={e=>(e.currentTarget.style.background='#f9fafb')} onMouseLeave={e=>(e.currentTarget.style.background='none')}>
      {icon}{label}
    </button>
  );

  const Modal = ({ children }: { children: React.ReactNode }) => (
    <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.35)', backdropFilter:'blur(4px)' }}/>
      <div style={{ position:'relative', background:'#fff', width:'100%', maxWidth:400, borderRadius:28, padding:'36px 32px', textAlign:'center', boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}>
        {children}
      </div>
    </div>
  );

  /* ══ RENDER ══ */
  return (
    <>
      <style>{globalStyles}</style>
      <div className="noscroll" style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}
        onClick={()=>setOpenMenuIndex(null)}>

        {/* ══════════════ LISTA ══════════════ */}
        {view==='list' && (
          <div style={{ display:'flex', flexDirection:'column', height:'100%', gap:18 }}>

            <h1 style={{ fontSize:34, fontWeight:800, color:'#3b82f6', margin:0, fontStyle:'italic' }}>Kit</h1>

            {/* Barra filtros — sin card, flotante */}
            <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
              <div style={{ position:'relative', flexShrink:0 }}>
                <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="kp" style={{ minWidth:130 }}>
                  <option value="">Estado</option>
                  <option value="true">Habilitado</option>
                  <option value="false">Deshabilitado</option>
                </select>
                <ChevronDown size={15} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'#9ca3af' }}/>
              </div>

              <div style={{ position:'relative', flexShrink:0 }}>
                <select value={listEsp} onChange={e=>{ setListEsp(e.target.value); setListSub(''); }} className="kp" style={{ minWidth:190 }}>
                  <option value="">Especialidad</option>
                  {especialidades.map(e=><option key={e.id} value={e.id}>{e.nombre}</option>)}
                </select>
                <ChevronDown size={15} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'#9ca3af' }}/>
              </div>

              <div style={{ position:'relative', flexShrink:0 }}>
                <select value={listSub} onChange={e=>setListSub(e.target.value)} className="kp" style={{ minWidth:200 }} disabled={!listEsp}>
                  <option value="">Subespecialidad</option>
                  {subespecialidades.map(s=><option key={s.id} value={s.id}>{s.nombre}</option>)}
                </select>
                <ChevronDown size={15} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'#9ca3af' }}/>
              </div>

              <div style={{ position:'relative', flex:1, minWidth:180 }}>
                <input type="text" placeholder="Buscar por numero" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="ks"/>
                <Search size={16} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', color:'#06b6d4', pointerEvents:'none' }}/>
              </div>

              <button onClick={()=>openView('create')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:'#06b6d4', fontWeight:700, fontSize:14, whiteSpace:'nowrap', padding:'0 4px', flexShrink:0 }}>
                Crear kit <PlusCircle size={18} strokeWidth={2.2}/>
              </button>
            </div>

            {/* Tabla */}
            <div style={{ flex:1, background:'#fff', borderRadius:20, border:'1px solid #f1f5f9', boxShadow:'0 1px 8px rgba(0,0,0,0.05)', display:'flex', flexDirection:'column', overflow:'hidden', minHeight:0 }}>
              <div style={{ overflow:'auto', flex:1 }} className="noscroll">
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom:'1.5px solid #f3f4f6' }}>
                      <th style={thS}>Código</th>
                      <th style={thS}>Especialidad</th>
                      <th style={thS}>Subespecialidad</th>
                      <th style={thS}>Tipo de subespecialidad</th>
                      <th style={thS}>Numero</th>
                      <th style={thS}>Cantidad</th>
                      <th style={thS}>Código de Kit</th>
                      <th style={{ ...thS, textAlign:'right' }}>Estado</th>
                      <th style={{ ...thS, width:52 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {kitsData.length===0 ? (
                      <tr><td colSpan={9} style={{ textAlign:'center', padding:'48px 0', color:'#9ca3af', fontSize:14 }}>No se encontraron registros.</td></tr>
                    ) : kitsData.map((row, i) => (
                      <tr key={row.id} style={{ borderBottom:'1px solid #f9fafb', transition:'background .12s' }}
                        onMouseEnter={e=>(e.currentTarget.style.background='#f9fafb')}
                        onMouseLeave={e=>(e.currentTarget.style.background='#fff')}>
                        <td style={{ ...tdS, color:'#9ca3af' }}>{row.id}</td>
                        <td style={tdS}>{row.especialidad?.nombre||'N/A'}</td>
                        <td style={tdS}>{row.subespecialidad?.nombre||'N/A'}</td>
                        <td style={tdS}>{row.tipoSubespecialidad}</td>
                        <td style={tdS}>{row.numeroKit}</td>
                        <td style={tdS}>{row.cantidad??0}</td>
                        <td style={{ ...tdS, fontWeight:600 }}>{row.codigoKit}</td>
                        <td style={{ ...tdS, textAlign:'right' }}>
                          <span style={{
                            padding:'4px 14px', borderRadius:999, fontSize:11.5, fontWeight:700,
                            ...(row.estado==='Habilitado'
                              ? { background:'#f0fdf4', color:'#16a34a', border:'1px solid #bbf7d0' }
                              : { background:'#fff1f2', color:'#ef4444', border:'1px solid #fecaca' })
                          }}>{row.estado}</span>
                        </td>
                        <td style={{ padding:'12px 12px', textAlign:'right', position:'relative' }} onClick={e=>e.stopPropagation()}>
                          {/* ⓘ igual al Figma */}
                          <button onClick={()=>setOpenMenuIndex(openMenuIndex===i?null:i)} style={{ width:30, height:30, borderRadius:'50%', border:'1.5px solid #e5e7eb', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#9ca3af', transition:'all .15s' }}
                            onMouseEnter={e=>{(e.currentTarget as any).style.borderColor='#06b6d4';(e.currentTarget as any).style.color='#06b6d4';}}
                            onMouseLeave={e=>{(e.currentTarget as any).style.borderColor='#e5e7eb';(e.currentTarget as any).style.color='#9ca3af';}}>
                            <Info size={13}/>
                          </button>
                          {openMenuIndex===i && (
                            <div ref={menuRef} style={{ position:'absolute', right:40, top:6, width:174, background:'#fff', borderRadius:14, boxShadow:'0 8px 28px rgba(0,0,0,0.12)', border:'1px solid #f3f4f6', zIndex:9999, paddingTop:4, paddingBottom:4, overflow:'hidden' }}>
                              <MenuBtn icon={<Eye size={13}/>}  label="Ver detalle" onClick={()=>openView('details',row)}/>
                              <MenuBtn icon={<Edit size={13}/>} label="Editar"       onClick={()=>openView('edit',row)}/>
                              <div style={{ height:1, background:'#f3f4f6', margin:'3px 12px' }}/>
                              <MenuBtn icon={row.estado==='Habilitado'?<Ban size={13}/>:<CheckCircle size={13}/>}
                                label={row.estado==='Habilitado'?'Deshabilitar':'Habilitar'}
                                color={row.estado==='Habilitado'?'#ef4444':'#16a34a'}
                                onClick={()=>{ setItemToToggle(row); setIsStatusAlertOpen(true); setOpenMenuIndex(null); }}/>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ CREAR / EDITAR / DETALLE ══════════════ */}
        {view!=='list' && (
          <div style={{ display:'flex', flexDirection:'column', height:'100%', gap:16, minHeight:0 }}>

            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
              <button onClick={handleCancelClick} style={{ background:'none', border:'none', cursor:'pointer', color:'#3b82f6', display:'flex', alignItems:'center', padding:0 }}>
                <ChevronLeft size={30} strokeWidth={2.5}/>
              </button>
              <h1 style={{ fontSize:28, fontWeight:800, color:'#3b82f6', margin:0, fontStyle:'italic' }}>
                {view==='create'?'Crear Kit':view==='edit'?'Editar Kit':'Detalles del Kit'}
              </h1>
            </div>

            {/* Layout 50/50 */}
            <div style={{ display:'flex', gap:16, flex:1, minHeight:0 }}>

              {/* ── Columna izquierda ── */}
              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:14, minWidth:0 }}>

                {/* Código Kit — card degradado azul claro */}
                <div style={{ background:'linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%)', border:'1px solid #bae6fd', borderRadius:18, padding:'16px 24px', display:'flex', alignItems:'center', gap:32, flexWrap:'wrap', flexShrink:0 }}>
                  <span style={{ fontSize:14, fontWeight:700, color:'#0369a1', flexShrink:0 }}>Código Kit</span>
                  <div style={{ display:'flex', gap:22, flexWrap:'wrap', alignItems:'flex-start' }}>
                    <CodeGroup chars={espLet} label="(Especialidad)"/>
                    <CodeGroup chars={subLet} label="(Subespecialidad)"/>
                    <CodeGroup chars={tipLet} label="(Tipo Subespecialidad)"/>
                    <CodeGroup chars={kitLet} label="(Kit)"/>
                  </div>
                </div>

                {/* Fila selects — sin card */}
                <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', flexShrink:0 }}>
                  <FormPill label="Especialidad"       required value={formData.especialidadId}
                    onChange={v=>handleInputChange({target:{name:'especialidadId',value:v}} as any)}
                    options={especialidades.map(e=>({value:e.id,label:e.nombre}))}
                    disabled={view!=='create'} width={162}/>
                  <FormPill label="Sub-especialidad"   required value={formData.subespecialidadId}
                    onChange={v=>handleInputChange({target:{name:'subespecialidadId',value:v}} as any)}
                    options={subespecialidades.map(s=>({value:s.id,label:s.nombre}))}
                    disabled={view!=='create'||!formData.especialidadId} width={188}/>
                  <FormPill label="T. Sub-especialidad" value={formData.tipoSubespecialidadId}
                    onChange={v=>handleInputChange({target:{name:'tipoSubespecialidadId',value:v}} as any)}
                    options={tiposSub.map(t=>({value:t.id,label:t.nombre}))}
                    disabled={view!=='create'||!formData.subespecialidadId} width={178}/>
                  {/* No. Kit — input pequeño circular */}
                  <div style={{ position:'relative', flexShrink:0, width:74 }}>
                    <input value={formData.numeroKit||''} readOnly disabled className="kfs" style={{ textAlign:'center', fontWeight:700, paddingLeft:0, paddingRight:0, width:'100%' }}/>
                    <label style={{ position:'absolute', left:'50%', top:0, transform:'translate(-50%,-50%)', fontSize:10, fontWeight:600, color:'#6b7280', background:'#f8fafc', padding:'0 4px', whiteSpace:'nowrap', pointerEvents:'none' }}>No. Kit</label>
                  </div>
                </div>

                {/* Panel "Añadir al Kit" */}
                <div style={{ flex:1, background:'#fff', border:'1px solid #e5e7eb', borderRadius:16, display:'flex', flexDirection:'column', overflow:'hidden', minHeight:0, boxShadow:'0 1px 6px rgba(0,0,0,0.04)' }}>
                  <div style={{ background:'linear-gradient(90deg,#dbeafe 0%,#bae6fd 100%)', padding:'11px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #bfdbfe', flexShrink:0 }}>
                    <span style={{ fontWeight:700, color:'#1e40af', fontSize:13 }}>Añadir al Kit</span>
                    <span style={{ background:'#fff', borderRadius:999, padding:'2px 12px', fontSize:11, color:'#6b7280', border:'1px solid #e5e7eb', fontWeight:600 }}>{addedItems.length} items</span>
                  </div>
                  <div style={{ overflowY:'auto', flex:1 }} className="noscroll">
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom:'1px solid #f3f4f6' }}>
                          {view!=='details' && <th style={{ ...thS, width:46 }}></th>}
                          <th style={thS}>Código</th>
                          <th style={thS}><span style={{ display:'flex', alignItems:'center', gap:3 }}>C. Instrumento <ChevronRight size={11} style={{ transform:'rotate(90deg)' }}/></span></th>
                          <th style={thS}><span style={{ display:'flex', alignItems:'center', gap:3 }}>Nombre <ChevronRight size={11} style={{ transform:'rotate(90deg)' }}/></span></th>
                        </tr>
                      </thead>
                      <tbody>
                        {addedItems.length===0 ? (
                          <tr><td colSpan={view!=='details'?4:3} style={{ textAlign:'center', padding:'36px 0', color:'#9ca3af', fontSize:13 }}>Sin instrumentos agregados</td></tr>
                        ) : addedItems.map((item,i)=>(
                          <tr key={i} style={{ borderBottom:'1px solid #f9fafb' }}
                            onMouseEnter={e=>(e.currentTarget.style.background='#f9fafb')}
                            onMouseLeave={e=>(e.currentTarget.style.background='#fff')}>
                            {view!=='details' && (
                              <td style={{ padding:'9px 8px 9px 12px' }}>
                                <button onClick={()=>handleRemoveItem(item)} style={{ width:28, height:28, borderRadius:'50%', border:'1.5px solid #e5e7eb', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#9ca3af', transition:'all .15s' }}
                                  onMouseEnter={e=>{(e.currentTarget as any).style.background='#fef2f2';(e.currentTarget as any).style.color='#ef4444';(e.currentTarget as any).style.borderColor='#fecaca';}}
                                  onMouseLeave={e=>{(e.currentTarget as any).style.background='#fff';(e.currentTarget as any).style.color='#9ca3af';(e.currentTarget as any).style.borderColor='#e5e7eb';}}>
                                  <ArrowRightCircle size={15} strokeWidth={1.5}/>
                                </button>
                              </td>
                            )}
                            <td style={{ ...tdS, color:'#9ca3af' }}>{item.codigo}</td>
                            <td style={tdS}>{item.codigoInstrumento||item.codigo}</td>
                            <td style={tdS}>{item.nombre}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* ── Columna derecha: Instrumentos filtrados ── */}
              {view!=='details' ? (
                <div style={{ flex:1, background:'#fff', border:'1px solid #e5e7eb', borderRadius:16, display:'flex', flexDirection:'column', overflow:'hidden', minHeight:0, minWidth:0, boxShadow:'0 1px 6px rgba(0,0,0,0.04)' }}>

                  <div style={{ background:'linear-gradient(90deg,#bae6fd 0%,#dbeafe 100%)', padding:'11px 18px', borderBottom:'1px solid #bfdbfe', flexShrink:0 }}>
                    <span style={{ fontWeight:700, color:'#0369a1', fontSize:13 }}>Instrumentos filtrados</span>
                  </div>

                  {/* Filtros — Creación | Tipo de instrumento | Buscar */}
                  <div style={{ padding:'12px 14px', borderBottom:'1px solid #f3f4f6', display:'flex', gap:10, flexWrap:'wrap', alignItems:'center', flexShrink:0 }}>
                    <div style={{ position:'relative', flexShrink:0 }}>
                      <input type="date" value={instrFecha} onChange={e=>setInstrFecha(e.target.value)} className="kfs" style={{ width:155, paddingRight:32 }}/>
                      <label style={{ position:'absolute', left:14, top:0, transform:'translateY(-50%)', fontSize:10.5, fontWeight:600, color:'#6b7280', background:'#fff', padding:'0 4px', pointerEvents:'none' }}>Creación</label>
                      <Calendar size={13} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', pointerEvents:'none' }}/>
                    </div>
                    <div style={{ position:'relative', flex:1, minWidth:140 }}>
                      <select value={instrTipo} onChange={e=>setInstrTipo(e.target.value)} className="kfs" style={{ width:'100%' }}>
                        <option value="">Seleccionar</option>
                        <option value="Cortante">Cortante</option>
                        <option value="Hemostático">Hemostático</option>
                        <option value="Retractor">Retractor</option>
                        <option value="Pinza">Pinza</option>
                      </select>
                      <label style={{ position:'absolute', left:14, top:0, transform:'translateY(-50%)', fontSize:10.5, fontWeight:600, color:'#6b7280', background:'#fff', padding:'0 4px', pointerEvents:'none' }}>Tipo de instrumento</label>
                      <ChevronDown size={13} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'#9ca3af' }}/>
                    </div>
                    <div style={{ position:'relative', flex:1, minWidth:130 }}>
                      <input type="text" placeholder="Buscar por nombre" value={instrSearch} onChange={e=>setInstrSearch(e.target.value)} className="ks" style={{ height:42 }}/>
                      <Search size={13} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', color:'#06b6d4', pointerEvents:'none' }}/>
                    </div>
                  </div>

                  {/* Tabla disponibles */}
                  <div style={{ overflowY:'auto', flex:1 }} className="noscroll">
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom:'1px solid #f3f4f6' }}>
                          <th style={{ ...thS, width:46 }}></th>
                          <th style={thS}>Código</th>
                          <th style={thS}><span style={{ display:'flex', alignItems:'center', gap:3 }}>C. Instrumento <ChevronRight size={11} style={{ transform:'rotate(90deg)' }}/></span></th>
                          <th style={thS}><span style={{ display:'flex', alignItems:'center', gap:3 }}>Nombre <ChevronRight size={11} style={{ transform:'rotate(90deg)' }}/></span></th>
                          <th style={{ ...thS, width:36 }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInstruments.length===0 ? (
                          <tr><td colSpan={5} style={{ textAlign:'center', padding:'36px 0', color:'#9ca3af', fontSize:13 }}>Sin instrumentos disponibles</td></tr>
                        ) : filteredInstruments.map((item,i)=>(
                          <tr key={i} style={{ borderBottom:'1px solid #f9fafb' }}
                            onMouseEnter={e=>(e.currentTarget.style.background='#f9fafb')}
                            onMouseLeave={e=>(e.currentTarget.style.background='#fff')}>
                            <td style={{ padding:'9px 8px 9px 12px' }}>
                              <button onClick={()=>handleAddItem(item)} style={{ width:28, height:28, borderRadius:'50%', border:'1.5px solid #e5e7eb', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#9ca3af', transition:'all .15s' }}
                                onMouseEnter={e=>{(e.currentTarget as any).style.background='#eff6ff';(e.currentTarget as any).style.color='#3b82f6';(e.currentTarget as any).style.borderColor='#bfdbfe';}}
                                onMouseLeave={e=>{(e.currentTarget as any).style.background='#fff';(e.currentTarget as any).style.color='#9ca3af';(e.currentTarget as any).style.borderColor='#e5e7eb';}}>
                                <ArrowLeftCircle size={15} strokeWidth={1.5}/>
                              </button>
                            </td>
                            <td style={{ ...tdS, color:'#9ca3af' }}>{item.codigo}</td>
                            <td style={tdS}>{item.codigoInstrumento||item.codigo}</td>
                            <td style={tdS}>{item.nombre}</td>
                            <td style={{ padding:'9px 12px 9px 4px', textAlign:'center' }}>
                              <Search size={12} style={{ color:'#d1d5db' }}/>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Botones */}
                  <div style={{ padding:'12px 18px', borderTop:'1px solid #f3f4f6', display:'flex', justifyContent:'flex-end', gap:12, background:'#fafafa', flexShrink:0 }}>
                    <button onClick={handleCancelClick} style={{ padding:'9px 22px', borderRadius:999, border:'1.5px solid #e5e7eb', background:'#fff', cursor:'pointer', fontWeight:600, fontSize:13, color:'#6b7280' }}>Cancelar</button>
                    <button onClick={handleSave} style={{ padding:'9px 26px', borderRadius:999, border:'none', cursor:'pointer', background:'linear-gradient(90deg,#3b82f6 0%,#34d399 100%)', color:'#fff', fontWeight:700, fontSize:13, boxShadow:'0 4px 14px rgba(59,130,246,0.28)' }}>
                      {view==='edit'?'Actualizar Kit':'Guardar Kit'}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display:'flex', alignItems:'flex-start', paddingTop:4 }}>
                  <button onClick={()=>setView('list')} style={{ padding:'9px 26px', borderRadius:999, border:'1.5px solid #e5e7eb', background:'#fff', cursor:'pointer', fontWeight:600, fontSize:13, color:'#6b7280' }}>Volver al listado</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ MODAL ALERTA ══ */}
        {isAlertOpen && (
          <Modal>
            <div style={{ width:60, height:60, borderRadius:'50%', margin:'0 auto 18px', display:'flex', alignItems:'center', justifyContent:'center', background:alertType==='success'?'#d1fae5':alertType==='error'?'#fee2e2':'#fef3c7', color:alertType==='success'?'#059669':alertType==='error'?'#ef4444':'#d97706', fontSize:28, fontWeight:900 }}>
              {alertType==='success'?<CheckCircle size={30}/>:alertType==='error'?<X size={30}/>:'!'}
            </div>
            <h3 style={{ fontSize:20, fontWeight:800, color:'#111827', marginBottom:8 }}>{alertType==='duplicate'?'¡Alerta!':alertType==='cancel'?'¿Está seguro?':alertType==='error'?'Error':'Éxito'}</h3>
            <p style={{ color:'#6b7280', fontSize:14, marginBottom:28, lineHeight:1.55 }}>{alertMsg}</p>
            {alertType==='cancel' ? (
              <div style={{ display:'flex', gap:12 }}>
                <button onClick={()=>setIsAlertOpen(false)} style={{ flex:1, padding:'11px 0', borderRadius:999, border:'1.5px solid #e5e7eb', background:'#fff', cursor:'pointer', fontWeight:600, fontSize:14, color:'#6b7280' }}>Cancelar</button>
                <button onClick={()=>{ setIsAlertOpen(false); setView('list'); }} style={{ flex:1, padding:'11px 0', borderRadius:999, border:'none', background:'#3b82f6', cursor:'pointer', fontWeight:700, fontSize:14, color:'#fff', boxShadow:'0 4px 14px rgba(59,130,246,0.25)' }}>Aceptar</button>
              </div>
            ) : (
              <button onClick={()=>{ setIsAlertOpen(false); if(alertType==='success') setView('list'); }} style={{ width:'100%', padding:'11px 0', borderRadius:999, border:'none', cursor:'pointer', fontWeight:700, fontSize:14, color:'#fff', background:alertType==='error'?'#ef4444':alertType==='success'?'#10b981':'#3b82f6', boxShadow:`0 4px 14px ${alertType==='error'?'rgba(239,68,68,0.25)':alertType==='success'?'rgba(16,185,129,0.25)':'rgba(59,130,246,0.25)'}` }}>Aceptar</button>
            )}
          </Modal>
        )}

        {/* ══ MODAL ESTADO ══ */}
        {isStatusAlertOpen && itemToToggle && (
          <Modal>
            <div style={{ width:60, height:60, borderRadius:'50%', margin:'0 auto 18px', display:'flex', alignItems:'center', justifyContent:'center', background:'#fef3c7', color:'#d97706', fontSize:28, fontWeight:900 }}>!</div>
            <h3 style={{ fontSize:20, fontWeight:800, color:'#111827', marginBottom:8 }}>¿Está seguro?</h3>
            <p style={{ color:'#6b7280', fontSize:14, marginBottom:28, lineHeight:1.55 }}>Se <b>{itemToToggle.estado==='Habilitado'?'deshabilitará':'habilitará'}</b> el kit:<br/><span style={{ fontWeight:700, color:'#374151' }}>{itemToToggle.codigoKit}</span></p>
            <div style={{ display:'flex', gap:12 }}>
              <button onClick={()=>setIsStatusAlertOpen(false)} style={{ flex:1, padding:'11px 0', borderRadius:999, border:'1.5px solid #e5e7eb', background:'#fff', cursor:'pointer', fontWeight:600, fontSize:14, color:'#6b7280' }}>Cancelar</button>
              <button onClick={confirmToggleStatus} style={{ flex:1, padding:'11px 0', borderRadius:999, border:'none', background:'#3b82f6', cursor:'pointer', fontWeight:700, fontSize:14, color:'#fff', boxShadow:'0 4px 14px rgba(59,130,246,0.25)' }}>Confirmar</button>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default KitScreen;