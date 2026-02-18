import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, PlusCircle, MoreVertical, ChevronDown, ChevronLeft, ChevronRight, 
  Calendar, ArrowLeftCircle, ArrowRightCircle, Eye, ChevronsLeft, ChevronsRight,
  Ban, Edit, FileText, CheckCircle, X 
} from 'lucide-react';

const KitScreen: React.FC = () => {
  // --- ESTADOS GLOBALES ---
  const [view, setView] = useState<any>('list'); // 'list', 'create', 'edit', 'details' (NUEVO)
  const [isAlertOpen, setIsAlertOpen] = useState<any>(false); // Alerta duplicados
  const [isStatusAlertOpen, setIsStatusAlertOpen] = useState<any>(false); // Alerta cambio estado
  const [itemToToggle, setItemToToggle] = useState<any>(null); // Item a cambiar estado
  const [selectedKit, setSelectedKit] = useState<any>(null); // Kit seleccionado para ver/editar

  // --- ESTADOS PARA MENÚ FLOTANTE ---
  const [openMenuIndex, setOpenMenuIndex] = useState<any>(null);
  const menuRef = useRef(null);

  // --- DATOS DEL KIT (Listado Principal) ---
  const [kitsData, setKitsData] = useState<any>([
    { id: 1, codigo: '013', esp: 'Oftalmología', sub: 'Síndrome del ojo seco', tipo: 'Básico', num: '01', codKit: 'OfSiBa01', estado: 'Deshabilitado' },
    { id: 2, codigo: '012', esp: 'Oftalmología', sub: 'Retinopatía diabética', tipo: 'Avanzado', num: '01', codKit: 'OfReAv01', estado: 'Deshabilitado' },
    { id: 3, codigo: '011', esp: 'Oftalmología', sub: 'Infecciones oculares', tipo: 'Básico', num: '01', codKit: 'OfInBa01', estado: 'Deshabilitado' },
  ]);

  // --- ESTADOS VISTA CREAR/EDITAR ---
  const [availableInstruments, setAvailableInstruments] = useState<any>([
    { id: 1, codigo: '053', instr: 'AR3436745', nombre: 'Bisturí de córnea' }, 
    { id: 2, codigo: '023', instr: 'EC7375464', nombre: 'Autorrefractómetro' },
    { id: 3, codigo: '047', instr: 'HD2745332', nombre: 'Láser de Argón' },
    { id: 4, codigo: '025', instr: 'AR3436745', nombre: 'Tonometría de Goldmann' },
    { id: 5, codigo: '020', instr: 'EC7375464', nombre: 'Cirugía refractiva' },
    { id: 6, codigo: '028', instr: 'HD2745332', nombre: 'Prisma de Fresnel' },
    { id: 7, codigo: '073', instr: 'AR3436745', nombre: 'Escleral' },
    { id: 8, codigo: '072', instr: 'EC7375464', nombre: 'Bisturí de córnea' }, 
    { id: 9, codigo: '029', instr: 'HD2745332', nombre: 'Microscopio de campo claro' },
    { id: 10, codigo: '061', instr: 'AR3436745', nombre: 'Oftalmoscopio' },
  ]);

  const [addedItems, setAddedItems] = useState<any>([]); 

  // --- HANDLERS GENERALES ---

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (index, e) => {
    e.stopPropagation();
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  // --- LÓGICA DE TRANSFERENCIA DE ITEMS ---
  const handleAddItem = (item) => {
      const isDuplicateName = addedItems.some(added => added.nombre === item.nombre);
      if (isDuplicateName) {
          setIsAlertOpen(true);
          return;
      }
      setAddedItems([...addedItems, item]);
      setAvailableInstruments(availableInstruments.filter(i => i.id !== item.id));
  };

  const handleRemoveItem = (item) => {
      setAvailableInstruments([...availableInstruments, item]);
      setAddedItems(addedItems.filter(i => i.id !== item.id));
  };

  const isNameAlreadyAdded = (itemName) => {
      return addedItems.some(added => added.nombre === itemName);
  };

  // --- NAVEGACIÓN Y ACCIONES ---

  const handleGoToCreate: React.FC = () => {
    setAddedItems([]); // Limpiar items al crear nuevo
    setSelectedKit(null);
    setView('create');
  };

  const handleGoToEdit = (kit) => {
    // Simulamos carga de datos
    setAddedItems([]); 
    setSelectedKit(kit);
    setView('edit');
    setOpenMenuIndex(null);
  };
  
  // NUEVO: Handler para ir a Detalles
  const handleGoToDetails = (kit) => {
      // Simulamos que cargamos los items de este kit específico
      // Para el ejemplo usaremos algunos items dummy
      setAddedItems([
          { id: 101, codigo: '053', instr: 'AR3436745', nombre: 'Bisturí de córnea' },
          { id: 102, codigo: '023', instr: 'EC7375464', nombre: 'Autorrefractómetro' },
          { id: 103, codigo: '047', instr: 'HD2745332', nombre: 'Láser de Argón' }
      ]);
      setSelectedKit(kit);
      setView('details');
      setOpenMenuIndex(null);
  };

  const handleOpenStatusAlert = (kit) => {
    setItemToToggle(kit);
    setIsStatusAlertOpen(true);
    setOpenMenuIndex(null);
  };

  const confirmToggleStatus: React.FC = () => {
    if (itemToToggle) {
        setKitsData(prev => prev.map(k => {
            if (k.id === itemToToggle.id) {
                return { ...k, estado: k.estado === 'Habilitado' ? 'Deshabilitado' : 'Habilitado' };
            }
            return k;
        }));
    }
    setIsStatusAlertOpen(false);
    setItemToToggle(null);
  };

  const getStatusColor = (status) => {
    return status === 'Habilitado' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100';
  };

  // --- COMPONENTES INTERNOS ---
  const CodigoKitBlock: React.FC<any> = ({ visible = true }) => (
    <div className={`bg-white border border-slate-200 rounded-3xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm ${!visible ? 'opacity-0 pointer-events-none' : ''}`}>
        <span className="font-bold text-blue-500 text-sm">Código Kit</span>
        <div className="flex gap-6 items-start">
            <div className="flex flex-col items-center gap-1"><div className="flex gap-2"><div className="w-8 h-8 rounded-full border border-cyan-400 text-cyan-500 flex items-center justify-center font-bold text-xs">O</div><div className="w-8 h-8 rounded-full border border-cyan-400 text-cyan-500 flex items-center justify-center font-bold text-xs">F</div></div><span className="text-[10px] text-slate-400">(Especialidad)</span></div>
            <div className="flex flex-col items-center gap-1"><div className="flex gap-2"><div className="w-8 h-8 rounded-full border border-cyan-400 text-cyan-500 flex items-center justify-center font-bold text-xs">C</div><div className="w-8 h-8 rounded-full border border-cyan-400 text-cyan-500 flex items-center justify-center font-bold text-xs">A</div></div><span className="text-[10px] text-slate-400">(Subespecialidad)</span></div>
            <div className="flex flex-col items-center gap-1"><div className="flex gap-2"><div className="w-8 h-8 rounded-full border border-cyan-400 text-cyan-500 flex items-center justify-center font-bold text-xs">A</div><div className="w-8 h-8 rounded-full border border-cyan-400 text-cyan-500 flex items-center justify-center font-bold text-xs">V</div></div><span className="text-[10px] text-slate-400">(Tipo Subespecialidad)</span></div>
            <div className="flex flex-col items-center gap-1"><div className="flex gap-2"><div className="w-8 h-8 rounded-full border border-cyan-400 text-cyan-500 flex items-center justify-center font-bold text-xs">0</div><div className="w-8 h-8 rounded-full border border-cyan-400 text-cyan-500 flex items-center justify-center font-bold text-xs">1</div></div><span className="text-[10px] text-slate-400">(Kit)</span></div>
        </div>
    </div>
  );

  // === VISTA DETALLES (NUEVO DISEÑO SEGÚN IMAGEN) ===
  if (view === 'details') {
      return (
          <div className="flex flex-col h-full font-sans space-y-4 relative">
              <div className="flex items-center gap-2">
                  <button onClick={() => setView('list')} className="text-blue-500 hover:bg-blue-50 p-1 rounded-full transition-colors">
                      <ChevronLeft strokeWidth={3} size={28} />
                  </button>
                  <h1 className="text-3xl font-bold text-blue-500">Detalles del Kit</h1>
              </div>

              <div className="flex flex-col gap-6 flex-1 overflow-hidden px-1">
                  
                  {/* Bloque Superior: Datos del Kit (Solo Lectura) */}
                  <div className="flex flex-col md:flex-row gap-6">
                      {/* Bloque de Código Visual */}
                      <div className="flex-1">
                          <CodigoKitBlock visible={true} />
                      </div>

                      {/* Datos Informativos */}
                      <div className="flex-[2] flex flex-wrap gap-4 items-end bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                           <div className="flex-1 min-w-[140px] flex flex-col gap-1">
                               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Especialidad</span>
                               <div className="text-slate-600 font-medium text-sm border-b border-slate-100 pb-1">{selectedKit?.esp || 'Oftalmología'}</div>
                           </div>
                           <div className="flex-1 min-w-[140px] flex flex-col gap-1">
                               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sub-especialidad</span>
                               <div className="text-slate-600 font-medium text-sm border-b border-slate-100 pb-1">{selectedKit?.sub || 'Catarata'}</div>
                           </div>
                           <div className="flex-1 min-w-[140px] flex flex-col gap-1">
                               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tipo</span>
                               <div className="text-slate-600 font-medium text-sm border-b border-slate-100 pb-1">{selectedKit?.tipo || 'Básico'}</div>
                           </div>
                           <div className="w-24 flex flex-col gap-1">
                               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">No. Kit</span>
                               <div className="w-full h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 font-bold text-sm">
                                   {selectedKit?.num || '01'}
                               </div>
                           </div>
                      </div>
                  </div>

                  {/* Bloque Inferior: Tabla de Instrumentos (Solo Lectura) */}
                  <div className="flex-1 border border-slate-100 rounded-2xl overflow-hidden flex flex-col bg-white shadow-sm mb-4">
                      <div className="bg-blue-50 px-6 py-4 font-bold text-blue-600 text-sm border-b border-blue-100">
                          Instrumentos del Kit
                      </div>
                      <div className="flex-1 overflow-y-auto">
                          <table className="w-full text-left text-sm">
                              <thead className="text-slate-500 font-semibold border-b border-slate-50 bg-white sticky top-0">
                                  <tr>
                                      <th className="px-6 py-4 w-24">Código</th>
                                      <th className="px-6 py-4 w-40">C. Instrumento</th>
                                      <th className="px-6 py-4">Nombre</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                  {addedItems.length === 0 ? (
                                      <tr><td colSpan="3" className="px-6 py-8 text-center text-slate-300 italic">No hay instrumentos registrados en este kit</td></tr>
                                  ) : (
                                      addedItems.map((item, i) => (
                                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                                              <td className="px-6 py-4 text-slate-500 font-medium">{item.codigo}</td>
                                              <td className="px-6 py-4 text-slate-500">{item.instr}</td>
                                              <td className="px-6 py-4 text-slate-600 font-medium">{item.nombre}</td>
                                          </tr>
                                      ))
                                  )}
                              </tbody>
                          </table>
                      </div>
                      
                      {/* Footer Tabla (Paginación simple visual) */}
                      <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                           <button 
                              onClick={() => setView('list')} 
                              className="px-8 py-2 rounded-full bg-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-300 transition-colors"
                           >
                              Volver
                           </button>
                      </div>
                  </div>

              </div>
          </div>
      );
  }

  // === VISTA CREAR / EDITAR (LÓGICA ANTERIOR) ===
  if (view === 'create' || view === 'edit') {
      return (
          <div className="flex flex-col h-full font-sans space-y-4 relative">
              
              {/* ALERTA DUPLICADOS */}
              {isAlertOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center w-[400px] animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 rounded-full bg-amber-400 flex items-center justify-center mb-4 shadow-sm">
                            <span className="text-white text-4xl font-bold">!</span>
                        </div>
                        <h3 className="text-blue-500 text-2xl font-bold mb-2">!Alerta¡</h3>
                        <p className="text-slate-400 text-center mb-8 font-medium">Este instrumento ya se encuentra agregado</p>
                        <button onClick={() => setIsAlertOpen(false)} className="px-10 py-2.5 rounded-full text-white font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-90 shadow-lg shadow-cyan-200/50 transition-transform active:scale-95">Aceptar</button>
                    </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                  <button onClick={() => setView('list')} className="text-blue-500 hover:bg-blue-50 p-1 rounded-full transition-colors">
                      <ChevronLeft strokeWidth={3} size={28} />
                  </button>
                  <h1 className="text-3xl font-bold text-blue-500">
                      {view === 'edit' ? 'Editar Kit' : 'Crear Kit'}
                  </h1>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden px-1">
                  
                  {/* === COLUMNA IZQUIERDA (AGREGADOS) === */}
                  <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                      <CodigoKitBlock visible={true} />
                      <div className="flex flex-wrap gap-4 items-end">
                           <div className="relative flex-1 min-w-[120px]"><label className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-red-500 font-bold z-10">Especialidad*</label><select className="w-full h-10 border border-slate-300 rounded-full px-4 text-slate-500 text-xs outline-none bg-white"><option>Seleccionar</option></select><ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={14}/></div>
                           <div className="relative flex-1 min-w-[120px]"><label className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-red-500 font-bold z-10">Sub-especialidad*</label><select className="w-full h-10 border border-slate-300 rounded-full px-4 text-slate-500 text-xs outline-none bg-white"><option>Seleccionar</option></select><ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={14}/></div>
                           <div className="relative flex-1 min-w-[120px]"><label className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-red-500 font-bold z-10">T. Sub-especialidad*</label><select className="w-full h-10 border border-slate-300 rounded-full px-4 text-slate-500 text-xs outline-none bg-white"><option>Seleccionar</option></select><ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={14}/></div>
                           <div className="relative w-20"><label className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-slate-500 font-bold z-10">No. Kit</label><div className="w-full h-10 border border-slate-300 rounded-full flex items-center justify-center text-slate-500 text-xs font-bold bg-white">01</div></div>
                      </div>

                      <div className="flex-1 border border-slate-100 rounded-xl overflow-hidden flex flex-col bg-slate-50/50 shadow-sm mb-4">
                          <div className="bg-blue-100/50 px-4 py-3 font-bold text-slate-700 text-sm border-b border-blue-100 h-12 flex items-center">Añadir al Kit</div>
                          <div className="flex-1 overflow-y-auto bg-white">
                              <table className="w-full text-left text-xs">
                                  <thead className="text-slate-500 font-semibold border-b border-slate-50">
                                      <tr><th className="w-12 py-3"></th><th className="px-4 py-2">Código</th><th className="px-4 py-2">C. Instrumento</th><th className="px-4 py-2">Nombre</th><th className="w-12 py-3"></th></tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-50">
                                      {addedItems.length === 0 ? (
                                          <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-300 italic">No hay instrumentos añadidos</td></tr>
                                      ) : (
                                          addedItems.map((item, i) => (
                                              <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                                  <td className="px-2 py-3 text-center">
                                                      <button 
                                                        onClick={() => handleRemoveItem(item)}
                                                        className="w-8 h-8 rounded-full border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                                                      >
                                                          <ArrowRightCircle size={18} strokeWidth={1.5} />
                                                      </button>
                                                  </td>
                                                  <td className="px-4 py-3 text-slate-500 font-bold">{item.codigo}</td>
                                                  <td className="px-4 py-3 text-slate-500">{item.instr}</td>
                                                  <td className="px-4 py-3 text-slate-500 font-medium">{item.nombre}</td>
                                                  <td className="px-2 py-3 text-center"><button className="text-slate-300 hover:text-blue-500"><Eye size={18} /></button></td>
                                              </tr>
                                          ))
                                      )}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>

                  {/* === COLUMNA DERECHA (DISPONIBLES) === */}
                  <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                      <CodigoKitBlock visible={false} />
                      <div className="flex gap-3 h-10">
                           <div className="relative w-32"><input type="text" placeholder="Creación" className="w-full h-10 border border-slate-300 rounded-full px-4 text-slate-500 text-xs outline-none bg-white"/><Calendar className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={14}/></div>
                           <div className="relative flex-1"><select className="w-full h-10 border border-slate-300 rounded-full px-4 text-slate-500 text-xs outline-none bg-white"><option>Tipo de instrumento</option></select><ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={14}/></div>
                           <div className="relative flex-1"><input type="text" placeholder="xxx" className="w-full h-10 border border-slate-300 rounded-full px-4 text-slate-500 text-xs outline-none bg-white"/></div>
                      </div>

                      <div className="flex-1 flex flex-col min-h-0">
                          <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
                              <div className="bg-blue-100/50 px-6 py-3 font-bold text-slate-700 text-sm border-b border-blue-100 h-12 flex items-center">Instrumentos filtrados</div>
                              <div className="flex-1 overflow-y-auto">
                                  <table className="w-full text-left text-xs">
                                      <thead className="text-slate-500 font-semibold border-b border-slate-50">
                                          <tr><th className="w-12 py-3"></th><th className="px-4 py-3">Código</th><th className="px-4 py-3">C. Instrumento</th><th className="px-4 py-3">Nombre</th><th className="w-12 py-3"></th></tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-50">
                                          {availableInstruments.map((item, i) => {
                                              const isBlocked = isNameAlreadyAdded(item.nombre);
                                              return (
                                                  <tr key={i} className={`transition-colors group ${isBlocked ? 'bg-slate-50' : 'hover:bg-blue-50/30'}`}>
                                                      <td className="px-2 py-3 text-center">
                                                          <button 
                                                            onClick={() => isBlocked ? setIsAlertOpen(true) : handleAddItem(item)}
                                                            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                                                                isBlocked 
                                                                ? 'border-red-200 text-red-400 bg-red-50 hover:bg-red-100 cursor-pointer' 
                                                                : 'border-slate-200 text-slate-400 hover:bg-blue-500 hover:text-white hover:border-blue-500'
                                                            }`}
                                                          >
                                                              {isBlocked ? <Ban size={16} /> : <ArrowLeftCircle size={18} strokeWidth={1.5} />}
                                                          </button>
                                                      </td>
                                                      <td className={`px-4 py-3 font-medium ${isBlocked ? 'text-slate-400' : 'text-slate-500'}`}>{item.codigo}</td>
                                                      <td className="px-4 py-3 text-slate-400">{item.instr}</td>
                                                      <td className={`px-4 py-3 ${isBlocked ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-600'}`}>{item.nombre}</td>
                                                      <td className="px-2 py-3 text-center"><button className="text-slate-300 hover:text-blue-400"><Eye size={18} /></button></td>
                                                  </tr>
                                              );
                                          })}
                                      </tbody>
                                  </table>
                              </div>
                          </div>
                          
                          <div className="py-4 flex justify-between items-center text-xs text-slate-400"><span>Pág. 1 de 1</span><div className="flex items-center gap-2 font-medium text-blue-400"><button><ChevronsLeft size={16} /></button><button><ChevronLeft size={16} /></button><span className="bg-blue-50 px-3 py-1 rounded text-blue-600 font-bold">1</span><button><ChevronRight size={16} /></button><button><ChevronsRight size={16} /></button></div></div>
                          <div className="flex justify-end gap-6 items-center mt-2">
                              <button onClick={() => setView('list')} className="text-slate-700 font-bold hover:text-red-500 transition-colors text-sm">Cancelar</button>
                              <button className="px-10 py-2.5 rounded-full text-white font-bold bg-gradient-to-r from-[#3B82F6] to-[#2DD4BF] hover:opacity-90 shadow-lg shadow-blue-200/50 transition-transform active:scale-95 text-sm">
                                  {view === 'edit' ? 'Actualizar' : 'Guardar'}
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // === VISTA LISTA PRINCIPAL ===
  return (
    <div className="space-y-6 h-full flex flex-col font-sans relative" onClick={() => setOpenMenuIndex(null)}>
      
      <h1 className="text-3xl font-bold text-blue-500">Kit</h1>
      <div className="bg-white rounded-2xl p-2 flex flex-col md:flex-row gap-4 items-center shadow-sm border border-slate-50">
        <div className="relative min-w-[150px]"><select className="w-full h-10 border border-slate-200 rounded-full px-4 text-slate-500 text-sm outline-none bg-white"><option>Estado</option></select><ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={16}/></div>
        <div className="relative flex-1 w-full"><input type="text" placeholder="Buscar..." className="w-full h-10 bg-slate-50 border-none rounded-full pl-4 pr-10 text-sm text-slate-600 outline-none"/><Search className="absolute right-3 top-2.5 text-blue-400" size={18} /></div>
        <button onClick={handleGoToCreate} className="flex items-center gap-2 text-blue-500 font-bold text-sm hover:text-blue-600 px-4 transition-colors whitespace-nowrap">Crear kit <PlusCircle size={18} /></button>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden relative">
        <div className="overflow-visible flex-1">
             <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/50 text-slate-700 font-bold border-b border-slate-200">
                    <tr><th className="px-6 py-4 text-center">Código</th><th className="px-6 py-4">Especialidad</th><th className="px-6 py-4">Subespecialidad</th><th className="px-6 py-4">Tipo de Subespecialidad</th><th className="px-6 py-4 text-center">Numero</th><th className="px-6 py-4">Código Kit</th><th className="px-6 py-4 text-center">Estado</th><th className="px-4 py-4"></th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {kitsData.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 text-slate-500 text-center">{row.codigo}</td><td className="px-6 py-4 text-slate-500">{row.esp}</td><td className="px-6 py-4 text-slate-500">{row.sub}</td><td className="px-6 py-4 text-slate-500">{row.tipo}</td><td className="px-6 py-4 text-slate-500 text-center">{row.num}</td><td className="px-6 py-4 text-slate-500 font-medium">{row.codKit}</td>
                            <td className="px-6 py-4 text-center"><span className={`px-4 py-1 rounded-full text-xs font-bold border ${getStatusColor(row.estado)}`}>{row.estado}</span></td>
                            
                            {/* ACCIONES (MENÚ 3 PUNTOS) */}
                            <td className="px-4 py-4 text-right relative">
                                <button 
                                    onClick={(e: any) => toggleMenu(i, e)}
                                    className={`p-2 rounded-full transition-colors ${openMenuIndex === i ? 'bg-blue-50 text-blue-500' : 'text-slate-300 hover:text-blue-500 hover:bg-slate-50'}`}
                                >
                                    <MoreVertical size={20} />
                                </button>
                                {openMenuIndex === i && (
                                    <div ref={menuRef} className="absolute right-8 top-8 w-44 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden text-left">
                                        <div className="flex flex-col py-1">
                                            <button 
                                                onClick={() => handleGoToDetails(row)}
                                                className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors text-left font-medium"
                                            >
                                                <Eye size={14} /> Ver detalle
                                            </button>
                                            <button 
                                                onClick={() => handleGoToEdit(row)}
                                                className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors text-left font-medium"
                                            >
                                                <Edit size={14} /> Editar
                                            </button>
                                            <button 
                                                onClick={() => handleOpenStatusAlert(row)} 
                                                className={`flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-slate-50 transition-colors text-left font-medium ${row.estado === 'Habilitado' ? 'text-red-500' : 'text-emerald-500'}`}
                                            >
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

      {/* MODAL ALERTA ESTADO (MISMO DISEÑO CONSISTENTE) */}
      {isStatusAlertOpen && itemToToggle && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 font-sans">
             <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity" onClick={() => setIsStatusAlertOpen(false)} />
             
             <div className="relative bg-white w-full max-w-[400px] rounded-[30px] p-8 flex flex-col items-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm ${itemToToggle.estado === 'Habilitado' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                    {itemToToggle.estado === 'Habilitado' ? <Ban size={40} strokeWidth={1.5} /> : <CheckCircle size={40} strokeWidth={1.5} />}
                 </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    {itemToToggle.estado === 'Habilitado' ? 'Deshabilitar Kit' : 'Habilitar Kit'}
                </h3>
                <p className="text-slate-500 text-center text-sm mb-8 px-4">
                    ¿Estás seguro de que deseas {itemToToggle.estado === 'Habilitado' ? 'deshabilitar' : 'habilitar'} el kit <span className="font-bold text-slate-700">{itemToToggle.codKit}</span>?
                </p>
                <div className="flex gap-4 w-full">
                    <button onClick={() => setIsStatusAlertOpen(false)} className="flex-1 py-3 rounded-full border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors text-sm">Cancelar</button>
                    <button 
                        onClick={confirmToggleStatus} 
                        className={`flex-1 py-3 rounded-full text-white font-bold shadow-lg transition-transform active:scale-95 text-sm bg-gradient-to-r ${
                            itemToToggle.estado === 'Habilitado' 
                            ? 'from-red-500 to-rose-400 shadow-red-200' 
                            : 'from-blue-500 to-emerald-400 shadow-blue-200'
                        }`}
                    >
                        Sí, {itemToToggle.estado === 'Habilitado' ? 'deshabilitar' : 'habilitar'}
                    </button>
                </div>
             </div>
        </div>
      )}

    </div>
  );
};

export default KitScreen;