import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ChevronDown, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Calendar, 
  Paperclip, 
  Upload,
  X
} from 'lucide-react';

const AlmacenamientoScreen: React.FC = () => {
  // Estados para el menú y el modal
  const [openMenuIndex, setOpenMenuIndex] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const menuRef = useRef(null);

  // Datos simulados
  const data = [
    { fecha: '08/04/2025', instr: 'Bisturí de córnea', esp: 'Facovit 3', sub: 'Carmen', tipo: 'Daño', kit: 'Fa-11', venc: '10/04/2025' },
    { fecha: '18/02/2026', instr: 'Autorrefractómetro', esp: 'Refracción', sub: 'Pablo', tipo: 'Desgaste', kit: 'Aut-02', venc: '27/12/2025' },
    { fecha: '10/06/2025', instr: 'Láser de Argón', esp: 'Retinopatía', sub: 'Lucía', tipo: 'Uso normal', kit: 'Ret-15', venc: '10/04/2025' },
    { fecha: '12/08/2025', instr: 'Tonometría de Goldmann', esp: 'Presión ocular', sub: 'Sebastián', tipo: 'Desgaste', kit: 'Ton-04', venc: '27/12/2025' },
    { fecha: '14/10/2025', instr: 'Cirugía refractiva', esp: 'Miopía', sub: 'Diego', tipo: 'Éxito', kit: 'Cir-01', venc: '10/04/2025' },
  ];

  // --- LÓGICA DEL MENÚ ---
  const toggleMenu = (index, e) => {
      e.stopPropagation();
      setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  useEffect(() => {
      const handleClickOutside = (event: any) => {
          if (menuRef.current && !menuRef.current.contains(event.target)) {
              setOpenMenuIndex(null);
          }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenSeguimiento: React.FC = () => {
    setOpenMenuIndex(null);
    setIsModalOpen(true);
  };

  // --- COMPONENTE DE INPUT ESTILIZADO (Para el Modal) ---
  const ModalInput: React.FC<any> = ({ label, placeholder = "", icon: Icon, required = false, type = "text", isSelect = false, className = "" }) => (
    <div className={`relative ${className}`}>
      <label className="absolute -top-2.5 left-4 bg-white px-1 text-slate-500 text-xs font-medium z-10 whitespace-nowrap">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {isSelect ? (
           <div className="relative">
             <select className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 text-sm outline-none focus:border-blue-400 appearance-none bg-white cursor-pointer shadow-sm">
                <option value="">{placeholder}</option>
                <option value="1">Opción 1</option>
             </select>
             <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16}/>
           </div>
        ) : (
           <>
             <input 
               type={type} 
               placeholder={placeholder}
               className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 text-sm outline-none focus:border-blue-400 shadow-sm transition-all placeholder-slate-300"
             />
             {Icon && (
               <Icon className="absolute right-4 top-3 text-slate-400 pointer-events-none" size={16} />
             )}
           </>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 h-full flex flex-col font-sans relative" onClick={() => setOpenMenuIndex(null)}>
      
      {/* Título */}
      <h1 className="text-3xl font-bold text-blue-500">Almacenamiento</h1>

      {/* Barra de Herramientas */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-transparent">
        <div className="relative w-full md:w-64">
             <select className="w-full h-10 pl-4 pr-10 border border-slate-300 rounded-full text-slate-500 text-sm appearance-none outline-none focus:border-blue-400 bg-white">
                 <option>Estado</option>
                 <option>Disponible</option>
                 <option>En uso</option>
             </select>
             <ChevronDown className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={18} />
        </div>

        <div className="relative flex-1 w-full">
            <input 
                type="text" 
                placeholder="Buscar..." 
                className="w-full h-10 bg-blue-50/50 border-none rounded-xl py-2 pl-4 pr-10 text-sm outline-none focus:ring-1 focus:ring-blue-200 text-slate-500 placeholder-slate-300"
            />
            <Search className="absolute right-3 top-2.5 text-blue-400" size={18} />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-[1rem] shadow-sm border border-slate-100 overflow-visible flex-1 flex flex-col">
        <div className="overflow-visible">
          <table className="w-full text-sm text-left">
            <thead className="bg-blue-50/30 text-slate-700 font-bold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Fecha</th>
                <th className="px-6 py-4 whitespace-nowrap">Instrumento</th>
                <th className="px-6 py-4 whitespace-nowrap">Especialidad</th>
                <th className="px-6 py-4 whitespace-nowrap">Sub-especialidad</th>
                <th className="px-6 py-4 whitespace-nowrap">T. Sub-especialidad</th>
                <th className="px-6 py-4 whitespace-nowrap">KIT</th>
                <th className="px-6 py-4 whitespace-nowrap">Vencimiento esterilización</th>
                <th className="px-4 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors text-slate-500">
                  <td className="px-6 py-4">{row.fecha}</td>
                  <td className="px-6 py-4 font-medium text-slate-600">{row.instr}</td>
                  <td className="px-6 py-4">{row.esp}</td>
                  <td className="px-6 py-4">{row.sub}</td>
                  <td className="px-6 py-4">{row.tipo}</td>
                  <td className="px-6 py-4">{row.kit}</td>
                  <td className="px-6 py-4">{row.venc}</td>
                  
                  {/* MENÚ DE TRES PUNTOS */}
                  <td className="px-4 py-4 text-right relative">
                    <button 
                        onClick={(e: any) => toggleMenu(i, e)}
                        className={`p-1 rounded-full transition-colors ${openMenuIndex === i ? 'bg-blue-50 text-blue-500' : 'text-slate-300 hover:text-blue-500 hover:bg-slate-50'}`}
                    >
                        <MoreVertical size={20} />
                    </button>

                    {openMenuIndex === i && (
                        <div ref={menuRef} className="absolute right-8 top-8 w-40 bg-white rounded-lg shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                            <div className="flex flex-col py-1">
                                <button 
                                    onClick={handleOpenSeguimiento}
                                    className="flex items-center gap-2 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors text-left font-medium"
                                >
                                    <FileText size={16} /> Seguimiento
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
        
        {/* Paginación */}
        <div className="mt-auto p-4 flex justify-between items-center text-xs text-slate-300 border-t border-slate-50">
            <span>Pág. 2 de 14 (135 encontrados)</span>
            <div className="flex items-center gap-2 font-medium text-blue-400">
                <button className="hover:text-blue-600"><ChevronLeft size={14} /></button>
                <span className="bg-blue-50 px-2 py-0.5 rounded text-blue-600">1</span>
                <span>/</span><span>3</span>
                <button className="hover:text-blue-600"><ChevronRight size={14} /></button>
            </div>
        </div>
      </div>

      {/* ======================================================= */}
      {/* MODAL: SEGUIMIENTO (Diseño de la imagen) */}
      {/* ======================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 font-sans">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" onClick={() => setIsModalOpen(false)} />
            
            <div className="relative bg-white w-[1000px] rounded-[30px] shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col p-8 overflow-y-auto max-h-full">
                
                {/* Título */}
                <h2 className="text-3xl font-bold text-blue-500 text-center mb-8">
                    Seguimiento
                </h2>

                <div className="w-full h-px bg-slate-100 mb-8 mx-auto"></div>

                {/* Sección Código Responsable (PIN) */}
                <div className="flex justify-center items-center gap-4 mb-8">
                    <span className="font-bold text-slate-700 text-sm">Código Responsable*</span>
                    <div className="flex gap-3">
                        {[1, 2, 3, 4].map((_, idx) => (
                            <div key={idx} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 font-bold border border-slate-200">
                                #
                            </div>
                        ))}
                    </div>
                </div>

                {/* Formulario Grid */}
                <div className="flex flex-col gap-6">
                    
                    {/* Fila 1 */}
                    <div className="grid grid-cols-4 gap-4">
                        <ModalInput label="Código" placeholder="Cor2" />
                        <ModalInput label="Cód. Instrumento" placeholder="CABA05" />
                        <ModalInput label="Nombre del instrumento" placeholder="Cucharillas de Graefe" className="col-span-1" />
                        <ModalInput label="KIT" placeholder="Cor2" />
                    </div>

                    {/* Fila 2 */}
                    <div className="grid grid-cols-3 gap-4">
                        <ModalInput label="Especialidad" placeholder="Cornea" />
                        <ModalInput label="Responsable del reporte" placeholder="Pedro Alonso Mejía Castellanos" />
                        <ModalInput label="Fecha baja" placeholder="00/00/0000" icon={Calendar} />
                    </div>

                    {/* Fila 3 */}
                    <div className="grid grid-cols-3 gap-4">
                        <ModalInput label="Descripción del daño" placeholder="Se doblo la punta mientras se hacia el procedimiento" required className="col-span-2" />
                        <ModalInput label="Evidencia" placeholder="Documento.pdf" icon={Paperclip} />
                    </div>

                    {/* Fila 4 */}
                    <div className="grid grid-cols-3 gap-4">
                        <ModalInput label="Tipo de daño" placeholder="Deterioro" isSelect />
                        <ModalInput label="Responsable de mantenimiento" placeholder="Juan Camilo Aristizábal Guerrero" required isSelect />
                        <ModalInput label="Días de mantenimiento" placeholder="Daño.pdf" required />
                    </div>

                    {/* Fila 5 */}
                    <div>
                        <ModalInput label="Descripción" placeholder="Se doblo la punta mientras se hacia el procedimiento" />
                    </div>

                    {/* Footer y Acciones */}
                    <div className="flex flex-wrap items-end justify-between mt-4 gap-4">
                        
                        {/* Radio Destino */}
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span className="font-bold text-slate-700">Destino</span>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <div className="w-5 h-5 rounded-full border-2 border-teal-400 flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 bg-teal-400 rounded-full"></div>
                                </div>
                                Control de bajas y retiros
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                                <div className="w-5 h-5 rounded-full border border-slate-300"></div>
                                Reingreso
                            </label>
                        </div>

                        {/* Botones Derecha */}
                        <div className="flex gap-4 items-end">
                            <button className="flex items-center gap-2 px-6 py-2.5 border border-slate-300 rounded-full text-slate-500 text-sm hover:border-blue-400 transition-colors">
                                Informe mantenimiento* <Paperclip size={16} />
                            </button>
                            <ModalInput label="Fecha de gestión" placeholder="00/00/0000" icon={Calendar} className="w-40" />
                        </div>
                    </div>

                    {/* Botones Finales */}
                    <div className="flex justify-center gap-10 mt-6">
                         <button 
                            onClick={() => setIsModalOpen(false)}
                            className="text-slate-600 font-bold hover:text-red-500 transition-colors text-sm"
                        >
                            Cancelar
                        </button>
                        <button className="px-12 py-2.5 rounded-full text-white font-bold bg-gradient-to-r from-blue-400 to-emerald-400 hover:opacity-90 shadow-lg text-sm">
                            Guardar
                        </button>
                    </div>

                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default AlmacenamientoScreen;