import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  PlusCircle, 
  Download, 
  ChevronLeft, 
  Calendar, 
  MoreVertical, 
  ChevronRight, 
  FileText,
  Clock,
  Paperclip,
  ArrowDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  Scissors // Icono para simular instrumentos
} from 'lucide-react';

const IngresoInstrumentosScreen: React.FC = () => {
  // --- ESTADOS ---
  const [openMenuIndex, setOpenMenuIndex] = useState<any>(null);
  
  // Estados de Modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<any>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<any>(false);
  const [isAddInstrumentModalOpen, setIsAddInstrumentModalOpen] = useState<any>(false); // NUEVO: Estado para Agregar Instrumentos
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const menuRef = useRef(null);

  // Datos de la tabla principal
  const data = [
    { id: '7356345', fecha: '03/05/2025', hora: '10:30 am', entidad: '--', area: '--', cantidad: 21 },
    { id: '3853564', fecha: '03/05/2025', hora: '9:15 am', entidad: '--', area: '--', cantidad: 35 },
    { id: '7356345', fecha: '03/05/2025', hora: '10:30 am', entidad: '--', area: '--', cantidad: 21 },
  ];

  // Datos simulados (Instrumentos ya agregados en Crear/Detalle)
  const instrumentosAgregados = [
    // Inicialmente vacío o con datos de prueba
  ];

  // Datos para el modal "Agregar Instrumentos" (Lista disponible para seleccionar)
  const instrumentosDisponibles = [
    { id: 'CA4674575', nombre: 'Bisturí de córnea', esp: 'Oftalmología', sub: 'Catarata', tipo: 'Básico', kit: '8' },
    { id: 'AR3436745', nombre: 'Blefaróstato de Barraquer', esp: 'Oftalmología', sub: 'Catarata', tipo: 'Avanzado', kit: '7' },
    { id: 'CA4674575', nombre: 'Pinzas de iris', esp: 'Oftalmología', sub: 'Catarata', tipo: 'Básico', kit: '6' },
    { id: 'AR3436745', nombre: 'Portaagujas de Barraquer', esp: 'Oftalmología', sub: 'Catarata', tipo: 'Avanzado', kit: '5' },
    { id: 'CA4674575', nombre: 'Bisturí de córnea', esp: 'Oftalmología', sub: 'Catarata', tipo: 'Básico', kit: '4' },
    { id: 'AR3436745', nombre: 'Blefaróstato de Barraquer', esp: 'Oftalmología', sub: 'Catarata', tipo: 'Avanzado', kit: '4' },
    { id: 'CA4674575', nombre: 'Pinzas de iris', esp: 'Oftalmología', sub: 'Catarata', tipo: 'Básico', kit: '2' },
    { id: 'AR3436745', nombre: 'Portaagujas de Barraquer', esp: 'Oftalmología', sub: 'Catarata', tipo: 'Avanzado', kit: '1' },
  ];

  // --- LÓGICA DEL MENÚ ---
  const toggleMenu = (index, e) => {
      e.stopPropagation();
      setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  useEffect(() => {
      const handleClickOutside = (event: any) => {
          if (menuRef.current && !menuRef.current.contains(event.target)) setOpenMenuIndex(null);
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- DESCARGA ---
  const handleDownload: React.FC = () => { /* Lógica de descarga igual */ };

  // --- ACCIONES DE FILA ---
  const handleRowAction = (action, item) => {
      if (action === 'Detalle') {
          setSelectedItem(item);
          setIsDetailModalOpen(true);
      }
      setOpenMenuIndex(null);
  };

  // --- COMPONENTE INPUT MODAL ---
  const ModalInput: React.FC<any> = ({ label, placeholder, icon: Icon, defaultValue, className="w-full", readOnly=false }) => (
    <div className={`relative ${className}`}>
      <label className="absolute -top-2.5 left-4 bg-white px-1 text-slate-500 text-xs font-medium z-10">
        {label}<span className="text-red-500 ml-0.5">*</span>
      </label>
      <div className="relative">
        <input 
          type="text" 
          placeholder={placeholder}
          defaultValue={defaultValue}
          readOnly={readOnly}
          className={`w-full h-10 border border-slate-300 rounded-full px-4 text-slate-600 text-sm outline-none bg-white shadow-sm ${readOnly ? 'focus:border-slate-300 cursor-default' : 'focus:border-blue-400'}`}
        />
        {Icon && <Icon className="absolute right-4 top-2.5 text-slate-400 pointer-events-none" size={18} />}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 h-full flex flex-col font-sans relative" onClick={() => setOpenMenuIndex(null)}>
      
      {/* HEADER */}
      <div className="flex items-center gap-2 text-2xl font-bold">
        <Link to="/informes" className="text-blue-500 hover:underline flex items-center gap-1"><ChevronLeft /> Informes</Link>
      </div>

      <h1 className="text-xl font-bold text-slate-600 pl-8 -mt-4">Ingreso de instrumentos de 3ros</h1>

      {/* TOOLBAR */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-center bg-white p-1 rounded-xl">
        <div className="flex flex-wrap gap-4 flex-1 w-full items-center">
           <div className="relative w-64">
              <input type="text" placeholder="Buscar..." className="w-full bg-slate-50 border-none rounded-lg py-2 pl-4 pr-10 text-sm outline-none focus:ring-1 focus:ring-blue-200 text-slate-500"/>
              <Search className="absolute right-3 top-2 text-blue-400" size={16} />
           </div>
           {/* Filtros fecha... */}
        </div>
        <div className="flex items-center gap-4">
            <button onClick={(e: any) => { e.stopPropagation(); setIsCreateModalOpen(true); }} className="flex items-center gap-1 text-blue-500 font-medium text-xs hover:text-blue-600 transition-colors">
                Crear entrega de instrumentos de 3ros <PlusCircle size={16} />
            </button>
            <button onClick={(e: any) => { e.stopPropagation(); handleDownload(); }} className="flex items-center gap-1 text-blue-500 font-medium text-xs hover:text-blue-600 transition-colors border-l border-slate-200 pl-4">
                Descargar <Download size={16} />
            </button>
        </div>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="bg-white rounded-[1rem] shadow-sm border border-slate-100 overflow-visible flex-1 flex flex-col">
        <div className="overflow-visible">
          <table className="w-full text-sm text-left">
            <thead className="bg-blue-50/50 text-slate-700 font-bold">
              <tr>
                <th className="px-6 py-4">ID de recepcion</th>
                <th className="px-6 py-4">Fecha de entrega</th>
                <th className="px-6 py-4">Hora</th>
                <th className="px-6 py-4">Entidad</th>
                <th className="px-6 py-4">Area</th>
                <th className="px-6 py-4">Cantidad ingresada</th>
                <th className="px-4 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors text-slate-500">
                  <td className="px-6 py-4">{row.id}</td>
                  <td className="px-6 py-4">{row.fecha}</td>
                  <td className="px-6 py-4">{row.hora}</td>
                  <td className="px-6 py-4">{row.entidad}</td>
                  <td className="px-6 py-4">{row.area}</td>
                  <td className="px-6 py-4">{row.cantidad}</td>
                  <td className="px-4 py-4 text-right relative">
                    <button onClick={(e: any) => toggleMenu(i, e)} className={`p-1 rounded-full transition-colors ${openMenuIndex === i ? 'bg-blue-50 text-blue-500' : 'text-slate-300 hover:text-blue-500 hover:bg-slate-50'}`}><MoreVertical size={18} /></button>
                    {openMenuIndex === i && (
                        <div ref={menuRef} className="absolute right-8 top-4 w-40 bg-white rounded-lg shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                            <div className="flex flex-col py-1">
                                <button onClick={() => handleRowAction('Detalle', row)} className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors text-left"><FileText size={14} /> Ver detalle</button>
                                <button className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors text-left"><Download size={14} /> Descargar</button>
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

      {/* ======================================================= */}
      {/* MODAL 1: CREAR (Padre)                                  */}
      {/* ======================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 font-sans">
             <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" onClick={() => setIsCreateModalOpen(false)} />
             <div className="relative bg-white w-[1000px] rounded-[30px] shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col p-8">
                <h2 className="text-2xl font-bold text-blue-500 text-center mb-6">Crear Ingreso de instrumentos de 3ros</h2>
                <div className="w-full h-px bg-slate-100 mb-6 mx-auto"></div>
                <div className="flex gap-4 mb-6 items-end">
                    <div className="w-1/4"><ModalInput label="ID de recepción" defaultValue="4386574" /></div>
                    <div className="w-1/4"><ModalInput label="Hora" icon={Clock} placeholder="00:00" /></div>
                    <div className="w-1/4"><ModalInput label="Fecha de entrega" icon={Calendar} placeholder="00/00/0000" /></div>
                    <div className="w-1/4"><ModalInput label="Evidencia" icon={Paperclip} placeholder="Adjuntar..." /></div>
                </div>
                <div className="flex justify-end mb-2">
                    <button 
                        onClick={() => setIsAddInstrumentModalOpen(true)} // ABRIR MODAL HIJO
                        className="text-blue-500 text-sm font-bold flex items-center gap-1 hover:underline"
                    >
                        Agregar instrumentos <PlusCircle size={16} />
                    </button>
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
                    <div className="bg-blue-50/50 grid grid-cols-12 px-6 py-3 border-b border-slate-200 text-slate-700 font-bold text-sm">
                        <div className="col-span-3">Código</div>
                        <div className="col-span-7 flex items-center gap-1">Nombre <ArrowDown size={14} className="text-blue-400" /></div>
                        <div className="col-span-2 text-right">Cantidad</div>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto bg-slate-50/30">
                         {/* Lista vacía por defecto o items agregados */}
                         <div className="p-8 text-center text-slate-400 italic">No hay instrumentos agregados</div>
                    </div>
                </div>
                <div className="flex justify-center gap-6 items-center mt-4">
                    <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-600 font-bold hover:text-red-500 transition-colors text-sm">Cancelar</button>
                    <button className="px-12 py-2.5 rounded-full text-white font-bold bg-gradient-to-r from-blue-400 to-emerald-400 hover:opacity-90 shadow-lg text-sm transition-transform active:scale-95">Guardar</button>
                </div>
             </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL 2: AGREGAR INSTRUMENTOS (Hijo - Z-Index mayor)    */}
      {/* ======================================================= */}
      {isAddInstrumentModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-6 font-sans">
            {/* Backdrop más oscuro para enfocar este modal */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsAddInstrumentModalOpen(false)} />
            
            <div className="relative bg-white w-[1100px] h-[700px] rounded-[30px] shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col p-8">
                
                <h2 className="text-2xl font-bold text-blue-500 text-center mb-6">Agregar instrumentos</h2>
                
                {/* FILTROS SUPERIORES */}
                <div className="flex gap-4 mb-6">
                    {/* Buscador grande */}
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            placeholder="Buscar..." 
                            className="w-full h-11 bg-slate-50 border border-slate-200 rounded-full pl-5 pr-10 text-sm outline-none focus:border-blue-400 focus:bg-white transition-all"
                        />
                        <Search className="absolute right-4 top-3 text-blue-400" size={18} />
                    </div>
                    
                    {/* Selects estilo Pill */}
                    <div className="relative w-48">
                        <select className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-500 text-sm outline-none appearance-none bg-white cursor-pointer">
                            <option>Especialidad</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16}/>
                    </div>
                    <div className="relative w-48">
                        <select className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-500 text-sm outline-none appearance-none bg-white cursor-pointer">
                            <option>Subespecialidad</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16}/>
                    </div>
                </div>

                {/* TABLA CON CHECKBOXES */}
                <div className="border border-slate-200 rounded-xl overflow-hidden flex-1 flex flex-col mb-4 bg-white">
                    <div className="bg-blue-50/50 grid grid-cols-12 px-4 py-3 border-b border-slate-200 text-slate-700 font-bold text-xs gap-2 items-center">
                        <div className="col-span-1 flex justify-center"><input type="checkbox" className="accent-blue-500 w-4 h-4" /></div>
                        <div className="col-span-2 flex items-center cursor-pointer hover:text-blue-600 gap-1">C. Intrumento <ArrowDown size={12} className="text-blue-400" /></div>
                        <div className="col-span-3 flex items-center cursor-pointer hover:text-blue-600 gap-1">Nombre <ArrowDown size={12} className="text-blue-400" /></div>
                        <div className="col-span-2">Especialidad</div>
                        <div className="col-span-2">Subespecialidad</div>
                        <div className="col-span-1">Tipo de sub...</div>
                        <div className="col-span-1 text-center">KIT</div>
                    </div>

                    <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
                        {instrumentosDisponibles.map((inst, idx) => (
                            <div key={idx} className="grid grid-cols-12 px-4 py-3 text-xs text-slate-500 hover:bg-slate-50 transition-colors gap-2 items-center">
                                <div className="col-span-1 flex justify-center"><input type="checkbox" className="accent-blue-500 w-4 h-4 cursor-pointer" /></div>
                                <div className="col-span-2">{inst.id}</div>
                                <div className="col-span-3 flex items-center gap-2 font-medium text-slate-600">
                                    <Scissors size={14} className="text-slate-400" />
                                    {inst.nombre}
                                </div>
                                <div className="col-span-2">{inst.esp}</div>
                                <div className="col-span-2">{inst.sub}</div>
                                <div className="col-span-1">{inst.tipo}</div>
                                <div className="col-span-1 text-center font-bold text-slate-400">{inst.kit}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FOOTER MODAL HIJO */}
                <div className="flex justify-between items-center mt-auto">
                    {/* Botones */}
                    <div className="flex gap-6 mx-auto pl-20"> {/* Padding left para compensar visualmente el paginador a la derecha */}
                         <button 
                            onClick={() => setIsAddInstrumentModalOpen(false)}
                            className="text-slate-600 font-bold hover:text-red-500 transition-colors text-sm"
                         >
                            Cancelar
                         </button>
                         <button 
                            onClick={() => setIsAddInstrumentModalOpen(false)}
                            className="px-10 py-2.5 rounded-full text-white font-bold bg-gradient-to-r from-blue-400 to-emerald-400 hover:opacity-90 shadow-lg text-sm transition-transform active:scale-95"
                         >
                            Aceptar
                         </button>
                    </div>

                    {/* Paginación */}
                    <div className="flex items-center gap-2 font-medium text-blue-400 text-xs">
                        <button className="hover:text-blue-600"><ChevronsLeft size={16} /></button>
                        <button className="hover:text-blue-600"><ChevronLeft size={16} /></button>
                        <span className="bg-blue-50 px-3 py-1 rounded text-blue-600 font-bold">1</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-500">3</span>
                        <button className="hover:text-blue-600"><ChevronRight size={16} /></button>
                        <button className="hover:text-blue-600"><ChevronsRight size={16} /></button>
                    </div>
                </div>

            </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL 3: VER DETALLE (Solo Lectura)                     */}
      {/* ======================================================= */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 font-sans">
             <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" onClick={() => setIsDetailModalOpen(false)} />
             <div className="relative bg-white w-[1000px] rounded-[30px] shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col p-8">
                <h2 className="text-2xl font-bold text-blue-500 text-center mb-6">Detalle Ingreso de instrumentos de 3ros</h2>
                <div className="w-full h-px bg-slate-100 mb-6 mx-auto"></div>
                <div className="flex gap-4 mb-6 items-end">
                    <div className="w-1/4"><ModalInput label="ID de recepción" defaultValue={selectedItem?.id} readOnly /></div>
                    <div className="w-1/4"><ModalInput label="Hora" icon={Clock} defaultValue={selectedItem?.hora} readOnly /></div>
                    <div className="w-1/4"><ModalInput label="Fecha de entrega" icon={Calendar} defaultValue={selectedItem?.fecha} readOnly /></div>
                    <div className="w-1/4"><ModalInput label="Evidencia" icon={Paperclip} defaultValue="Documento.pdf" readOnly /></div>
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden mb-4 mt-6">
                    <div className="bg-blue-50/50 grid grid-cols-12 px-6 py-3 border-b border-slate-200 text-slate-700 font-bold text-sm">
                        <div className="col-span-3">Código</div>
                        <div className="col-span-7 flex items-center gap-1">Nombre <ArrowDown size={14} className="text-blue-400" /></div>
                        <div className="col-span-2 text-right">Cantidad</div>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto bg-slate-50/30">
                         {/* Lista dummy para detalle */}
                         <div className="p-4 text-center text-slate-400 italic">Instrumentos agregados...</div>
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-600 font-bold hover:text-red-500 transition-colors text-sm px-6 py-2">Cerrar</button>
                </div>
             </div>
        </div>
      )}

    </div>
  );
};

export default IngresoInstrumentosScreen;