import React from 'react';

interface InventarioHVProps {
  data: any[];
  loading: boolean;
  kitColor: (i: number) => string;
}

export const InventarioHV: React.FC<InventarioHVProps> = ({ data, loading, kitColor }) => {
  return (
    <div className="flex-1 overflow-visible relative table-container" style={{ zIndex: 10 }}>
      <table className="w-full text-left" style={{ fontSize: 12.5 }}>
        <thead className="bg-sky-50/40 text-slate-600 border-b border-slate-100 sticky top-0 z-10">
          <tr>
            {['Especialidad', 'Subespecialidad', 'Tipo subespecialidad', 'KIT', 'Cantidad'].map((h, i) => (
              <th key={i} className="px-5 py-3 whitespace-nowrap text-xs font-bold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {loading ? (
            <tr><td colSpan={5} className="text-center py-10 text-slate-400">Cargando datos...</td></tr>
          ) : data.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-10 text-slate-400">No hay instrumentos en inventario.</td></tr>
          ) : (
            data.map((row: any, index: number) => (
              <tr key={row.id || index} className="hover:bg-slate-50/50">
                <td className="px-5 py-4 text-slate-500 text-xs">{row.esp}</td>
                <td className="px-5 py-4 text-slate-500 text-xs">{row.sub}</td>
                <td className="px-5 py-4 text-slate-500 text-xs">{row.tipo}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {!row.kits?.length ? (
                      <span className="text-xs text-slate-300 italic">Sueltos</span>
                    ) : (
                      row.kits.map((k: string, i: number) => (
                        <span key={i} className={`px-2 py-0.5 rounded border text-[10px] font-bold ${kitColor(i)}`}>
                          {k}
                        </span>
                      ))
                    )}
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-700 font-bold text-xs text-center">{row.cant}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};