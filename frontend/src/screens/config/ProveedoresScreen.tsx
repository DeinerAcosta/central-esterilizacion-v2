import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, PlusCircle, ChevronDown, MoreVertical, Edit, Ban, CheckCircle, X, FileText,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight 
} from 'lucide-react';
import Swal from 'sweetalert2';

const ProveedoresScreen: React.FC = () => {
  const [isModalOpen, setIsModalOpen]             = useState(false); 
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false); 
  const [openMenuIndex, setOpenMenuIndex]         = useState<number | null>(null); 
  const menuRef                                   = useRef<HTMLDivElement>(null); 
  const [modalMode, setModalMode]                 = useState<'create' | 'edit' | 'view'>('create');
  const [selectedProvider, setSelectedProvider]   = useState<any>(null);
  const [loading, setLoading]                     = useState(false);
  const [proveedores, setProveedores]             = useState<any[]>([]);
  
  // Estados para la API de Países y Ciudades
  const [apiData, setApiData]                     = useState<any[]>([]); 
  const [ciudadesOptions, setCiudadesOptions]     = useState<string[]>([]);
  
  const [currentPage, setCurrentPage]             = useState(1);
  const [totalPages, setTotalPages]               = useState(1);
  const [totalRecords, setTotalRecords]           = useState(0);
  const [searchTerm, setSearchTerm]               = useState('');
  const [statusFilter, setStatusFilter]           = useState('');
  
  const initialFormState = { id: null, codigo: '', nombre: '', nit: '', tipo: '', pais: '', ciudad: '' };
  const [formData, setFormData]                   = useState<any>(initialFormState);

  // 1. Cargar la API pública de ubicaciones al montar el componente
  useEffect(() => {
    const fetchApiUbicaciones = async () => {
      try {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries');
        const json = await res.json();
        if(json && json.data) {
          const sorted = json.data.sort((a: any, b: any) => a.country.localeCompare(b.country));
          setApiData(sorted);
        }
      } catch (error) {
        console.error("Error cargando API de países:", error);
      }
    };
    fetchApiUbicaciones();
  }, []);

  useEffect(() => { fetchProveedores(); }, [currentPage, searchTerm, statusFilter]);

  // Actualizar las ciudades disponibles cuando cambia el país
  useEffect(() => {
    if (formData.pais && apiData.length > 0) {
      const selected = apiData.find((p: any) => p.country === formData.pais);
      setCiudadesOptions(selected ? selected.cities.sort() : []);
    } else {
      setCiudadesOptions([]);
    }
  }, [formData.pais, apiData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpenMenuIndex(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchProveedores = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`http://localhost:4000/api/proveedores?page=${currentPage}&search=${searchTerm}&estado=${statusFilter}`);
      const json = await res.json();
      const formateados = json.data.map((item: any) => ({
        id: item.id, codigo: item.codigo, tipo: item.tipo, nombre: item.nombre, nit: item.nit,
        pais: item.pais || '', ciudad: item.ciudad || '', 
        status: item.estado ? 'Habilitado' : 'Deshabilitado'
      }));
      setProveedores(formateados);
      setTotalPages(json.totalPages);
      setTotalRecords(json.total);
    } catch (error) { console.error('Error al obtener proveedores:', error); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!formData.tipo.trim() || !formData.nombre.trim() || !formData.nit.trim() || !formData.pais || !formData.ciudad) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Es necesario el diligenciamiento de todos los campos obligatorios.', confirmButtonColor: '#3b82f6' });
      return;
    }
    const regexAlfanumerico = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ.\-]+$/;
    if (!regexAlfanumerico.test(formData.nombre)) {
      Swal.fire({ icon: 'warning', title: 'Formato inválido', text: 'El nombre solo debe contener caracteres alfanuméricos.', confirmButtonColor: '#3b82f6' });
      return;
    }
    const regexNumeros = /^\d+$/;
    if (!regexNumeros.test(formData.nit)) {
      Swal.fire({ icon: 'warning', title: 'Formato inválido', text: 'El NIT solo debe contener números.', confirmButtonColor: '#3b82f6' });
      return;
    }
    try {
      const payload = { 
        codigo: formData.codigo, tipo: formData.tipo, nombre: formData.nombre, 
        nit: formData.nit, pais: formData.pais, ciudad: formData.ciudad 
      };
      let res: any;
      if (modalMode === 'create') {
        res = await fetch('http://localhost:4000/api/proveedores', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
      } else if (modalMode === 'edit') {
        res = await fetch(`http://localhost:4000/api/proveedores/${formData.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
      }
      if (!res?.ok) { const err = await res?.json(); throw new Error(err.msg); }
      Swal.fire({
        icon: 'success', title: '¡Éxito!',
        text: `Proveedor ${modalMode === 'create' ? 'creado' : 'actualizado'} exitosamente.`,
        confirmButtonColor: '#10b981', timer: 2000, showConfirmButton: false
      });
      setIsModalOpen(false);
      fetchProveedores();
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Ocurrió un error al guardar.', confirmButtonColor: '#ef4444' });
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: '¿Está seguro?', text: 'La información diligenciada no se guardará en el sistema.',
      icon: 'warning', showCancelButton: true, confirmButtonColor: '#3b82f6', cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) setIsModalOpen(false);
    });
  };

  const confirmToggleStatus = async () => {
    if (selectedProvider) {
      try {
        const nuevoEstado = selectedProvider.status !== 'Habilitado';
        await fetch(`http://localhost:4000/api/proveedores/${selectedProvider.id}/estado`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: nuevoEstado })
        });
        Swal.fire({ icon: 'success', title: 'Estado actualizado', text: `El proveedor ha sido ${!nuevoEstado ? 'deshabilitado' : 'habilitado'}.`, timer: 1500, showConfirmButton: false });
        fetchProveedores();
      } catch (error) { console.error('Error al cambiar estado:', error); }
    }
    setIsStatusModalOpen(false);
    setSelectedProvider(null);
  };

  const toggleMenu = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); setOpenMenuIndex(openMenuIndex === index ? null : index);
  };
  const handleOpenCreate = () => {
    setFormData(initialFormState); setModalMode('create'); setIsModalOpen(true); setOpenMenuIndex(null);
  };
  const handleOpenEdit = (item: any) => {
    setFormData({ ...item }); setModalMode('edit'); setIsModalOpen(true); setOpenMenuIndex(null);
  };
  const handleView = (item: any) => {
    setFormData({ ...item }); setModalMode('view'); setIsModalOpen(true); setOpenMenuIndex(null);
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToPrevPage  = () => setCurrentPage(p => Math.max(1, p - 1));
  const goToNextPage  = () => setCurrentPage(p => Math.min(totalPages, p + 1));
  const goToLastPage  = () => setCurrentPage(totalPages);

  const isView = modalMode === 'view';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .p-search-icon { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #60a5fa; }
        .p-save-btn { padding: 11px 48px; border-radius: 30px; border: none; cursor: pointer; background: linear-gradient(90deg, #60a5fa 0%, #34d399 100%); color: #fff; font-weight: 700; font-size: 14px; font-family: 'Inter', sans-serif; box-shadow: 0 4px 14px rgba(96,165,250,0.4); transition: opacity 0.2s, transform 0.15s; }
        .p-save-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .p-cancel-btn { background: none; border: none; cursor: pointer; font-size: 14px; font-weight: 600; color: #64748b; font-family: 'Inter', sans-serif; transition: color 0.2s; padding: 0; }
        .p-cancel-btn:hover { color: #ef4444; }

        /* SCROLLBAR PERSONALIZADO PARA LOS SELECTS */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      <div className="space-y-6 h-full flex flex-col font-sans relative" onClick={() => setOpenMenuIndex(null)}>
        <h1 className="text-3xl font-bold text-blue-500">Proveedores</h1>

        {/* ══ BARRA BÚSQUEDA ══ */}
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
          <div className="flex gap-3 flex-1 w-full md:w-auto items-center">
            <div style={{ width: 170, flexShrink: 0 }}>
              <ProvNotchSelect id="statusFilter" label="Estado" value={statusFilter} onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }} options={[{ value: 'true',  label: 'Habilitar' }, { value: 'false', label: 'Deshabilitado' }]} compact />
            </div>
            <div style={{ position: 'relative', flex: 1, maxWidth: 560 }}>
              <input type="text" placeholder="Buscar por nombre o NIT..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} style={{ width: '100%', height: 42, borderRadius: 30, border: '1.5px solid #e2e8f0', background: '#f8fafc', padding: '0 40px 0 18px', fontSize: 13, color: '#475569', outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s' } as React.CSSProperties} onFocus={e => (e.target.style.borderColor = '#3b82f6')} onBlur={e  => (e.target.style.borderColor = '#e2e8f0')} />
              <Search className="p-search-icon" size={17} />
            </div>
          </div>
          <button onClick={handleOpenCreate} className="flex items-center gap-2 text-blue-500 font-bold text-sm hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap">
            Crear proveedor <PlusCircle size={18} />
          </button>
        </div>

        {/* ══ TABLA ══ */}
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden flex-1 flex flex-col">
          <div className="overflow-visible flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Código</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Nombre proveedor</th>
                  <th className="px-6 py-4">NIT</th>
                  <th className="px-6 py-4">Ubicación</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-4 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? ( <tr><td colSpan={7} className="text-center py-8 text-slate-400">Cargando proveedores...</td></tr> ) 
                : proveedores.length === 0 ? ( <tr><td colSpan={7} className="text-center py-8 text-slate-400">No se encontraron registros.</td></tr> ) 
                : proveedores.map((row, i) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-medium">{row.codigo}</td>
                    <td className="px-6 py-4 text-slate-500">{row.tipo}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{row.nombre}</td>
                    <td className="px-6 py-4 text-slate-500">{row.nit}</td>
                    <td className="px-6 py-4 text-slate-500">{row.ciudad}, {row.pais}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${row.status === 'Habilitado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right relative">
                      <button onClick={(e) => toggleMenu(i, e)} className={`p-2 rounded-full transition-colors ${openMenuIndex === i ? 'bg-blue-50 text-blue-500' : 'text-slate-300 hover:text-blue-500 hover:bg-slate-50'}`}>
                        <MoreVertical size={20} />
                      </button>
                      {openMenuIndex === i && (
                        <div ref={menuRef} className="absolute right-8 top-8 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                          <div className="flex flex-col py-1">
                            <button onClick={() => handleOpenEdit(row)} className="flex items-center gap-3 px-4 py-3 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors text-left font-bold"><Edit size={16} /> Editar</button>
                            <button onClick={() => handleOpenStatusModal(row)} className={`flex items-center gap-3 px-4 py-3 text-xs hover:bg-slate-50 transition-colors text-left font-bold ${row.status === 'Habilitado' ? 'text-red-500' : 'text-emerald-500'}`}>{row.status === 'Habilitado' ? <Ban size={16} /> : <CheckCircle size={16} />}{row.status === 'Habilitado' ? 'Deshabilitar' : 'Habilitar'}</button>
                            <button onClick={() => handleView(row)} className="flex items-center gap-3 px-4 py-3 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors text-left font-bold"><FileText size={16} /> Ver detalle</button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-auto p-4 flex justify-between items-center text-xs text-slate-400 border-t border-slate-50">
            <span>Mostrando {proveedores.length} de {totalRecords} registros</span>
            <div className="flex items-center gap-3 font-medium text-blue-500">
              <button onClick={goToFirstPage} disabled={currentPage === 1} className="hover:text-blue-700 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronsLeft size={16} /></button>
              <button onClick={goToPrevPage}  disabled={currentPage === 1} className="hover:text-blue-700 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronLeft size={16} /></button>
              <span className="bg-blue-50 px-3 py-1 rounded text-blue-600 font-bold">Pág. {currentPage} de {totalPages || 1}</span>
              <button onClick={goToNextPage} disabled={currentPage === totalPages || totalPages === 0} className="hover:text-blue-700 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronRight size={16} /></button>
              <button onClick={goToLastPage} disabled={currentPage === totalPages || totalPages === 0} className="hover:text-blue-700 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronsRight size={16} /></button>
            </div>
          </div>
        </div>

        {/* ══ MODAL CREAR / EDITAR / VER ══ */}
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)' }} onClick={isView ? () => setIsModalOpen(false) : handleCancel} />

            <div style={{ position: 'relative', background: '#fff', width: '100%', maxWidth: 560, borderRadius: 20, padding: '32px 40px 28px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: 18, fontFamily: "'Inter', sans-serif" }}>
              <button onClick={isView ? () => setIsModalOpen(false) : handleCancel} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: 4 }}><X size={20} /></button>

              <h2 style={{ textAlign: 'center', fontSize: 21, fontWeight: 700, color: '#3b82f6', margin: '0 0 4px' }}>
                {modalMode === 'create' && 'Crear proveedor'}
                {modalMode === 'edit'   && 'Editar proveedor'}
                {modalMode === 'view'   && 'Detalle del proveedor'}
              </h2>

              {/* AQUÍ ESTÁ EL CAMBIO SOLICITADO */}
              {modalMode !== 'create' && (
                <ProvNotchInput id="codigo" label="Código" required value={formData.codigo} disabled={true} onChange={() => {}} />
              )}
              
              <ProvNotchSelect id="tipo" label="Tipo de proveedor" required value={formData.tipo} disabled={isView} onChange={(v) => setFormData({ ...formData, tipo: v })} options={[{ value: 'Mantenimientos', label: 'Mantenimientos' }, { value: 'Compras', label: 'Compras' }]} />
              
              <ProvNotchInput id="nombre" label="Nombre del proveedor" required value={formData.nombre} disabled={isView} onChange={(v) => setFormData({ ...formData, nombre: v })} />
              
              <ProvNotchInput id="nit" label="NIT" required value={formData.nit} disabled={isView} inputMode="numeric" onChange={(v) => { if (/^\d*$/.test(v)) setFormData({ ...formData, nit: v }); }} />

              {/* LISTAS PERSONALIZADAS DE PAÍS Y CIUDAD (Máximo 5 elementos visibles + Scroll) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <ProvCustomSelect
                  id="pais" label="País" required
                  value={formData.pais} disabled={isView}
                  onChange={(v) => setFormData({ ...formData, pais: v, ciudad: '' })}
                  options={apiData.map(p => ({ value: p.country, label: p.country }))}
                />
                <ProvCustomSelect
                  id="ciudad" label="Ciudad" required
                  value={formData.ciudad} disabled={isView || !formData.pais}
                  onChange={(v) => setFormData({ ...formData, ciudad: v })}
                  options={ciudadesOptions.map(c => ({ value: c, label: c }))}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 44, marginTop: 8 }}>
                <button className="p-cancel-btn" onClick={isView ? () => setIsModalOpen(false) : handleCancel}>{isView ? 'Cerrar' : 'Cancelar'}</button>
                {!isView && <button className="p-save-btn" onClick={handleSave}>Guardar</button>}
              </div>
            </div>
          </div>
        )}

        {/* ══ MODAL CAMBIO ESTADO ══ */}
        {isStatusModalOpen && selectedProvider && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 font-sans">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsStatusModalOpen(false)} />
            <div className="relative bg-white w-full max-w-[400px] rounded-[30px] p-8 shadow-2xl flex flex-col items-center text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm ${selectedProvider.status === 'Habilitado' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                {selectedProvider.status === 'Habilitado' ? <Ban size={40} strokeWidth={1.5} /> : <CheckCircle size={40} strokeWidth={1.5} />}
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 mb-2">{selectedProvider.status === 'Habilitado' ? 'Deshabilitar proveedor' : 'Habilitar proveedor'}</h2>
              <p className="text-slate-500 text-sm mb-8 px-2 leading-relaxed">¿Estás seguro de que deseas {selectedProvider.status === 'Habilitado' ? 'deshabilitar' : 'habilitar'} a <span className="font-bold text-slate-700">{selectedProvider.nombre}</span>?</p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setIsStatusModalOpen(false)} className="flex-1 py-3 rounded-full border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-sm">Cancelar</button>
                <button onClick={confirmToggleStatus} className={`flex-1 py-3 rounded-full text-white font-bold shadow-lg text-sm bg-gradient-to-r ${selectedProvider.status === 'Habilitado' ? 'from-red-500 to-rose-400' : 'from-blue-500 to-emerald-400'}`}>Sí, {selectedProvider.status === 'Habilitado' ? 'deshabilitar' : 'habilitar'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

/* ══════════════════════════════════════════════
   ProvNotchInput — Input de texto
   ══════════════════════════════════════════════ */
interface ProvNotchInputProps { id: string; label: string; value: string; disabled?: boolean; required?: boolean; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']; onChange: (value: string) => void; }
const ProvNotchInput: React.FC<ProvNotchInputProps> = ({ id, label, value, disabled = false, required = false, inputMode, onChange }) => {
  const [focused, setFocused] = useState(false);
  const active  = focused || value.length > 0;
  const bgColor = disabled ? '#f8fafc' : '#fff';
  const displayValue = (id === 'codigo' && !value) ? 'Se generará automáticamente' : value;
  return (
    <div style={{ position: 'relative' }}>
      <input id={id} type="text" value={displayValue} disabled={disabled} placeholder="" inputMode={inputMode} onChange={e => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={{ width: '100%', height: 48, borderRadius: 30, border: `1.5px solid ${focused ? '#3b82f6' : '#d1d5db'}`, background: bgColor, padding: active ? '14px 16px 0 16px' : '0 16px', fontSize: 13.5, color: disabled ? '#94a3b8' : '#334155', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s, padding 0.18s', fontFamily: 'Inter, sans-serif', cursor: disabled ? 'not-allowed' : 'text' } as React.CSSProperties} />
      <label htmlFor={id} style={{ position: 'absolute', left: 18, top: active ? 0 : '50%', transform: 'translateY(-50%)', fontSize: active ? 10.5 : 13, color: focused ? '#3b82f6' : (active ? '#6b7280' : '#9ca3af'), pointerEvents: 'none', transition: 'all 0.18s ease', background: bgColor, padding: '0 4px', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>{label}{required && <span style={{ color: '#ef4444', marginLeft: 1 }}>*</span>}</label>
    </div>
  );
};

/* ══════════════════════════════════════════════
   ProvNotchSelect — Select Nativo (Para opciones cortas como Tipo y Estado)
   ══════════════════════════════════════════════ */
interface ProvNotchSelectProps { id: string; label: string; value: string; disabled?: boolean; required?: boolean; compact?: boolean; onChange: (value: string) => void; options: { value: string | number; label: string }[]; }
const ProvNotchSelect: React.FC<ProvNotchSelectProps> = ({ id, label, value, disabled = false, required = false, compact = false, onChange, options }) => {
  const [focused, setFocused] = useState(false);
  const bgColor = disabled ? '#f8fafc' : (compact ? (focused ? '#fff' : '#f8fafc') : '#fff');
  return (
    <div style={{ position: 'relative' }}>
      <select id={id} value={value} disabled={disabled} onChange={e => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={{ width: '100%', height: compact ? 42 : 48, borderRadius: 30, border: `1.5px solid ${focused ? '#3b82f6' : '#d1d5db'}`, background: bgColor, padding: compact ? '10px 36px 0 16px' : '14px 36px 0 16px', fontSize: compact ? 13 : 13.5, color: value === '' ? '#9ca3af' : (disabled ? '#94a3b8' : '#334155'), outline: 'none', appearance: 'none' as const, boxSizing: 'border-box' as const, transition: 'border-color 0.2s', fontFamily: 'Inter, sans-serif', cursor: disabled ? 'not-allowed' : 'pointer' }}>
        <option value="" style={{ color: '#9ca3af' }}>Seleccionar</option>
        {options.map(opt => ( <option key={opt.value} value={opt.value}>{opt.label}</option> ))}
      </select>
      <label htmlFor={id} style={{ position: 'absolute', left: 18, top: 0, transform: 'translateY(-50%)', fontSize: 10.5, color: focused ? '#3b82f6' : '#6b7280', pointerEvents: 'none', background: bgColor, padding: '0 4px', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', transition: 'color 0.18s' }}>{label}{required && <span style={{ color: '#ef4444', marginLeft: 1 }}>*</span>}</label>
      <ChevronDown size={15} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af' }} />
    </div>
  );
};

/* ══════════════════════════════════════════════
   ProvCustomSelect — Menú Desplegable Personalizado (Scroll de 5 ítems máximo)
   ══════════════════════════════════════════════ */
interface ProvCustomSelectProps { id: string; label: string; value: string; disabled?: boolean; required?: boolean; onChange: (value: string) => void; options: { value: string | number; label: string }[]; }
const ProvCustomSelect: React.FC<ProvCustomSelectProps> = ({ id, label, value, disabled = false, required = false, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const bgColor = disabled ? '#f8fafc' : '#fff';
  const selectedOption = options.find(o => String(o.value) === String(value));
  const displayValue = selectedOption ? selectedOption.label : 'Seleccionar';

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <div onClick={() => { if (!disabled) { setIsOpen(!isOpen); setFocused(true); } }} style={{ width: '100%', height: 48, borderRadius: 30, border: `1.5px solid ${focused || isOpen ? '#3b82f6' : '#d1d5db'}`, background: bgColor, padding: '14px 36px 0 16px', fontSize: 13.5, color: value === '' ? '#9ca3af' : (disabled ? '#94a3b8' : '#334155'), outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', fontFamily: 'Inter, sans-serif', cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}>
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', width: '100%', marginTop: -4 }}>
          {displayValue}
        </span>
      </div>

      <label style={{ position: 'absolute', left: 18, top: 0, transform: 'translateY(-50%)', fontSize: 10.5, color: focused || isOpen ? '#3b82f6' : '#6b7280', pointerEvents: 'none', background: bgColor, padding: '0 4px', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', transition: 'color 0.18s', zIndex: 10 }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: 1 }}>*</span>}
      </label>

      <ChevronDown size={15} style={{ position: 'absolute', right: 14, top: '50%', transform: `translateY(-50%) ${isOpen ? 'rotate(180deg)' : ''}`, pointerEvents: 'none', color: '#9ca3af', transition: 'transform 0.2s' }} />

      {isOpen && (
        <ul className="custom-scrollbar" style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxHeight: 200, overflowY: 'auto', zIndex: 9999, padding: '8px 0', margin: 0, listStyle: 'none' }}>
          {options.length === 0 ? (
            <li style={{ padding: '10px 16px', fontSize: 13, color: '#9ca3af', fontFamily: 'Inter, sans-serif' }}>No hay opciones</li>
          ) : (
            options.map(opt => (
              <li key={opt.value} onClick={() => { onChange(String(opt.value)); setIsOpen(false); setFocused(false); }}
                style={{ padding: '10px 16px', fontSize: 13.5, color: '#334155', cursor: 'pointer', fontFamily: 'Inter, sans-serif', background: String(value) === String(opt.value) ? '#eff6ff' : 'transparent', fontWeight: String(value) === String(opt.value) ? 600 : 400, transition: 'background 0.15s' }}
                onMouseEnter={(e) => { if(String(value) !== String(opt.value)) e.currentTarget.style.background = '#f8fafc' }}
                onMouseLeave={(e) => { if(String(value) !== String(opt.value)) e.currentTarget.style.background = 'transparent' }}
              >
                {opt.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default ProveedoresScreen;