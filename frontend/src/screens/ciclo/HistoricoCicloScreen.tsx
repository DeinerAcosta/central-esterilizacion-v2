import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, ArrowDown, Scissors, PenTool, Syringe, GripHorizontal } from 'lucide-react';

const HistoricoCicloScreen: React.FC = () => {
  // Estado para controlar el acordeón del sidebar
  const [expandedSection, setExpandedSection] = useState<any>('Cornea');
  const [selectedKit, setSelectedKit] = useState<any>('CaBas01');

  // Datos del Sidebar
  const sidebarData = [
    { 
      title: 'Cornea', count: 10, 
      items: [
        { id: 'CaBas01', label: 'CaBas01', type: 'Básico' },
        { id: 'CaBas02', label: 'CaBas02', type: 'Básico' },
        { id: 'CaBas03', label: 'CaBas03', type: 'Básico' },
        { id: 'CaAvz01', label: 'CaAvz01', type: 'Avanzado' },
        { id: 'CaAvz02', label: 'CaAvz02', type: 'Avanzado' },
        { id: 'CaAvz03', label: 'CaAvz03', type: 'Avanzado' },
      ] 
    },
    { title: 'Catarata', count: 10, items: [] },
    { title: 'Glaucoma', count: 10, items: [] },
  ];

  // Datos de la Tabla Principal
  const instrumentsData = [
    { icon: PenTool, name: 'Bisturí de córnea', l: 130, s: 134, se: 131, r: 134, e: 132, c: 134, status: 'Activo' },
    { icon: Scissors, name: 'Tijeras de microcirugía', l: 130, s: 135, se: 132, r: 135, e: 133, c: 135, status: 'Activo' },
    { icon: Syringe, name: 'Portaagujas de Barraquer', l: 130, s: 137, se: 134, r: 137, e: 135, c: 137, status: 'Mantenimiento' },
    { icon: GripHorizontal, name: 'Cucharillas de Graefe', l: 130, s: 139, se: 136, r: 139, e: 137, c: 139, status: 'Activo' },
    { icon: Scissors, name: 'Pinzas de iris', l: 130, s: 134, se: 131, r: 134, e: 132, c: 134, status: 'Mantenimiento' },
    { icon: PenTool, name: 'Espátula de iris', l: 130, s: 138, se: 135, r: 138, e: 136, c: 138, status: 'Mantenimiento' },
    { icon: Syringe, name: 'Blefaróstato de Barraquer', l: 130, s: 136, se: 133, r: 136, e: 134, c: 136, status: 'Mantenimiento' },
    { icon: Scissors, name: 'Pinzas de conjuntiva', l: 130, s: 140, se: 137, r: 140, e: 138, c: 140, status: 'Mantenimiento' },
  ];

  return (
    <div className="h-full flex gap-6 font-sans">
      
      {/* SIDEBAR IZQUIERDO */}
      <div className="w-72 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
         {/* Buscador Sidebar */}
         <div className="p-4 border-b border-slate-50">
            <div className="relative">
                <input type="text" placeholder="Buscar..." className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2 pl-4 pr-10 text-sm outline-none focus:ring-1 focus:ring-blue-200 text-slate-500"/>
                <Search className="absolute right-3 top-2.5 text-blue-400" size={16} />
            </div>
         </div>

         {/* Lista Accordion */}
         <div className="flex-1 overflow-y-auto">
            {sidebarData.map((section, idx) => (
                <div key={idx}>
                    <button 
                        onClick={() => setExpandedSection(expandedSection === section.title ? null : section.title)}
                        className={`w-full flex items-center justify-between px-6 py-4 text-sm font-bold ${expandedSection === section.title ? 'text-blue-600 bg-blue-50/50' : 'text-blue-500 hover:bg-slate-50'}`}
                    >
                        <span>{section.title}</span>
                        <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs">{section.count}</span>
                            {expandedSection === section.title ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                        </div>
                    </button>
                    
                    {/* Subitems */}
                    {expandedSection === section.title && (
                        <div className="bg-slate-50/50">
                            {section.items.map((item) => (
                                <button 
                                    key={item.id}
                                    onClick={() => setSelectedKit(item.id)}
                                    className={`w-full flex items-center justify-between px-8 py-3 text-sm transition-colors border-l-4 ${
                                        selectedKit === item.id 
                                        ? 'border-blue-500 bg-white font-bold text-slate-700' 
                                        : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                                    }`}
                                >
                                    <span>{item.label}</span>
                                    <span className="text-xs text-slate-400 font-normal">{item.type}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}
         </div>
      </div>

      {/* CONTENIDO DERECHO */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
         {/* Header */}
         <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <h1 className="text-3xl font-bold text-blue-600">Histórico de ciclo</h1>
             
             {/* Info de cabecera */}
             <div className="flex items-center text-sm">
                 <div className="px-4 border-r border-slate-200 text-center">
                     <span className="block text-blue-500 font-bold">Especialidad</span>
                     <span className="text-slate-500">Oftalmología</span>
                 </div>
                 <div className="px-4 border-r border-slate-200 text-center">
                     <span className="block text-blue-500 font-bold">Subespecialidad</span>
                     <span className="text-slate-500">Cornea</span>
                 </div>
                 <div className="px-4 border-r border-slate-200 text-center">
                     <span className="block text-blue-500 font-bold">T. Subespecialidad</span>
                     <span className="text-slate-500">Basico</span>
                 </div>
                 <div className="px-4 text-center">
                     <span className="block text-blue-500 font-bold">KIT</span>
                     <span className="text-slate-500">01</span>
                 </div>
             </div>
         </div>

         {/* Tabla */}
         <div className="flex-1 overflow-auto p-4">
            <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-blue-50/30 text-slate-700 font-bold">
                    <tr>
                        <th className="px-4 py-3 rounded-l-lg flex items-center gap-1 cursor-pointer hover:text-blue-600">
                            Nombre <ArrowDown size={14}/>
                        </th>
                        <th className="px-4 py-3 text-center">Lavado</th>
                        <th className="px-4 py-3 text-center">Secado</th>
                        <th className="px-4 py-3 text-center">Sellado</th>
                        <th className="px-4 py-3 text-center">Rotulado</th>
                        <th className="px-4 py-3 text-center">Esterilizado</th>
                        <th className="px-4 py-3 text-center">Cirugía</th>
                        <th className="px-4 py-3 text-center rounded-r-lg">Estado</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {instrumentsData.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-4 text-slate-500 flex items-center gap-3">
                                <row.icon size={16} className="text-slate-400" />
                                {row.name}
                            </td>
                            <td className="px-4 py-4 text-center text-slate-500">{row.l}</td>
                            <td className="px-4 py-4 text-center text-slate-500">{row.s}</td>
                            <td className="px-4 py-4 text-center text-slate-500">{row.se}</td>
                            <td className="px-4 py-4 text-center text-slate-500">{row.r}</td>
                            <td className="px-4 py-4 text-center text-slate-500">{row.e}</td>
                            <td className="px-4 py-4 text-center text-slate-500">{row.c}</td>
                            <td className="px-4 py-4 text-center">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                    row.status === 'Activo' 
                                    ? 'bg-emerald-50 text-emerald-500 border-emerald-100' 
                                    : 'bg-red-50 text-red-500 border-red-100'
                                }`}>
                                    {row.status}
                                </span>
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

export default HistoricoCicloScreen;