import React, { useState, useEffect, useRef } from 'react';
import {
  Search, PlusCircle, ChevronDown, MoreVertical, Edit, Ban, CheckCircle, X, FileText,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';

const TipoSubespecialidadScreen: React.FC = () => {
  const [isModalOpen, setIsModalOpen]             = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen]             = useState(false);
  const [isSuccessOpen, setIsSuccessOpen]         = useState(false);
  const [errorMsg, setErrorMsg]                   = useState('');
  const [successMsg, setSuccessMsg]               = useState('');
  const [openMenuIndex, setOpenMenuIndex]         = useState<number | null>(null);
  const menuRef                                   = useRef<HTMLDivElement>(null);
  const [modalMode, setModalMode]                 = useState<'create' | 'edit' | 'view'>('create');
  const [selectedItem, setSelectedItem]           = useState<any>(null);
  const [loading, setLoading]                     = useState(false);
  const [data, setData]                           = useState<any[]>([]);
  const [especialidades, setEspecialidades]       = useState<any[]>([]);
  const [subFiltradas, setSubFiltradas]           = useState<any[]>([]);
  const [currentPage, setCurrentPage]             = useState(1);
  const [totalPages, setTotalPages]               = useState(1);
  const [totalRecords, setTotalRecords]           = useState(0);
  const [searchTerm, setSearchTerm]               = useState('');
  const [statusFilter, setStatusFilter]           = useState('');
  // código generado automáticamente por el backend (alfanumérico)
  const initialFormState = { id: null, nombre: '', especialidadId: '', subespecialidadId: '' };
  const [formData, setFormData]                   = useState<any>(initialFormState);

  useEffect(() => {
    fetchListas();
    fetchTipos();
  }, [currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setOpenMenuIndex(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchListas = async () => {
    try {
      const res  = await fetch('http://localhost:4000/api/tipos-subespecialidad/listas');
      const json = await res.json();
      setEspecialidades(json.especialidades || []);
    } catch (error) { console.error(error); }
  };

  const fetchTipos = async () => {
    setLoading(true);
    try {
      const res  = await fetch(
        `http://localhost:4000/api/tipos-subespecialidad?page=${currentPage}&search=${searchTerm}&estado=${statusFilter}`
      );
      const json = await res.json();
      if (json && json.data) {
        setData(json.data.map((item: any) => ({
          ...item,
          especialidadId: item.subespecialidad?.especialidadId,
          espNombre: item.subespecialidad?.especialidad?.nombre || 'N/A',
          subNombre: item.subespecialidad?.nombre || 'N/A',
          status: item.estado ? 'Habilitado' : 'Deshabilitado'
        })));
        setTotalPages(json.totalPages || 1);
        setTotalRecords(json.total || 0);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleEspecialidadChange = (val: string) => {
    setFormData((p: any) => ({ ...p, especialidadId: val, subespecialidadId: '' }));
    const selectedEsp = especialidades.find(esp => esp.id === Number(val));
    setSubFiltradas(selectedEsp ? selectedEsp.subespecialidades : []);
  };

  const handleOpenCreate = () => {
    const haySubs = especialidades.some(esp => esp.subespecialidades?.length > 0);
    if (!haySubs) {
      setErrorMsg('No es posible crear un tipo de subespecialidad porque no existen subespecialidades registradas.');
      setIsErrorOpen(true);
      return;
    }
    setSubFiltradas([]);
    setFormData(initialFormState);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row: any) => {
    const selectedEsp = especialidades.find(esp => esp.id === Number(row.especialidadId));
    setSubFiltradas(selectedEsp ? selectedEsp.subespecialidades : []);
    setFormData(row);
    setModalMode('edit');
    setIsModalOpen(true);
    setOpenMenuIndex(null);
  };

  // ← En modo 'view' cierra directo; en create/edit pide confirmación
  const handleCancelClick = () => {
    if (modalMode === 'view') setIsModalOpen(false);
    else setIsCancelAlertOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nombre.trim() || !formData.subespecialidadId) {
      setErrorMsg('Es necesario el diligenciamiento de todos los campos obligatorios.');
      setIsErrorOpen(true);
      return;
    }
    const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    if (!regexLetras.test(formData.nombre.trim())) {
      setErrorMsg('El nombre solo debe contener letras.');
      setIsErrorOpen(true);
      return;
    }
    try {
      const method = modalMode === 'create' ? 'POST' : 'PUT';
      const url    = modalMode === 'create'
        ? 'http://localhost:4000/api/tipos-subespecialidad'
        : `http://localhost:4000/api/tipos-subespecialidad/${formData.id}`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        // código NO se envía — el backend lo genera automáticamente (alfanumérico)
        body: JSON.stringify({ nombre: formData.nombre, subespecialidadId: formData.subespecialidadId })
      });
      if (!res.ok) throw new Error((await res.json()).msg);
      setSuccessMsg(
        modalMode === 'create'
          ? 'Tipo de subespecialidad creado correctamente'
          : 'Tipo de subespecialidad actualizado correctamente'
      );
      setIsSuccessOpen(true);
      setIsModalOpen(false);
      fetchTipos();
    } catch (error: any) {
      setErrorMsg(error.message);
      setIsErrorOpen(true);
    }
  };

  const confirmToggleStatus = async () => {
    if (!selectedItem) return;
    const nuevoEstado = selectedItem.status === 'Deshabilitado';
    try {
      const res = await fetch(`http://localhost:4000/api/tipos-subespecialidad/${selectedItem.id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      if (!res.ok) throw new Error('Error al cambiar estado');
      setSuccessMsg(
        nuevoEstado
          ? 'Tipo de subespecialidad habilitado correctamente'
          : 'Tipo de subespecialidad deshabilitado correctamente'
      );
      setIsSuccessOpen(true);
      setIsStatusModalOpen(false);
      fetchTipos();
    } catch {
      setErrorMsg('No se pudo cambiar el estado.');
      setIsErrorOpen(true);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .ts-save-btn {
          padding: 11px 48px; border-radius: 30px; border: none; cursor: pointer;
          background: linear-gradient(90deg, #60a5fa 0%, #34d399 100%);
          color: #fff; font-weight: 700; font-size: 14px;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 4px 14px rgba(96,165,250,0.4);
          transition: opacity 0.2s, transform 0.15s;
        }
        .ts-save-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        .ts-cancel-btn {
          background: none; border: none; cursor: pointer;
          font-size: 14px; font-weight: 600; color: #64748b;
          font-family: 'Inter', sans-serif; transition: color 0.2s; padding: 0;
        }
        .ts-cancel-btn:hover { color: #ef4444; }

        .ts-search-icon {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%); pointer-events: none; color: #60a5fa;
        }
      `}</style>

      <div className="space-y-6 h-full flex flex-col font-sans" onClick={() => setOpenMenuIndex(null)}>
        <h1 className="text-3xl font-bold text-blue-500">Tipo de Subespecialidad</h1>

        {/* ══ BARRA ══ */}
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
          <div className="flex gap-3 flex-1 w-full md:w-auto items-center">

            {/* Filtro Estado — notch compacto */}
            <div style={{ width: 170, flexShrink: 0 }}>
              <TSNotchSelect
                id="statusFilter" label="Estado"
                value={statusFilter}
                onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
                options={[
                  { value: 'true',  label: 'Habilitado'    },
                  { value: 'false', label: 'Deshabilitado' },
                ]}
                compact
              />
            </div>

            {/* Búsqueda */}
            <div style={{ position: 'relative', flex: 1, maxWidth: 560 }}>
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                style={{
                  width: '100%', height: 42, borderRadius: 30,
                  border: '1.5px solid #e2e8f0', background: '#f8fafc',
                  padding: '0 40px 0 18px', fontSize: 13, color: '#475569',
                  outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s',
                } as React.CSSProperties}
                onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                onBlur={e  => (e.target.style.borderColor = '#e2e8f0')}
              />
              <Search className="ts-search-icon" size={17} />
            </div>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 text-blue-500 font-bold text-sm hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            Crear tipo de subespecialidad <PlusCircle size={18} />
          </button>
        </div>

        {/* ══ TABLA ══ */}
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-visible flex-1 flex flex-col">
          <div className="overflow-visible flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Código</th>
                  <th className="px-6 py-4">Especialidad</th>
                  <th className="px-6 py-4">Subespecialidad</th>
                  <th className="px-6 py-4">Tipo de Subespecialidad</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-4 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-10 text-slate-400">Cargando...</td></tr>
                ) : (data || []).map((row, i) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-medium">{row.codigo}</td>
                    <td className="px-6 py-4 text-slate-500">{row.espNombre}</td>
                    <td className="px-6 py-4 text-slate-500">{row.subNombre}</td>
                    <td className="px-6 py-4 text-slate-500">{row.nombre}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-4 py-1 rounded-full text-xs font-bold border ${
                        row.status === 'Habilitado'
                          ? 'bg-emerald-50 text-emerald-500 border-emerald-100'
                          : 'bg-red-50 text-red-500 border-red-100'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenMenuIndex(openMenuIndex === i ? null : i); }}
                        className="text-slate-300 hover:text-blue-500 p-2"
                      >
                        <MoreVertical size={20}/>
                      </button>
                      {openMenuIndex === i && (
                        <div ref={menuRef} className="absolute right-8 top-8 w-48 bg-white rounded-lg shadow-xl border z-50 overflow-hidden">
                          <button
                            onClick={() => handleOpenEdit(row)}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-xs hover:bg-slate-50 text-slate-600 font-bold text-left"
                          >
                            <Edit size={14}/> Editar
                          </button>
                          <button
                            onClick={() => { setFormData(row); setModalMode('view'); setIsModalOpen(true); setOpenMenuIndex(null); }}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-xs hover:bg-slate-50 text-slate-600 font-bold text-left"
                          >
                            <FileText size={14}/> Ver detalle
                          </button>
                          <button
                            onClick={() => { setSelectedItem(row); setIsStatusModalOpen(true); setOpenMenuIndex(null); }}
                            className={`flex items-center gap-2 w-full px-4 py-2.5 text-xs hover:bg-slate-50 font-bold text-left ${
                              row.status === 'Habilitado' ? 'text-red-500' : 'text-emerald-500'
                            }`}
                          >
                            {row.status === 'Habilitado' ? <Ban size={14}/> : <CheckCircle size={14}/>}
                            {row.status === 'Habilitado' ? 'Deshabilitar' : 'Habilitar'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="p-4 flex justify-between items-center text-xs text-slate-400 border-t border-slate-50 font-medium">
            <span>Mostrando {data.length} de {totalRecords} registros</span>
            <div className="flex items-center gap-3 text-blue-500">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="hover:text-blue-700 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronsLeft size={16}/></button>
              <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="hover:text-blue-700 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronLeft size={16}/></button>
              <span className="bg-blue-50 px-3 py-1 rounded text-blue-600 font-bold">Pág. {currentPage} de {totalPages || 1}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages || totalPages === 0} className="hover:text-blue-700 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronRight size={16}/></button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0} className="hover:text-blue-700 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronsRight size={16}/></button>
            </div>
          </div>
        </div>

        {/* ══ MODAL CREAR / EDITAR / VER ══ */}
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)' }}
              onClick={handleCancelClick}
            />
            <div style={{
              position: 'relative', background: '#fff', width: '100%', maxWidth: 560,
              borderRadius: 20, padding: '32px 40px 28px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              display: 'flex', flexDirection: 'column', gap: 18,
              fontFamily: "'Inter', sans-serif",
            }}>
              <button
                onClick={handleCancelClick}
                style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: 4 }}
              >
                <X size={20} />
              </button>

              <h2 style={{ textAlign: 'center', fontSize: 21, fontWeight: 700, color: '#3b82f6', margin: '0 0 4px' }}>
                {modalMode === 'create' && 'Crear tipo de subespecialidad'}
                {modalMode === 'edit'   && 'Editar tipo de subespecialidad'}
                {modalMode === 'view'   && 'Detalle de tipo de subespecialidad'}
              </h2>

              {/* 1️⃣ Especialidad */}
              <TSNotchSelect
                id="especialidadId" label="Especialidad" required
                value={String(formData.especialidadId || '')}
                disabled={modalMode === 'view'}
                onChange={handleEspecialidadChange}
                options={especialidades.map(e => ({ value: e.id, label: e.nombre }))}
              />

              {/* 2️⃣ Subespecialidad — depende de Especialidad seleccionada */}
              <TSNotchSelect
                id="subespecialidadId" label="Subespecialidad" required
                value={String(formData.subespecialidadId || '')}
                disabled={!formData.especialidadId || modalMode === 'view'}
                onChange={(v) => setFormData((p: any) => ({ ...p, subespecialidadId: v }))}
                options={subFiltradas.map(s => ({ value: s.id, label: s.nombre }))}
              />

              {/* 3️⃣ Nombre Tipo */}
              <TSNotchInput
                id="nombre" label="Tipo de Subespecialidad" required
                value={formData.nombre}
                disabled={modalMode === 'view'}
                onChange={(v) => setFormData((p: any) => ({ ...p, nombre: v }))}
              />

              {/* Botones */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 44, marginTop: 8 }}>
                <button className="ts-cancel-btn" onClick={handleCancelClick}>
                  {modalMode === 'view' ? 'Cerrar' : 'Cancelar'}
                </button>
                {modalMode !== 'view' && (
                  <button className="ts-save-btn" onClick={handleSave}>Guardar</button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ ALERTA CANCELAR ══ */}
        {isCancelAlertOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative bg-white w-full max-w-[380px] rounded-[30px] p-8 text-center shadow-2xl font-sans">
              <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-3xl">!</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">¿Está seguro?</h3>
              <p className="text-slate-500 text-sm mb-8">La información diligenciada no se guardará en el sistema.</p>
              <div className="flex gap-3">
                <button onClick={() => setIsCancelAlertOpen(false)} className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-600 font-bold text-sm">Cancelar</button>
                <button onClick={() => { setIsCancelAlertOpen(false); setIsModalOpen(false); }} className="flex-1 py-2.5 rounded-full bg-blue-500 text-white font-bold text-sm">Aceptar</button>
              </div>
            </div>
          </div>
        )}

        {/* ══ ALERTA ÉXITO ══ */}
        {isSuccessOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsSuccessOpen(false)} />
            <div className="relative bg-white w-full max-w-[380px] rounded-[30px] p-8 text-center shadow-2xl font-sans">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={32}/></div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Éxito</h3>
              <p className="text-slate-500 text-sm mb-8">{successMsg}</p>
              <button onClick={() => setIsSuccessOpen(false)} className="w-full py-2.5 rounded-full bg-emerald-500 text-white font-bold text-sm">Aceptar</button>
            </div>
          </div>
        )}

        {/* ══ ALERTA ERROR ══ */}
        {isErrorOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center font-sans">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsErrorOpen(false)} />
            <div className="relative bg-white w-full max-w-[400px] rounded-[30px] p-8 text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><X size={32}/></div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Error / Aviso</h3>
              <p className="text-slate-500 text-sm mb-8">{errorMsg}</p>
              <button onClick={() => setIsErrorOpen(false)} className="w-full py-2.5 rounded-full bg-red-500 text-white font-bold text-sm">Aceptar</button>
            </div>
          </div>
        )}

        {/* ══ MODAL ESTADO ══ */}
        {isStatusModalOpen && selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 font-sans">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsStatusModalOpen(false)} />
            <div className="relative bg-white w-full max-w-[400px] rounded-[30px] p-8 shadow-2xl flex flex-col items-center text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm ${
                selectedItem.status === 'Habilitado' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'
              }`}>
                {selectedItem.status === 'Habilitado'
                  ? <Ban size={40} strokeWidth={1.5} />
                  : <CheckCircle size={40} strokeWidth={1.5} />
                }
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
                {selectedItem.status === 'Habilitado' ? 'Deshabilitar' : 'Habilitar'}
              </h2>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed px-4 font-medium">
                ¿Estás seguro de que deseas {selectedItem.status === 'Habilitado' ? 'deshabilitar' : 'habilitar'} a{' '}
                <span className="font-bold text-slate-700">{selectedItem.nombre}</span>?
              </p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setIsStatusModalOpen(false)} className="flex-1 py-3 rounded-full border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-sm">Cancelar</button>
                <button
                  onClick={confirmToggleStatus}
                  className={`flex-1 py-3 rounded-full text-white font-bold shadow-lg text-sm bg-gradient-to-r ${
                    selectedItem.status === 'Habilitado' ? 'from-red-500 to-rose-400' : 'from-blue-500 to-emerald-400'
                  }`}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

/* ══════════════════════════════════════════════
   TSNotchInput — label flotante (sube/baja)
   ══════════════════════════════════════════════ */
interface TSNotchInputProps {
  id: string; label: string; value: string;
  disabled?: boolean; required?: boolean;
  onChange: (value: string) => void;
}
const TSNotchInput: React.FC<TSNotchInputProps> = ({
  id, label, value, disabled = false, required = false, onChange
}) => {
  const [focused, setFocused] = useState(false);
  const active  = focused || value.length > 0;
  const bgColor = disabled ? '#f8fafc' : '#fff';
  return (
    <div style={{ position: 'relative' }}>
      <input
        id={id} type="text" value={value} disabled={disabled} placeholder=""
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', height: 48, borderRadius: 30,
          border: `1.5px solid ${focused ? '#3b82f6' : '#d1d5db'}`,
          background: bgColor,
          padding: active ? '14px 16px 0 16px' : '0 16px',
          fontSize: 13.5, color: disabled ? '#94a3b8' : '#334155',
          outline: 'none', boxSizing: 'border-box',
          transition: 'border-color 0.2s, padding 0.18s',
          fontFamily: 'Inter, sans-serif',
          cursor: disabled ? 'not-allowed' : 'text',
        } as React.CSSProperties}
      />
      <label htmlFor={id} style={{
        position: 'absolute', left: 18,
        top: active ? 0 : '50%',
        transform: 'translateY(-50%)',
        fontSize: active ? 10.5 : 13,
        color: focused ? '#3b82f6' : (active ? '#6b7280' : '#9ca3af'),
        pointerEvents: 'none', transition: 'all 0.18s ease',
        background: bgColor, padding: '0 4px',
        fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
      }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: 1 }}>*</span>}
      </label>
    </div>
  );
};

/* ══════════════════════════════════════════════
   TSNotchSelect — label SIEMPRE en borde superior
   ══════════════════════════════════════════════ */
interface TSNotchSelectProps {
  id: string; label: string; value: string;
  disabled?: boolean; required?: boolean; compact?: boolean;
  onChange: (value: string) => void;
  options: { value: string | number; label: string }[];
}
const TSNotchSelect: React.FC<TSNotchSelectProps> = ({
  id, label, value, disabled = false, required = false,
  compact = false, onChange, options
}) => {
  const [focused, setFocused] = useState(false);
  const bgColor = disabled ? '#f8fafc' : (compact ? (focused ? '#fff' : '#f8fafc') : '#fff');
  return (
    <div style={{ position: 'relative' }}>
      <select
        id={id} value={value} disabled={disabled}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          height: compact ? 42 : 48,
          borderRadius: 30,
          border: `1.5px solid ${focused ? '#3b82f6' : '#d1d5db'}`,
          background: bgColor,
          padding: compact ? '10px 36px 0 16px' : '14px 36px 0 16px',
          fontSize: compact ? 13 : 13.5,
          color: value === '' ? '#9ca3af' : (disabled ? '#94a3b8' : '#334155'),
          outline: 'none', appearance: 'none' as const,
          boxSizing: 'border-box' as const,
          transition: 'border-color 0.2s',
          fontFamily: 'Inter, sans-serif',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <option value="" style={{ color: '#9ca3af' }}>Seleccionar...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <label htmlFor={id} style={{
        position: 'absolute', left: 18, top: 0,
        transform: 'translateY(-50%)', fontSize: 10.5,
        color: focused ? '#3b82f6' : '#6b7280',
        pointerEvents: 'none', background: bgColor,
        padding: '0 4px', fontFamily: 'Inter, sans-serif',
        whiteSpace: 'nowrap', transition: 'color 0.18s',
      }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: 1 }}>*</span>}
      </label>
      <ChevronDown size={15} style={{
        position: 'absolute', right: 14, top: '50%',
        transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af',
      }} />
    </div>
  );
};

export default TipoSubespecialidadScreen;