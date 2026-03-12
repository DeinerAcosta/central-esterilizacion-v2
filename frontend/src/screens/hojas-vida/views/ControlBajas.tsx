import React from 'react';
import { ChevronLeft, Database, Search, ChevronsLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { ModalNotchSelect } from '../../../components/ui/ModalNotch';

interface ControlBajasProps {
  setIsBajasOpen: (val: boolean) => void;
  bajasDesde: string; setBajasDesde: (val: string) => void;
  bajasHasta: string; setBajasHasta: (val: string) => void;
  bajasEsp: string; setBajasEsp: (val: string) => void;
  bajasSub: string; setBajasSub: (val: string) => void;
  bajasSearch: string; setBajasSearch: (val: string) => void;
  handleBajaDateChange: (tipo: 'desde' | 'hasta', val: string) => void;
  especialidades: any[]; subespecialidades: any[];
  bajasLoading: boolean; bajasData: any[];
  bajasPage: number; setBajasPage: any; bajasTotalPages: number;
  today: string;
}

export const ControlBajas: React.FC<ControlBajasProps> = ({
  setIsBajasOpen, bajasDesde, bajasHasta, bajasEsp, setBajasEsp, bajasSub, setBajasSub,
  bajasSearch, setBajasSearch, handleBajaDateChange, especialidades, subespecialidades,
  bajasLoading, bajasData, bajasPage, setBajasPage, bajasTotalPages, today
}) => {
  return (
    <div className="h-full flex flex-col overflow-y-auto hide-scrollbar pb-10 gap-4">
      {/* Encabezado */}
      <div className="flex items-center gap-2">
        <button onClick={() => setIsBajasOpen(false)} className="text-sky-500 hover:text-sky-700 p-1">
          <ChevronLeft size={26} strokeWidth={2.5} />
        </button>
        <Database size={22} className="text-red-400" />
        <h1 className="text-xl font-bold text-slate-800">Control de Bajas</h1>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        {([{ lbl: 'Desde', val: bajasDesde, idx: 0 }, { lbl: 'Hasta', val: bajasHasta, idx: 1 }]).map(f => (
          <div key={f.lbl} style={{ position: 'relative', width: 148 }}>
            <input type="date" value={f.val} max={f.idx === 1 ? today : undefined}
              onChange={e => handleBajaDateChange(f.idx === 0 ? 'desde' : 'hasta', e.target.value)}
              style={{
                width: '100%', height: 42, borderRadius: 30, border: '1.5px solid #d1d5db',
                background: '#f8fafc', padding: '10px 16px 0 16px', fontSize: 13, color: '#334155',
                outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter,sans-serif'
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#3b82f6'}
              onBlur={e => e.currentTarget.style.borderColor = '#d1d5db'} />
            <span style={{
              position: 'absolute', left: 16, top: 0, transform: 'translateY(-50%)',
              fontSize: 10.5, color: '#6b7280', background: '#f8fafc', padding: '0 4px',
              fontFamily: 'Inter,sans-serif', whiteSpace: 'nowrap'
            }}>{f.lbl}</span>
          </div>
        ))}
        <ModalNotchSelect label="Especialidad" compact value={bajasEsp}
          onChange={v => { setBajasEsp(v); setBajasSub(''); }}
          options={especialidades.map(x => ({ value: String(x.id), label: x.nombre }))} />
        <ModalNotchSelect label="Subespecialidad" compact disabled={!bajasEsp}
          value={bajasSub} onChange={setBajasSub}
          options={subespecialidades.filter(s => s.especialidadId === Number(bajasEsp))
            .map(x => ({ value: String(x.id), label: x.nombre }))} />
        
        {/* Buscador de Bajas: Permite Letras y Números */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <input 
            type="text" 
            placeholder="Buscar instrumento o kit..." 
            value={bajasSearch}
            onChange={e => {
              // Validación alfanumérica
              const val = e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, '');
              setBajasSearch(val);
            }}
            style={{
              width: '100%', height: 42, borderRadius: 30, border: '1.5px solid #d1d5db',
              background: '#f8fafc', padding: '0 40px 0 16px', fontSize: 13, color: '#475569',
              outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter,sans-serif', transition: 'border-color 0.2s'
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#3b82f6'}
            onBlur={e => e.currentTarget.style.borderColor = '#d1d5db'} 
          />
          <Search size={15} style={{
            position: 'absolute', right: 14, top: '50%',
            transform: 'translateY(-50%)', color: '#60a5fa', pointerEvents: 'none'
          }} />
        </div>
      </div>

      {/* Tabla */}
      <div className="flex-1 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-red-50 text-red-700 font-bold border-b border-red-100 sticky top-0">
              <tr>{['Fecha de Baja', 'Instrumento', 'Código', 'Especialidad', 'Subespecialidad', 'KIT'].map(h => (
                <th key={h} className="px-5 py-3 whitespace-nowrap text-xs font-bold">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bajasLoading ? <tr><td colSpan={6} className="text-center py-10 text-slate-400">Buscando...</td></tr>
                : bajasData.length === 0 ? <tr><td colSpan={6} className="text-center py-10 text-slate-400">No se encontraron instrumentos dados de baja.</td></tr>
                : bajasData.map((r: any) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 text-red-500 font-bold text-xs">{new Date(r.updatedAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3 text-slate-700 font-medium text-xs">{r.nombre}</td>
                    <td className="px-5 py-3 font-mono text-xs font-bold text-slate-500">{r.codigo}</td>
                    <td className="px-5 py-3 text-slate-500 text-xs">{r.especialidad?.nombre}</td>
                    <td className="px-5 py-3 text-slate-500 text-xs">{r.subespecialidad?.nombre}</td>
                    <td className="px-5 py-3 text-slate-500 text-xs">{r.kit?.codigoKit || <span className="text-slate-300 italic">Suelto</span>}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        
        {/* Paginación */}
        <div className="p-3 flex justify-between items-center text-xs text-slate-400 border-t border-slate-50">
          <span>Pág. {bajasPage} de {bajasTotalPages}</span>
          <div className="flex items-center gap-1.5 text-sky-500">
            <button onClick={() => setBajasPage(1)} disabled={bajasPage === 1} className="disabled:text-slate-300"><ChevronsLeft size={15} /></button>
            <button onClick={() => setBajasPage((p: number) => Math.max(1, p - 1))} disabled={bajasPage === 1} className="disabled:text-slate-300"><ChevronLeft size={15} /></button>
            <span className="bg-sky-50 px-2.5 py-1 rounded text-sky-600 font-bold">{bajasPage}/{bajasTotalPages || 1}</span>
            <button onClick={() => setBajasPage((p: number) => Math.min(bajasTotalPages, p + 1))} disabled={bajasPage === bajasTotalPages} className="disabled:text-slate-300"><ChevronRight size={15} /></button>
            <button onClick={() => setBajasPage(bajasTotalPages)} disabled={bajasPage === bajasTotalPages} className="disabled:text-slate-300"><ChevronsRight size={15} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};