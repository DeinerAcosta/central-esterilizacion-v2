import React, { useState, useEffect, useRef } from 'react';
import {
  Search, PlusCircle, ChevronDown, MoreVertical, Edit, Ban, CheckCircle, X, FileText,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import Swal from 'sweetalert2';

const TipoSubespecialidadScreen: React.FC = () => {
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [openMenuIndex, setOpenMenuIndex]   = useState<number | null>(null);
  const menuRef                             = useRef<HTMLDivElement>(null);
  const [modalMode, setModalMode]           = useState<'create' | 'edit' | 'view'>('create');
  const [loading, setLoading]               = useState(false);
  const [data, setData]                     = useState<any[]>([]);
  const [especialidades, setEspecialidades] = useState<any[]>([]);
  const [subFiltradas, setSubFiltradas]     = useState<any[]>([]);
  const [currentPage, setCurrentPage]       = useState(1);
  const [totalPages, setTotalPages]         = useState(1);
  const [totalRecords, setTotalRecords]     = useState(0);
  const [searchTerm, setSearchTerm]         = useState('');
  const [statusFilter, setStatusFilter]     = useState('');
  const initialFormState                    = { id: null, nombre: '', especialidadId: '', subespecialidadId: '' };
  const [formData, setFormData]             = useState<any>(initialFormState);

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
      Swal.fire({
        icon: 'warning',
        title: 'Sin subespecialidades',
        text: 'No es posible crear un tipo de subespecialidad porque no existen subespecialidades registradas.',
        confirmButtonColor: '#3b82f6',
      });
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

  /* ── Cierre con confirmación (X, backdrop y botón Cancelar en create/edit) ── */
  const handleCloseModal = () => {
    if (modalMode === 'view') { setIsModalOpen(false); return; }
    Swal.fire({
      title: '¿Está seguro?',
      text: modalMode === 'create'
        ? 'La información diligenciada no se guardará en el sistema.'
        : 'Los cambios realizados no se guardarán en el sistema.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then(result => { if (result.isConfirmed) setIsModalOpen(false); });
  };

  const handleSave = async () => {
    if (!formData.nombre.trim() || !formData.subespecialidadId) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Es necesario el diligenciamiento de todos los campos obligatorios.',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }
    const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    if (!regexLetras.test(formData.nombre.trim())) {
      Swal.fire({
        icon: 'warning',
        title: 'Formato inválido',
        text: 'El nombre solo debe contener letras.',
        confirmButtonColor: '#3b82f6',
      });
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
        body: JSON.stringify({ nombre: formData.nombre, subespecialidadId: formData.subespecialidadId })
      });
      if (!res.ok) throw new Error((await res.json()).msg);
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: modalMode === 'create'
          ? 'Tipo de subespecialidad creado correctamente.'
          : 'Tipo de subespecialidad actualizado correctamente.',
        confirmButtonColor: '#10b981',
        timer: 2000,
        showConfirmButton: false,
      });
      setIsModalOpen(false);
      fetchTipos();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Ocurrió un error al guardar.',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  const handleToggleStatus = (item: any) => {
    setOpenMenuIndex(null);
    const accion = item.status === 'Habilitado' ? 'deshabilitará' : 'habilitará';
    Swal.fire({
      title: '¿Está seguro?',
      html: `Se <b>${accion}</b> el tipo de subespecialidad:<br/><span style="color:#475569;font-weight:600">${item.nombre}</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const nuevoEstado = item.status === 'Deshabilitado';
          const res = await fetch(`http://localhost:4000/api/tipos-subespecialidad/${item.id}/estado`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
          });
          if (!res.ok) throw new Error('Error al cambiar estado');
          Swal.fire({
            icon: 'success',
            title: 'Estado actualizado',
            text: `El tipo de subespecialidad ha sido ${nuevoEstado ? 'habilitado' : 'deshabilitado'}.`,
            timer: 1500,
            showConfirmButton: false,
          });
          fetchTipos();
        } catch {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cambiar el estado del tipo de subespecialidad.',
            confirmButtonColor: '#ef4444',
          });
        }
      }
    });
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
                            onClick={() => handleToggleStatus(row)}
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

          <div className="p-4 flex justify-between items-center text-xs text-slate-400 border-t border-slate-50 font-medium">
            <span>Mostrando {data.length} de {totalRecords} registros</span>
            <div className="flex items-center gap-3 text-blue-500">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="hover:text-blue-700 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronsLeft size={16}/></button>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="hover:text-blue-700 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronLeft size={16}/></button>
              <span className="bg-blue-50 px-3 py-1 rounded text-blue-600 font-bold">Pág. {currentPage} de {totalPages || 1}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="hover:text-blue-700 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronRight size={16}/></button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0} className="hover:text-blue-700 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronsRight size={16}/></button>
            </div>
          </div>
        </div>

        {/* ══ MODAL CREAR / EDITAR / VER ══ */}
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            {/* Backdrop — confirma antes de cerrar si es create/edit */}
            <div
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)' }}
              onClick={handleCloseModal}
            />
            <div style={{
              position: 'relative', background: '#fff', width: '100%', maxWidth: 560,
              borderRadius: 20, padding: '32px 40px 28px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              display: 'flex', flexDirection: 'column', gap: 18,
              fontFamily: "'Inter', sans-serif",
            }}>
              {/* X — confirma antes de cerrar si es create/edit */}
              <button
                onClick={handleCloseModal}
                style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: 4 }}
              >
                <X size={20} />
              </button>

              <h2 style={{ textAlign: 'center', fontSize: 21, fontWeight: 700, color: '#3b82f6', margin: '0 0 4px' }}>
                {modalMode === 'create' && 'Crear tipo de subespecialidad'}
                {modalMode === 'edit'   && 'Editar tipo de subespecialidad'}
                {modalMode === 'view'   && 'Detalle de tipo de subespecialidad'}
              </h2>

              <TSNotchSelect
                id="especialidadId" label="Especialidad" required
                value={String(formData.especialidadId || '')}
                disabled={modalMode === 'view'}
                onChange={handleEspecialidadChange}
                options={especialidades.map(e => ({ value: e.id, label: e.nombre }))}
              />

              <TSNotchSelect
                id="subespecialidadId" label="Subespecialidad" required
                value={String(formData.subespecialidadId || '')}
                disabled={!formData.especialidadId || modalMode === 'view'}
                onChange={(v) => setFormData((p: any) => ({ ...p, subespecialidadId: v }))}
                options={subFiltradas.map(s => ({ value: s.id, label: s.nombre }))}
              />

              <TSNotchInput
                id="nombre" label="Tipo de Subespecialidad" required
                value={formData.nombre}
                disabled={modalMode === 'view'}
                onChange={(v) => setFormData((p: any) => ({ ...p, nombre: v }))}
              />

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 44, marginTop: 8 }}>
                <button className="ts-cancel-btn" onClick={handleCloseModal}>
                  {modalMode === 'view' ? 'Cerrar' : 'Cancelar'}
                </button>
                {modalMode !== 'view' && (
                  <button className="ts-save-btn" onClick={handleSave}>Guardar</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

/* ══════════════════════════════════════════════
   TSNotchInput
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
   TSNotchSelect
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