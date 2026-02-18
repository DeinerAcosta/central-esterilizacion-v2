import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRightCircle,
  Check,
  X
} from 'lucide-react';

const TrazabilidadScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<any>('ciclos');
  const [view, setView] = useState<any>('list'); // list | aprobar

  // Datos simulados
  const data = [
    { fecha: '08/04/2025 08:00 pm', qui: 'Quirofano 05', sede: 'Quirofano 05', esp: 'Oftalmología', sub: 'Catarata', tipo: 'Básico', kit: '01', instr: 'Fernando Andrés Piedrahita Tresp...' },
    { fecha: '08/04/2025 09:00 pm', qui: 'Quirofano 05', sede: 'Quirofano 05', esp: 'Oftalmología', sub: 'Catarata', tipo: 'Básico', kit: '02', instr: 'Francisco José Aristizábal Rodriguez' },
    { fecha: '08/04/2025 11:00 pm', qui: 'Quirofano 06', sede: 'Quirofano 05', esp: 'Oftalmología', sub: 'Glaucoma', tipo: 'Avanzado', kit: '02', instr: 'Carlos Alberto Martínez Villamizar' },
  ];

  const instrumentos = [
    'Bisturí de córnea',
    'Blefaróstato de Barraquer',
    'Pinzas de iris',
    'Portaagujas de Barraquer',
    'Espátula de iris',
    'Ganchos de iris',
    'Lenticular de Facoemulsificación',
  ];

  /* ========================================================= */
  /* ================= VISTA APROBAR ========================= */
  /* ========================================================= */
  if (view === 'aprobar') {
    return (
      <div className="space-y-6 h-full font-sans">

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <button onClick={() => setView('list')}>
            <ChevronLeft size={28} className="text-blue-500" />
          </button>
          <h1 className="text-3xl font-bold text-blue-500">
            Aprobar asignaciones
          </h1>
        </div>

        {/* FILTROS */}
        <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl border border-slate-100">
          {[
            'Especialidad',
            'Subespecialidad',
            'Tipo de sub-especialidad',
            'KIT',
          ].map((f) => (
            <button
              key={f}
              className="flex items-center gap-2 px-4 py-2 border rounded-full text-slate-400"
            >
              {f} <ChevronDown size={16} />
            </button>
          ))}
          <button className="flex items-center gap-2 px-4 py-2 border rounded-full text-slate-400">
            Fecha de la asignación <Calendar size={16} />
          </button>
        </div>

        {/* TABLA */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-50 text-slate-700 font-bold">
              <tr>
                <th className="px-6 py-4">Instrumento</th>
                <th className="px-6 py-4 text-right">Estado</th>
              </tr>
            </thead>
            <tbody>
              {instrumentos.map((inst, i) => (
                <tr key={i} className="border-t">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <button className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center">
                      <Check size={18} />
                    </button>
                    <button className="w-9 h-9 rounded-full border border-red-400 text-red-400 flex items-center justify-center">
                      <X size={18} />
                    </button>
                    <span className="text-slate-500 font-medium">
                      {inst}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-4 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">
                      Pendiente
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-4">
          <button className="px-6 py-3 rounded-full border border-red-400 text-red-400 font-bold">
            Rechazar todo
          </button>
          <button className="px-6 py-3 rounded-full bg-blue-500 text-white font-bold">
            Aprobar todo
          </button>
          <button className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 text-white font-bold">
            Guardar
          </button>
        </div>
      </div>
    );
  }

  /* ========================================================= */
  /* ================= VISTA LISTADO ========================= */
  /* ========================================================= */

  return (
    <div className="space-y-6 h-full flex flex-col font-sans">

      <h1 className="text-3xl font-bold text-blue-500">Trazabilidad Qx</h1>

      {/* TABS */}
      <div className="flex w-full bg-white rounded-t-xl overflow-hidden border-b">
        {['asignaciones', 'ciclos'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-bold ${
              activeTab === tab
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-slate-400'
            }`}
          >
            {tab === 'asignaciones' ? 'Asignaciones' : 'Ciclos'}
          </button>
        ))}
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl border overflow-hidden flex-1">
        <table className="w-full text-sm">
          <thead className="bg-blue-50 text-slate-700 font-bold">
            <tr>
              <th className="px-6 py-4">Fecha / Hora</th>
              <th className="px-6 py-4">Quirófano</th>
              <th className="px-6 py-4">Sede</th>
              <th className="px-6 py-4">Especialidad</th>
              <th className="px-6 py-4">Subespecialidad</th>
              <th className="px-6 py-4">T. Subespecialidad</th>
              <th className="px-6 py-4">KIT</th>
              {activeTab === 'ciclos' && (
                <th className="px-6 py-4">Instrumentador</th>
              )}
              <th className="px-4 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-t hover:bg-slate-50">
                <td className="px-6 py-4">{row.fecha}</td>
                <td className="px-6 py-4">{row.qui}</td>
                <td className="px-6 py-4">{row.sede}</td>
                <td className="px-6 py-4">{row.esp}</td>
                <td className="px-6 py-4">{row.sub}</td>
                <td className="px-6 py-4">{row.tipo}</td>
                <td className="px-6 py-4 text-center">{row.kit}</td>

                {activeTab === 'ciclos' && (
                  <td className="px-6 py-4">{row.instr}</td>
                )}

                <td className="px-4 py-4 text-right">
                  {activeTab === 'asignaciones' && (
                    <button
                      onClick={() => setView('aprobar')}
                      className="text-blue-400 hover:text-blue-600"
                    >
                      <ArrowRightCircle size={20} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINACIÓN */}
        <div className="p-4 flex justify-between text-xs text-slate-300 border-t">
          <span>Pág. 2 de 14 (135 encontrados)</span>
          <div className="flex gap-2 items-center text-blue-400">
            <ChevronLeft size={14} />
            <span className="bg-blue-50 px-2 rounded text-blue-600">1</span>
            <span>/</span>
            <span>3</span>
            <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrazabilidadScreen;
