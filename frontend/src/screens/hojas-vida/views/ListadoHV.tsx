import React from 'react';
import { Edit, FileText, MoreVertical, Image as ImageIcon, Ban, CheckCircle, Database } from 'lucide-react';

interface ListadoHVProps {
  data: any[];
  loading: boolean;
  permisos: any;
  openActionMenu: number | null;
  setOpenActionMenu: (val: number | null) => void;
  handleOpenDetail: (row: any) => void;
  handleOpenEdit: (row: any) => void;
  openRC: (row: any) => void;
  changeStatus: (row: any, estado: string) => void; 
  statusColor: (s: string) => string;
}

export const ListadoHV: React.FC<ListadoHVProps> = ({
  data, loading, permisos, openActionMenu, setOpenActionMenu,
  handleOpenDetail, handleOpenEdit, openRC, changeStatus, statusColor
}) => {
  return (
    <div className="flex-1 overflow-visible relative table-container" style={{ zIndex: 10 }}>
      <table className="w-full text-left" style={{ fontSize: 12.5 }}>
        <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-100 sticky top-0 z-10">
          <tr>
            {['Código', 'C. Instrumento', 'Nombre', 'Especialidad', 'Subespecialidad', 'Tipo subespecialidad', 'KIT', 'F. mtto', 'F. creación', 'Estado', ''].map((h, i) => (
              <th key={i} className={`px-4 py-3 whitespace-nowrap text-xs font-bold ${h === 'KIT' ? 'text-center' : ''}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {loading ? <tr><td colSpan={11} className="text-center py-10 text-slate-400">Cargando datos...</td></tr>
            : data.length === 0 ? <tr><td colSpan={11} className="text-center py-10 text-slate-400">No se encontraron registros.</td></tr>
            : data.map((row: any, idx: number) => (
              <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-4 text-slate-400 text-xs">{row.id}</td>
                <td className="px-4 py-4 font-mono text-xs font-bold text-sky-500">{row.codigo}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200 flex items-center justify-center">
                      {row.fotoUrl ? (
                        <img 
                          src={row.fotoUrl.startsWith('http') ? row.fotoUrl : `http://localhost:4000${row.fotoUrl}`} 
                          alt="" 
                          className="w-full h-full object-cover" 
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <ImageIcon size={11} className="text-slate-300" />
                      )}
                    </div>
                    <span className="text-slate-500 font-medium whitespace-nowrap">{row.nombre}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-500 text-xs">{row.especialidad?.nombre}</td>
                <td className="px-4 py-4 text-slate-500 text-xs">{row.subespecialidad?.nombre}</td>
                <td className="px-4 py-4 text-slate-500 text-xs">{row.tipo?.nombre || '–'}</td>
                <td className="px-4 py-4 text-center text-slate-500 text-xs font-medium">{row.kit?.codigoKit || '–'}</td>
                <td className="px-4 py-4 text-slate-400 text-xs whitespace-nowrap">{row.proximoMantenimiento ? new Date(row.proximoMantenimiento).toLocaleDateString() : '–'}</td>
                <td className="px-4 py-4 text-slate-400 text-xs whitespace-nowrap">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '–'}</td>
                <td className="px-4 py-4">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap ${statusColor(row.estado)}`}>{row.estado}</span>
                </td>
                
                {/* ── MENÚ DE ACCIONES ── */}
                <td className="px-2 py-4 text-right relative" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setOpenActionMenu(openActionMenu === idx ? null : idx)} className={`p-1 rounded-full transition-colors ${openActionMenu === idx ? 'bg-blue-50 text-blue-500' : 'text-slate-300 hover:text-blue-500 hover:bg-slate-50'}`}>
                    <MoreVertical size={18} />
                  </button>
                  {openActionMenu === idx && (
                    <div className="absolute right-8 w-44 bg-white rounded-lg shadow-xl border border-slate-100 py-1" style={{ zIndex: 9999, top: idx > data.length - 3 ? 'auto' : 8, bottom: idx > data.length - 3 ? '100%' : 'auto' }}>
                      
                      {/* 1. Editar */}
                      {['Habilitado', 'Pendiente de registro', 'P. registrar', 'En mantenimiento'].includes(row.estado) && (
                        <button onClick={() => handleOpenEdit(row)} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors text-left font-medium">
                          <Edit size={14} /> Editar
                        </button>
                      )}
                      
                      {/* 2. Deshabilitar / Habilitar */}
                      {(row.estado === 'Habilitado' || row.estado === 'Deshabilitado') && (
                        <button 
                          onClick={() => changeStatus(row, row.estado === 'Habilitado' ? 'Deshabilitado' : 'Habilitado')} 
                          className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors text-left font-medium ${row.estado === 'Habilitado' ? 'hover:text-red-500' : 'hover:text-emerald-500'}`}
                        >
                          {row.estado === 'Habilitado' ? <Ban size={14} /> : <CheckCircle size={14} />}
                          {row.estado === 'Habilitado' ? 'Deshabilitar' : 'Habilitar'}
                        </button>
                      )}

                      {/* 3. Ver detalle */}
                      <button onClick={() => handleOpenDetail(row)} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors text-left font-medium">
                        <FileText size={14} /> Ver detalle
                      </button>

                      {/* 4. Registrar Contable */}
                      {(row.estado === 'Pendiente de registro' || row.estado === 'P. registrar') && permisos.puedeRegistrarContable && (
                        <button onClick={() => openRC(row)} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors text-left font-medium">
                          <Database size={14} /> Registrar
                        </button>
                      )}

                    </div>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};