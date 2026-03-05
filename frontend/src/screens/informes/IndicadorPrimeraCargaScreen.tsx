import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, ChevronLeft, Calendar, MoreVertical, ChevronRight } from 'lucide-react';

const IndicadorPrimeraCargaScreen: React.FC = () => {
  // Estado para controlar qué menú de fila está abierto
  const [openMenuIndex, setOpenMenuIndex] = useState<any>(null);
  
  // Referencia para detectar clicks fuera del menú
  const menuRef = useRef(null);

  const data = [
    { no: 1, fecha: '06/02/2023', lote: '5665/1', temp: '734°C', presion: '30lb', inicio: '11:00am', salida: '12:20pm' },
    { no: 2, fecha: '18/12/2024', lote: '5666/1', temp: '738°C', presion: '29lb', inicio: '8:00am', salida: '9:20pm' },
    { no: 3, fecha: '30/10/2026', lote: '5667/1', temp: '734°C', presion: '30lb', inicio: '10:00am', salida: '11:10pm' },
    { no: 4, fecha: '10/9/2028', lote: '5668/1', temp: '734°C', presion: '30lb', inicio: '11:00am', salida: '12:20pm' },
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

  // --- FUNCIÓN DE DESCARGA GLOBAL (MASIVA) ---
  const handleDownload: React.FC = () => {
    const headers = "No,Fecha,Lote/Carga,Equipo,Instrumental,Temperatura,Libras Presion,Hora Inicio,Hora Salida\n";
    const rows = data.map(row => 
      `${row.no},${row.fecha},${row.lote},--,--,${row.temp},${row.presion},${row.inicio},${row.salida}`
    ).join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reporte_primera_carga_completo.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- FUNCIÓN DE DESCARGA INDIVIDUAL ---
  const handleRowDownload = (item) => {
      const headers = "No,Fecha,Lote/Carga,Equipo,Instrumental,Temperatura,Libras Presion,Hora Inicio,Hora Salida\n";
      const row = `${item.no},${item.fecha},${item.lote},--,--,${item.temp},${item.presion},${item.inicio},${item.salida}`;
      
      const csvContent = "data:text/csv;charset=utf-8," + headers + row;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      // Nombre único para el archivo individual
      link.setAttribute("download", `reporte_carga_${item.lote.replace('/', '-')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setOpenMenuIndex(null); // Cerrar menú después de descargar
  };

  return (
    <div className="space-y-6 h-full flex flex-col font-sans" onClick={() => setOpenMenuIndex(null)}>
      {/* Header */}
      <div className="flex items-center gap-2 text-2xl font-bold">
        <Link to="/informes" className="text-blue-500 hover:underline flex items-center gap-1"><ChevronLeft /> Informes</Link>
      </div>
      <h1 className="text-xl font-bold text-slate-600 pl-8 -mt-4">Indicador de primera carga</h1>
      
      {/* Filtros */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-center bg-white p-1 rounded-xl">
        <div className="flex flex-wrap gap-4 flex-1 w-full items-center">
           <div className="relative w-64"><input type="text" placeholder="Buscar..." className="w-full bg-slate-50 border-none rounded-lg py-2 pl-4 pr-10 text-sm outline-none focus:ring-1 focus:ring-blue-200 text-slate-500"/><Search className="absolute right-3 top-2 text-blue-400" size={16} /></div>
           <div className="flex gap-2">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-400 text-sm"><span>Fecha desde</span> <Calendar size={16} /></button>
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-400 text-sm"><span>Fecha hasta</span> <Calendar size={16} /></button>
           </div>
        </div>
        
        {/* BOTÓN DESCARGA MASIVA */}
        <button 
            onClick={(e: any) => { e.stopPropagation(); handleDownload(); }}
            className="flex items-center gap-1 text-blue-500 font-medium text-xs hover:text-blue-600 transition-colors"
        >
            Descargar <Download size={16} />
        </button>
      </div>

      {/* Tabla */}
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
                  
                  {/* --- COLUMNA DE MENÚ --- */}
                  <td className="px-4 py-4 text-right relative">
                    <button 
                        onClick={(e: any) => toggleMenu(i, e)}
                        className={`p-1 rounded-full transition-colors ${openMenuIndex === i ? 'bg-blue-50 text-blue-500' : 'text-slate-300 hover:text-blue-500 hover:bg-slate-50'}`}
                    >
                        <MoreVertical size={18} />
                    </button>

                    {/* Menú Desplegable: SOLO DESCARGAR INDIVIDUAL */}
                    {openMenuIndex === i && (
                        <div ref={menuRef} className="absolute right-8 top-4 w-32 bg-white rounded-lg shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                            <div className="flex flex-col py-1">
                                <button 
                                    onClick={() => handleRowDownload(row)}
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
    </div>
  );
};

export default IndicadorPrimeraCargaScreen;