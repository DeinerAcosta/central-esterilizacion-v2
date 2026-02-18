import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  PlusCircle, 
  ChevronLeft, 
  Calendar, 
  MoreVertical, 
  ChevronRight,
  Clock, 
  Paperclip, 
  ChevronDown,
  Download,
  Edit
} from 'lucide-react';

const RegistroEsterilizacionScreen: React.FC = () => {
  // --- ESTADOS ---
  const [isModalOpen, setIsModalOpen] = useState<any>(false); // Modal Crear (Mantenemos el existente)
  const [isEditModalOpen, setIsEditModalOpen] = useState<any>(false); // NUEVO: Modal Editar
  const [editingItem, setEditingItem] = useState<any>(null); // NUEVO: Datos del ítem a editar
  
  const [openMenuIndex, setOpenMenuIndex] = useState<any>(null);
  const menuRef = useRef(null);

  const data = [
    { no: 1, fecha: '06/02/2023', lote: '5665/1', temp: '734°C', presion: '30lb', inicio: '11:00am', salida: '12:20pm' },
    { no: 2, fecha: '18/12/2024', lote: '5666/1', temp: '738°C', presion: '29lb', inicio: '8:00am', salida: '9:20pm' },
    { no: 3, fecha: '30/10/2026', lote: '5667/1', temp: '734°C', presion: '30lb', inicio: '10:00am', salida: '11:10pm' },
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
      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, []);

  // --- MANEJO DE ACCIONES DE FILA ---
  const handleRowAction = (action, item) => {
      if (action === 'Editar') {
        // Abrir el modal de edición con el diseño solicitado
        setEditingItem(item);
        setIsEditModalOpen(true);
      } else if (action === 'Descargar') {
        // Ejecutar descarga individual
        handleSingleDownload(item);
      }
      setOpenMenuIndex(null);
  };

  // --- COMPONENTE INPUT MODAL (Reutilizable) ---
  const ModalInput: React.FC<any> = ({ label, placeholder = "", icon: Icon, required = false, type = "text", isSelect = false, className = "" }) => (
    <div className={`relative w-full ${className}`}>
      <label className="absolute -top-2.5 left-4 bg-white px-1 text-slate-500 text-xs font-medium z-10">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      
      <div className="relative">
        {isSelect ? (
           <div className="relative">
             <select className="w-full h-12 border border-slate-300 rounded-full px-4 text-slate-600 text-sm outline-none focus:border-blue-400 appearance-none bg-white cursor-pointer shadow-sm">
                <option value="">{placeholder}</option>
                <option value="1">Opción 1</option>
             </select>
             <ChevronDown className="absolute right-4 top-4 text-slate-400 pointer-events-none" size={18}/>
           </div>
        ) : (
           <>
             <input 
               type={type} 
               placeholder={placeholder}
               className="w-full h-12 border border-slate-300 rounded-full px-4 text-slate-600 text-sm outline-none focus:border-blue-400 shadow-sm transition-all"
             />
             {Icon && (
               <Icon className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={18} />
             )}
           </>
        )}
      </div>
    </div>
  );

  // --- DESCARGA GLOBAL (Todo) ---
  const handleDownload: React.FC = () => {
    generateCSV(data, "registro_esterilizacion_completo.csv");
  };

  // --- DESCARGA INDIVIDUAL (Solo una fila) ---
  const handleSingleDownload = (item) => {
    generateCSV([item], `registro_${item.fecha.replace(/\//g, '-')}_lote_${item.lote.replace('/', '-')}.csv`);
  };

  // Función auxiliar para generar CSV
  const generateCSV = (rowsData, filename) => {
    const headers = "No,Fecha,Lote/Carga,Equipo,Instrumental,Temperatura,Libras Presion,Hora Inicio,Hora Salida\n";
    const rows = rowsData.map(row => 
      `${row.no},${row.fecha},${row.lote},--,--,${row.temp},${row.presion},${row.inicio},${row.salida}`
    ).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 h-full flex flex-col font-sans relative" onClick={() => setOpenMenuIndex(null)}>
      <div className="flex items-center gap-2 text-2xl font-bold">
        <Link to="/informes" className="text-blue-500 hover:underline flex items-center gap-1"><ChevronLeft /> Informes</Link>
      </div>
      <h1 className="text-xl font-bold text-slate-600 pl-8 -mt-4">Registro de esterilización</h1>
      
      {/* BARRA SUPERIOR */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-center bg-white p-1 rounded-xl">
        <div className="flex flex-wrap gap-4 flex-1 w-full items-center">
           <div className="relative w-64"><input type="text" placeholder="Buscar..." className="w-full bg-slate-50 border-none rounded-lg py-2 pl-4 pr-10 text-sm outline-none focus:ring-1 focus:ring-blue-200 text-slate-500"/><Search className="absolute right-3 top-2 text-blue-400" size={16} /></div>
           <div className="flex gap-2">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-400 text-sm"><span>Fecha desde</span> <Calendar size={16} /></button>
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-400 text-sm"><span>Fecha hasta</span> <Calendar size={16} /></button>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
            <button 
                onClick={(e: any) => { e.stopPropagation(); setIsModalOpen(true); }} 
                className="flex items-center gap-1 text-blue-500 font-medium text-xs hover:text-blue-600 transition-colors"
            >
                Crear registro de indicador <PlusCircle size={16} />
            </button>
            <button 
                onClick={(e: any) => { e.stopPropagation(); handleDownload(); }}
                className="flex items-center gap-1 text-blue-500 font-medium text-xs hover:text-blue-600 transition-colors border-l border-slate-200 pl-4"
            >
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
                <th className="px-6 py-4">Nº</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Lote/Carga</th>
                <th className="px-6 py-4">Equipo</th>
                <th className="px-6 py-4">Instrumental</th>
                <th className="px-6 py-4">Temperatura</th>
                <th className="px-6 py-4">Libras presión</th>
                <th className="px-6 py-4">Hora de inicio</th>
                <th className="px-6 py-4">Hora de salida</th>
                <th className="px-4 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors text-slate-500">
                  <td className="px-6 py-4">{row.no}</td>
                  <td className="px-6 py-4">{row.fecha}</td>
                  <td className="px-6 py-4">{row.lote}</td>
                  <td className="px-6 py-4">--</td>
                  <td className="px-6 py-4">--</td>
                  <td className="px-6 py-4">{row.temp}</td>
                  <td className="px-6 py-4">{row.presion}</td>
                  <td className="px-6 py-4">{row.inicio}</td>
                  <td className="px-6 py-4">{row.salida}</td>
                  
                  <td className="px-4 py-4 text-right relative">
                    <button 
                        onClick={(e: any) => toggleMenu(i, e)}
                        className={`p-1 rounded-full transition-colors ${openMenuIndex === i ? 'bg-blue-50 text-blue-500' : 'text-slate-300 hover:text-blue-500 hover:bg-slate-50'}`}
                    >
                        <MoreVertical size={18} />
                    </button>

                    {/* Menú Desplegable */}
                    {openMenuIndex === i && (
                        <div ref={menuRef} className="absolute right-8 top-4 w-32 bg-white rounded-lg shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                            <div className="flex flex-col py-1">
                                <button 
                                    onClick={() => handleRowAction('Editar', row)}
                                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors text-left"
                                >
                                    <Edit size={14} /> Editar
                                </button>
                                <button 
                                    onClick={() => handleRowAction('Descargar', row)}
                                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors text-left"
                                >
                                    <Download size={14} /> Descargar
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
        <div className="mt-auto p-4 flex justify-between items-center text-xs text-slate-300">
            <span>Pág. 2 de 14</span>
            <div className="flex items-center gap-2 font-medium text-blue-400"><button><ChevronLeft size={14} /></button>1/3<button><ChevronRight size={14} /></button></div>
        </div>
      </div>

      {/* ======================================================= */}
      {/* MODAL CREAR (Mantenemos el existente) */}
      {/* ======================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 font-sans">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" onClick={() => setIsModalOpen(false)} />
            <div className="relative bg-white w-[1100px] rounded-[30px] shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col p-10 overflow-y-auto max-h-full">
                <h2 className="text-3xl font-bold text-blue-500 text-center mb-10">Crear registro de esterilización</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 mb-10">
                    <ModalInput label="Fecha" placeholder="00/00/0000" icon={Calendar} />
                    <ModalInput label="Lote/Carga" required />
                    <ModalInput label="Equipo" required />
                    <ModalInput label="Instrumental" required icon={Calendar} /> 
                    <ModalInput label="Temperatura" required />
                    <ModalInput label="Temperatura C°" required />
                    <ModalInput label="Libras Presión" required />
                    <ModalInput label="Hora de inicio" required icon={Clock} />
                    <ModalInput label="Hora de salida" required icon={Clock} />
                    <ModalInput label="Responsable" required isSelect />
                    <ModalInput label="Integrador Qco" required icon={Paperclip} />
                    <ModalInput label="Indicador Biologico" required icon={Paperclip} />
                </div>
                <div className="flex justify-center gap-12 mt-auto">
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-600 font-bold hover:text-red-500 transition-colors text-base">Cancelar</button>
                    <button className="px-16 py-3 rounded-full text-white font-bold bg-gradient-to-r from-blue-400 to-emerald-400 hover:opacity-90 shadow-lg shadow-blue-200/50 transition-transform active:scale-95 text-base">Guardar</button>
                </div>
            </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL EDITAR (Diseño solicitado en la imagen) */}
      {/* ======================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 font-sans">
            {/* Fondo oscuro con blur */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" onClick={() => setIsEditModalOpen(false)} />
            
            {/* Contenedor del Modal - Ancho ajustado a la imagen */}
            <div className="relative bg-white w-[900px] rounded-[24px] shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col p-8 overflow-y-auto">
                
                {/* Título en azul */}
                <h2 className="text-2xl font-bold text-blue-500 text-center mb-8">
                    Editar registro de indicador
                </h2>

                {/* GRID: Replica exacta de la imagen */}
                <div className="flex flex-col gap-6 mb-8">
                    
                    {/* Fila 1: Fecha - Nombre - Intervención */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ModalInput 
                            label="Fecha" 
                            placeholder={editingItem?.fecha || "00/00/0000"} 
                            icon={Calendar} 
                        />
                        <ModalInput 
                            label="Nombre" 
                            placeholder="Felipe Cantillo Lara" 
                            isSelect 
                        />
                        <ModalInput 
                            label="Intervención" 
                            placeholder="Plástica" 
                        />
                    </div>

                    {/* Fila 2: Quirofano - Equipo - Cantidad */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ModalInput 
                            label="Quirofano" 
                            placeholder="8" 
                            isSelect 
                        />
                        <ModalInput 
                            label="Equipo" 
                            placeholder="Plástico" 
                            isSelect 
                        />
                        <ModalInput 
                            label="Cantidad" 
                            placeholder="1" 
                        />
                    </div>

                    {/* Fila 3: Indicadores (2 columnas anchas) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ModalInput 
                            label="Indicador del paquete" 
                            required 
                            icon={Paperclip} 
                        />
                        <ModalInput 
                            label="Indicador del instrumental" 
                            required 
                            icon={Paperclip} 
                        />
                    </div>
                </div>

                {/* BOTONES (Estilo exacto de la imagen) */}
                <div className="flex justify-center gap-8 mt-4">
                    <button 
                        onClick={() => setIsEditModalOpen(false)}
                        className="text-slate-500 font-bold hover:text-red-500 transition-colors text-sm px-6"
                    >
                        Cancelar
                    </button>
                    <button 
                        className="px-12 py-2.5 rounded-full text-white font-bold bg-gradient-to-r from-blue-400 to-emerald-400 hover:opacity-90 shadow-lg shadow-blue-200/50 transition-transform active:scale-95 text-sm"
                    >
                        Guardar
                    </button>
                </div>

            </div>
        </div>
      )}

    </div>
  );
};

export default RegistroEsterilizacionScreen;