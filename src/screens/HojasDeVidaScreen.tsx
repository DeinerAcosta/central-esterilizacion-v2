import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, PlusCircle, Info, ChevronLeft, ChevronRight, ChevronDown, Download, 
  ArrowRightLeft, X, Calendar, Paperclip, Image as ImageIcon, Upload, Trash2, 
  MoreVertical, Eye, Edit, Ban, CheckCircle, Database // Database importado para el icono nuevo
} from 'lucide-react';

const HojasDeVidaScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<any>('hv'); 
  const [isModalOpen, setIsModalOpen] = useState<any>(false); // Modal Crear HV
  const [isTrasladarOpen, setIsTrasladarOpen] = useState<any>(false); // Modal Trasladar
  const [compatible, setCompatible] = useState<any>(false);
  const [transferType, setTransferType] = useState<any>('kit');

  // Estado para el menú desplegable de cada fila
  const [openMenuId, setOpenMenuId] = useState<any>(null);
  const menuRef = useRef(null);

  // --- DATOS: HOJAS DE VIDA (Del código antiguo) ---
  const [dataHV, setDataHV] = useState<any>([
    { id: 120, codigo: "CA4674575", nombre: "Bisturí de córnea", esp: "Oftalmología", sub: "Catarata", tipo: "Básico", kit: 8, fm: "30/04/2025", fc: "14/04/2025", estado: "Activo" },
    { id: 119, codigo: "AR3436745", nombre: "Blefaróstato de Barraquer", esp: "Oftalmología", sub: "Catarata", tipo: "Avanzado", kit: 7, fm: "16/08/2025", fc: "14/04/2025", estado: "Activo" },
    { id: 118, codigo: "CA4674575", nombre: "Pinzas de iris", esp: "Oftalmología", sub: "Catarata", tipo: "Básico", kit: 6, fm: "08/09/2025", fc: "25/04/2025", estado: "Activo" },
    { id: 117, codigo: "AR3436745", nombre: "Portaagujas de Barraquer", esp: "Oftalmología", sub: "Catarata", tipo: "Avanzado", kit: 5, fm: "17/09/2025", fc: "28/04/2025", estado: "Activo" },
    { id: 116, codigo: "CA4674575", nombre: "Bisturí de córnea", esp: "Oftalmología", sub: "Catarata", tipo: "Básico", kit: 4, fm: "30/04/2025", fc: "14/04/2025", estado: "Pendiente" },
    { id: 115, codigo: "PR9988776", nombre: "Separador de Farabeuf", esp: "Cirugía General", sub: "General", tipo: "Básico", kit: 1, fm: "-", fc: "23/01/2026", estado: "P. Registrar" },
    { id: 114, codigo: "MT1122334", nombre: "Tijera Metzenbaum", esp: "Cirugía General", sub: "General", tipo: "Avanzado", kit: 2, fm: "20/01/2026", fc: "10/01/2025", estado: "En mantenimiento" },
  ]);

  // --- DATOS: INVENTARIO (Estructura NUEVA para soportar el diseño de etiquetas de colores) ---
  const dataInventario = [
    { 
        id: 1, 
        esp: 'Oftalmología', 
        sub: 'Catarata', 
        tipo: 'Básico', 
        kits: ['CaBas01', 'CaBas02', 'CaBas03', 'CaBas05', 'CaBas06'], // Etiquetas visuales
        cant: 25 
    },
    { 
        id: 2, 
        esp: 'Autoestático', 
        sub: 'Catarata', 
        tipo: 'Avanzado', 
        kits: ['CaBas01', 'CaBas02', 'CaBas03', 'CaBas05', 'CaBas06'], 
        cant: 25 
    },
    { 
        id: 3, 
        esp: 'Pinzas', 
        sub: 'Catarata', 
        tipo: 'Básico', 
        kits: ['CaBas01', 'CaBas02', 'CaBas03', 'CaBas05', 'CaBas06'], 
        cant: 25 
    },
    { 
        id: 4, 
        esp: 'Portaagujas', 
        sub: 'Catarata', 
        tipo: 'Avanzado', 
        kits: ['CaBas01', 'CaBas02', 'CaBas03', 'CaBas05', 'CaBas06'], 
        cant: 25 
    },
  ];

  // --- DATOS MOCK PARA EL MODAL DE TRASLADO (Del código antiguo) ---
  const instrumentsList = [
    { name: "Blefaróstato de Barraquer", qty: 25 },
    { name: "Portaagujas de Barraquer", qty: 25 },
    { name: "Pinzas iris", qty: 25 },
    { name: "Cucharillas de Graefe", qty: 25 },
  ];

  // --- HELPER PARA RENDERIZAR TAGS DE COLORES (Del diseño nuevo) ---
  const renderKitTags = (kits) => {
      return (
          <div className="flex flex-wrap gap-2">
              {kits.map((k, i) => {
                  let colorClass = "bg-blue-50 text-blue-500 border-blue-100";
                  if (i === 2) colorClass = "bg-yellow-50 text-yellow-600 border-yellow-100";
                  if (i === 4) colorClass = "bg-red-50 text-red-500 border-red-100";
                  
                  return (
                      <span key={i} className={`px-2 py-0.5 rounded border text-[10px] font-bold ${colorClass}`}>
                          {k}
                      </span>
                  );
              })}
          </div>
      );
  };

  // --- LÓGICA DEL MENÚ FLOTANTE ---
  const toggleMenu = (id, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LÓGICA HABILITAR / DESHABILITAR ---
  const handleToggleStatus = (id) => {
    setDataHV(prevData => prevData.map(item => {
        if (item.id === id) {
            const newStatus = item.estado === 'Activo' ? 'Inactivo' : 'Activo';
            return { ...item, estado: newStatus };
        }
        return item;
    }));
    setOpenMenuId(null); // Cerrar menú
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Activo': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Pendiente': return 'bg-orange-50 text-orange-500 border-orange-100';
      case 'P. Registrar': return 'bg-blue-50 text-blue-500 border-blue-100';
      case 'En mantenimiento': return 'bg-purple-50 text-purple-500 border-purple-100';
      case 'Inactivo': return 'bg-slate-100 text-slate-500 border-slate-200';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  // --- FUNCIÓN PARA DESCARGAR EXCEL (CSV) ---
  const downloadExcel: React.FC = () => {
    const dataToExport = activeTab === 'hv' ? dataHV : dataInventario;
    if (dataToExport.length === 0) { alert("No hay datos para exportar"); return; }
    // Ajuste simple para descargar los datos del inventario correctamente
    const headers = Object.keys(dataToExport[0]).join(",");
    const rows = dataToExport.map(row => {
        // Si es inventario y tiene array de kits, lo unimos con pipe | para el CSV
        if (Array.isArray(row.kits)) {
            return Object.values({ ...row, kits: row.kits.join('|') }).join(",");
        }
        return Object.values(row).join(",");
    });
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Reporte_${activeTab === 'hv' ? 'HojaDeVida' : 'Inventario'}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Componentes Helper
  const FloatingLabelSelect: React.FC<any> = ({ label, required = false, defaultValue = "Seleccionar" }) => (
    <div className="relative w-full">
        <label className="absolute -top-2.5 left-4 bg-white px-2 text-xs text-slate-500 font-medium z-10">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <div className="relative">
            <select className="w-full h-12 border border-slate-300 rounded-full px-4 text-slate-600 text-sm outline-none focus:border-blue-400 appearance-none bg-white cursor-pointer shadow-sm">
                <option>{defaultValue}</option>
            </select>
            <ChevronDown className="absolute right-4 top-4 text-slate-400 pointer-events-none" size={16}/>
        </div>
    </div>
  );

  const FloatingLabelInput: React.FC<any> = ({ label, required = false, type = "text", placeholder = "" }) => (
    <div className="relative w-full">
        <label className="absolute -top-2.5 left-4 bg-white px-2 text-xs text-slate-500 font-medium z-10">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <div className="relative">
            <input type={type} placeholder={placeholder} className="w-full h-12 border border-slate-300 rounded-full px-4 text-slate-600 text-sm outline-none focus:border-blue-400 shadow-sm" />
            {type === 'date' && <Calendar className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={18}/>}
        </div>
    </div>
  );

  return (
    <div className="space-y-6 h-full flex flex-col font-sans relative" onClick={() => setOpenMenuId(null)}>
      
      <h1 className="text-3xl font-bold text-blue-500">Hoja de vida</h1>

      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden">
        {/* TABS y TOOLBAR */}
        <div className="flex w-full border-b border-slate-100">
            <button onClick={() => setActiveTab('hv')} className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'hv' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-50/30' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>Hoja de vida</button>
            <button onClick={() => setActiveTab('inventario')} className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'inventario' ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-50/30' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>Inventario</button>
        </div>

        <div className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center border-b border-slate-50">
            {activeTab === 'hv' ? (
                // TOOLBAR HOJA DE VIDA
                <>
                    <div className="flex gap-4 flex-1 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        <select className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-500 text-sm font-medium w-40 outline-none cursor-pointer"><option>Especialidad</option></select>
                        <select className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-500 text-sm font-medium w-40 outline-none cursor-pointer"><option>Subespecialidad</option></select>
                        <select className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-500 text-sm font-medium w-40 outline-none cursor-pointer"><option>Estado</option></select>
                        <div className="relative flex-1 min-w-[200px]">
                            <input type="text" placeholder="Buscar..." className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-5 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-100"/>
                            <Search className="absolute right-4 top-2.5 text-blue-400" size={18} />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-blue-500 font-bold text-sm hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap">
                            Crear hoja de vida <PlusCircle size={18} />
                        </button>
                    </div>
                </>
            ) : (
                // TOOLBAR INVENTARIO (DISEÑO NUEVO)
                <>
                    <div className="flex gap-4 flex-1 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        <div className="relative w-40">
                             <select className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-full text-slate-500 text-xs font-medium outline-none appearance-none cursor-pointer"><option>Especialidad</option></select>
                             <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={14}/>
                        </div>
                        <div className="relative w-40">
                             <select className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-full text-slate-500 text-xs font-medium outline-none appearance-none cursor-pointer"><option>Subespecialidad</option></select>
                             <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={14}/>
                        </div>
                        <div className="relative w-48">
                             <select className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-full text-slate-500 text-xs font-medium outline-none appearance-none cursor-pointer"><option>Tipo subespecialidad</option></select>
                             <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={14}/>
                        </div>
                        <div className="relative flex-1 min-w-[200px]">
                            <input type="text" placeholder="Buscar..." className="w-full bg-slate-50 border-none rounded-full py-2.5 pl-4 pr-10 text-xs outline-none focus:ring-1 focus:ring-blue-100 text-slate-500"/>
                            <Search className="absolute right-4 top-2.5 text-blue-400" size={16} />
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                         {/* Botón Control de bajas */}
                         <button className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-300 rounded-full text-blue-500 text-xs font-bold hover:bg-blue-50 transition-colors whitespace-nowrap">
                            Control de bajas <Database size={14} />
                        </button>
                        
                        {/* Botón Trasladar */}
                        <button 
                            onClick={() => setIsTrasladarOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-300 rounded-full text-blue-500 text-xs font-bold hover:bg-blue-50 transition-colors whitespace-nowrap"
                        >
                            Trasladar <ArrowRightLeft size={14} />
                        </button>

                         {/* Botón Descargar */}
                        <button onClick={downloadExcel} className="flex items-center gap-1 text-blue-500 font-bold text-xs hover:text-blue-600 px-3 py-2 transition-colors">
                            Descargar <Download size={14} />
                        </button>
                    </div>
                </>
            )}
        </div>

        {/* TABLA PRINCIPAL */}
        <div className="flex-1 overflow-visible">
             <table className="w-full text-sm text-left">
                <thead className={activeTab === 'hv' ? "bg-slate-50/50 text-slate-700 font-bold border-b border-slate-200" : "bg-[#EFF6FF] text-slate-800 font-bold"}>
                    {activeTab === 'hv' ? (
                        <tr>
                            <th className="px-6 py-4">Código</th>
                            <th className="px-6 py-4">C. Instrumento</th>
                            <th className="px-6 py-4">Nombre</th>
                            <th className="px-6 py-4">Especialidad</th>
                            <th className="px-6 py-4">Subespecialidad</th>
                            <th className="px-6 py-4">Tipo de Subespecialidad</th>
                            <th className="px-6 py-4 text-center">KIT</th>
                            <th className="px-6 py-4">F. mtto</th>
                            <th className="px-6 py-4">F. creación</th>
                            <th className="px-6 py-4 text-center">Estado</th>
                            <th className="px-4 py-4"></th>
                        </tr>
                    ) : (
                        // CABECERA INVENTARIO (DISEÑO NUEVO)
                        <tr>
                            <th className="px-6 py-4">Especialidad</th>
                            <th className="px-6 py-4">Subespecialidad</th>
                            <th className="px-6 py-4">Tipo subespecialidad</th>
                            <th className="px-6 py-4">KIT</th>
                            <th className="px-6 py-4 text-center">Cantidad</th>
                        </tr>
                    )}
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {activeTab === 'hv' ? (
                        dataHV.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 text-slate-500 font-medium">{row.id}</td>
                                <td className="px-6 py-4 text-slate-500">{row.codigo}</td>
                                <td className="px-6 py-4 text-slate-500 font-medium">{row.nombre}</td>
                                <td className="px-6 py-4 text-slate-500">{row.esp}</td>
                                <td className="px-6 py-4 text-slate-500">{row.sub}</td>
                                <td className="px-6 py-4 text-slate-500">{row.tipo}</td>
                                <td className="px-6 py-4 text-slate-500 text-center">{row.kit}</td>
                                <td className="px-6 py-4 text-slate-500">{row.fm}</td>
                                <td className="px-6 py-4 text-slate-500">{row.fc}</td>
                                <td className="px-6 py-4 text-center"><span className={`px-4 py-1 rounded-full text-xs font-bold border ${getStatusColor(row.estado)}`}>{row.estado}</span></td>
                                <td className="px-4 py-4 text-right relative">
                                    <button 
                                        onClick={(e: any) => toggleMenu(row.id, e)}
                                        className={`p-1 rounded-full transition-colors ${openMenuId === row.id ? 'bg-blue-50 text-blue-500' : 'text-slate-300 hover:text-blue-500 hover:bg-slate-50'}`}
                                    >
                                        <MoreVertical size={20} />
                                    </button>
                                    {openMenuId === row.id && (
                                        <div ref={menuRef} className="absolute right-8 top-8 w-44 bg-white rounded-lg shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                                            <div className="flex flex-col py-1">
                                                <button className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors text-left font-medium">
                                                    <Eye size={14} /> Ver detalles
                                                </button>
                                                <button className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors text-left font-medium">
                                                    <Edit size={14} /> Editar
                                                </button>
                                                <button 
                                                    onClick={() => handleToggleStatus(row.id)}
                                                    className={`flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-slate-50 transition-colors text-left font-medium ${row.estado === 'Activo' ? 'text-red-500 hover:text-red-600' : 'text-emerald-500 hover:text-emerald-600'}`}
                                                >
                                                    {row.estado === 'Activo' ? <Ban size={14} /> : <CheckCircle size={14} />} 
                                                    {row.estado === 'Activo' ? 'Deshabilitar' : 'Habilitar'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        // CUERPO TABLA INVENTARIO (DISEÑO NUEVO)
                        dataInventario.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 text-slate-500">{row.esp}</td>
                                <td className="px-6 py-4 text-slate-500">{row.sub}</td>
                                <td className="px-6 py-4 text-slate-500">{row.tipo}</td>
                                <td className="px-6 py-4">
                                     {renderKitTags(row.kits)}
                                </td>
                                <td className="px-6 py-4 text-center text-slate-600 font-medium">{row.cant}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
        
        {/* PAGINACIÓN */}
        <div className="mt-auto p-4 flex justify-between items-center text-xs text-slate-300 border-t border-slate-50">
            <span>Pág. 1 de 5 (45 encontrados)</span>
            <div className="flex items-center gap-2 font-medium text-blue-400">
                <button className="hover:text-blue-600"><ChevronLeft size={14} /></button>
                <span className="bg-blue-50 px-2 py-0.5 rounded text-blue-600">1</span>
                <span>/</span><span>3</span>
                <button className="hover:text-blue-600"><ChevronRight size={14} /></button>
            </div>
        </div>
      </div>

      {/* ======================================================= */}
      {/* MODAL 1: CREAR HOJA DE VIDA (DEL CÓDIGO ANTIGUO)        */}
      {/* ======================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
            <div className="relative bg-white w-[1246px] h-[620px] rounded-[28px] px-10 py-10 shadow-xl animate-in fade-in zoom-in-95 duration-200 overflow-y-auto hide-scrollbar">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-blue-500">Crear hoja de vida</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={28} /></button>
                </div>

                {/* SECCIÓN 1: FOTO Y REQUISITOS */}
                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 mb-8 flex flex-col xl:flex-row items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <h3 className="text-xl font-bold text-blue-500">Foto Instrumento</h3>
                            <p className="text-xs text-slate-400 mt-1">Mín. 400 x 400 píxeles <span className="mx-1">|</span> Máx. 2MB</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-300"><ImageIcon size={20} /></div>
                        <div className="flex flex-col gap-2">
                             <button className="px-4 py-1.5 rounded-full border border-cyan-400 text-cyan-400 text-xs font-bold hover:bg-cyan-50 transition-colors">Subir foto</button>
                             <button className="text-slate-400 text-xs font-bold hover:text-red-500 transition-colors">Eliminar</button>
                        </div>
                    </div>
                    <div className="hidden xl:block w-px h-16 bg-slate-200 mx-2"></div>
                    <div className="flex-1 w-full flex flex-col gap-3">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Requisitos:</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                             <div className="relative"><label className="absolute -top-2.5 left-3 bg-[#f8fafc] px-1 text-[10px] font-bold text-slate-500 z-10">Garantía<span className="text-red-500">*</span></label><div className="w-full h-10 border border-slate-300 rounded-full flex items-center px-4 text-slate-400 text-xs hover:border-blue-300 transition-colors bg-white cursor-pointer group"><span className="truncate">Documento.pdf</span><Paperclip size={14} className="ml-auto text-slate-400 group-hover:text-blue-500"/></div></div>
                             <div className="relative"><label className="absolute -top-2.5 left-3 bg-[#f8fafc] px-1 text-[10px] font-bold text-slate-500 z-10">Registro INVIMA<span className="text-red-500">*</span></label><div className="w-full h-10 border border-slate-300 rounded-full flex items-center px-4 text-slate-400 text-xs hover:border-blue-300 transition-colors bg-white cursor-pointer group"><span className="truncate">Documento.pdf</span><Paperclip size={14} className="ml-auto text-slate-400 group-hover:text-blue-500"/></div></div>
                             <div className="relative"><label className="absolute -top-2.5 left-3 bg-[#f8fafc] px-1 text-[10px] font-bold text-slate-500 z-10">Código<span className="text-red-500">*</span></label><div className="w-full h-10 border border-slate-300 rounded-full flex items-center px-4 text-slate-400 text-xs hover:border-blue-300 transition-colors bg-white cursor-pointer group"><span className="truncate">registro.pdf</span><Paperclip size={14} className="ml-auto text-slate-400 group-hover:text-blue-500"/></div></div>
                             <div className="relative"><label className="absolute -top-2.5 left-3 bg-[#f8fafc] px-1 text-[10px] font-bold text-slate-500 z-10">Código<span className="text-red-500">*</span></label><div className="w-full h-10 border border-slate-300 rounded-full flex items-center px-4 text-slate-400 text-xs hover:border-blue-300 transition-colors bg-white cursor-pointer group"><span className="truncate">Documento...</span><Paperclip size={14} className="ml-auto text-slate-400 group-hover:text-blue-500"/></div></div>
                        </div>
                    </div>
                </div>

                {/* SECCIÓN 2: DATOS BÁSICOS */}
                <h3 className="text-lg font-bold text-slate-800 mb-4 ml-1">Datos básicos del Instrumento</h3>
                <div className="bg-slate-50/50 rounded-3xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6 justify-center border border-slate-100">
                    <span className="text-blue-500 font-bold text-sm">Código Instrumento</span>
                    <div className="flex gap-8 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        <div className="flex flex-col items-center gap-1"><div className="flex gap-2"><div className="w-8 h-8 rounded-full border border-cyan-400 flex items-center justify-center text-cyan-500 text-xs font-bold bg-white">O</div><div className="w-8 h-8 rounded-full border border-cyan-400 flex items-center justify-center text-cyan-500 text-xs font-bold bg-white">F</div></div><span className="text-[10px] text-slate-400">(Especialidad)</span></div>
                         <div className="flex flex-col items-center gap-1"><div className="flex gap-2"><div className="w-8 h-8 rounded-full border border-cyan-400 flex items-center justify-center text-cyan-500 text-xs font-bold bg-white">C</div><div className="w-8 h-8 rounded-full border border-cyan-400 flex items-center justify-center text-cyan-500 text-xs font-bold bg-white">A</div></div><span className="text-[10px] text-slate-400">(Subespecialidad)</span></div>
                        <div className="flex flex-col items-center gap-1"><div className="flex gap-2"><div className="w-8 h-8 rounded-full border border-cyan-400 flex items-center justify-center text-cyan-500 text-xs font-bold bg-white">B</div><div className="w-8 h-8 rounded-full border border-cyan-400 flex items-center justify-center text-cyan-500 text-xs font-bold bg-white">A</div></div><span className="text-[10px] text-slate-400">(Tipo Subespecialidad)</span></div>
                        <div className="flex flex-col items-center gap-1"><div className="flex gap-2"><div className="w-8 h-8 rounded-full border border-cyan-400 flex items-center justify-center text-cyan-500 text-xs font-bold bg-white">1</div><div className="w-8 h-8 rounded-full border border-cyan-400 flex items-center justify-center text-cyan-500 text-xs font-bold bg-white">0</div></div><span className="text-[10px] text-slate-400">(Kit)</span></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                    <div className="relative"><label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 z-10">Nombre<span className="text-red-500">*</span></label><input type="text" placeholder="Portaagujas de Barraquer" className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-sm"/></div>
                    <div className="relative"><label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 z-10">Especialidad<span className="text-red-500">*</span></label><div className="relative"><select className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-sm appearance-none cursor-pointer bg-white"><option>Seleccionar...</option></select><ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16}/></div></div>
                    <div className="relative"><label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 z-10">Subespecialidad<span className="text-red-500">*</span></label><div className="relative"><select className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-sm appearance-none cursor-pointer bg-white"><option>Seleccionar...</option></select><ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16}/></div></div>
                    <div className="relative"><label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 z-10">Tipo de subespecialidad<span className="text-red-500">*</span></label><div className="relative"><select className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-sm appearance-none cursor-pointer bg-white"><option>Seleccionar...</option></select><ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16}/></div></div>
                    <div className="relative"><label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 z-10">KIT<span className="text-red-500">*</span></label><div className="relative"><select className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-sm appearance-none cursor-pointer bg-white"><option>Seleccionar...</option></select><ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16}/></div></div>
                    <div className="relative"><label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 z-10">Fabricante<span className="text-red-500">*</span></label><input type="text" placeholder="Olglass Internacional S.A.S." className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-sm"/></div>
                    <div className="relative"><label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 z-10">No. de serie<span className="text-red-500">*</span></label><input type="text" className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-sm"/></div>
                    <div className="relative"><label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 z-10">No. registro INVIMA<span className="text-red-500">*</span></label><input type="text" className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-sm"/></div>
                    <div className="relative"><label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 z-10">Proveedor / Distribuidor<span className="text-red-500">*</span></label><div className="relative"><select className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-sm appearance-none cursor-pointer bg-white"><option>Seleccionar...</option></select><ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16}/></div></div>
                    <div className="relative"><label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 z-10">País origen<span className="text-red-500">*</span></label><div className="relative"><select className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-sm appearance-none cursor-pointer bg-white"><option>Seleccionar...</option></select><ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16}/></div></div>
                </div>

                {/* SECCIÓN 3: CARACTERÍSTICAS TÉCNICAS */}
                <h3 className="text-lg font-bold text-slate-800 mb-4 ml-1">Características técnicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-center">
                    <div className="relative">
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 z-10">Material del instrumento<span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-sm appearance-none cursor-pointer bg-white">
                                <option>Seleccionar...</option>
                                <option>Acero Inoxidable</option>
                                <option>Titanio</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16}/>
                        </div>
                    </div>
                    <div className="relative">
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 z-10">Esterilización compatible<span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-sm appearance-none cursor-pointer bg-white">
                                <option>Seleccionar...</option>
                                <option>Autoclave</option>
                                <option>Óxido de Etileno</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16}/>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                             <div onClick={() => setCompatible(!compatible)} className={`w-11 h-6 flex items-center bg-slate-200 rounded-full p-1 cursor-pointer transition-colors ${compatible ? 'bg-blue-400' : 'bg-slate-200'}`}>
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${compatible ? 'translate-x-5' : 'translate-x-0'}`}></div>
                             </div>
                             <span className="text-sm text-slate-500">Compatible con otros equipos</span>
                        </div>
                        <input type="text" placeholder="¿Cuál?" disabled={!compatible} className={`flex-1 h-11 border border-slate-300 rounded-full px-4 text-sm outline-none transition-all ${compatible ? 'bg-white text-slate-600 focus:border-blue-400' : 'bg-slate-50 cursor-not-allowed'}`} />
                    </div>
                </div>

                {/* SECCIÓN 4: MANTENIMIENTO */}
                <h3 className="text-lg font-bold text-slate-800 mb-4 ml-1">Mantenimiento y calibración</h3>
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className="relative w-full md:w-1/4">
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 z-10">Frecuencia preventivo<span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-sm appearance-none cursor-pointer bg-white">
                                <option>Seleccionar...</option>
                                <option>Mensual</option>
                                <option>Trimestral</option>
                                <option>Anual</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16}/>
                        </div>
                    </div>
                    <div className="relative w-full md:w-1/4">
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 z-10">Fecha de mantenimiento</label>
                        <div className="relative">
                            <input type="date" className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-sm uppercase" />
                            <Calendar className="absolute right-4 top-3 text-slate-400 pointer-events-none" size={18}/>
                        </div>
                    </div>
                      <div className="relative flex-1">
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 z-10">Observaciones del técnico<span className="text-red-500">*</span></label>
                        <input type="text" className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-sm"/>
                    </div>
                </div>

                {/* SECCIÓN 5: USO Y TRAZABILIDAD */}
                <h3 className="text-lg font-bold text-slate-800 mb-4 ml-1">Uso y trazabilidad</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="relative">
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 z-10">Área / Servicio asignado<span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-sm appearance-none cursor-pointer bg-white">
                                <option>Seleccionar...</option>
                                <option>Quirófano 1</option>
                                <option>Urgencias</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16}/>
                        </div>
                    </div>
                    <div className="relative">
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 z-10">Estado actual<span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-sm appearance-none cursor-pointer bg-white">
                                <option>Activo</option>
                                <option>En reparación</option>
                                <option>De baja</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16}/>
                        </div>
                    </div>
                    <div className="relative">
                         <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 z-10">Ciclo de esterilización<span className="text-red-500">*</span></label>
                         <input type="text" className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-sm"/>
                    </div>
                    <div className="relative">
                        <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 z-10">Propietario<span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-sm appearance-none cursor-pointer bg-white">
                                <option>Clínica Central</option>
                                <option>Dr. Juan Pérez</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={16}/>
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <input type="text" placeholder="Notas y observaciones" className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all text-sm"/>
                </div>

                <div className="mt-12 flex justify-center gap-10">
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-500 font-bold hover:text-slate-700 transition-colors">Cancelar</button>
                    <button className="px-12 py-3 rounded-full text-white font-bold bg-gradient-to-r from-blue-500 to-emerald-400 hover:opacity-90 shadow-lg shadow-blue-200 transition-transform active:scale-95">Guardar</button>
                </div>

            </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL 2: TRASLADAR (DEL CÓDIGO ANTIGUO)                 */}
      {/* ======================================================= */}
      {isTrasladarOpen && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6 font-sans">
             <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" onClick={() => setIsTrasladarOpen(false)} />
             
             <div className="relative bg-white w-[650px] rounded-[30px] shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col p-8">
                
                {/* Header */}
                <div className="text-center mb-6 relative">
                     <h2 className="text-[26px] font-extrabold text-[#3B82F6] mb-4">Trasladar</h2>
                     <div className="w-full h-px bg-slate-100 mx-auto"></div>
                </div>

                {/* Filtros Superiores */}
                <div className="flex gap-4 mb-6">
                     <div className="flex-1 relative">
                        <select className="w-full h-10 border border-slate-300 rounded-full px-4 text-slate-500 text-sm outline-none appearance-none bg-white"><option>Especialidad</option></select>
                        <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={16}/>
                     </div>
                     <div className="flex-1 relative">
                        <select className="w-full h-10 border border-slate-300 rounded-full px-4 text-slate-500 text-sm outline-none appearance-none bg-white"><option>Subespecialidad</option></select>
                        <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={16}/>
                     </div>
                     <div className="flex-1 relative">
                        <select className="w-full h-10 border border-slate-300 rounded-full px-4 text-slate-500 text-sm outline-none appearance-none bg-white"><option>Tipo</option></select>
                        <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={16}/>
                     </div>
                </div>

                {/* Radio Buttons */}
                <div className="flex items-center gap-6 mb-4 px-2">
                    <span className="text-sm font-bold text-slate-800">¿Qué desea transferir?</span>
                    
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div 
                            onClick={() => setTransferType('kit')}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${transferType === 'kit' ? 'border-[#2DD4BF]' : 'border-slate-300'}`}
                        >
                            {transferType === 'kit' && <div className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF]"></div>}
                        </div>
                        <span className="text-sm text-slate-500">KIT</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div 
                            onClick={() => setTransferType('instrumento')}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${transferType === 'instrumento' ? 'border-[#2DD4BF]' : 'border-slate-300'}`}
                        >
                             {transferType === 'instrumento' && <div className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF]"></div>}
                        </div>
                        <span className="text-sm text-slate-500">Instrumento</span>
                    </label>
                </div>

                {/* BÚSQUEDA (Solo visible en Instrumento) */}
                {transferType === 'instrumento' && (
                     <div className="relative mb-4">
                        <input type="text" placeholder="Buscar..." className="w-full h-10 bg-slate-50 border border-slate-200 rounded-full pl-4 pr-10 text-sm text-slate-600 outline-none focus:ring-1 focus:ring-blue-100" />
                        <Search className="absolute right-3 top-2.5 text-blue-400" size={18} />
                     </div>
                )}

                {/* Lista de Selección */}
                <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                    {transferType === 'kit' ? (
                        // VISTA KIT
                        <>
                            <div className="bg-blue-50/50 px-4 py-3 border-b border-slate-100">
                                <span className="text-slate-700 text-sm font-bold">KITS <span className="text-slate-800">disponibles</span></span>
                            </div>
                            <div className="max-h-[180px] overflow-y-auto">
                                {['Básico 01', 'Básico 02', 'Básico 03', 'Básico 04'].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                        <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-500 focus:ring-blue-200 cursor-pointer" />
                                        <span className="text-slate-500 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        // VISTA INSTRUMENTO
                        <>
                            <div className="bg-blue-50/50 px-4 py-3 border-b border-slate-100 flex items-center">
                                <span className="text-slate-700 text-sm font-bold flex-1">KITS <span className="text-slate-800">disponibles</span></span>
                                <div className="flex gap-8 text-slate-700 text-sm font-bold mr-6">
                                    <span className="w-16 text-center">Cantidad</span>
                                    <span className="w-24 text-center">Solicitar</span>
                                </div>
                            </div>
                            <div className="max-h-[180px] overflow-y-auto">
                                {instrumentsList.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3 flex-1">
                                            <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-500 focus:ring-blue-200 cursor-pointer" />
                                            <span className="text-slate-500 text-sm">{item.name}</span>
                                        </div>
                                        <div className="flex items-center gap-8 mr-2">
                                            <span className="w-16 text-center text-slate-500 text-sm">{item.qty}</span>
                                            <div className="w-24 flex justify-center">
                                                <input 
                                                    type="text" 
                                                    defaultValue="3"
                                                    className="w-full h-8 border border-slate-400 rounded-full text-center text-sm text-slate-600 outline-none focus:border-blue-400"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Campos Inferiores Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 mb-8">
                     <FloatingLabelSelect label="Sede origen" defaultValue="Sala Azul Mall Plaza Buenavista" />
                     <FloatingLabelSelect label="Sede destino" required defaultValue="Seleccionar" />
                     
                     <FloatingLabelInput label="Fecha traslado" type="date" placeholder="00/00/0000" />
                     <FloatingLabelInput label="Fecha devolución" required type="date" placeholder="00/00/0000" />
                </div>

                {/* Botones */}
                <div className="flex justify-center gap-8 mt-auto">
                    <button 
                        onClick={() => setIsTrasladarOpen(false)}
                        className="text-slate-700 font-bold hover:text-red-500 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button className="px-14 py-3 rounded-full text-white font-bold bg-gradient-to-r from-[#3B82F6] to-[#2DD4BF] hover:opacity-90 shadow-lg shadow-blue-200/50 transition-transform active:scale-95">
                        Guardar
                    </button>
                </div>

             </div>
         </div>
      )}

    </div>
  );
};

export default HojasDeVidaScreen;