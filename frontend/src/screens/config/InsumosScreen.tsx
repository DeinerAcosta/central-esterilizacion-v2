import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, PlusCircle, MoreVertical, ChevronDown, X, Edit, Ban, FileText, CheckCircle,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight 
} from 'lucide-react';
import Swal from 'sweetalert2';

const InsumosScreen: React.FC = () => {
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [openMenuIndex, setOpenMenuIndex]   = useState<number | null>(null);
  const menuRef                             = useRef<HTMLDivElement>(null);
  const [modalMode, setModalMode]           = useState<'create' | 'edit' | 'view'>('create');
  const [loading, setLoading]               = useState(false);
  const [data, setData]                     = useState<any[]>([]);
  const [unidades, setUnidades]             = useState<any[]>([]);
  const [presentaciones, setPresentaciones] = useState<any[]>([]);
  const [proveedores, setProveedores]       = useState<any[]>([]);
  const [currentPage, setCurrentPage]       = useState(1);
  const [totalPages, setTotalPages]         = useState(1);
  const [totalRecords, setTotalRecords]     = useState(0);
  const [searchTerm, setSearchTerm]         = useState('');
  const [statusFilter, setStatusFilter]     = useState('');
  const [formData, setFormData] = useState<any>({
    id: null, codigo: '', nombre: '', descripcion: '',
    unidadMedidaId: '', presentacionId: '', proveedorId: '',
    status: 'Habilitado', reqEst: 'no', tipoEst: ''
  });

  useEffect(() => { fetchListasSoporte(); }, []);
  useEffect(() => { fetchInsumos(); }, [currentPage, searchTerm, statusFilter]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setOpenMenuIndex(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchListasSoporte = async () => {
    try {
      const res  = await fetch('http://localhost:4000/api/insumos/listas');
      const json = await res.json();
      setUnidades(json.unidades || []);
      setPresentaciones(json.presentaciones || []);
      
      // Filtramos para que solo guarde en el estado los proveedores que sean de compras.
      // (Buscamos coincidencias comunes en campos de tipo de proveedor)
      const proveedoresCompras = (json.proveedores || []).filter((p: any) => 
        p.tipo === 'Compras' || p.tipoProveedor === 'Compras' || p.categoria === 'Compras' || p.tipo_proveedor === 'Compras'
      );
      setProveedores(proveedoresCompras);
      
    } catch (error) { console.error('Error al cargar listas:', error); }
  };

  const fetchInsumos = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`http://localhost:4000/api/insumos?page=${currentPage}&search=${searchTerm}&estado=${statusFilter}`);
      const json = await res.json();
      const formateados = json.data.map((item: any) => ({
        id: item.id, codigo: item.codigo, nombre: item.nombre,
        descripcion: item.descripcion || '',
        unidad: item.unidadMedida?.nombre || '', unidadMedidaId: item.unidadMedidaId,
        pres: item.presentacion?.nombre || '',   presentacionId: item.presentacionId,
        proveedor: item.proveedor?.nombre || '', proveedorId: item.proveedorId,
        est: item.requiereEsterilizacion ? item.tipoEsterilizacion : 'No aplica',
        status: item.estado ? 'Habilitado' : 'Deshabilitado',
        reqEst: item.requiereEsterilizacion ? 'si' : 'no',
        tipoEst: item.tipoEsterilizacion || ''
      }));
      setData(formateados);
      setTotalPages(json.totalPages);
      setTotalRecords(json.total);
    } catch (error) { console.error('Error al obtener insumos:', error); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!formData.nombre.trim() || !formData.descripcion?.trim() || !formData.unidadMedidaId || !formData.presentacionId) {
      Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Es necesario diligenciar todos los campos obligatorios.', confirmButtonColor: '#3b82f6' });
      return;
    }
    const regex = /^[\w\s.,;:¡!¿?()'"\-áéíóúÁÉÍÓÚñÑ]+$/;
    if (!regex.test(formData.nombre) || !regex.test(formData.descripcion)) {
      Swal.fire({ icon: 'warning', title: 'Formato inválido', text: 'El nombre y la descripción contienen caracteres no permitidos.', confirmButtonColor: '#3b82f6' });
      return;
    }
    try {
      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        unidadMedidaId: formData.unidadMedidaId,
        presentacionId: formData.presentacionId,
        proveedorId: formData.proveedorId || null,
        requiereEsterilizacion: formData.reqEst === 'si',
        tipoEsterilizacion: formData.reqEst === 'si' ? formData.tipoEst : null
      };
      let res: any;
      if (modalMode === 'create') {
        res = await fetch('http://localhost:4000/api/insumos', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
      } else if (modalMode === 'edit') {
        res = await fetch(`http://localhost:4000/api/insumos/${formData.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
      }
      if (!res.ok) { const err = await res.json(); throw new Error(err.msg); }
      Swal.fire({ icon: 'success', title: '¡Éxito!', text: `Insumo ${modalMode === 'create' ? 'creado' : 'actualizado'} correctamente.`, confirmButtonColor: '#10b981', timer: 2000, showConfirmButton: false });
      setIsModalOpen(false);
      fetchInsumos();
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Ocurrió un error al guardar.', confirmButtonColor: '#ef4444' });
    }
  };

  const handleToggleClick = (item: any) => {
    setOpenMenuIndex(null);
    const accion = item.status === 'Habilitado' ? 'deshabilitará' : 'habilitará';
    Swal.fire({
      title: '¿Está seguro?',
      html: `Se <b>${accion}</b> el insumo:<br/><span style="color:#475569;font-weight:600">${item.nombre}</span>`,
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#3b82f6', cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, continuar', cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`http://localhost:4000/api/insumos/${item.id}/estado`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: item.status !== 'Habilitado' })
          });
          Swal.fire({ icon: 'success', title: 'Estado actualizado', text: `El insumo ha sido ${item.status === 'Habilitado' ? 'deshabilitado' : 'habilitado'}.`, timer: 1500, showConfirmButton: false });
          fetchInsumos();
        } catch { Swal.fire('Error', 'No se pudo cambiar el estado del insumo.', 'error'); }
      }
    });
  };

  const toggleMenu        = (index: number, e: React.MouseEvent) => { e.stopPropagation(); setOpenMenuIndex(openMenuIndex === index ? null : index); };
  const handleInputChange = (e: any) => { const { name, value } = e.target; setFormData((prev: any) => ({ ...prev, [name]: value })); };
  const handleRadioChange = (val: string) => { setFormData((prev: any) => ({ ...prev, reqEst: val, tipoEst: val === 'no' ? '' : prev.tipoEst })); };

  const handleCreate = () => {
    setModalMode('create');
    setFormData({
      id: null, codigo: '', nombre: '', descripcion: '',
      unidadMedidaId: '', presentacionId: '', proveedorId: '',
      status: 'Habilitado', reqEst: 'no', tipoEst: ''
    });
    setIsModalOpen(true);
    setOpenMenuIndex(null);
  };
  const handleEdit = (item: any) => { setModalMode('edit');  setFormData({ ...item }); setIsModalOpen(true); setOpenMenuIndex(null); };
  const handleView = (item: any) => { setModalMode('view');  setFormData({ ...item }); setIsModalOpen(true); setOpenMenuIndex(null); };

  const goToFirstPage = () => setCurrentPage(1);
  const goToPrevPage  = () => setCurrentPage(p => Math.max(1, p - 1));
  const goToNextPage  = () => setCurrentPage(p => Math.min(totalPages, p + 1));
  const goToLastPage  = () => setCurrentPage(totalPages);

  const isView = modalMode === 'view';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .m-notch-wrapper { position: relative; }

        /* ── Input texto ── */
        .m-notch-input {
          width: 100%; height: 48px; border-radius: 30px;
          border: 1.5px solid #d1d5db; background: #fff;
          padding: 14px 16px 0 16px; font-size: 13.5px; color: #334155;
          outline: none; box-sizing: border-box;
          transition: border-color 0.2s; font-family: 'Inter', sans-serif;
        }
        .m-notch-input:disabled { background: #f8fafc; cursor: not-allowed; color: #94a3b8; }
        .m-notch-input:focus:not(:disabled) { border-color: #3b82f6; }

        /* ── Select ── */
        .m-notch-select {
          width: 100%; height: 48px; border-radius: 30px;
          border: 1.5px solid #d1d5db; background: #fff;
          padding: 14px 36px 0 16px; font-size: 13.5px; color: #334155;
          outline: none; appearance: none; box-sizing: border-box;
          transition: border-color 0.2s; font-family: 'Inter', sans-serif;
          cursor: pointer;
        }
        .m-notch-select:disabled { background: #f8fafc; cursor: not-allowed; color: #94a3b8; }
        .m-notch-select:focus:not(:disabled) { border-color: #3b82f6; }

        /* Select compacto barra */
        .m-notch-select.bar {
          height: 42px; background: #f8fafc; font-size: 13px;
          padding: 12px 36px 0 16px;
        }
        .m-notch-select.bar:focus { border-color: #3b82f6; background: #fff; }

        /* ── Label: SIEMPRE arriba (posición fija en el borde superior) ── */
        .m-notch-label {
          position: absolute; left: 18px; top: 0;
          transform: translateY(-50%);
          font-size: 10.5px; color: #6b7280;
          pointer-events: none;
          background: #fff;
          padding: 0 4px;
          font-family: 'Inter', sans-serif; white-space: nowrap;
          transition: color 0.18s;
        }
        .m-notch-label .ast { color: #ef4444; margin-left: 1px; }

        /* Label color azul en focus */
        .m-notch-wrapper.focused .m-notch-label  { color: #3b82f6; }
        .m-notch-wrapper.focused .m-notch-input  { border-color: #3b82f6; }
        .m-notch-wrapper.focused .m-notch-select { border-color: #3b82f6; }

        /* Label fondo gris para barra y para disabled */
        .m-notch-wrapper.bar-wrap  .m-notch-label { background: #f8fafc; }
        .m-notch-wrapper.bar-wrap.focused .m-notch-label { background: #fff; }
        .m-notch-wrapper.disabled  .m-notch-label { background: #f8fafc; }

        /* Placeholder dentro del select: texto gris pequeño */
        .m-notch-select option[value=""] { color: #9ca3af; }

        /* Chevron */
        .m-right-icon {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%); pointer-events: none; color: #9ca3af;
        }

        /* Botones */
        .m-save-btn {
          padding: 11px 48px; border-radius: 30px; border: none; cursor: pointer;
          background: linear-gradient(90deg, #60a5fa 0%, #34d399 100%);
          color: #fff; font-weight: 700; font-size: 14px;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 4px 14px rgba(96,165,250,0.4);
          transition: opacity 0.2s, transform 0.15s;
        }
        .m-save-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        .m-cancel-btn {
          background: none; border: none; cursor: pointer;
          font-size: 14px; font-weight: 600; color: #64748b;
          font-family: 'Inter', sans-serif; transition: color 0.2s; padding: 0;
        }
        .m-cancel-btn:hover { color: #ef4444; }

        /* Icono lupa barra */
        .bar-search-icon {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%); pointer-events: none; color: #60a5fa;
        }
      `}</style>

      <div className="space-y-6 h-full flex flex-col font-sans relative" onClick={() => setOpenMenuIndex(null)}>
        <h1 className="text-3xl font-bold text-blue-500">Insumos Quirúrgicos</h1>

        {/* ══ BARRA BÚSQUEDA ══ */}
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
          <div className="flex gap-3 flex-1 w-full md:w-auto items-center">

            {/* Filtro Estado */}
            <div style={{ width: 170, flexShrink: 0 }}>
              <ModalNotchSelect
                id="statusFilter"
                label="Estado"
                value={statusFilter}
                onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
                options={[
                  { value: 'true',  label: 'Habilitar'    },
                  { value: 'false', label: 'Deshabilitado' },
                ]}
                compact
              />
            </div>

            {/* Búsqueda */}
            <div style={{ position: 'relative', flex: 1, maxWidth: 560 }}>
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                style={{
                  width: '100%', height: 42, borderRadius: 30,
                  border: '1.5px solid #e2e8f0', background: '#f8fafc',
                  padding: '0 40px 0 18px', fontSize: 13, color: '#475569',
                  outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s',
                }}
                onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                onBlur={e  => (e.target.style.borderColor = '#e2e8f0')}
              />
              <Search className="bar-search-icon" size={17} />
            </div>
          </div>

          <button
            onClick={handleCreate}
            className="flex items-center gap-2 text-blue-500 font-bold text-sm hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            Crear insumo <PlusCircle size={18} />
          </button>
        </div>

        {/* ══ TABLA ══ */}
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-visible flex-1 flex flex-col">
          <div className="overflow-visible flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Código</th>
                  <th className="px-6 py-4">Nombre</th>
                  <th className="px-6 py-4">Unidad de medida</th>
                  <th className="px-6 py-4">Esterilización</th>
                  <th className="px-6 py-4">Presentación</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-4 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-8 text-slate-400">Cargando datos...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-slate-400">No se encontraron registros.</td></tr>
                ) : data.map((row, i) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-medium">{row.codigo}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{row.nombre}</td>
                    <td className="px-6 py-4 text-slate-500">{row.unidad}</td>
                    <td className="px-6 py-4 text-slate-500">{row.est}</td>
                    <td className="px-6 py-4 text-slate-500">{row.pres}</td>
                    <td className="px-6 py-4">
                      <span className={`px-4 py-1 rounded-full text-xs font-bold border ${
                        row.status === 'Habilitado'
                          ? 'bg-emerald-50 text-emerald-500 border-emerald-100'
                          : 'bg-red-50 text-red-500 border-red-100'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right relative">
                      <button onClick={(e) => toggleMenu(i, e)} className={`p-1 rounded-full transition-colors ${openMenuIndex === i ? 'bg-blue-50 text-blue-500' : 'text-slate-300 hover:text-blue-500 hover:bg-slate-50'}`}>
                        <MoreVertical size={20} />
                      </button>
                      {openMenuIndex === i && (
                        <div ref={menuRef} className="absolute right-8 top-8 w-44 bg-white rounded-lg shadow-xl border border-slate-100 z-50 overflow-hidden">
                          <div className="flex flex-col py-1">
                            <button onClick={() => handleEdit(row)} className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors text-left font-medium"><Edit size={14} /> Editar</button>
                            <button onClick={() => handleToggleClick(row)} className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-red-500 transition-colors text-left font-medium">
                              {row.status === 'Habilitado' ? <Ban size={14} /> : <CheckCircle size={14} />}
                              {row.status === 'Habilitado' ? 'Deshabilitar' : 'Habilitar'}
                            </button>
                            <button onClick={() => handleView(row)} className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors text-left font-medium"><FileText size={14} /> Ver detalle</button>
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
            <span>Mostrando {data.length} de {totalRecords} registros</span>
            <div className="flex items-center gap-3 font-medium text-blue-500">
              <button onClick={goToFirstPage} disabled={currentPage === 1} className="hover:text-blue-700 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronsLeft size={16} /></button>
              <button onClick={goToPrevPage}  disabled={currentPage === 1} className="hover:text-blue-700 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronLeft size={16} /></button>
              <span className="bg-blue-50 px-3 py-1 rounded text-blue-600 font-bold">Pág. {currentPage} de {totalPages || 1}</span>
              <button onClick={goToNextPage} disabled={currentPage === totalPages || totalPages === 0} className="hover:text-blue-700 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronRight size={16} /></button>
              <button onClick={goToLastPage} disabled={currentPage === totalPages || totalPages === 0} className="hover:text-blue-700 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronsRight size={16} /></button>
            </div>
          </div>
        </div>

        {/* ══ MODAL ══ */}
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)' }}
              onClick={() => setIsModalOpen(false)} />

            <div style={{
              position: 'relative', background: '#fff', width: '100%', maxWidth: 560,
              borderRadius: 20, padding: '32px 40px 28px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              display: 'flex', flexDirection: 'column', gap: 16,
              fontFamily: "'Inter', sans-serif",
            }}>
              <button onClick={() => setIsModalOpen(false)}
                style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: 4 }}>
                <X size={20} />
              </button>

              <h2 style={{ textAlign: 'center', fontSize: 21, fontWeight: 700, color: '#3b82f6', margin: '0 0 4px' }}>
                {modalMode === 'create' && 'Crear insumos'}
                {modalMode === 'edit'   && 'Editar insumo'}
                {modalMode === 'view'   && 'Detalle del insumo'}
              </h2>

              {/* Fila 1: Nombre | Unidad */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <ModalNotchInput
                  id="nombre" label="Nombre" required
                  value={formData.nombre} disabled={isView}
                  onChange={(v) => setFormData((p: any) => ({ ...p, nombre: v }))}
                />
                <ModalNotchSelect
                  id="unidadMedidaId" label="Unidad de medida" required
                  value={formData.unidadMedidaId} disabled={isView}
                  onChange={(v) => setFormData((p: any) => ({ ...p, unidadMedidaId: v }))}
                  options={unidades.map(u => ({ value: u.id, label: u.nombre }))}
                />
              </div>

              {/* Fila 2: Presentación | Proveedor */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <ModalNotchSelect
                  id="presentacionId" label="Presentación" required
                  value={formData.presentacionId} disabled={isView}
                  onChange={(v) => setFormData((p: any) => ({ ...p, presentacionId: v }))}
                  options={presentaciones.map(p => ({ value: p.id, label: p.nombre }))}
                />
                <ModalNotchSelect
                  id="proveedorId" label="Proveedor" required
                  value={formData.proveedorId} disabled={isView}
                  onChange={(v) => setFormData((p: any) => ({ ...p, proveedorId: v }))}
                  options={proveedores.map((p: any) => ({ value: p.id, label: p.nombre }))}
                />
              </div>

              {/* Fila 3: Descripción */}
              <ModalNotchInput
                id="descripcion" label="Descripción" required
                value={formData.descripcion} disabled={isView}
                onChange={(v) => setFormData((p: any) => ({ ...p, descripcion: v }))}
              />

              {/* Fila 4: Esterilización */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 4 }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#64748b', margin: '0 0 10px 4px' }}>¿Requiere esterilización?</p>
                  <div style={{ display: 'flex', gap: 18, paddingLeft: 4 }}>
                    {[{ val: 'si', label: 'Si' }, { val: 'no', label: 'No aplica' }].map(opt => (
                      <label key={opt.val} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#475569', cursor: isView ? 'not-allowed' : 'pointer', userSelect: 'none' }}>
                        <input type="radio" name="reqEst" disabled={isView}
                          checked={formData.reqEst === opt.val}
                          onChange={() => handleRadioChange(opt.val)}
                          style={{ accentColor: '#3b82f6', width: 15, height: 15 }} />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, margin: '0 0 10px 4px', color: formData.reqEst === 'no' ? '#cbd5e1' : '#64748b' }}>Tipo de esterilización</p>
                  <div style={{ display: 'flex', gap: 18, paddingLeft: 4 }}>
                    {[{ val: 'Gas', label: 'Gas' }, { val: 'Vapor', label: 'Vapor' }].map(opt => (
                      <label key={opt.val} style={{
                        display: 'flex', alignItems: 'center', gap: 7, fontSize: 13,
                        cursor: (formData.reqEst === 'no' || isView) ? 'not-allowed' : 'pointer',
                        color: (formData.reqEst === 'no' || isView) ? '#cbd5e1' : '#475569',
                        userSelect: 'none'
                      }}>
                        <input type="radio" name="tipoEst" value={opt.val}
                          disabled={formData.reqEst === 'no' || isView}
                          checked={formData.tipoEst === opt.val}
                          onChange={handleInputChange}
                          style={{ accentColor: '#3b82f6', width: 15, height: 15 }} />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 44, marginTop: 8 }}>
                <button className="m-cancel-btn" onClick={() => setIsModalOpen(false)}>
                  {isView ? 'Cerrar' : 'Cancelar'}
                </button>
                {!isView && (
                  <button className="m-save-btn" onClick={handleSave}>Guardar</button>
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
   ModalNotchInput — label SIEMPRE arriba
   sube cuando hay texto, baja solo si pierde foco y está vacío
   ══════════════════════════════════════════════ */
interface ModalNotchInputProps {
  id: string; label: string; value: string;
  disabled?: boolean; required?: boolean;
  onChange: (value: string) => void;
}
const ModalNotchInput: React.FC<ModalNotchInputProps> = ({
  id, label, value, disabled = false, required = false, onChange
}) => {
  const [focused, setFocused] = useState(false);
  // Para inputs: sube con foco o cuando hay texto
  const active = focused || value.length > 0;

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
          background: disabled ? '#f8fafc' : '#fff',
          padding: active ? '14px 16px 0 16px' : '0 16px',
          fontSize: 13.5, color: disabled ? '#94a3b8' : '#334155',
          outline: 'none', boxSizing: 'border-box',
          transition: 'border-color 0.2s, padding 0.18s',
          fontFamily: 'Inter, sans-serif',
          cursor: disabled ? 'not-allowed' : 'text',
        } as React.CSSProperties}
      />
      <label htmlFor={id} style={{
        position: 'absolute',
        left: 18,
        top: active ? 0 : '50%',
        transform: active ? 'translateY(-50%)' : 'translateY(-50%)',
        fontSize: active ? 10.5 : 13,
        color: focused ? '#3b82f6' : (active ? '#6b7280' : '#9ca3af'),
        pointerEvents: 'none',
        transition: 'all 0.18s ease',
        background: disabled ? '#f8fafc' : '#fff',
        padding: '0 4px',
        fontFamily: 'Inter, sans-serif',
        whiteSpace: 'nowrap',
      }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: 1 }}>*</span>}
      </label>
    </div>
  );
};

/* ══════════════════════════════════════════════
   ModalNotchSelect — label SIEMPRE arriba (fijo en borde)
   "Seleccionar" aparece como primera opción elegible
   cuando se escoge → label sigue arriba + valor visible
   ══════════════════════════════════════════════ */
interface ModalNotchSelectProps {
  id: string; label: string; value: string;
  disabled?: boolean; required?: boolean; compact?: boolean;
  onChange: (value: string) => void;
  options: { value: string | number; label: string }[];
}
const ModalNotchSelect: React.FC<ModalNotchSelectProps> = ({
  id, label, value, disabled = false, required = false,
  compact = false, onChange, options
}) => {
  const [focused, setFocused] = useState(false);

  // Para selects: label SIEMPRE en la parte superior del borde
  // (porque el select siempre muestra un texto — sea "Seleccionar" o el valor elegido)
  const bgColor = disabled ? '#f8fafc' : (compact ? (focused ? '#fff' : '#f8fafc') : '#fff');

  return (
    <div style={{ position: 'relative' }}>
      <select
        id={id}
        value={value}
        disabled={disabled}
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
          outline: 'none',
          appearance: 'none' as const,
          boxSizing: 'border-box' as const,
          transition: 'border-color 0.2s',
          fontFamily: 'Inter, sans-serif',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {/* Primera opción: "Seleccionar" siempre visible pero en gris */}
        <option value="" style={{ color: '#9ca3af' }}>Seleccionar</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {/* Label SIEMPRE fijo en el borde superior */}
      <label htmlFor={id} style={{
        position: 'absolute',
        left: 18, top: 0,
        transform: 'translateY(-50%)',
        fontSize: 10.5,
        color: focused ? '#3b82f6' : '#6b7280',
        pointerEvents: 'none',
        background: bgColor,
        padding: '0 4px',
        fontFamily: 'Inter, sans-serif',
        whiteSpace: 'nowrap',
        transition: 'color 0.18s',
      }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: 1 }}>*</span>}
      </label>

      <ChevronDown size={15} style={{
        position: 'absolute', right: 14, top: '50%',
        transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af'
      }} />
    </div>
  );
};

export default InsumosScreen;