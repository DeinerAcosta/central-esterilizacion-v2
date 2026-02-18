import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Download, 
  ChevronLeft, 
  Calendar, 
  Eye, 
  MoreVertical, 
  ChevronRight, 
  Edit, 
  FileText,
  Paperclip,
  ArrowDown,
  Printer, 
  Plus,    
  Minus    
} from 'lucide-react';

const IndicadorGasScreen: React.FC = () => {
  // --- ESTADOS ---
  const [openMenuIndex, setOpenMenuIndex] = useState<any>(null);
  
  // Estados para Modales
  const [isEditModalOpen, setIsEditModalOpen] = useState<any>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<any>(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<any>(false); 
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const menuRef = useRef(null);

  // Datos principales
  const data = [
    { fecha: '20/07/2025', nombre: 'Autoclave', valor: '5.000 + 2', kit: 'CaBas01' },
    { fecha: '05/10/2025', nombre: 'Autoclave', valor: '6.000 + 1', kit: 'CaBas01' },
    { fecha: '20/07/2025', nombre: 'Autoclave', valor: '3.000 + 4', kit: 'CaBas01' },
    { fecha: '05/10/2025', nombre: 'Autoclave', valor: '6.000 + 2', kit: 'CaBas01' },
    { fecha: '20/07/2025', nombre: 'Autoclave', valor: '4.000 + 5', kit: 'CaBas01' },
  ];

  // Datos simulados para tabla interna de detalle
  const instrumentosDetalle = [
    { cant: 1, nombre: 'Bisturí de córnea' },
    { cant: 1, nombre: 'Blefaróstato de Barraquer' },
    { cant: 1, nombre: 'Pinzas de iris' },
    { cant: 1, nombre: 'Portaagujas de Barraquer' },
    { cant: 1, nombre: 'Espátula de iris' },
    { cant: 1, nombre: 'Ganchos de iris' },
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

  // --- ACCIONES ---
  const handleEdit = (item) => {
      setSelectedItem(item);
      setIsEditModalOpen(true);
      setOpenMenuIndex(null);
  };

  const handleViewDetail = (item) => {
      setSelectedItem(item);
      setIsDetailModalOpen(true);
      setOpenMenuIndex(null);
  };

  const handlePreview = (item) => {
      setSelectedItem(item);
      setIsPreviewModalOpen(true);
      setOpenMenuIndex(null);
  };

  const handleRowDownload = (item) => {
      generateCSV([item], `indicador_gas_${item.fecha.replaceAll('/', '-')}.csv`);
      setOpenMenuIndex(null);
  };

  const handleDownloadGlobal: React.FC = () => {
      generateCSV(data, "reporte_indicador_gas.csv");
  };

  // Funciones de Vista Previa
  const handlePrintDoc: React.FC = () => {
      window.print();
  };

  const handleDownloadDoc: React.FC = () => {
      const link = document.createElement("a");
      link.href = "#"; 
      link.setAttribute("download", "Documento_Evidencia_Gas.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  // Helper CSV
  const generateCSV = (rowsData, filename) => {
    const headers = "Fecha,Nombre,Valor,Codigo Kit\n";
    const rows = rowsData.map(row => `${row.fecha},${row.nombre},${row.valor},${row.kit}`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper Input
  const ModalInput: React.FC<any> = ({ label, defaultValue, icon: Icon, className = "w-full" }) => (
    <div className={`relative ${className}`}>
      <label className="absolute -top-2.5 left-4 bg-white px-1 text-slate-500 text-xs font-medium z-10">
        {label}
      </label>
      <div className="relative">
        <input 
          type="text" 
          defaultValue={defaultValue}
          className="w-full h-11 border border-slate-300 rounded-full px-4 text-slate-600 text-sm outline-none focus:border-blue-400 bg-white shadow-sm"
          readOnly={true}
        />
        {Icon && (
           <Icon className="absolute right-4 top-3 text-slate-400 pointer-events-none" size={18} />
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 h-full flex flex-col font-sans relative" onClick={() => setOpenMenuIndex(null)}>
      
      {/* HEADER */}
      <div className="flex items-center gap-2 text-2xl font-bold">
        <Link to="/informes" className="text-blue-500 hover:underline flex items-center gap-1">
          <ChevronLeft /> Informes
        </Link>
      </div>
      <h1 className="text-xl font-bold text-slate-600 pl-8 -mt-4">Indicador a gas</h1>

      {/* FILTROS */}
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
                onClick={(e: any) => { e.stopPropagation(); handleDownloadGlobal(); }}
                className="flex items-center gap-1 text-blue-500 font-medium text-xs hover:text-blue-600 transition-colors px-4"
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
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Código Kit</th>
                <th className="px-6 py-4">Evidencia</th>
                <th className="px-4 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors text-slate-500">
                  <td className="px-6 py-4">{row.fecha}</td>
                  <td className="px-6 py-4">{row.nombre}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{row.valor}</td>
                  <td className="px-6 py-4 text-blue-500 underline cursor-pointer">{row.kit}</td>
                  
                  {/* Celdas con Vista Previa */}
                  <td className="px-6 py-4 flex items-center gap-3">
                    <button onClick={() => handlePreview(row)} className="text-blue-500 hover:underline cursor-pointer">Documento.pdf</button>
                    <button onClick={() => handlePreview(row)} className="text-blue-400 hover:text-blue-600"><Eye size={18} /></button>
                  </td>
                  
                  {/* Menú de Acciones */}
                  <td className="px-4 py-4 text-right relative">
                    <button 
                        onClick={(e: any) => toggleMenu(i, e)}
                        className={`p-1 rounded-full transition-colors ${openMenuIndex === i ? 'bg-blue-50 text-blue-500' : 'text-slate-300 hover:text-blue-500 hover:bg-slate-50'}`}
                    >
                        <MoreVertical size={18} />
                    </button>

                    {openMenuIndex === i && (
                        <div ref={menuRef} className="absolute right-8 top-4 w-40 bg-white rounded-lg shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                            <div className="flex flex-col py-1">
                                <button onClick={() => handleEdit(row)} className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors text-left"><Edit size={14} /> Editar</button>
                                <button onClick={() => handleViewDetail(row)} className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors text-left"><FileText size={14} /> Ver detalle</button>
                                <button onClick={() => handleRowDownload(row)} className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors text-left"><Download size={14} /> Descargar</button>
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
        <div className="mt-auto p-4 flex justify-between items-center text-xs text-slate-300">
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
      {/* MODAL 1: EDITAR                                         */}
      {/* ======================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 font-sans">
             <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" onClick={() => setIsEditModalOpen(false)} />
             <div className="relative bg-white w-[750px] rounded-[30px] shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col p-10">
                <h2 className="text-2xl font-bold text-blue-500 text-center mb-8">Editar indicador a gas</h2>
                <div className="flex flex-col gap-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ModalInput label="Fecha" defaultValue={selectedItem?.fecha} icon={Calendar} />
                        <ModalInput label="Nombre" defaultValue={selectedItem?.nombre} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ModalInput label="Valor" defaultValue={selectedItem?.valor} />
                        <ModalInput label="Evidencia" defaultValue="Documento.pdf" icon={Paperclip} />
                    </div>
                </div>
                <div className="flex justify-center gap-6 mt-2">
                    <button onClick={() => setIsEditModalOpen(false)} className="text-slate-500 font-bold hover:text-red-500 transition-colors text-sm">Cancelar</button>
                    <button className="px-12 py-2.5 rounded-full text-white font-bold bg-gradient-to-r from-blue-400 to-emerald-400 shadow-lg text-sm">Guardar</button>
                </div>
             </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL 2: VER DETALLE                                    */}
      {/* ======================================================= */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 font-sans">
             <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" onClick={() => setIsDetailModalOpen(false)} />
             <div className="relative bg-white w-[900px] rounded-[30px] shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col p-8 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-blue-500 text-center mb-8">Detalle indicador a gas</h2>
                <div className="flex flex-col gap-5 mb-8">
                    <div className="flex gap-4">
                        <div className="w-1/3"><ModalInput label="Fecha" defaultValue={selectedItem?.fecha} icon={Calendar} /></div>
                        <div className="flex-1"><ModalInput label="Nombre" defaultValue={selectedItem?.nombre} /></div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1/3"><ModalInput label="Valor" defaultValue={selectedItem?.valor} /></div>
                        <div className="w-1/3"><ModalInput label="Valor" defaultValue={selectedItem?.valor} /></div>
                        <div className="w-1/3"><ModalInput label="Evidencia" defaultValue="Documento.pdf" icon={Paperclip} /></div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1/4"><ModalInput label="Especialidad" defaultValue="String value" /></div>
                        <div className="w-1/4"><ModalInput label="Subespecialidad" defaultValue="String value" /></div>
                        <div className="w-1/4"><ModalInput label="T. Subespecialidad" defaultValue="String value" /></div>
                        <div className="w-1/4"><ModalInput label="Kit" defaultValue="01" /></div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-8">
                    <div className="bg-blue-50/50 px-6 py-3 border-b border-slate-200 flex text-blue-900 font-bold text-sm">
                        <div className="w-24">Cantidad</div>
                        <div className="flex-1 flex items-center gap-1">Instrumentos quirúrgicos <ArrowDown size={14} className="text-blue-500" /></div>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                        {instrumentosDetalle.map((inst, idx) => (
                            <div key={idx} className="flex px-6 py-3 text-sm text-slate-500 hover:bg-slate-50 transition-colors">
                                <div className="w-24 flex items-center justify-start pl-2 font-medium">{inst.cant}</div>
                                <div className="flex-1 flex items-center gap-3">{inst.nombre}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center">
                    <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-600 font-bold hover:text-red-500 transition-colors text-sm">Cancelar</button>
                </div>
             </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* MODAL 3: VISTA PREVIA                                   */}
      {/* ======================================================= */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-6 font-sans">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsPreviewModalOpen(false)} />
             
             <div className="relative bg-white w-[1000px] h-[650px] flex rounded-[24px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Visualizador Izquierdo */}
                <div className="w-[70%] bg-slate-100 relative flex items-center justify-center p-8">
                    <div className="bg-white shadow-xl max-w-full max-h-full overflow-hidden transform transition-transform">
                        <div className="w-[400px] h-[500px] bg-slate-200 flex items-center justify-center relative">
                             <div className="absolute inset-0 bg-[url('https://placehold.co/400x500/e2e8f0/94a3b8?text=Documento+Gas')] bg-cover opacity-50"></div>
                             <div className="bg-white p-4 shadow-md rotate-[-5deg] w-64 border border-slate-300">
                                 <div className="h-4 w-full bg-red-500/80 mb-2"></div>
                                 <div className="flex gap-2">
                                     <div className="h-12 w-12 bg-black/10"></div>
                                     <div className="flex-1 space-y-2">
                                         <div className="h-2 bg-slate-300 w-full"></div>
                                         <div className="h-2 bg-slate-300 w-3/4"></div>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>
                    {/* Zoom Control */}
                    <div className="absolute bottom-6 left-6 bg-white rounded-lg shadow-lg border border-slate-200 flex flex-col items-center py-2 px-1 gap-2">
                        <button className="p-1 hover:bg-slate-100 rounded text-slate-500"><Plus size={18} /></button>
                        <div className="h-24 w-1 bg-slate-100 rounded-full relative mx-auto my-1">
                            <div className="absolute bottom-0 w-full h-1/2 bg-blue-400 rounded-full"></div>
                            <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white border-2 border-blue-400 rounded-full shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
                        </div>
                        <button className="p-1 hover:bg-slate-100 rounded text-slate-500"><Minus size={18} /></button>
                    </div>
                </div>

                {/* Panel Derecho */}
                <div className="w-[30%] bg-white p-8 flex flex-col border-l border-slate-100 relative">
                    <h2 className="text-2xl font-bold text-blue-600 mb-8">Vista previa</h2>
                    <div className="space-y-6 flex-1">
                        <div>
                            <span className="text-blue-500 font-bold text-sm block mb-1">Origen:</span>
                            <span className="text-slate-500 text-sm">Esterilización/Gas</span>
                        </div>
                        <div>
                            <span className="text-blue-500 font-bold text-sm block mb-1">Nombre:</span>
                            <div className="flex items-center gap-1 text-slate-500 text-sm bg-slate-50 p-2 rounded-lg border border-slate-100">
                                <span className="flex-1 truncate">Documento_Gas.pdf</span>
                                <span className="text-slate-400 text-xs">.PDF</span>
                            </div>
                        </div>
                        <div>
                             <span className="text-blue-500 font-bold text-sm block mb-1">Tamaño:</span>
                             <span className="text-slate-500 text-sm">120 KB</span>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button onClick={handlePrintDoc} className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="Imprimir">
                                <Printer size={24} />
                            </button>
                            <button onClick={handleDownloadDoc} className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="Descargar">
                                <Download size={24} />
                            </button>
                        </div>
                    </div>
                    <div className="mt-auto flex justify-end">
                        <button onClick={() => setIsPreviewModalOpen(false)} className="text-blue-500 font-bold hover:text-blue-700 text-sm">Cerrar</button>
                    </div>
                </div>
             </div>
        </div>
      )}

    </div>
  );
};

export default IndicadorGasScreen;