import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, PlusCircle, ChevronDown, ChevronUp, X, 
  Eye, Edit, Copy, CheckCircle, Ban, MoreVertical, 
  Upload, User, Trash2, EyeOff 
} from 'lucide-react';

const UsuariosScreen: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [modalMode, setModalMode] = useState<any>('create'); // 'create', 'view', 'edit', 'duplicate'
  const [showPassword, setShowPassword] = useState<any>(false);
  const [selectedModules, setSelectedModules] = useState<any>({});
  
  // Estado para el menú flotante
  const [openMenuIndex, setOpenMenuIndex] = useState<any>(null);
  const menuRef = useRef(null);

  // Datos simulados tabla principal
  const [usersData, setUsersData] = useState<any>([
    { id: 1, nombre: 'Juan Pablo C.', cargo: 'Coordinador SST', rol: 'Administrador', correo: 'juan@sena.edu.co', status: 'Habilitado' },
    { id: 2, nombre: 'Maria L.', cargo: 'Enfermera Jefe', rol: 'Operario', correo: 'maria@sena.edu.co', status: 'Habilitado' },
    { id: 3, nombre: 'Carlos R.', cargo: 'Auxiliar', rol: 'Operario', correo: 'carlos@sena.edu.co', status: 'Deshabilitado' },
  ]);

  // ESTRUCTURA DE PERMISOS
  const estructuraPermisos = [
    { id: 'dashboard', label: 'Dashboard', type: 'simple' },
    { 
      id: 'ciclo', 
      label: 'Ciclo de esterilización', 
      type: 'parent',
      subModules: [
        { id: 'trazabilidad_qx', label: 'Trazabilidad Qx' },
        { id: 'instrumentos_qx', label: 'Instrumentos Qx' },
        { id: 'insumos_qx', label: 'Insumos Qx' },
        { id: 'historico_ciclo', label: 'Historico de ciclo' }
      ]
    },
    { id: 'reporte', label: 'Reporte', type: 'simple' },
    { id: 'hojas', label: 'Hojas de vida', type: 'simple' },
    { id: 'informes', label: 'Informes', type: 'simple' },
    { 
      id: 'config', 
      label: 'Configuración', 
      type: 'parent',
      subModules: [
        { id: 'tm_esterilizacion', label: 'TM Esterilización' },
        { id: 'tm_instrumentos', label: 'TM Instrumentos Qx' },
        { id: 'tm_kits', label: 'TMKITs' },
        { id: 'tm_proveedores', label: 'TM Proveedores' },
        { id: 'tm_especialidades', label: 'TM Especialidades' },
        { id: 'tm_sedes', label: 'TM Sedes' },
        { id: 'tm_usuario', label: 'TM Usuario' }
      ]
    },
  ];

  // --- LÓGICA DEL MENÚ FLOTANTE ---
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (index, e) => {
    e.stopPropagation();
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  // --- HANDLERS DE ACCIONES ---
  const handleOpenModal = (mode, user = null) => {
    setModalMode(mode);
    setIsModalOpen(true);
    setOpenMenuIndex(null);
    // Aquí podrías cargar los datos del usuario seleccionado en el formulario
    if (mode === 'create') {
        setSelectedModules({});
    } else {
        // Simulación: Preseleccionar algunos módulos al editar/ver/duplicar
        setSelectedModules({ 'dashboard': true, 'ciclo': true, 'trazabilidad_qx': true });
    }
  };

  const handleToggleStatus = (id) => {
    setUsersData(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'Habilitado' ? 'Deshabilitado' : 'Habilitado' };
      }
      return u;
    }));
    setOpenMenuIndex(null);
  };

  // --- MANEJO DE PERMISOS ---
  const toggleSelection = (key) => {
    // Si estamos en modo ver, no permitir cambios
    if (modalMode === 'view') return;

    setSelectedModules(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderPermissionCell = (rowKey, colType) => {
    const isActive = selectedModules[rowKey];
    const isReadOnly = modalMode === 'view';

    // Lógica especial para Dashboard
    if (rowKey === 'dashboard') {
      if (colType !== 'ver' && colType !== 'descargar') {
        return <span className="text-slate-300">-</span>;
      }
    }

    return (
      <input 
        type="checkbox" 
        disabled={!isActive || isReadOnly}
        className={`w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-200 transition-all
          ${(!isActive || isReadOnly) ? 'opacity-50 cursor-not-allowed bg-slate-100' : 'cursor-pointer'}
        `}
      />
    );
  };

  // Título del modal dinámico
  const getModalTitle: React.FC = () => {
      switch(modalMode) {
          case 'view': return 'Detalles del usuario';
          case 'edit': return 'Editar usuario';
          case 'duplicate': return 'Duplicar usuario';
          default: return 'Crear usuario';
      }
  };

  return (
    <div className="space-y-6 h-full flex flex-col font-sans relative" onClick={() => setOpenMenuIndex(null)}>
      
      {/* TÍTULO */}
      <h1 className="text-3xl font-bold text-blue-500">Usuarios</h1>
      
      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-2 rounded-xl">
        <div className="flex gap-4 flex-1 w-full md:w-auto">
           <button className="flex items-center justify-between gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-500 text-sm font-medium w-40">
              <span>Estado</span><ChevronDown size={16} />
           </button>
           <div className="relative flex-1 max-w-3xl">
              <input type="text" placeholder="Buscar usuario..." className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-5 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-100"/>
              <Search className="absolute right-4 top-2.5 text-blue-400" size={18} />
           </div>
        </div>
        
        <button 
            onClick={() => handleOpenModal('create')}
            className="flex items-center gap-2 text-blue-500 font-medium text-sm hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
        >
            Crear usuario <PlusCircle size={18} />
        </button>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden flex-1 flex flex-col overflow-visible">
        <table className="w-full text-sm text-left">
            <thead className="bg-slate-100/50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Cargo</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Correo</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-4 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {usersData.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-500 font-bold">{row.nombre}</td>
                  <td className="px-6 py-4 text-slate-500">{row.cargo}</td>
                  <td className="px-6 py-4 text-slate-500">{row.rol}</td>
                  <td className="px-6 py-4 text-slate-500">{row.correo}</td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold border ${
                        row.status === 'Habilitado' 
                        ? 'bg-emerald-50 text-emerald-500 border-emerald-100' 
                        : 'bg-red-50 text-red-500 border-red-100'
                    }`}>
                        {row.status}
                    </span>
                  </td>
                  
                  {/* MENÚ DE ACCIONES */}
                  <td className="px-4 py-4 text-right relative">
                    <button 
                        onClick={(e: any) => toggleMenu(i, e)}
                        className={`p-2 rounded-full transition-colors ${openMenuIndex === i ? 'bg-blue-50 text-blue-500' : 'text-slate-300 hover:text-blue-500 hover:bg-slate-50'}`}
                    >
                        <MoreVertical size={20} />
                    </button>

                    {openMenuIndex === i && (
                        <div ref={menuRef} className="absolute right-10 top-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden text-left">
                            <div className="flex flex-col py-1">
                                <button onClick={() => handleOpenModal('view', row)} className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors font-medium">
                                    <Eye size={14} /> Ver detalles
                                </button>
                                <button onClick={() => handleOpenModal('edit', row)} className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors font-medium">
                                    <Edit size={14} /> Editar
                                </button>
                                <button onClick={() => handleOpenModal('duplicate', row)} className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors font-medium">
                                    <Copy size={14} /> Duplicar
                                </button>
                                <div className="h-px bg-slate-100 my-1"></div>
                                <button 
                                    onClick={() => handleToggleStatus(row.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-slate-50 transition-colors font-medium ${row.status === 'Habilitado' ? 'text-red-500' : 'text-emerald-500'}`}
                                >
                                    {row.status === 'Habilitado' ? <Ban size={14} /> : <CheckCircle size={14} />} 
                                    {row.status === 'Habilitado' ? 'Deshabilitar' : 'Habilitar'}
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

      {/* ======================================================= */}
      {/* MODAL UNIVERSAL (CREAR, VER, EDITAR, DUPLICAR) */}
      {/* ======================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
            
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={() => setIsModalOpen(false)}
            />

            {/* Contenedor Modal */}
            <div className="relative bg-white w-full max-w-6xl rounded-[28px] px-10 py-10 shadow-xl animate-in fade-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto hide-scrollbar">

                {/* Header */}
                <div className="flex items-center mb-8">
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="mr-4 text-blue-500 font-bold hover:underline flex items-center gap-1"
                    >
                        <ChevronDown className="rotate-90" size={20}/> Volver
                    </button>
                    <h2 className="text-3xl font-bold text-blue-500 flex-1">
                        {getModalTitle()}
                    </h2>
                </div>

                {/* SECCIÓN 1: FOTO */}
                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 mb-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-300">
                            <User size={40} />
                        </div>
                        {modalMode !== 'view' && (
                            <div>
                                <h3 className="text-lg font-bold text-blue-500 mb-2">Foto de perfil</h3>
                                <div className="flex gap-3">
                                    <button className="px-4 py-2 rounded-full border border-blue-200 text-blue-500 text-sm font-bold hover:bg-blue-50 flex items-center gap-2">
                                        Subir foto <Upload size={16}/>
                                    </button>
                                    <button className="px-4 py-2 rounded-full text-slate-400 text-sm font-bold hover:text-red-500 flex items-center gap-2">
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
                                <p>Mín. 400 x 400 píxeles | Máx. 2MB</p>
                                <p>Su cara o logotipo</p>
                            </div>
                        </>
                    )}
                </div>

                {/* SECCIÓN 2: DETALLES */}
                <h3 className="text-lg font-bold text-slate-700 mb-4 ml-1">Detalles del usuario</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div>
                        <label className="text-xs font-bold text-slate-500 ml-2">Nombre*</label>
                        <input disabled={modalMode === 'view'} type="text" className={`mt-1 w-full bg-slate-50 border border-slate-200 rounded-full px-5 py-2.5 text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 ${modalMode === 'view' ? 'cursor-not-allowed bg-slate-100' : ''}`} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 ml-2">Apellido*</label>
                        <input disabled={modalMode === 'view'} type="text" className={`mt-1 w-full bg-slate-50 border border-slate-200 rounded-full px-5 py-2.5 text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 ${modalMode === 'view' ? 'cursor-not-allowed bg-slate-100' : ''}`} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 ml-2">Empresa*</label>
                        <div className="relative mt-1">
                            <select disabled={modalMode === 'view'} className={`w-full bg-slate-50 border border-slate-200 rounded-full px-5 py-2.5 appearance-none text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer ${modalMode === 'view' ? 'cursor-not-allowed bg-slate-100' : ''}`}>
                                <option>Seleccionar...</option>
                                <option>Clínica Central</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-3 text-slate-400 pointer-events-none" size={16}/>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 ml-2">Cargo*</label>
                        <div className="relative mt-1">
                            <select disabled={modalMode === 'view'} className={`w-full bg-slate-50 border border-slate-200 rounded-full px-5 py-2.5 appearance-none text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer ${modalMode === 'view' ? 'cursor-not-allowed bg-slate-100' : ''}`}>
                                <option>Seleccionar...</option>
                                <option>Enfermera Jefe</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-3 text-slate-400 pointer-events-none" size={16}/>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 ml-2">Usuario*</label>
                        <input disabled={modalMode === 'view'} type="text" className={`mt-1 w-full bg-slate-50 border border-slate-200 rounded-full px-5 py-2.5 text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 ${modalMode === 'view' ? 'cursor-not-allowed bg-slate-100' : ''}`} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 ml-2">Contraseña*</label>
                        <div className="relative mt-1">
                             <input disabled={modalMode === 'view'} type={showPassword ? "text" : "password"} className={`w-full bg-slate-50 border border-slate-200 rounded-full px-5 py-2.5 pr-10 text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 ${modalMode === 'view' ? 'cursor-not-allowed bg-slate-100' : ''}`} />
                             <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-400 hover:text-blue-500">
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                             </button>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 ml-2">Correo electrónico*</label>
                        <input disabled={modalMode === 'view'} type="email" className={`mt-1 w-full bg-slate-50 border border-slate-200 rounded-full px-5 py-2.5 text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 ${modalMode === 'view' ? 'cursor-not-allowed bg-slate-100' : ''}`} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 ml-2">Rol*</label>
                        <div className="relative mt-1">
                            <select disabled={modalMode === 'view'} className={`w-full bg-slate-50 border border-slate-200 rounded-full px-5 py-2.5 appearance-none text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer text-sm ${modalMode === 'view' ? 'cursor-not-allowed bg-slate-100' : ''}`}>
                                <option>Admin</option>
                                <option>Operario</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-3 text-slate-400 pointer-events-none" size={16}/>
                        </div>
                    </div>
                    <div className="relative">
                        <label className="text-xs font-bold text-slate-500 ml-2">Código de verificación</label>
                        <input type="text" value="9365" readOnly className="mt-1 w-full bg-slate-100 border border-slate-200 rounded-full px-5 py-2.5 text-slate-400 outline-none cursor-not-allowed" />
                    </div>
                </div>
                
                <div className="flex items-center gap-2 mb-8 ml-2">
                    <input disabled={modalMode === 'view'} type="checkbox" id="propietario" className="w-4 h-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"/>
                    <label htmlFor="propietario" className="text-sm text-slate-500">Propietario del instrumentos</label>
                </div>

                {/* SECCIÓN 3: ROLES Y PERMISOS (MISMA ESTRUCTURA) */}
                <h3 className="text-lg font-bold text-slate-700 mb-4 ml-1">Roles y permisos</h3>
                <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden mb-8 transition-all">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-blue-500 uppercase bg-blue-50/50 border-b border-blue-100">
                            <tr>
                                <th className="px-6 py-3 font-bold">Módulo</th>
                                <th className="px-6 py-3 text-center font-bold">Ver</th>
                                <th className="px-6 py-3 text-center font-bold">Crear</th>
                                <th className="px-6 py-3 text-center font-bold">Editar</th>
                                <th className="px-6 py-3 text-center font-bold">Gestionar Estados</th>
                                <th className="px-6 py-3 text-center font-bold">Descargar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {estructuraPermisos.map((modulo) => (
                                <React.Fragment key={modulo.id}>
                                    <tr className={`hover:bg-slate-50 transition-colors ${modulo.type === 'parent' ? 'bg-slate-50/80' : 'bg-white'}`}>
                                        <td className="px-6 py-4 font-medium text-slate-600">
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-3">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={!!selectedModules[modulo.id]}
                                                        onChange={() => toggleSelection(modulo.id)}
                                                        disabled={modalMode === 'view'}
                                                        className={`w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-200 ${modalMode === 'view' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                                    />
                                                    <span className={modulo.type === 'parent' ? 'font-bold text-slate-700' : ''}>
                                                    {modulo.label}
                                                    </span>
                                                </div>
                                                {modulo.type === 'parent' && selectedModules[modulo.id] && (
                                                    <div className="text-blue-500"><ChevronUp size={18} /></div>
                                                )}
                                            </div>
                                        </td>
                                        {modulo.type === 'parent' ? (
                                            <td colSpan="5" className="px-6 py-4 text-center text-xs text-slate-400 italic"></td>
                                        ) : (
                                            <>
                                                <td className="px-6 py-4 text-center">{renderPermissionCell(modulo.id, 'ver')}</td>
                                                <td className="px-6 py-4 text-center">{renderPermissionCell(modulo.id, 'crear')}</td>
                                                <td className="px-6 py-4 text-center">{renderPermissionCell(modulo.id, 'editar')}</td>
                                                <td className="px-6 py-4 text-center">{renderPermissionCell(modulo.id, 'habilitar')}</td>
                                                <td className="px-6 py-4 text-center">{renderPermissionCell(modulo.id, 'descargar')}</td>
                                            </>
                                        )}
                                    </tr>

                                    {modulo.type === 'parent' && selectedModules[modulo.id] && modulo.subModules.map((sub) => (
                                        <tr key={sub.id} className="bg-slate-50/30 animate-in slide-in-from-top-2 duration-200">
                                            <td className="px-6 py-3 pl-16 text-sm text-slate-500 flex items-center gap-2 border-l-4 border-blue-50">
                                                <input 
                                                    type="checkbox" 
                                                    checked={!!selectedModules[sub.id]}
                                                    onChange={() => toggleSelection(sub.id)}
                                                    disabled={modalMode === 'view'}
                                                    className={`w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-200 ${modalMode === 'view' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                                />
                                                {sub.label}
                                            </td>
                                            <td className="px-6 py-3 text-center">{renderPermissionCell(sub.id, 'ver')}</td>
                                            <td className="px-6 py-3 text-center">{renderPermissionCell(sub.id, 'crear')}</td>
                                            <td className="px-6 py-3 text-center">{renderPermissionCell(sub.id, 'editar')}</td>
                                            <td className="px-6 py-3 text-center">{renderPermissionCell(sub.id, 'habilitar')}</td>
                                            <td className="px-6 py-3 text-center">{renderPermissionCell(sub.id, 'descargar')}</td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* BOTONES (Solo se muestran si NO es vista 'view') */}
                {modalMode !== 'view' ? (
                    <div className="flex justify-center gap-10">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="text-slate-500 font-bold hover:text-slate-700 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button className="px-12 py-3 rounded-full text-white font-bold bg-gradient-to-r from-blue-500 to-emerald-400 hover:opacity-90 shadow-lg shadow-blue-200 transition-transform active:scale-95">
                            {modalMode === 'edit' ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-center">
                         <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-12 py-3 rounded-full bg-slate-200 text-slate-600 font-bold hover:bg-slate-300 transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                )}

            </div>
        </div>
      )}

    </div>
  );
};

export default UsuariosScreen;