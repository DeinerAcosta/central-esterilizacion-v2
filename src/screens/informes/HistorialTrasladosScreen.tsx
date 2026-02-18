import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Download, ChevronLeft, Calendar, MoreVertical, ChevronRight, 
  FileText, Activity 
} from 'lucide-react';

const HistorialTrasladosScreen: React.FC = () => {
  // --- ESTADOS ---
  const [activeTab, setActiveTab] = useState<any>('kit');
  const [openMenuIndex, setOpenMenuIndex] = useState<any>(null);
  const menuRef = useRef(null);

  // Estado para manejar la vista (null = lista principal, objeto = vista detalle)
  const [selectedKit, setSelectedKit] = useState<any>(null);

  // --- DATOS SIMULADOS ---
  const dataKits = [
    { 
      id: 1, fechaT: '07/03/2024', fechaD: '23/03/2024', origen: 'Sala Azul', destino: 'Sabana larga', 
      esp: 'Oftalmología', sub: 'Catarata', tipo: 'Avanzado', kit: '1', codigoKit: 'OfCaAv01',
      contenido: [
        { codigo: '053', nombre: 'Bisturí de córnea', instr: 'AR3436745' },
        { codigo: '023', nombre: 'Autorrefractómetro', instr: 'EC7375464' },
        { codigo: '047', nombre: 'Láser de Argón', instr: 'HD2745332' }
      ]
    },
    { 
      id: 2, fechaT: '09/06/2024', fechaD: '20/06/2024', origen: 'Sala Azul', destino: 'Cartagena', 
      esp: 'Oftalmología', sub: 'Catarata', tipo: 'Basico', kit: '3', codigoKit: 'OfCaBa03',
      contenido: [
        { codigo: '025', nombre: 'Tonometría de Goldmann', instr: 'AR3436745' },
        { codigo: '020', nombre: 'Cirugía refractiva', instr: 'EC7375464' }
      ]
    },
    { 
      id: 3, fechaT: '14/12/2024', fechaD: '19/12/2024', origen: 'Sala Azul', destino: 'Riohacha', 
      esp: 'Oftalmología', sub: 'Cornea', tipo: 'Avanzado', kit: '2', codigoKit: 'OfCoAv02',
      contenido: [
        { codigo: '028', nombre: 'Prisma de Fresnel', instr: 'HD2745332' },
        { codigo: '073', nombre: 'Escleral', instr: 'AR3436745' }
      ]
    },
    { id: 4, fechaT: '18/03/2025', fechaD: '20/03/2025', origen: 'Sala Azul', destino: 'Barranquilla', esp: 'Oftalmología', sub: 'Ceroplástica', tipo: 'Avanzado', kit: '8', codigoKit: 'OfCeAv08', contenido: [] },
    { id: 5, fechaT: '20/06/2025', fechaD: '30/06/2025', origen: 'Sala Azul', destino: 'San Andrés', esp: 'Oftalmología', sub: 'Ceroplástica', tipo: 'Basico', kit: '1', codigoKit: 'OfCeBa01', contenido: [] },
    { id: 6, fechaT: '11/09/2024', fechaD: '28/09/2024', origen: 'Sala Azul', destino: 'Santa marta', esp: 'Oftalmología', sub: 'Catarata', tipo: 'Basico', kit: '5', codigoKit: 'OfCaBa05', contenido: [] },
  ];

  const dataInstrumentos = [
    { fechaT: '07/03/2024', fechaD: '23/03/2024', origen: 'Sala Azul', destino: 'Sabana larga', nombre: 'Portaagujas', cant: 5 },
    { fechaT: '09/06/2024', fechaD: '20/06/2024', origen: 'Sala Azul', destino: 'Cartagena', nombre: 'Blefaróstato', cant: 2 },
    { fechaT: '11/09/2024', fechaD: '28/09/2024', origen: 'Sala Azul', destino: 'Santa marta', nombre: 'Tijera de Westcott', cant: 1 },
    { fechaT: '14/12/2024', fechaD: '19/12/2024', origen: 'Sala Azul', destino: 'Riohacha', nombre: 'Riohacha', cant: 3 },
    { fechaT: '18/03/2025', fechaD: '20/03/2025', origen: 'Sala Azul', destino: 'Barranquilla', nombre: 'Pinza Relojero', cant: 2 },
    { fechaT: '20/06/2025', fechaD: '30/06/2025', origen: 'Sala Azul', destino: 'San Andrés', nombre: 'Portaagujas', cant: 1 },
  ];

  // --- HANDLERS ---

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

  // Activar vista detalle (reemplaza a la tabla principal)
  const handleOpenDetail = (item) => {
      setSelectedKit(item);
      setOpenMenuIndex(null);
  };

  // Volver a la tabla principal
  const handleBackToMain: React.FC = () => {
      setSelectedKit(null);
  };

  // Descargar CSV
  const handleDownload: React.FC = () => {
    let headers = "";
    let rows = "";
    let filename = "";

    if (activeTab === 'kit') {
      headers = "Fecha Traslado,Fecha Devolucion,Origen,Destino,Especialidad,Subespecialidad,Tipo,Kit\n";
      rows = dataKits.map(row => 
        `${row.fechaT},${row.fechaD},${row.origen},${row.destino},${row.esp},${row.sub},${row.tipo},${row.kit}`
      ).join("\n");
      filename = "historial_traslados_kits.csv";
    } else {
      headers = "Fecha Traslado,Fecha Devolucion,Origen,Destino,Nombre Instrumento,Cantidad\n";
      rows = dataInstrumentos.map(row => 
        `${row.fechaT},${row.fechaD},${row.origen},${row.destino},${row.nombre},${row.cant}`
      ).join("\n");
      filename = "historial_traslados_instrumentos.csv";
    }

    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- RENDERIZADO CONDICIONAL ---

  // 1. VISTA DE DETALLE (PANTALLA COMPLETA)
  if (selectedKit) {
    return (
      <div className="space-y-6 h-full flex flex-col font-sans relative animate-in fade-in duration-300">
        
        {/* Cabecera de Navegación */}
        <div className="flex items-center gap-2">
           <button 
              onClick={handleBackToMain}
              className="flex items-center gap-2 text-blue-500 font-bold text-3xl hover:text-blue-600 transition-colors"
           >
              <ChevronLeft size={36} strokeWidth={2.5} /> Detalle
           </button>
        </div>

        {/* Buscador Superior */}
        <div>
            <div className="relative w-full md:w-80">
                 <input 
                    type="text" 
                    placeholder="Buscar..." 
                    className="w-full bg-slate-50 border-none rounded-lg py-3 pl-4 pr-10 text-sm outline-none focus:ring-1 focus:ring-blue-200 text-slate-500 shadow-sm"
                 />
                 <Search className="absolute right-3 top-3 text-blue-400" size={18} />
            </div>
        </div>

        {/* Tabla de Detalle (Container Blanco Principal) */}
        <div className="bg-white rounded-[1rem] shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden">
            <div className="overflow-auto flex-1">
                <table className="w-full text-left text-sm">
                    {/* Header Azul como en la imagen */}
                    <thead className="bg-blue-50/50 text-slate-600 font-bold sticky top-0 z-10 border-b border-blue-50">
                        <tr>
                            <th className="px-6 py-5 whitespace-nowrap">Fecha / Hora</th>
                            <th className="px-6 py-5 whitespace-nowrap">Nombre</th>
                            <th className="px-6 py-5 whitespace-nowrap">Especialidad</th>
                            <th className="px-6 py-5 whitespace-nowrap">Subespecialidad</th>
                            <th className="px-6 py-5 whitespace-nowrap">T. Subespecialidad</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-500 font-medium">
                        {selectedKit.contenido && selectedKit.contenido.length > 0 ? (
                            selectedKit.contenido.map((item, index) => (
                                <tr key={index} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        {selectedKit.fechaT} <span className="text-xs text-slate-400 ml-1">08:00 pm</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 text-slate-600">
                                            {/* Icono de actividad/ritmo cardiaco simulado */}
                                            <Activity size={18} className="text-slate-300" /> 
                                            {item.nombre}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{selectedKit.esp}</td>
                                    <td className="px-6 py-4">{selectedKit.sub}</td>
                                    <td className="px-6 py-4">{selectedKit.tipo}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                    No hay instrumentos asociados a este kit.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación (Igual al estilo principal) */}
            <div className="mt-auto p-4 flex justify-between items-center text-xs text-slate-300 border-t border-slate-50">
                <span>Pág. 2 de 14 (135 encontrados)</span>
                <div className="flex items-center gap-2 font-bold text-blue-500">
                    <button className="hover:text-blue-700 flex items-center"><ChevronLeft size={16} className="mr-[-6px]" /><ChevronLeft size={16} /></button>
                    <button className="hover:text-blue-700"><ChevronLeft size={16} /></button>
                    
                    <span className="text-slate-400 font-normal px-1">1</span>
                    <span className="bg-blue-50 px-2 py-0.5 rounded text-blue-600 border border-blue-100">2</span>
                    <span className="text-slate-400 font-normal px-1">3</span>
                    <span className="text-slate-400 font-normal px-1">4</span>
                    <span className="text-slate-400 font-normal px-1">...</span>

                    <button className="hover:text-blue-700"><ChevronRight size={16} /></button>
                    <button className="hover:text-blue-700 flex items-center"><ChevronRight size={16} className="mr-[-6px]" /><ChevronRight size={16} /></button>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // 2. VISTA PRINCIPAL (LISTA DE KITS)
  return (
    <div className="space-y-6 h-full flex flex-col font-sans relative" onClick={() => setOpenMenuIndex(null)}>
      
      {/* Cabecera y Breadcrumb */}
      <div className="flex items-center gap-2 text-2xl font-bold">
        <Link to="/informes" className="text-blue-500 hover:underline flex items-center gap-1">
            <ChevronLeft /> Informes
        </Link>
      </div>
      <h1 className="text-xl font-bold text-slate-600 pl-8 -mt-4">Historial de traslado</h1>
      
      {/* Pestañas (Tabs) Superior */}
      <div className="flex w-full bg-white rounded-t-xl overflow-hidden border-b border-slate-100">
        <button 
          onClick={() => { setActiveTab('kit'); setOpenMenuIndex(null); }}
          className={`flex-1 py-3 text-sm font-bold transition-all ${
            activeTab === 'kit' 
              ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-50/20' 
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
        >
          Kit
        </button>
        <button 
          onClick={() => { setActiveTab('instrumento'); setOpenMenuIndex(null); }}
          className={`flex-1 py-3 text-sm font-bold transition-all ${
            activeTab === 'instrumento' 
              ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-50/20' 
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
        >
          Instrumento
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-center bg-white p-2 rounded-b-xl shadow-sm border border-slate-100 mt-0">
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
        
        <button 
            onClick={(e: any) => { e.stopPropagation(); handleDownload(); }}
            className="flex items-center gap-1 text-blue-500 font-medium text-xs hover:text-blue-600 transition-colors px-4"
        >
            Descargar <Download size={16} />
        </button>
      </div>

      {/* Tabla Dinámica */}
      <div className="bg-white rounded-[1rem] shadow-sm border border-slate-100 overflow-visible flex-1 flex flex-col">
        <div className="overflow-visible">
          <table className="w-full text-sm text-left">
            <thead className="bg-blue-50/50 text-slate-700 font-bold">
              {activeTab === 'kit' ? (
                <tr>
                  <th className="px-6 py-4">Fecha traslado</th>
                  <th className="px-6 py-4">Fecha devolucion</th>
                  <th className="px-6 py-4">Sede Origen</th>
                  <th className="px-6 py-4">Sede Destino</th>
                  <th className="px-6 py-4">Especialidad</th>
                  <th className="px-6 py-4">Subespecialidad</th>
                  <th className="px-6 py-4">Tipo de sub</th>
                  <th className="px-6 py-4">Kit</th>
                  <th className="px-4 py-4"></th>
                </tr>
              ) : (
                <tr>
                  <th className="px-6 py-4">Fecha traslado</th>
                  <th className="px-6 py-4">Fecha devolucion</th>
                  <th className="px-6 py-4">Sede Origen</th>
                  <th className="px-6 py-4">Sede Destino</th>
                  <th className="px-6 py-4">Nombre del instrumento</th>
                  <th className="px-6 py-4 text-center">Cantidad</th>
                  <th className="px-4 py-4"></th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activeTab === 'kit' ? (
                dataKits.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors text-slate-500">
                      <td className="px-6 py-4">{row.fechaT}</td>
                      <td className="px-6 py-4">{row.fechaD}</td>
                      <td className="px-6 py-4">{row.origen}</td>
                      <td className="px-6 py-4">{row.destino}</td>
                      <td className="px-6 py-4">{row.esp}</td>
                      <td className="px-6 py-4">{row.sub}</td>
                      <td className="px-6 py-4">{row.tipo}</td>
                      <td className="px-6 py-4">{row.kit}</td>
                      
                      <td className="px-4 py-4 text-right relative">
                          <button 
                            onClick={(e: any) => toggleMenu(i, e)}
                            className={`p-1 rounded-full transition-colors ${openMenuIndex === i ? 'bg-blue-50 text-blue-500' : 'text-slate-300 hover:text-blue-500 hover:bg-slate-50'}`}
                          >
                             <MoreVertical size={18} />
                          </button>

                          {/* MENÚ FLOTANTE */}
                          {openMenuIndex === i && (
                             <div ref={menuRef} className="absolute right-8 top-4 w-36 bg-white rounded-lg shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                                 <div className="flex flex-col py-1">
                                     <button 
                                         onClick={() => handleOpenDetail(row)}
                                         className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors text-left"
                                     >
                                         <FileText size={14} /> Ver detalles
                                     </button>
                                 </div>
                             </div>
                          )}
                      </td>
                    </tr>
                ))
              ) : (
                dataInstrumentos.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors text-slate-500">
                      <td className="px-6 py-4">{row.fechaT}</td>
                      <td className="px-6 py-4">{row.fechaD}</td>
                      <td className="px-6 py-4">{row.origen}</td>
                      <td className="px-6 py-4">{row.destino}</td>
                      <td className="px-6 py-4">{row.nombre}</td>
                      <td className="px-6 py-4 text-center">{row.cant}</td>
                      <td className="px-4 py-4 text-right"></td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginación */}
        <div className="mt-auto p-4 flex justify-between items-center text-xs text-slate-300">
            <span>Pág. 1 de 5 (24 encontrados)</span>
            <div className="flex items-center gap-2 font-medium text-blue-400">
                <button className="hover:text-blue-600"><ChevronLeft size={14} /></button>
                <span className="bg-blue-50 px-2 py-0.5 rounded text-blue-600">1</span>
                <span>/</span><span>3</span>
                <button className="hover:text-blue-600"><ChevronRight size={14} /></button>
            </div>
        </div>
      </div>

    </div>
  );
};

export default HistorialTrasladosScreen;