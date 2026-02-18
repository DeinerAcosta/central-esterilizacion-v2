import React, { useState, useEffect, useRef } from 'react';
import { Search, PlusCircle, Info, ChevronDown, X, Paperclip, Calendar, MoreVertical, FileText, Activity, Settings } from 'lucide-react';

const ReportesScreen: React.FC = () => {
  // --- ESTADOS ---
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [openMenuIndex, setOpenMenuIndex] = useState<any>(null);
  const menuRef = useRef(null);

  // Control del modo del modal: 'create', 'manage' (gestionar), 'followup' (seguimiento), 'view' (ver detalle)
  const [modalMode, setModalMode] = useState<any>('create');
  const [selectedReport, setSelectedReport] = useState<any>(null);

  // Datos simulados (Más completos y con variados estados)
  const reportsData = [
    { 
        id: 1, date: '08/04/2025', instrument: 'Bisturí de córnea', spec: 'Facovit 3', kit: 'Fa-11', user: 'Carmen', type: 'Daño', provider: 'Opti S.A.S.', obs: 'Se dobló la punta durante el procedimiento.', status: 'Pendiente', code: '120', lot: '98654413', resp: 'Pedro Alonso Mejía' 
    },
    { 
        id: 2, date: '18/02/2026', instrument: 'Autorrefractómetro', spec: 'Refracción', kit: 'Aut-02', user: 'Pablo', type: 'Desgaste', provider: 'Topcon', obs: 'El equipo presenta ruidos al encender.', status: 'En curso', code: '121', lot: '11223344', resp: 'Maria Fernanda Lopez' 
    },
    { 
        id: 3, date: '10/06/2025', instrument: 'Láser de Argón', spec: 'Retinopatía', kit: 'Ret-15', user: 'Lucía', type: 'Uso normal', provider: 'Opti S.A.S.', obs: 'Mantenimiento preventivo programado.', status: 'Finalizado', code: '122', lot: '55667788', resp: 'Carlos Andres Perez' 
    },
    { 
        id: 4, date: '12/06/2025', instrument: 'Microscopio Opmi', spec: 'Cirugía', kit: 'Mic-01', user: 'Andrea', type: 'Fallo eléctrico', provider: 'Zeiss', obs: 'No enciende la luz principal.', status: 'Pendiente', code: '123', lot: '99887766', resp: 'Luisa Martinez' 
    },
  ];

  // --- HANDLERS ---

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente': return 'bg-amber-50 text-amber-500 border-amber-100';
      case 'En curso': return 'bg-blue-50 text-blue-500 border-blue-100';
      case 'Finalizado': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  // Abrir Modal según la acción
  const handleOpenModal = (mode, report = null) => {
    setModalMode(mode);
    setSelectedReport(report);
    setOpenMenuIndex(null);
    setIsModalOpen(true);
  };

  // Determinar si es solo lectura
  const isReadOnly = modalMode === 'view';

  // --- COMPONENTE INPUT AUXILIAR ---
  const FormField: React.FC<any> = ({ label, placeholder, value, icon: Icon, type = "text", required = false, isSelect = false, readOnly = false }) => (
    <div className="flex flex-col gap-1 w-full">
        <label className="text-[11px] font-bold text-slate-500 ml-3 truncate">
            {label}
            {required && !readOnly && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <div className="relative">
            {isSelect ? (
                <>
                    <select 
                        disabled={readOnly}
                        defaultValue={value || placeholder}
                        className={`w-full h-10 px-4 border rounded-full text-slate-600 text-sm outline-none appearance-none truncate pr-8 transition-colors
                        ${readOnly ? 'bg-slate-100 border-slate-200 cursor-not-allowed text-slate-500' : 'bg-white border-slate-300 focus:border-blue-400'}`}
                    >
                        <option>{placeholder}</option>
                        {/* Opciones simuladas */}
                        <option>Daño</option>
                        <option>Desgaste</option>
                        <option>Uso normal</option>
                    </select>
                    {!readOnly && <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none"/>}
                </>
            ) : (
                <>
                    <input 
                        type={type} 
                        defaultValue={value} 
                        readOnly={readOnly}
                        placeholder={placeholder}
                        className={`w-full h-10 px-4 border rounded-full text-slate-600 text-sm outline-none transition-colors
                        ${readOnly ? 'bg-slate-100 border-slate-200 cursor-not-allowed text-slate-500' : 'bg-white border-slate-300 focus:border-blue-400 placeholder:text-slate-300'}`}
                    />
                    {Icon && <Icon size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none"/>}
                </>
            )}
        </div>
    </div>
  );

  return (
    <div className="space-y-6 h-full flex flex-col font-sans relative z-0" onClick={() => setOpenMenuIndex(null)}>
      
      {/* --- VISTA PRINCIPAL (FONDO) --- */}
      <h1 className="text-3xl font-bold text-blue-500">Reporte</h1>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-2 rounded-xl relative z-10">
        <div className="flex gap-4 flex-1 w-full md:w-auto">
           <button className="flex items-center justify-between gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-500 text-sm font-medium w-40">
              <span>Estado</span> <ChevronDown size={16} />
           </button>
           <div className="relative flex-1 max-w-2xl">
              <input type="text" placeholder="Buscar..." className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-5 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-100"/>
              <Search className="absolute right-4 top-2.5 text-blue-400" size={18} />
           </div>
        </div>
        {/* BOTÓN CREAR */}
        <button 
            onClick={() => handleOpenModal('create')}
            className="flex items-center gap-2 text-blue-500 font-medium text-sm hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
        >
            Crear reporte <PlusCircle size={18} />
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden flex-1 relative z-0">
        <div className="overflow-visible">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Fecha</th>
                <th className="px-6 py-4 whitespace-nowrap">Instrumento</th>
                <th className="px-6 py-4 whitespace-nowrap">Especialidad</th>
                <th className="px-6 py-4 whitespace-nowrap">KIT</th>
                <th className="px-6 py-4 whitespace-nowrap">Quien reporta</th>
                <th className="px-6 py-4 whitespace-nowrap">Tipo reporte</th>
                <th className="px-6 py-4 whitespace-nowrap">Proveedor</th>
                <th className="px-6 py-4 whitespace-nowrap">Observaciones</th>
                <th className="px-6 py-4 text-center whitespace-nowrap">Estado</th>
                <th className="px-4 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {reportsData.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{row.date}</td>
                  <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">{row.instrument}</td>
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{row.spec}</td>
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{row.kit}</td>
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{row.user}</td>
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{row.type}</td>
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{row.provider}</td>
                  <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{row.obs}</td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(row.status)}`}>{row.status}</span>
                  </td>
                  
                  {/* ACCIONES (MENÚ TRES PUNTOS) */}
                  <td className="px-4 py-4 text-right relative">
                    <button 
                        onClick={(e: any) => toggleMenu(index, e)}
                        className={`p-2 rounded-full transition-colors ${openMenuIndex === index ? 'bg-blue-50 text-blue-500' : 'text-slate-300 hover:text-blue-500 hover:bg-slate-50'}`}
                    >
                        <MoreVertical size={20} />
                    </button>

                    {/* MENÚ FLOTANTE */}
                    {openMenuIndex === index && (
                        <div ref={menuRef} className="absolute right-8 top-8 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden text-left">
                            <div className="flex flex-col py-1">
                                
                                {/* OPCIÓN PENDIENTE -> GESTIONAR */}
                                {row.status === 'Pendiente' && (
                                    <button 
                                        onClick={() => handleOpenModal('manage', row)}
                                        className="flex items-center gap-3 px-4 py-3 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors font-bold"
                                    >
                                        <Settings size={16} /> Gestionar reporte
                                    </button>
                                )}

                                {/* OPCIÓN EN CURSO -> SEGUIMIENTO */}
                                {row.status === 'En curso' && (
                                    <button 
                                        onClick={() => handleOpenModal('followup', row)}
                                        className="flex items-center gap-3 px-4 py-3 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors font-bold"
                                    >
                                        <Activity size={16} /> Seguimiento
                                    </button>
                                )}

                                {/* OPCIÓN FINALIZADO -> VER DETALLE */}
                                {row.status === 'Finalizado' && (
                                    <button 
                                        onClick={() => handleOpenModal('view', row)}
                                        className="flex items-center gap-3 px-4 py-3 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors font-bold"
                                    >
                                        <FileText size={16} /> Ver detalle
                                    </button>
                                )}

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

      {/* ==================================================================================== */}
      {/* MODAL: DINÁMICO (CREAR / GESTIONAR / VER) */}
      {/* ==================================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-sans">
            {/* Overlay Oscuro */}
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
                onClick={() => setIsModalOpen(false)}
            ></div>

            {/* Contenedor del Modal */}
            <div className="relative bg-white w-[791px] min-h-[433px] rounded-[30px] shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center pt-8 pb-10 px-12">
                
                {/* 1. HEADER DINÁMICO */}
                <h2 className="text-[26px] font-extrabold text-[#3B82F6] mb-4">
                    {modalMode === 'create' && 'Crear reporte'}
                    {modalMode === 'manage' && 'Gestionar reporte'}
                    {modalMode === 'followup' && 'Seguimiento de reporte'}
                    {modalMode === 'view' && 'Detalle del reporte'}
                </h2>
                
                {/* Línea separadora sutil */}
                <div className="w-full h-px bg-slate-100 absolute top-[70px] left-0"></div>

                {/* 2. CÓDIGO RESPONSABLE (Visual PIN) */}
                <div className="mt-6 mb-8 flex items-center justify-center gap-4 bg-white p-2 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.03)] border border-slate-50">
                    <span className="font-bold text-slate-700 text-sm ml-2">Código Responsable{modalMode !== 'view' && <span className="text-red-500">*</span>}</span>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map((_, i) => (
                            <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isReadOnly ? 'bg-slate-200 text-slate-400' : 'bg-slate-100 text-slate-300'}`}>#</div>
                        ))}
                    </div>
                </div>

                {/* 3. GRID FORMULARIO */}
                <div className="w-full grid grid-cols-12 gap-x-4 gap-y-5 mb-10">
                    
                    {/* FILA 1 */}
                    <div className="col-span-2">
                        <FormField label="Código" value={selectedReport?.code || "120"} readOnly={true} /> {/* Código siempre suele ser auto/readonly */}
                    </div>
                    <div className="col-span-3">
                        <FormField label="Cód. Instrumento" value={selectedReport?.id ? `INS-${selectedReport.id}` : ''} placeholder="" required readOnly={isReadOnly} />
                    </div>
                    <div className="col-span-5">
                        <FormField label="Nombre del instrumento" value={selectedReport?.instrument || "Cucharillas de Graefe"} readOnly={isReadOnly} />
                    </div>
                    <div className="col-span-2">
                        <FormField label="KIT" value={selectedReport?.kit || "Cor2"} readOnly={isReadOnly} />
                    </div>

                    {/* FILA 2 */}
                    <div className="col-span-3">
                        <FormField label="Especialidad" value={selectedReport?.spec || "Cornea"} readOnly={isReadOnly} />
                    </div>
                    <div className="col-span-3">
                        <FormField label="No. de Lote" value={selectedReport?.lot || "98654413"} readOnly={isReadOnly} />
                    </div>
                    <div className="col-span-4">
                        <FormField label="Responsable del reporte" value={selectedReport?.resp || "Pedro Alonso Mejía Castellanos"} readOnly={isReadOnly} />
                    </div>
                    <div className="col-span-2">
                         <FormField label="Fecha baja" value={selectedReport?.date || ""} placeholder="00/00/0000" icon={Calendar} readOnly={isReadOnly} />
                    </div>

                    {/* FILA 3 */}
                    <div className="col-span-3">
                        <FormField label="Tipo de daño" value={selectedReport?.type || "Seleccionar"} placeholder="Seleccionar" required isSelect readOnly={isReadOnly} />
                    </div>
                    <div className="col-span-7">
                        <FormField label="Descripción del daño" value={selectedReport?.obs || ""} placeholder="" required readOnly={isReadOnly} />
                    </div>
                    <div className="col-span-2">
                        <FormField label="Evidencia" placeholder="" required icon={Paperclip} readOnly={isReadOnly} />
                    </div>
                </div>

                {/* 4. FOOTER BOTONES */}
                <div className="flex gap-12 items-center">
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="text-slate-500 font-bold hover:text-slate-700 transition-colors"
                    >
                        {isReadOnly ? 'Cerrar' : 'Cancelar'}
                    </button>
                    
                    {!isReadOnly && (
                        <button className="px-12 py-3 rounded-full text-white font-bold bg-gradient-to-r from-[#3B82F6] to-[#2DD4BF] hover:opacity-90 shadow-lg shadow-blue-200 transition-transform active:scale-95">
                            {modalMode === 'create' ? 'Guardar' : 'Actualizar'}
                        </button>
                    )}
                </div>

            </div>
        </div>
      )}
    </div>
  );
};

export default ReportesScreen;