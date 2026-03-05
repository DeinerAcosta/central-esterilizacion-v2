import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  PlusCircle, 
  Download, 
  ChevronLeft, 
  Calendar, 
  ChevronRight, 
  Clock, 
  ArrowDown,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical 
} from 'lucide-react';

const DevolucionInstrumentosScreen: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<any>(false); // Modal "Crear Devolución"
  const [isSelectIngresoOpen, setIsSelectIngresoOpen] = useState<any>(false); // Modal "Seleccionar Ingreso"
  
  // Estados para el menú desplegable de filas
  const [openMenuIndex, setOpenMenuIndex] = useState<any>(null);
  const menuRef = useRef(null);

  // Datos principales (Pantalla base)
  const data = [
    { id: '7356345', fecha: '03/05/2025', hora: '10:30 am', entidad: '--', area: '--', ingresada: 24, devuelta: 20, pendientes: 4 },
    { id: '3853564', fecha: '03/05/2025', hora: '9:15 am', entidad: '--', area: '--', ingresada: 32, devuelta: 26, pendientes: 6 },
    { id: '7356345', fecha: '03/05/2025', hora: '10:30 am', entidad: '--', area: '--', ingresada: 24, devuelta: 20, pendientes: 4 },
  ];

  // Datos para el Modal de "Seleccionar Ingreso"
  const dataIngresos = [
    { id: '7356345', fecha: '03/05/2025', hora: '10:30 am', entidad: '--', area: '--', cant: 21 },
    { id: '3853564', fecha: '03/05/2025', hora: '9:15 am', entidad: '--', area: '--', cant: 35 },
    { id: '7356345', fecha: '03/05/2025', hora: '10:30 am', entidad: '--', area: '--', cant: 21 },
    { id: '3853564', fecha: '03/05/2025', hora: '9:15 am', entidad: '--', area: '--', cant: 35 },
    { id: '7356345', fecha: '03/05/2025', hora: '10:30 am', entidad: '--', area: '--', cant: 21 },
    { id: '3853564', fecha: '03/05/2025', hora: '9:15 am', entidad: '--', area: '--', cant: 35 },
  ];

  // --- LÓGICA DEL MENÚ ---
  const toggleMenu = (index, e) => {
      e.stopPropagation();
      if (openMenuIndex === index) {
          setOpenMenuIndex(null);
      } else {
          setOpenMenuIndex(index);
      }
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

  // --- NUEVA LÓGICA: DESCARGA INDIVIDUAL ---
  const handleSingleDownload = (item) => {
    const headers = "ID Recepcion,Fecha Salida,Hora,Entidad,Area,Cant. Ingresada,Cant. Devuelta,Pendientes";
    const row = `${item.id},${item.fecha},${item.hora},${item.entidad},${item.area},${item.ingresada},${item.devuelta},${item.pendientes}`;
    
    const csvContent = "\uFEFF" + headers + "\n" + row;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    // Nombre del archivo único usando ID y Fecha
    link.setAttribute("download", `Devolucion_${item.id}_${item.fecha.replaceAll('/', '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- MANEJO DE ACCIONES DE FILA ---
  const handleRowAction = (action, item) => {
      if (action === 'Descargar') {
          handleSingleDownload(item); // Ejecuta la descarga individual
      }
      setOpenMenuIndex(null);
  };

  // --- FUNCIÓN DE DESCARGA GLOBAL (Todo el reporte) ---
  const handleDownload: React.FC = () => {
    const headers = "ID Recepcion,Fecha Salida,Hora,Entidad,Area,Cant. Ingresada,Cant. Devuelta,Pendientes";
    const rows = data.map(row => 
      `${row.id},${row.fecha},${row.hora},${row.entidad},${row.area},${row.ingresada},${row.devuelta},${row.pendientes}`
    ).join("\n");
    const csvContent = "\uFEFF" + headers + "\n" + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Reporte_Devoluciones_Completo_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper Input
  const ModalInput: React.FC<any> = ({ label, placeholder, icon: Icon, required = false, type = "text", width = "w-full" }) => (
    <div className={`relative ${width}`}>
      <label className="absolute -top-2.5 left-4 bg-white px-1 text-slate-500 text-xs font-medium z-10">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input 
          type={type} 
          placeholder={placeholder} 
          className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all"
        />
        {Icon && <Icon className="absolute right-4 top-3 text-slate-400 pointer-events-none" size={18} />}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 h-full flex flex-col font-sans relative" onClick={() => setOpenMenuIndex(null)}>
      
      {/* HEADER PRINCIPAL */}
      <div className="flex items-center gap-2 text-2xl font-bold">
        <Link to="/informes" className="text-blue-500 hover:underline flex items-center gap-1">
          <ChevronLeft /> Informes
        </Link>
      </div>

      <h1 className="text-xl font-bold text-slate-600 pl-8 -mt-4">Devolución de instrumentos de 3ros</h1>

      {/* BARRA DE FILTROS */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-center bg-white p-1 rounded-xl">
        <div className="flex flex-wrap gap-4 flex-1 w-full items-center">
           <div className="relative w-64">
              <input type="text" placeholder="Buscar..." className="w-full bg-slate-50 border-none rounded-lg py-2 pl-4 pr-10 text-sm outline-none focus:ring-1 focus:ring-blue-200 text-slate-500"/>
              <Search className="absolute right-3 top-2 text-blue-400" size={16} />
           </div>
           <div className="flex gap-2">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-400 text-sm hover:border-blue-300">
               <span>Fecha desde</span> <Calendar size={16} />
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-400 text-sm hover:border-blue-300">
               <span>Fecha hasta</span> <Calendar size={16} />
             </button>
           </div>
        </div>

        <div className="flex items-center gap-4">
            <button 
                onClick={(e: any) => { e.stopPropagation(); setIsModalOpen(true); }}
                className="flex items-center gap-1 text-blue-500 font-medium text-xs hover:text-blue-600 transition-colors cursor-pointer"
            >
                Crear devolución de instrumentos de 3ros <PlusCircle size={16} />
            </button>
            {/* BOTÓN CONECTADO A LA FUNCIÓN handleDownload (GLOBAL) */}
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
                <th className="px-6 py-4">ID de recepcion</th>
                <th className="px-6 py-4">Fecha de salida</th>
                <th className="px-6 py-4">Hora</th>
                <th className="px-6 py-4">Entidad</th>
                <th className="px-6 py-4">Area</th>
                <th className="px-6 py-4">Cantidad ingresada</th>
                <th className="px-6 py-4">Cantidad devuelta</th>
                <th className="px-6 py-4">Pendientes</th>
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
                  <td className="px-6 py-4">{row.ingresada}</td>
                  <td className="px-6 py-4">{row.devuelta}</td>
                  <td className="px-6 py-4">{row.pendientes}</td>
                  
                  {/* --- COLUMNA DE ACCIONES (MENÚ) --- */}
                  <td className="px-4 py-4 text-right relative">
                    <button 
                        onClick={(e: any) => toggleMenu(i, e)}
                        className={`p-1 rounded-full transition-colors ${openMenuIndex === i ? 'bg-blue-50 text-blue-500' : 'text-slate-300 hover:text-blue-500 hover:bg-slate-50'}`}
                    >
                        <MoreVertical size={18} />
                    </button>

                    {/* Menú Desplegable: DESCARGA INDIVIDUAL */}
                    {openMenuIndex === i && (
                        <div ref={menuRef} className="absolute right-8 top-4 w-32 bg-white rounded-lg shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                            <div className="flex flex-col py-1">
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
      </div>

      {/* ======================================================= */}
      {/* MODAL 1: CREAR DEVOLUCIÓN */}
      {/* ======================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 font-sans">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" onClick={() => setIsModalOpen(false)} />
            <div className="relative bg-white w-[900px] h-[550px] rounded-[30px] shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col p-8 overflow-hidden">
                
                <h2 className="text-2xl font-bold text-blue-500 text-center mb-8">
                    Crear devolución de instrumentos de 3ros
                </h2>

                <div className="flex flex-wrap items-center gap-6 mb-8 px-2">
                    <div className="w-56"><ModalInput label="ID de recepción" placeholder="4386574" /></div>
                    <div className="w-40"><ModalInput label="Hora" required icon={Clock} placeholder="Hora" /></div>
                    <div className="w-48"><ModalInput label="Fecha de entrega" required icon={Calendar} placeholder="Fecha" /></div>
                    
                    <button 
                        onClick={() => setIsSelectIngresoOpen(true)}
                        className="flex items-center gap-1 text-blue-500 font-medium text-sm hover:underline ml-auto"
                    >
                        Seleccionar ingreso <PlusCircle size={18} />
                    </button>
                </div>

                <div className="bg-blue-50/50 rounded-2xl border border-blue-100 flex-1 flex flex-col overflow-hidden mb-6">
                    <div className="grid grid-cols-12 px-6 py-3 border-b border-blue-100 text-slate-700 font-bold text-sm">
                        <div className="col-span-3">Código</div>
                        <div className="col-span-6 flex items-center gap-1 cursor-pointer hover:text-blue-600">Nombre <ArrowDown size={14} className="text-blue-400" /></div>
                        <div className="col-span-3 text-right">Cantidad</div>
                    </div>
                    <div className="flex-1 overflow-y-auto bg-white/50 p-8 text-center text-slate-400 text-sm italic">
                        No hay instrumentos seleccionados
                    </div>
                </div>

                <div className="flex justify-center gap-10">
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-500 font-bold hover:text-red-500 text-sm">Cancelar</button>
                    <button className="px-12 py-2.5 rounded-full text-white font-bold bg-gradient-to-r from-blue-400 to-emerald-400 hover:opacity-90 shadow-lg text-sm">Guardar</button>
                </div>
            </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL 2: SELECCIONAR INGRESO */}
      {/* ======================================================= */}
      {isSelectIngresoOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6 font-sans">
             <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" onClick={() => setIsSelectIngresoOpen(false)} />
             
             <div className="relative bg-white w-[1000px] rounded-[30px] shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col p-8">
                
                <h2 className="text-2xl font-bold text-blue-500 text-center mb-6">
                   Ingreso de instrumentos de 3ros
                </h2>
                
                <div className="w-full h-px bg-slate-100 mb-6 mx-auto"></div>

                <div className="relative w-full max-w-sm mb-6">
                    <input type="text" placeholder="Buscar..." className="w-full h-10 bg-slate-100 rounded-lg pl-4 pr-10 text-sm text-slate-600 outline-none focus:ring-1 focus:ring-blue-300" />
                    <Search className="absolute right-3 top-2.5 text-blue-400" size={18} />
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-blue-50/50 text-slate-700 font-bold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3">ID de recepcion</th>
                                <th className="px-6 py-3">Fecha de entrega</th>
                                <th className="px-6 py-3">Hora</th>
                                <th className="px-6 py-3">Entidad</th>
                                <th className="px-6 py-3">Area</th>
                                <th className="px-6 py-3">Cantidad ingresada</th>
                                <th className="w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {dataIngresos.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                                    <td className="px-6 py-3 text-slate-500">{row.id}</td>
                                    <td className="px-6 py-3 text-slate-500">{row.fecha}</td>
                                    <td className="px-6 py-3 text-slate-500">{row.hora}</td>
                                    <td className="px-6 py-3 text-slate-400">{row.entidad}</td>
                                    <td className="px-6 py-3 text-slate-400">{row.area}</td>
                                    <td className="px-6 py-3 text-slate-500">{row.cant}</td>
                                    <td className="px-4 text-right">
                                        <ArrowDown className="text-slate-300 group-hover:text-blue-500 -rotate-90" size={18} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400 mb-8 px-2">
                    <span>Pág. 2 de 14 (135 encontrados)</span>
                    <div className="flex items-center gap-2 font-medium text-blue-400">
                        <button className="hover:text-blue-600"><ChevronsLeft size={16} /></button>
                        <button className="hover:text-blue-600"><ChevronLeft size={16} /></button>
                        <span className="bg-blue-50 px-3 py-1 rounded text-blue-600 font-bold">1</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-500">3</span>
                        <button className="hover:text-blue-600"><ChevronRight size={16} /></button>
                        <button className="hover:text-blue-600"><ChevronsRight size={16} /></button>
                    </div>
                </div>

                <div className="flex justify-end gap-6 items-center">
                    <button 
                        onClick={() => setIsSelectIngresoOpen(false)}
                        className="text-slate-600 font-bold hover:text-red-500 transition-colors text-sm"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={() => setIsSelectIngresoOpen(false)} 
                        className="px-8 py-2.5 rounded-full text-white font-bold bg-gradient-to-r from-[#3B82F6] to-[#2DD4BF] hover:opacity-90 shadow-lg text-sm transition-transform active:scale-95"
                    >
                        Aceptar
                    </button>
                </div>

             </div>
        </div>
      )}

    </div>
  );
};

export default DevolucionInstrumentosScreen;