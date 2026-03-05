import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, PlusCircle, MoreVertical, ChevronDown, ChevronLeft, ChevronRight, 
  Calendar, ArrowLeftCircle, ArrowRightCircle, Eye, ChevronsLeft, ChevronsRight,
  Ban, Edit, CheckCircle, X 
} from 'lucide-react';

const KitScreen: React.FC = () => {
  const [view, setView] = useState<'list' | 'create' | 'edit' | 'details'>('list'); 
  const [isAlertOpen, setIsAlertOpen] = useState(false); 
  const [alertType, setAlertType] = useState<'duplicate' | 'cancel' | 'error' | 'success'>('duplicate');
  const [alertMsg, setAlertMsg] = useState('');
  const [isStatusAlertOpen, setIsStatusAlertOpen] = useState(false); 
  const [itemToToggle, setItemToToggle] = useState<any>(null); 
  const [selectedKit, setSelectedKit] = useState<any>(null); 
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [kitsData, setKitsData] = useState<any[]>([]);
  const [especialidades, setEspecialidades] = useState<any[]>([]);
  const [subespecialidades, setSubespecialidades] = useState<any[]>([]);
  const [tiposSub, setTiposSub] = useState<any[]>([]);
  const [instrumentosBase, setInstrumentosBase] = useState<any[]>([]); // Todos los de la DB
  const [availableInstruments, setAvailableInstruments] = useState<any[]>([]); 
  const [addedItems, setAddedItems] = useState<any[]>([]); 
  const initialForm = {
      especialidadId: '', subespecialidadId: '', tipoSubespecialidadId: '', 
      numeroKit: '', codKit: '', tipoInstrumento: ''
  };
  const [formData, setFormData] = useState<any>(initialForm);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchKits();
    fetchMaestras();
    fetchInstrumentos();
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuIndex(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchKits = async () => {
    try {
        const res = await fetch(`http://localhost:4000/api/kits?search=${searchTerm}&estado=${statusFilter}`);
        const json = await res.json();
        setKitsData(json.data || []);
    } catch (e) { console.error(e); }
  };

  const fetchMaestras = async () => {
      try {
          const resEsp = await fetch('http://localhost:4000/api/especialidades?estado=true');
          const dataEsp = await resEsp.json();
          setEspecialidades(dataEsp.data || []);
      } catch (e) {}
  };

  const fetchInstrumentos = async () => {
      try {
          const res = await fetch('http://localhost:4000/api/insumos-quirurgicos?estado=true');
          const json = await res.json();
          setInstrumentosBase(json.data || []);
      } catch (e) {}
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });

      if (name === 'especialidadId') {
          try {
              const res = await fetch(`http://localhost:4000/api/subespecialidades?especialidadId=${value}`);
              const json = await res.json();
              setSubespecialidades(json.data || []);
              setTiposSub([]);
              setFormData((prev:any) => ({...prev, subespecialidadId: '', tipoSubespecialidadId: ''}));
          } catch(e){}
      }

      if (name === 'subespecialidadId') {
          try {
              const res = await fetch(`http://localhost:4000/api/tipos-subespecialidad?subespecialidadId=${value}`);
              const json = await res.json();
              setTiposSub(json.data || []);
              setFormData((prev:any) => ({...prev, tipoSubespecialidadId: ''}));
          } catch(e){}
      }
      if (name === 'tipoSubespecialidadId' && formData.especialidadId && formData.subespecialidadId) {
          generarCodigoKit(formData.especialidadId, formData.subespecialidadId, value);
      }
  };

  const generarCodigoKit = async (espId: string, subId: string, tipoId: string) => {
      const esp = especialidades.find(e => e.id == espId)?.nombre.substring(0,2).toUpperCase() || 'XX';
      const sub = subespecialidades.find(s => s.id == subId)?.nombre.substring(0,2).toUpperCase() || 'XX';
      const num = Math.floor(Math.random() * 99).toString().padStart(2, '0'); // Ideal: Pedir consecutivo al backend
      
      setFormData((prev:any) => ({
          ...prev, 
          numeroKit: num,
          codKit: `${esp}${sub}${tipoId}${num}`
      }));

      setAvailableInstruments(instrumentosBase);
  };

  const handleAddItem = (item: any) => {
      if (addedItems.some(added => added.id === item.id)) {
          setAlertMsg("Este instrumento ya se encuentra agregado");
          setAlertType('duplicate');
          setIsAlertOpen(true);
          return;
      }
      setAddedItems([...addedItems, item]);
      setAvailableInstruments(availableInstruments.filter(i => i.id !== item.id));
  };

  const handleRemoveItem = (item: any) => {
      setAvailableInstruments([...availableInstruments, item]);
      setAddedItems(addedItems.filter(i => i.id !== item.id));
  };


  const handleSave = async () => {
      if (!formData.especialidadId || !formData.subespecialidadId || !formData.tipoSubespecialidadId || addedItems.length === 0) {
          setAlertMsg("Es necesario el diligenciamiento de todos los campos obligatorios y la adición de al menos un instrumento al kit.");
          setAlertType('error');
          setIsAlertOpen(true);
          return;
      }

      try {
          const payload = {
              ...formData,
              instrumentosIds: addedItems.map(i => i.id)
          };

          const method = view === 'create' ? 'POST' : 'PUT';
          const url = view === 'create' ? 'http://localhost:4000/api/kits' : `http://localhost:4000/api/kits/${selectedKit.id}`;

          const res = await fetch(url, {
              method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });

          if (!res.ok) throw new Error("Error al guardar");

          setAlertMsg(view === 'create' ? "Se ha creado exitosamente." : "Se ha actualizado exitosamente.");
          setAlertType('success');
          setIsAlertOpen(true);
          fetchKits(); // Refrescar grilla
      } catch (e) {
          setAlertMsg("Ocurrió un error al procesar la solicitud.");
          setAlertType('error');
          setIsAlertOpen(true);
      }
  };

  const confirmToggleStatus = async () => {
      if (!itemToToggle) return;
      try {
          await fetch(`http://localhost:4000/api/kits/${itemToToggle.id}/estado`, {
              method: 'PATCH',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ estado: itemToToggle.estado === 'Deshabilitado' }) // true si estaba deshabil
          });
          setIsStatusAlertOpen(false);
          fetchKits();
      } catch (e) { }
  };

  const handleCancelClick = () => {
      if (view === 'details') {
          setView('list');
      } else {
          setAlertMsg("La información diligenciada no se guardará en el sistema.");
          setAlertType('cancel');
          setIsAlertOpen(true);
      }
  };

  const openView = async (type: 'create' | 'edit' | 'details', kit: any = null) => {
      setSelectedKit(kit);
      setOpenMenuIndex(null);
      setAddedItems([]);

      if (type === 'create') {
          setFormData(initialForm);
          setAvailableInstruments(instrumentosBase);
      } else if (type === 'edit' || type === 'details') {
          setFormData({
              especialidadId: kit.especialidadId,
              subespecialidadId: kit.subespecialidadId,
              tipoSubespecialidadId: kit.tipoSubespecialidad,
              numeroKit: kit.numeroKit,
              codKit: kit.codigoKit
          });

          await handleInputChange({ target: { name: 'especialidadId', value: kit.especialidadId } } as any);
          setAddedItems(kit.instrumentos || []);
      }
      setView(type);
  };

  const CodigoKitBlock = () => (
    <div className={`bg-white border border-slate-200 rounded-3xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm`}>
        <span className="font-bold text-blue-500 text-sm">Código Kit</span>
        <div className="flex gap-6 items-start">
            <div className="flex flex-col items-center gap-1">
                <div className="flex gap-1 h-8 px-3 rounded-full border border-cyan-400 text-cyan-500 items-center font-bold text-sm tracking-widest bg-cyan-50/30">
                    {formData.codKit ? formData.codKit.substring(0,2) : '--'}
                </div>
                <span className="text-[10px] text-slate-400">Especialidad</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="flex gap-1 h-8 px-3 rounded-full border border-cyan-400 text-cyan-500 items-center font-bold text-sm tracking-widest bg-cyan-50/30">
                    {formData.codKit ? formData.codKit.substring(2,4) : '--'}
                </div>
                <span className="text-[10px] text-slate-400">Subespecialidad</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="flex gap-1 h-8 px-3 rounded-full border border-cyan-400 text-cyan-500 items-center font-bold text-sm bg-cyan-50/30">
                    {formData.tipoSubespecialidadId || '-'}
                </div>
                <span className="text-[10px] text-slate-400">Tipo</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="flex gap-1 h-8 px-3 rounded-full border border-cyan-400 text-cyan-500 items-center font-bold text-sm bg-cyan-50/30">
                    {formData.numeroKit || '--'}
                </div>
                <span className="text-[10px] text-slate-400">No. Kit</span>
            </div>
        </div>
    </div>
  );

  return (
    <div className="space-y-6 h-full flex flex-col font-sans relative" onClick={() => setOpenMenuIndex(null)}>

      {view === 'list' && (
        <>
            <h1 className="text-3xl font-bold text-blue-500">Kit</h1>
            <div className="bg-white rounded-2xl p-2 flex flex-col md:flex-row gap-4 items-center shadow-sm border border-slate-50">
                <div className="relative min-w-[150px]">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full h-10 border border-slate-200 rounded-full px-4 text-slate-500 text-sm outline-none bg-white font-medium cursor-pointer">
                        <option value="">Estado (Todos)</option>
                        <option value="true">Habilitado</option>
                        <option value="false">Deshabilitado</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={16}/>
                </div>
                <div className="relative flex-1 w-full">
                    <input type="text" placeholder="Buscar por código..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full h-10 bg-slate-50 border-none rounded-full pl-4 pr-10 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-100"/>
                    <Search className="absolute right-3 top-2.5 text-blue-400" size={18} />
                </div>
                <button onClick={() => openView('create')} className="flex items-center gap-2 bg-blue-50 text-blue-500 font-bold text-sm hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors whitespace-nowrap">Crear kit <PlusCircle size={18} /></button>
            </div>

            <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden relative">
                <div className="overflow-visible flex-1">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50/50 text-slate-700 font-bold border-b border-slate-200">
                            <tr><th className="px-6 py-4 text-center">Código</th><th className="px-6 py-4">Especialidad</th><th className="px-6 py-4">Subespecialidad</th><th className="px-6 py-4">Tipo</th><th className="px-6 py-4 text-center">Número</th><th className="px-6 py-4 font-extrabold text-blue-600">Código Kit</th><th className="px-6 py-4 text-center">Estado</th><th className="px-4 py-4"></th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {kitsData.map((row, i) => (
                                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors font-medium">
                                    <td className="px-6 py-4 text-slate-400 text-center">{row.id}</td>
                                    <td className="px-6 py-4 text-slate-600">{row.especialidad?.nombre || 'N/A'}</td>
                                    <td className="px-6 py-4 text-slate-600">{row.subespecialidad?.nombre || 'N/A'}</td>
                                    <td className="px-6 py-4 text-slate-600">{row.tipoSubespecialidad}</td>
                                    <td className="px-6 py-4 text-slate-500 text-center">{row.numeroKit}</td>
                                    <td className="px-6 py-4 text-blue-500 font-bold">{row.codigoKit}</td>
                                    <td className="px-6 py-4 text-center"><span className={`px-4 py-1 rounded-full text-[10px] font-bold border ${row.estado === 'Habilitado' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>{row.estado}</span></td>
                                    <td className="px-4 py-4 text-right relative">
                                        <button onClick={(e) => {e.stopPropagation(); setOpenMenuIndex(openMenuIndex === i ? null : i)}} className="p-2 text-slate-300 hover:text-blue-500"><MoreVertical size={20} /></button>
                                        {openMenuIndex === i && (
                                            <div ref={menuRef} className="absolute right-8 top-8 w-44 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden text-left font-bold animate-in fade-in zoom-in-95 duration-200">
                                                <div className="flex flex-col py-1">
                                                    <button onClick={() => openView('details', row)} className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500"><Eye size={14} /> Ver detalle</button>
                                                    <button onClick={() => openView('edit', row)} className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500"><Edit size={14} /> Editar</button>
                                                    <div className="h-px bg-slate-100 my-1"></div>
                                                    <button onClick={() => {setItemToToggle(row); setIsStatusAlertOpen(true); setOpenMenuIndex(null);}} className={`flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-slate-50 ${row.estado === 'Habilitado' ? 'text-red-500' : 'text-emerald-500'}`}>
                                                        {row.estado === 'Habilitado' ? <Ban size={14} /> : <CheckCircle size={14} />} 
                                                        {row.estado === 'Habilitado' ? 'Deshabilitar' : 'Habilitar'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
      )}

      {view !== 'list' && (
          <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <button onClick={handleCancelClick} className="p-2 bg-white rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"><ChevronLeft size={24}/></button>
                      <h1 className="text-3xl font-bold text-blue-500">{view === 'create' ? 'Crear Kit' : view === 'edit' ? 'Editar Kit' : 'Detalles del Kit'}</h1>
                  </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
                  <div className={`flex flex-col gap-4 overflow-hidden ${view === 'details' ? 'lg:w-1/3' : 'flex-1'}`}>
                      <CodigoKitBlock />
                      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap gap-4">
                          <div className="relative flex-1 min-w-[140px]">
                              <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-red-500 font-bold z-10">Especialidad*</label>
                              <select name="especialidadId" value={formData.especialidadId} onChange={handleInputChange} disabled={view !== 'create'} className={`w-full h-11 border border-slate-300 rounded-full px-4 text-xs outline-none font-bold ${view !== 'create' ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-600'}`}>
                                  <option value="">Seleccionar</option>
                                  {especialidades.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                              </select>
                          </div>
                          <div className="relative flex-1 min-w-[140px]">
                              <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-red-500 font-bold z-10">Subespecialidad*</label>
                              <select name="subespecialidadId" value={formData.subespecialidadId} onChange={handleInputChange} disabled={view !== 'create'} className={`w-full h-11 border border-slate-300 rounded-full px-4 text-xs outline-none font-bold ${view !== 'create' ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-600'}`}>
                                  <option value="">Seleccionar</option>
                                  {subespecialidades.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                              </select>
                          </div>
                          <div className="relative flex-1 min-w-[140px]">
                              <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-red-500 font-bold z-10">Tipo Sub*</label>
                              <select name="tipoSubespecialidadId" value={formData.tipoSubespecialidadId} onChange={handleInputChange} disabled={view !== 'create'} className={`w-full h-11 border border-slate-300 rounded-full px-4 text-xs outline-none font-bold ${view !== 'create' ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-600'}`}>
                                  <option value="">Seleccionar</option>
                                  {tiposSub.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                              </select>
                          </div>
                      </div>
                      <div className="flex-1 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-[300px]">
                          <div className="bg-blue-50/50 px-6 py-4 font-bold text-blue-600 text-sm border-b border-blue-100 flex justify-between items-center">
                              Instrumentos del Kit
                              <span className="bg-white px-3 py-1 rounded-full text-xs text-slate-500 shadow-sm border border-slate-100">{addedItems.length} items</span>
                          </div>
                          <div className="flex-1 overflow-y-auto">
                              <table className="w-full text-left text-xs">
                                  <thead className="text-slate-500 font-bold border-b border-slate-50 bg-white sticky top-0">
                                      <tr>{view !== 'details' && <th className="w-12"></th>}<th className="px-4 py-3">Código</th><th className="px-4 py-3">Nombre</th></tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                                      {addedItems.length === 0 ? <tr><td colSpan={3} className="py-10 text-center text-slate-400">Sin instrumentos</td></tr> :
                                          addedItems.map((item, i) => (
                                              <tr key={i} className="hover:bg-slate-50">
                                                  {view !== 'details' && (
                                                      <td className="px-2 py-2 text-center">
                                                          <button onClick={() => handleRemoveItem(item)} className="w-8 h-8 rounded-full border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-200"><ArrowRightCircle size={18} strokeWidth={1.5} /></button>
                                                      </td>
                                                  )}
                                                  <td className="px-4 py-3">{item.codigo}</td>
                                                  <td className="px-4 py-3">{item.nombre}</td>
                                              </tr>
                                          ))
                                      }
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
                  {view !== 'details' && (
                      <div className="flex-1 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col">
                          <div className="bg-slate-50/50 px-6 py-4 font-bold text-slate-700 text-sm border-b border-slate-100">Instrumentos Disponibles</div>
                          <div className="p-4 border-b border-slate-50">
                              <input type="text" placeholder="Buscar instrumento..." className="w-full h-10 border border-slate-200 rounded-full px-5 text-sm outline-none focus:ring-2 focus:ring-blue-100 bg-slate-50"/>
                          </div>
                          <div className="flex-1 overflow-y-auto">
                              <table className="w-full text-left text-xs">
                                  <thead className="text-slate-500 font-bold border-b border-slate-50 bg-white sticky top-0">
                                      <tr><th className="w-12"></th><th className="px-4 py-3">Código</th><th className="px-4 py-3">Nombre</th></tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                                      {availableInstruments.map((item, i) => (
                                          <tr key={i} className="hover:bg-slate-50">
                                              <td className="px-2 py-2 text-center">
                                                  <button onClick={() => handleAddItem(item)} className="w-8 h-8 rounded-full border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-blue-500 hover:text-white"><ArrowLeftCircle size={18} strokeWidth={1.5} /></button>
                                              </td>
                                              <td className="px-4 py-3">{item.codigo}</td>
                                              <td className="px-4 py-3">{item.nombre}</td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                          <div className="p-4 border-t border-slate-100 flex justify-end gap-4 bg-slate-50/30">
                              <button onClick={handleCancelClick} className="px-6 py-2.5 rounded-full text-slate-500 font-bold text-sm hover:bg-slate-200 transition-colors">Cancelar</button>
                              <button onClick={handleSave} className="px-8 py-2.5 rounded-full text-white font-bold text-sm bg-gradient-to-r from-blue-500 to-emerald-400 shadow-lg active:scale-95 transition-transform">
                                  {view === 'edit' ? 'Actualizar Kit' : 'Guardar Kit'}
                              </button>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      )}
      {isAlertOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center font-sans px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white w-full max-w-[400px] rounded-[30px] p-8 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
             <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 font-bold ${
                 alertType === 'duplicate' || alertType === 'cancel' ? 'bg-amber-100 text-amber-500 text-3xl' :
                 alertType === 'error' ? 'bg-red-100 text-red-500' : 'bg-emerald-100 text-emerald-500'
             }`}>
                {alertType === 'duplicate' || alertType === 'cancel' ? '!' : alertType === 'error' ? <X size={32}/> : <CheckCircle size={32}/>}
             </div>
             
             <h3 className="text-xl font-extrabold text-slate-800 mb-2">
                 {alertType === 'duplicate' ? '¡Alerta!' : alertType === 'cancel' ? '¿Está seguro?' : alertType === 'error' ? 'Error' : 'Éxito'}
             </h3>
             <p className="text-slate-500 text-sm mb-8 font-medium px-2">{alertMsg}</p>
             
             {alertType === 'cancel' ? (
                 <div className="flex gap-3 font-bold">
                    <button onClick={() => setIsAlertOpen(false)} className="flex-1 py-3 rounded-full border border-slate-200 text-slate-600 text-sm hover:bg-slate-50">Cancelar</button>
                    <button onClick={() => { setIsAlertOpen(false); setView('list'); }} className="flex-1 py-3 rounded-full bg-blue-500 text-white text-sm shadow-lg shadow-blue-200">Aceptar</button>
                 </div>
             ) : (
                 <button 
                    onClick={() => { setIsAlertOpen(false); if(alertType === 'success') setView('list'); }} 
                    className={`w-full py-3 rounded-full text-white font-bold text-sm shadow-lg ${alertType === 'error' ? 'bg-red-500 shadow-red-200' : alertType === 'success' ? 'bg-emerald-500 shadow-emerald-200' : 'bg-blue-500 shadow-blue-200'}`}
                 >
                    Aceptar
                 </button>
             )}
          </div>
        </div>
      )}

    </div>
  );
};

export default KitScreen;