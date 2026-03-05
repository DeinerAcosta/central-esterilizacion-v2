import React, { useState, useEffect, useRef } from 'react';
import {
  Search, PlusCircle, ChevronDown, ChevronUp, X,
  Eye, Edit, Copy, CheckCircle, Ban, MoreVertical,
  Upload, User, Trash2, EyeOff, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight
} from 'lucide-react';

/* ── Cargo → Rol automático ── */
const CARGO_ROL_MAP: Record<string, string> = {
  'Administrador General': 'Administrador',
  'Coordinador SST':       'Supervisor',
  'Enfermera Jefe':        'Supervisor',
  'Auxiliar':              'Operario',
};

const UsuariosScreen: React.FC = () => {
  const [isModalOpen, setIsModalOpen]             = useState(false);
  const [modalMode, setModalMode]                 = useState<'create'|'view'|'edit'|'duplicate'>('create');
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen]         = useState(false);
  const [isErrorOpen, setIsErrorOpen]             = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [errorMsg, setErrorMsg]                   = useState('');
  const [successMsg, setSuccessMsg]               = useState('');
  const [showPassword, setShowPassword]           = useState(false);
  const [selectedModules, setSelectedModules]     = useState<any>({});
  const [expandedModules, setExpandedModules]     = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem]           = useState<any>(null);
  const [openMenuIndex, setOpenMenuIndex]         = useState<number|null>(null);
  const menuRef                                   = useRef<HTMLDivElement>(null);
  const fileInputRef                              = useRef<HTMLInputElement>(null);
  const [usersData, setUsersData]                 = useState<any[]>([]);
  const [loading, setLoading]                     = useState(false);
  const [searchTerm, setSearchTerm]               = useState('');
  const [statusFilter, setStatusFilter]           = useState('');
  const [currentPage, setCurrentPage]             = useState(1);
  const [totalPages, setTotalPages]               = useState(1);
  const [totalRecords, setTotalRecords]           = useState(0);

  // ← campo "usuario" eliminado del formulario (lo genera el backend)
  const initialForm = {
    id: null, nombre: '', apellido: '', empresa: '', cargo: '',
    email: '', password: '', rol: 'Administrador',
    esPropietario: false, registroContable: false, estado: true, fotoUrl: ''
  };
  const [formData, setFormData] = useState<any>(initialForm);
  const [selectedFile, setSelectedFile] = useState<File|null>(null);

  const estructuraPermisos = [
    { id: 'dashboard', label: 'Dashboard', type: 'simple' },
    {
      id: 'ciclo', label: 'Ciclo de esterilización', type: 'parent',
      subModules: [
        { id: 'trazabilidad_qx', label: 'Trazabilidad Qx' },
        { id: 'instrumentos_qx', label: 'Instrumentos Qx' },
        { id: 'insumos_qx',      label: 'Insumos Qx' },
        { id: 'historico_ciclo', label: 'Histórico de ciclo' },
      ]
    },
    { id: 'reporte', label: 'Reporte',       type: 'simple' },
    { id: 'hojas',   label: 'Hojas de vida', type: 'simple' },
    { id: 'informes',label: 'Informes',      type: 'simple' },
    {
      id: 'config', label: 'Configuración', type: 'parent',
      subModules: [
        { id: 'tm_esterilizacion', label: 'TM Esterilización'    },
        { id: 'tm_instrumentos',   label: 'TM Instrumentos Qx'   },
        { id: 'tm_kits',           label: 'TM KITs'              },
        { id: 'tm_proveedores',    label: 'TM Proveedores'       },
        { id: 'tm_especialidades', label: 'TM Especialidades'    },
        { id: 'tm_sedes',          label: 'TM Sedes'             },
        { id: 'tm_usuario',        label: 'TM Usuario'           },
      ]
    },
  ];

  useEffect(() => { fetchUsuarios(); }, [searchTerm, statusFilter, currentPage]);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuIndex(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`http://localhost:4000/api/usuarios?page=${currentPage}&search=${searchTerm}&estado=${statusFilter}`);
      const json = await res.json();
      setUsersData(json.data || []);
      setTotalPages(json.totalPages || 1);
      setTotalRecords(json.total || 0);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  /* ── cargo cambia → rol se auto-completa ── */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    if (name === 'cargo' && CARGO_ROL_MAP[value]) {
      setFormData((p: any) => ({ ...p, cargo: value, rol: CARGO_ROL_MAP[value] }));
    } else {
      setFormData((p: any) => ({ ...p, [name]: val }));
    }
  };

  const handleOpenModal = (mode: any, user: any = null) => {
    setModalMode(mode);
    setSelectedFile(null);
    setExpandedModules(new Set());
    if (user) {
      setFormData({ ...initialForm, ...user, password: '', });
      setSelectedModules(user.permisos || {});
    } else {
      setFormData(initialForm);
      setSelectedModules({});
    }
    setShowPassword(false);
    setIsModalOpen(true);
    setOpenMenuIndex(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg','image/png'].includes(file.type)) {
      setErrorMsg('Solo se permiten formatos JPG o PNG.'); setIsErrorOpen(true); return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setErrorMsg('La imagen supera el tamaño máximo permitido (4MB).'); setIsErrorOpen(true); return;
    }
    setSelectedFile(file);
    setFormData((p: any) => ({ ...p, fotoUrl: URL.createObjectURL(file) }));
  };

  const removePhoto = () => {
    setSelectedFile(null);
    setFormData((p: any) => ({ ...p, fotoUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    const regexAlfa  = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPass  = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    // ← validación sin campo usuario
    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.empresa ||
        !formData.cargo || !formData.email.trim() || !formData.rol) {
      setErrorMsg('Es necesario el diligenciamiento de todos los campos obligatorios (*).'); setIsErrorOpen(true); return;
    }
    if (!regexAlfa.test(formData.nombre.trim()) || !regexAlfa.test(formData.apellido.trim())) {
      setErrorMsg('Los campos Nombre y Apellido solo deben contener caracteres alfabéticos.'); setIsErrorOpen(true); return;
    }
    if (!regexEmail.test(formData.email.trim())) {
      setErrorMsg('El formato del correo electrónico es inválido.'); setIsErrorOpen(true); return;
    }
    if ((modalMode === 'create' || modalMode === 'duplicate' || (modalMode === 'edit' && formData.password))) {
      if (!regexPass.test(formData.password)) {
        setErrorMsg('La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.'); setIsErrorOpen(true); return;
      }
    }
    try {
      const method = (modalMode === 'create' || modalMode === 'duplicate') ? 'POST' : 'PUT';
      const url    = method === 'POST'
        ? 'http://localhost:4000/api/usuarios'
        : `http://localhost:4000/api/usuarios/${formData.id}`;
      // ← usuario no se envía, el backend lo genera
      const { id, ...rest } = formData;
      const payload = { ...rest, permisos: selectedModules };
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.msg || 'Error en el servidor'); }
      setSuccessMsg(modalMode === 'edit' ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');
      setIsSuccessOpen(true); setIsModalOpen(false); fetchUsuarios();
    } catch (e: any) { setErrorMsg(e.message); setIsErrorOpen(true); }
  };

  const confirmToggleStatus = async () => {
    if (!selectedItem) return;
    const nuevoEstado = !selectedItem.estado;
    try {
      const res = await fetch(`http://localhost:4000/api/usuarios/${selectedItem.id}/estado`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.msg); }
      setSuccessMsg(nuevoEstado ? 'Usuario habilitado correctamente' : 'Usuario deshabilitado correctamente');
      setIsSuccessOpen(true); setIsStatusModalOpen(false); fetchUsuarios();
    } catch (e: any) { setErrorMsg(e.message); setIsErrorOpen(true); setIsStatusModalOpen(false); }
  };

  const handleCancelClick = () => {
    if (modalMode === 'view') setIsModalOpen(false);
    else setIsCancelAlertOpen(true);
  };

  /* ── Acordeón de permisos ── */
  const toggleExpand = (id: string) => {
    setExpandedModules(prev => {
      const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
    });
  };

  /* ── Checkbox padre selecciona todos los hijos ── */
  const toggleParentSelection = (modulo: any) => {
    if (modalMode === 'view') return;
    const newVal = !selectedModules[modulo.id];
    setSelectedModules((prev: any) => {
      const n = { ...prev, [modulo.id]: newVal };
      modulo.subModules?.forEach((s: any) => { n[s.id] = newVal; });
      return n;
    });
  };

  const toggleSelection = (key: string) => {
    if (modalMode === 'view') return;
    setSelectedModules((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderPermCell = (rowKey: string, col: string) => {
    const active = selectedModules[rowKey];
    const ro     = modalMode === 'view';
    if (rowKey === 'dashboard' && col !== 'ver' && col !== 'descargar')
      return <span className="text-slate-300">-</span>;
    return (
      <input type="checkbox" disabled={!active || ro}
        className={`w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-200 ${(!active || ro) ? 'opacity-50 cursor-not-allowed bg-slate-100' : 'cursor-pointer'}`}
      />
    );
  };

  const getTitle = () => ({ view:'Detalles del usuario', edit:'Editar usuario', duplicate:'Duplicar usuario', create:'Crear usuario' }[modalMode]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .u-save-btn {
          padding: 11px 48px; border-radius: 30px; border: none; cursor: pointer;
          background: linear-gradient(90deg,#60a5fa 0%,#34d399 100%);
          color:#fff; font-weight:700; font-size:14px; font-family:'Inter',sans-serif;
          box-shadow:0 4px 14px rgba(96,165,250,.4); transition:opacity .2s,transform .15s;
        }
        .u-save-btn:hover { opacity:.9; transform:translateY(-1px); }
        .u-cancel-btn {
          background:none; border:none; cursor:pointer; font-size:14px; font-weight:600;
          color:#64748b; font-family:'Inter',sans-serif; transition:color .2s; padding:0;
        }
        .u-cancel-btn:hover { color:#ef4444; }
        .u-search-icon { position:absolute; right:14px; top:50%; transform:translateY(-50%); pointer-events:none; color:#60a5fa; }
      `}</style>

      <div className="space-y-6 h-full flex flex-col font-sans relative" onClick={() => setOpenMenuIndex(null)}>
        <h1 className="text-3xl font-bold text-blue-500">Usuarios</h1>

        {/* ══ BARRA ══ */}
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
          <div className="flex gap-3 flex-1 w-full md:w-auto items-center">
            <div style={{ width: 170, flexShrink: 0 }}>
              <UNotchSelect id="statusFilter" label="Estado" value={statusFilter} compact
                onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
                options={[{ value:'true', label:'Habilitado' }, { value:'false', label:'Deshabilitado' }]}
              />
            </div>
            <div style={{ position:'relative', flex:1, maxWidth:560 }}>
              <input type="text" placeholder="Buscar usuario..." value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                style={{ width:'100%', height:42, borderRadius:30, border:'1.5px solid #e2e8f0', background:'#f8fafc',
                  padding:'0 40px 0 18px', fontSize:13, color:'#475569', outline:'none',
                  boxSizing:'border-box', fontFamily:'Inter,sans-serif', transition:'border-color .2s' } as React.CSSProperties}
                onFocus={e=>(e.target.style.borderColor='#3b82f6')}
                onBlur={e=>(e.target.style.borderColor='#e2e8f0')}
              />
              <Search className="u-search-icon" size={17}/>
            </div>
          </div>
          <button onClick={() => handleOpenModal('create')}
            className="flex items-center gap-2 text-blue-500 font-bold text-sm hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap">
            Crear usuario <PlusCircle size={18}/>
          </button>
        </div>

        {/* ══ TABLA ══ */}
        {/* Orden de columnas: Código, Nombre, Cargo, Rol, Correo electrónico, Estado */}
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 flex-1 flex flex-col overflow-visible">
          <div className="overflow-visible flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Código</th>
                  <th className="px-6 py-4">Nombre</th>
                  <th className="px-6 py-4">Cargo</th>
                  <th className="px-6 py-4">Rol</th>
                  <th className="px-6 py-4">Correo electrónico</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-4 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-10 text-slate-400">Cargando...</td></tr>
                ) : usersData.map((row, i) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-medium">{row.codigo}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {row.fotoUrl
                            ? <img src={row.fotoUrl} alt="perfil" className="w-full h-full rounded-full object-cover"/>
                            : (row.nombre?.[0] || '?')
                          }
                        </div>
                        <span className="text-slate-700 font-medium">{row.nombre} {row.apellido}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{row.cargo || '—'}</td>
                    <td className="px-6 py-4 text-slate-500">{row.rol}</td>
                    <td className="px-6 py-4 text-slate-500">{row.email}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-4 py-1 rounded-full text-xs font-bold border ${row.estado ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                        {row.estado ? 'Habilitado' : 'Deshabilitado'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right relative">
                      <button onClick={(e: any) => { e.stopPropagation(); setOpenMenuIndex(openMenuIndex===i?null:i); }}
                        className={`p-2 rounded-full transition-colors ${openMenuIndex===i ? 'bg-blue-50 text-blue-500' : 'text-slate-300 hover:text-blue-500 hover:bg-slate-50'}`}>
                        <MoreVertical size={20}/>
                      </button>
                      {openMenuIndex===i && (
                        <div ref={menuRef} className="absolute right-10 top-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden font-bold">
                          <div className="flex flex-col py-1">
                            <button onClick={() => handleOpenModal('view', row)} className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 text-left"><Eye size={14}/> Ver detalles</button>
                            <button onClick={() => handleOpenModal('edit', row)} className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 text-left"><Edit size={14}/> Editar</button>
                            <button onClick={() => handleOpenModal('duplicate', row)} className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 text-left"><Copy size={14}/> Duplicar</button>
                            <div className="h-px bg-slate-100 my-1"></div>
                            <button onClick={() => { setSelectedItem(row); setIsStatusModalOpen(true); setOpenMenuIndex(null); }}
                              className={`flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-slate-50 text-left ${row.estado ? 'text-red-500' : 'text-emerald-500'}`}>
                              {row.estado ? <Ban size={14}/> : <CheckCircle size={14}/>}
                              {row.estado ? 'Deshabilitar' : 'Habilitar'}
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
          <div className="p-4 flex justify-between items-center text-xs text-slate-400 border-t border-slate-50 font-medium">
            <span>Mostrando {usersData.length} de {totalRecords} registros</span>
            <div className="flex items-center gap-3 text-blue-500">
              <button onClick={()=>setCurrentPage(1)} disabled={currentPage===1} className="hover:text-blue-700 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronsLeft size={16}/></button>
              <button onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1} className="hover:text-blue-700 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronLeft size={16}/></button>
              <span className="bg-blue-50 px-3 py-1 rounded text-blue-600 font-bold">Pág. {currentPage} de {totalPages||1}</span>
              <button onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={currentPage===totalPages||totalPages===0} className="hover:text-blue-700 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronRight size={16}/></button>
              <button onClick={()=>setCurrentPage(totalPages)} disabled={currentPage===totalPages||totalPages===0} className="hover:text-blue-700 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronsRight size={16}/></button>
            </div>
          </div>
        </div>

        {/* ══ MODAL (full-page) ══ */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleCancelClick}/>
            <div className="relative bg-white w-full max-w-6xl rounded-[28px] px-10 py-10 shadow-xl max-h-[95vh] overflow-y-auto"
              style={{ fontFamily:"'Inter',sans-serif", scrollbarWidth:'none' }}>

              {/* Encabezado */}
              <div className="flex items-center mb-8">
                <button onClick={handleCancelClick} className="mr-4 text-blue-500 font-bold hover:underline flex items-center gap-1">
                  <ChevronLeft size={20}/> Volver
                </button>
                <h2 className="text-3xl font-bold text-blue-500 flex-1">{getTitle()}</h2>
              </div>

              {/* Foto de perfil */}
              <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 mb-8 flex flex-col md:flex-row items-center gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-300 overflow-hidden">
                    {formData.fotoUrl ? <img src={formData.fotoUrl} alt="Perfil" className="w-full h-full object-cover"/> : <User size={40}/>}
                  </div>
                  {modalMode !== 'view' && (
                    <div>
                      <h3 className="text-lg font-bold text-blue-500 mb-2">Foto de perfil</h3>
                      <div className="flex gap-3">
                        <input type="file" accept=".jpg,.jpeg,.png" className="hidden" ref={fileInputRef} onChange={handleFileChange}/>
                        <button onClick={()=>fileInputRef.current?.click()} className="px-4 py-2 rounded-full border border-blue-200 text-blue-500 text-sm font-bold hover:bg-blue-50 flex items-center gap-2">
                          Subir foto <Upload size={16}/>
                        </button>
                        <button onClick={removePhoto} className="px-4 py-2 rounded-full text-slate-400 text-sm font-bold hover:text-red-500 flex items-center gap-2">
                          Eliminar <Trash2 size={16}/>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {modalMode !== 'view' && (
                  <>
                    <div className="h-12 w-px bg-slate-200 hidden md:block mx-4"></div>
                    <div className="text-sm text-slate-400">
                      <p className="font-bold text-slate-500 mb-1">Requisitos de imagen:</p>
                      <p>Mín. 400 x 400 píxeles | Máx. 4MB (JPG/PNG)</p>
                      <p className="mt-1">Su cara o logotipo</p>
                    </div>
                  </>
                )}
              </div>

              {/* ── Detalles del usuario ── */}
              <h3 className="text-lg font-bold text-slate-700 mb-5">Detalles del usuario</h3>

              {/* Fila 1: Nombre, Apellido, Empresa, Cargo */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
                <UNotchInput id="nombre" label="Nombre" required value={formData.nombre} disabled={modalMode==='view'}
                  onChange={v=>setFormData((p:any)=>({...p,nombre:v}))}/>
                <UNotchInput id="apellido" label="Apellido" required value={formData.apellido} disabled={modalMode==='view'}
                  onChange={v=>setFormData((p:any)=>({...p,apellido:v}))}/>
                {/* Empresa — opciones exactas del documento */}
                <UNotchSelect id="empresa" label="Empresa" required value={formData.empresa} disabled={modalMode==='view'}
                  onChange={v=>setFormData((p:any)=>({...p,empresa:v}))}
                  options={[
                    { value:'VIU',  label:'Clínica Oftalmológica Internacional SAS (VIU)' },
                    { value:'FOCA', label:'Fundacion Oftalmologica Del Caribe (FOCA)' },
                    { value:'ESCAF',label:'Inversiones Medicas Escaf Sales SAS' },
                  ]}
                />
                <UNotchSelect id="cargo" label="Cargo" required value={formData.cargo} disabled={modalMode==='view'}
                  onChange={v=>{
                    const autoRol = CARGO_ROL_MAP[v] || formData.rol;
                    setFormData((p:any)=>({...p,cargo:v,rol:autoRol}));
                  }}
                  options={[
                    { value:'Administrador General', label:'Administrador General' },
                    { value:'Coordinador SST',       label:'Coordinador SST' },
                    { value:'Enfermera Jefe',        label:'Enfermera Jefe' },
                    { value:'Auxiliar',              label:'Auxiliar' },
                  ]}
                />
              </div>

              {/* Fila 2: Contraseña, Correo, Rol, Código de verificación */}
              {/* ← campo "Usuario Login" eliminado según documento */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
                {/* Contraseña con toggle */}
                <div style={{ position:'relative' }}>
                  <UNotchInput id="password" label="Contraseña" required={modalMode!=='edit'}
                    value={formData.password} disabled={modalMode==='view'}
                    onChange={v=>setFormData((p:any)=>({...p,password:v}))}
                    type={showPassword ? 'text' : 'password'}
                  />
                  <button onClick={()=>setShowPassword(!showPassword)}
                    style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#94a3b8', display:'flex', alignItems:'center' }}>
                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
                <UNotchInput id="email" label="Correo electrónico" required value={formData.email} disabled={modalMode==='view'}
                  onChange={v=>setFormData((p:any)=>({...p,email:v}))}/>
                {/* Rol — se auto-completa con Cargo, pero editable */}
                <UNotchSelect id="rol" label="Rol" required value={formData.rol} disabled={modalMode==='view'}
                  onChange={v=>setFormData((p:any)=>({...p,rol:v}))}
                  options={[
                    { value:'Administrador', label:'Administrador' },
                    { value:'Supervisor',    label:'Supervisor'    },
                    { value:'Operario',      label:'Operario'      },
                  ]}
                />
                {/* Código de verificación — generado automáticamente */}
                <UNotchInput id="codigoVerificacion" label="Código de verificación"
                  value={modalMode==='create' ? 'Generado automático' : (formData.codigoVerificacion || '—')}
                  disabled onChange={()=>{}}/>
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6 mb-8 ml-1">
                <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer font-medium">
                  <input name="esPropietario" checked={formData.esPropietario} onChange={handleInputChange}
                    disabled={modalMode==='view'} type="checkbox"
                    className="w-4 h-4 text-blue-500 rounded border-gray-300 cursor-pointer"/>
                  Propietario del instrumentos
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer font-medium">
                  <input name="registroContable" checked={formData.registroContable || false} onChange={handleInputChange}
                    disabled={modalMode==='view'} type="checkbox"
                    className="w-4 h-4 text-blue-500 rounded border-gray-300 cursor-pointer"/>
                  Registro Contable
                </label>
              </div>

              {/* ── Roles y permisos — acordeón limpio ── */}
              <h3 className="text-lg font-bold text-slate-700 mb-4">Roles y permisos</h3>
              <div className="rounded-2xl border border-slate-200 overflow-hidden mb-8 divide-y divide-slate-100">
                {estructuraPermisos.map((mod: any) => {
                  const isExpanded = expandedModules.has(mod.id);
                  const isParent   = mod.type === 'parent';
                  return (
                    <React.Fragment key={mod.id}>
                      {/* ── Fila módulo: checkbox + nombre azul + chevron ── */}
                      <div className="flex items-center gap-3 px-5 py-3.5 bg-white hover:bg-slate-50/60 transition-colors">
                        <input
                          type="checkbox"
                          checked={!!selectedModules[mod.id]}
                          onChange={() => isParent ? toggleParentSelection(mod) : toggleSelection(mod.id)}
                          disabled={modalMode === 'view'}
                          className="w-4 h-4 rounded border-slate-300 text-blue-500 cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
                        />
                        <span className="flex-1 text-sm font-semibold text-blue-500">{mod.label}</span>
                        {/* Chevron solo en módulos padre */}
                        {isParent && (
                          <button
                            onClick={() => toggleExpand(mod.id)}
                            className="text-blue-400 hover:text-blue-600 transition-colors p-1"
                          >
                            {isExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                          </button>
                        )}
                      </div>

                      {/* ── Submódulos expandidos con tabla de permisos ── */}
                      {isParent && isExpanded && (
                        <div className="bg-slate-50/50">
                          {/* Cabecera de columnas de permisos */}
                          <div className="grid text-xs font-bold text-slate-400 uppercase px-5 py-2 border-b border-slate-100"
                            style={{ gridTemplateColumns: '1fr 80px 80px 80px 80px 80px' }}>
                            <span className="pl-10">Submódulo</span>
                            <span className="text-center">Ver</span>
                            <span className="text-center">Crear</span>
                            <span className="text-center">Editar</span>
                            <span className="text-center">Estados</span>
                            <span className="text-center">Descargar</span>
                          </div>
                          {mod.subModules.map((sub: any) => (
                            <div key={sub.id}
                              className="grid items-center px-5 py-2.5 border-b border-slate-100 last:border-b-0 hover:bg-white/70 transition-colors"
                              style={{ gridTemplateColumns: '1fr 80px 80px 80px 80px 80px' }}>
                              {/* Nombre submódulo */}
                              <div className="flex items-center gap-2 pl-6 border-l-4 border-blue-100">
                                <input type="checkbox" checked={!!selectedModules[sub.id]}
                                  onChange={() => toggleSelection(sub.id)}
                                  disabled={modalMode === 'view'}
                                  className="w-4 h-4 rounded border-slate-300 text-blue-500 cursor-pointer disabled:cursor-not-allowed"/>
                                <span className="text-sm text-slate-500">{sub.label}</span>
                              </div>
                              {/* Celdas de permisos */}
                              <div className="flex justify-center">{renderPermCell(sub.id,'ver')}</div>
                              <div className="flex justify-center">{renderPermCell(sub.id,'crear')}</div>
                              <div className="flex justify-center">{renderPermCell(sub.id,'editar')}</div>
                              <div className="flex justify-center">{renderPermCell(sub.id,'habilitar')}</div>
                              <div className="flex justify-center">{renderPermCell(sub.id,'descargar')}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Botones finales */}
              {modalMode !== 'view' ? (
                <div className="flex justify-center gap-10">
                  <button className="u-cancel-btn" onClick={handleCancelClick}>Cancelar</button>
                  <button className="u-save-btn" onClick={handleSave}>{modalMode==='edit' ? 'Actualizar' : 'Guardar'}</button>
                </div>
              ) : (
                <div className="flex justify-center">
                  <button onClick={()=>setIsModalOpen(false)} className="px-12 py-3 rounded-full bg-slate-200 text-slate-600 font-bold hover:bg-slate-300 transition-colors">Cerrar</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ ALERTA CANCELAR ══ */}
        {isCancelAlertOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"/>
            <div className="relative bg-white w-full max-w-[380px] rounded-[30px] p-8 text-center shadow-2xl font-sans">
              <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-3xl">!</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">¿Está seguro?</h3>
              <p className="text-slate-500 text-sm mb-8">La información diligenciada no se guardará en el sistema.</p>
              <div className="flex gap-3">
                <button onClick={()=>setIsCancelAlertOpen(false)} className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-600 font-bold text-sm">Cancelar</button>
                <button onClick={()=>{setIsCancelAlertOpen(false);setIsModalOpen(false);}} className="flex-1 py-2.5 rounded-full bg-blue-500 text-white font-bold text-sm">Aceptar</button>
              </div>
            </div>
          </div>
        )}

        {/* ══ ALERTA ÉXITO ══ */}
        {isSuccessOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={()=>setIsSuccessOpen(false)}/>
            <div className="relative bg-white w-full max-w-[380px] rounded-[30px] p-8 text-center shadow-2xl font-sans">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={32}/></div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Éxito</h3>
              <p className="text-slate-500 text-sm mb-8">{successMsg}</p>
              <button onClick={()=>setIsSuccessOpen(false)} className="w-full py-2.5 rounded-full bg-emerald-500 text-white font-bold text-sm">Aceptar</button>
            </div>
          </div>
        )}

        {/* ══ ALERTA ERROR ══ */}
        {isErrorOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center font-sans">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={()=>setIsErrorOpen(false)}/>
            <div className="relative bg-white w-full max-w-[400px] rounded-[30px] p-8 text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><X size={32}/></div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Error / Aviso</h3>
              <p className="text-slate-500 text-sm mb-8">{errorMsg}</p>
              <button onClick={()=>setIsErrorOpen(false)} className="w-full py-2.5 rounded-full bg-red-500 text-white font-bold text-sm">Aceptar</button>
            </div>
          </div>
        )}

        {/* ══ MODAL ESTADO ══ */}
        {isStatusModalOpen && selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 font-sans">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={()=>setIsStatusModalOpen(false)}/>
            <div className="relative bg-white w-full max-w-[400px] rounded-[30px] p-8 shadow-2xl flex flex-col items-center text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm ${selectedItem.estado ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                {selectedItem.estado ? <Ban size={40} strokeWidth={1.5}/> : <CheckCircle size={40} strokeWidth={1.5}/>}
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 mb-2">{selectedItem.estado ? 'Deshabilitar' : 'Habilitar'}</h2>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed px-4 font-medium">
                ¿Estás seguro de que deseas {selectedItem.estado ? 'deshabilitar' : 'habilitar'} al usuario{' '}
                <span className="font-bold text-slate-700">{selectedItem.nombre} {selectedItem.apellido}</span>?
              </p>
              <div className="flex gap-3 w-full">
                <button onClick={()=>setIsStatusModalOpen(false)} className="flex-1 py-3 rounded-full border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-sm">Cancelar</button>
                <button onClick={confirmToggleStatus}
                  className={`flex-1 py-3 rounded-full text-white font-bold shadow-lg text-sm bg-gradient-to-r ${selectedItem.estado ? 'from-red-500 to-rose-400' : 'from-blue-500 to-emerald-400'}`}>
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
   UNotchInput — label flotante (sube/baja)
   ══════════════════════════════════════════════ */
interface UNotchInputProps {
  id: string; label: string; value: string;
  disabled?: boolean; required?: boolean; type?: string;
  onChange: (value: string) => void;
}
const UNotchInput: React.FC<UNotchInputProps> = ({
  id, label, value, disabled=false, required=false, type='text', onChange
}) => {
  const [focused, setFocused] = useState(false);
  const active  = focused || value.length > 0;
  const bgColor = disabled ? '#f8fafc' : '#fff';
  return (
    <div style={{ position:'relative' }}>
      <input id={id} type={type} value={value} disabled={disabled} placeholder=""
        onChange={e=>onChange(e.target.value)}
        onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
        style={{
          width:'100%', height:48, borderRadius:30,
          border:`1.5px solid ${focused?'#3b82f6':'#d1d5db'}`,
          background:bgColor, padding:active?'14px 16px 0 16px':'0 16px',
          fontSize:13.5, color:disabled?'#94a3b8':'#334155',
          outline:'none', boxSizing:'border-box',
          transition:'border-color .2s, padding .18s',
          fontFamily:'Inter,sans-serif',
          cursor:disabled?'not-allowed':'text',
        } as React.CSSProperties}
      />
      <label htmlFor={id} style={{
        position:'absolute', left:18, top:active?0:'50%',
        transform:'translateY(-50%)', fontSize:active?10.5:13,
        color:focused?'#3b82f6':(active?'#6b7280':'#9ca3af'),
        pointerEvents:'none', transition:'all .18s ease',
        background:bgColor, padding:'0 4px',
        fontFamily:'Inter,sans-serif', whiteSpace:'nowrap',
      }}>
        {label}{required&&<span style={{color:'#ef4444',marginLeft:1}}>*</span>}
      </label>
    </div>
  );
};

/* ══════════════════════════════════════════════
   UNotchSelect — label SIEMPRE en borde superior
   ══════════════════════════════════════════════ */
interface UNotchSelectProps {
  id: string; label: string; value: string;
  disabled?: boolean; required?: boolean; compact?: boolean;
  onChange: (value: string) => void;
  options: { value: string|number; label: string }[];
}
const UNotchSelect: React.FC<UNotchSelectProps> = ({
  id, label, value, disabled=false, required=false, compact=false, onChange, options
}) => {
  const [focused, setFocused] = useState(false);
  const bgColor = disabled?'#f8fafc':(compact?(focused?'#fff':'#f8fafc'):'#fff');
  return (
    <div style={{ position:'relative' }}>
      <select id={id} value={value} disabled={disabled}
        onChange={e=>onChange(e.target.value)}
        onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
        style={{
          width:'100%', height:compact?42:48, borderRadius:30,
          border:`1.5px solid ${focused?'#3b82f6':'#d1d5db'}`,
          background:bgColor, padding:compact?'10px 36px 0 16px':'14px 36px 0 16px',
          fontSize:compact?13:13.5,
          color:value===''?'#9ca3af':(disabled?'#94a3b8':'#334155'),
          outline:'none', appearance:'none' as const,
          boxSizing:'border-box' as const, transition:'border-color .2s',
          fontFamily:'Inter,sans-serif', cursor:disabled?'not-allowed':'pointer',
        }}>
        <option value="" style={{color:'#9ca3af'}}>Seleccionar...</option>
        {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <label htmlFor={id} style={{
        position:'absolute', left:18, top:0, transform:'translateY(-50%)', fontSize:10.5,
        color:focused?'#3b82f6':'#6b7280', pointerEvents:'none', background:bgColor,
        padding:'0 4px', fontFamily:'Inter,sans-serif', whiteSpace:'nowrap', transition:'color .18s',
      }}>
        {label}{required&&<span style={{color:'#ef4444',marginLeft:1}}>*</span>}
      </label>
      <ChevronDown size={15} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'#9ca3af' }}/>
    </div>
  );
};

export default UsuariosScreen;