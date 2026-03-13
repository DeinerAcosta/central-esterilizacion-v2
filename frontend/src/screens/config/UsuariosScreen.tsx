import React, { useState, useEffect, useRef } from 'react';
import {
  Search, PlusCircle, ChevronDown, ChevronUp, X,
  Eye, Edit, Copy, CheckCircle, Ban, MoreVertical,
  User, EyeOff, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight
} from 'lucide-react';
import Swal from 'sweetalert2';

const CARGO_ROL_MAP: Record<string, string> = {
  'Administrador General': 'Administrador',
  'Coordinador SST':       'Supervisor',
  'Enfermera Jefe':        'Supervisor',
  'Auxiliar':              'Operario',
};

/* ═══════════════════════════════════════════
   ESTRUCTURA DE PERMISOS
   ═══════════════════════════════════════════ */
const PERMISOS_ESTRUCTURA: any[] = [
  {
    id: 'modulos', label: 'Módulos', type: 'top',
    children: [
      {
        id: 'dashboard', label: 'Dashboard', type: 'leaf',
        permisos: [{ key: 'ver', label: 'Ver' }]
      },
      {
        id: 'ciclo', label: 'Ciclo de esterilización', type: 'sub_accordion',
        children: [
          { id: 'c_asignaciones', label: 'Asignaciones', permisos: [
            { key: 'ver', label: 'Ver' }, { key: 'aprobar', label: 'Aprobar Asignaciones' }
          ]},
          { id: 'c_ciclos', label: 'Ciclos', permisos: [
            { key: 'ver', label: 'Ver' }, { key: 'detalle', label: 'Detalle trazabilidad' }
          ]},
          { id: 'c_instr_qx', label: 'Instrumentos Qx', permisos: [
            { key: 'ver', label: 'Ver' }, { key: 'recepcion', label: 'Recepción' },
            { key: 'lavado', label: 'Lavado' }, { key: 'secado', label: 'Secado' },
            { key: 'sellado', label: 'Sellado' }, { key: 'rotulado', label: 'Rotulado' },
            { key: 'esterilizado', label: 'Esterilizado' }, { key: 'reportar', label: 'Reportar' }
          ]},
          { id: 'c_insumos_qx', label: 'Insumos QX', permisos: [
            { key: 'ver', label: 'Ver' }, { key: 'sellado_rot', label: 'Sellado y rotulado' },
            { key: 'esterilizado2', label: 'Esterilizado' }
          ]},
          { id: 'c_historico', label: 'Histórico ciclo', permisos: [{ key: 'ver', label: 'Ver' }]},
          { id: 'c_almacen', label: 'Almacenamiento', permisos: [
            { key: 'ver', label: 'Ver' }, { key: 'enviar', label: 'Enviar' },
            { key: 'ver_detalle', label: 'Ver detalle' }
          ]},
          { id: 'c_hist_prest', label: 'Historial de préstamo', permisos: [{ key: 'ver', label: 'Ver' }]},
        ]
      },
      {
        id: 'hv_section', label: 'Hoja de vida', type: 'section_checkable',
        children: [
          { id: 'hv_hoja', label: 'Hoja de vida', permisos: [
            { key: 'ver', label: 'Ver' }, { key: 'crear', label: 'Crear' },
            { key: 'ver_detalle', label: 'Ver detalle' }, { key: 'editar', label: 'Editar' },
            { key: 'reg_contable', label: 'Registro contable' }
          ]},
          { id: 'hv_inventario', label: 'Inventario', permisos: [
            { key: 'ver', label: 'Ver' }, { key: 'ctrl_bajas', label: 'Control de bajas' },
            { key: 'trasladar', label: 'Trasladar' }, { key: 'descargar', label: 'Descargar' }
          ]},
          { id: 'hv_reportes', label: 'Reportes', permisos: [
            { key: 'ver', label: 'Ver' }, { key: 'crear', label: 'Crear' },
            { key: 'gestionar', label: 'Gestionar reporte' }, { key: 'seguimiento', label: 'Seguimiento' },
            { key: 'ver_detalle', label: 'Ver detalle' }
          ]},
        ]
      },
      {
        id: 'informes', label: 'Informes', type: 'sub_accordion',
        children: [
          { id: '_lbl_inst3ros', label: 'Instrumentos de 3ros', type: 'group_label' },
          { id: 'inf_ingresos', label: 'Ingresos', permisos: [
            { key: 'ver', label: 'Ver' }, { key: 'crear', label: 'Crear' },
            { key: 'descargar', label: 'Descargar' }, { key: 'ver_detalle', label: 'Ver detalle' }
          ]},
          { id: 'inf_devoluciones', label: 'Devoluciones', permisos: [
            { key: 'ver', label: 'Ver' }, { key: 'crear', label: 'Crear' },
            { key: 'descargar', label: 'Descargar' }
          ]},
          { id: 'inf_bio_statim', label: 'Indicador biológico statim', permisos: [
            { key: 'ver', label: 'Ver' }, { key: 'descargar', label: 'Descargar' },
            { key: 'ver_detalle', label: 'Ver detalle' }
          ]},
          { id: 'inf_ind_gas', label: 'Indicador a gas', permisos: [
            { key: 'ver', label: 'Ver' }, { key: 'descargar', label: 'Descargar' },
            { key: 'ver_detalle', label: 'Ver detalle' }
          ]},
          { id: 'inf_ind_paquetes', label: 'Indicador de paquetes e instrumentales', permisos: [
            { key: 'ver', label: 'Ver' }, { key: 'crear', label: 'Crear' },
            { key: 'descargar', label: 'Descargar' }
          ]},
          { id: '_lbl_hist_trasl', label: 'Historial de traslados', type: 'group_label' },
          { id: 'inf_kit', label: 'Kit', permisos: [
            { key: 'ver', label: 'Ver' }, { key: 'descargar', label: 'Descargar' },
            { key: 'ver_detalle', label: 'Ver detalle' }
          ]},
          { id: 'inf_instrumentos', label: 'Instrumentos', permisos: [
            { key: 'ver', label: 'Ver' }, { key: 'descargar', label: 'Descargar' }
          ]},
          { id: 'inf_primera_carga', label: 'Indicador de primera carga', permisos: [
            { key: 'ver', label: 'Ver' }, { key: 'crear', label: 'Crear' },
            { key: 'descargar', label: 'Descargar' }
          ]},
        ]
      },
    ]
  },
  {
    id: 'configuracion', label: 'Configuración', type: 'top_table',
    tableColumns: [
      { key: 'ver', label: 'Ver' }, { key: 'crear', label: 'Crear' },
      { key: 'editar', label: 'Editar' }, { key: 'habilitar', label: 'Habilitar' },
      { key: 'inhabilitar', label: 'Inhabilitar' }
    ],
    children: [
      { id: 'cfg_insumos',  label: 'Insumos quirúrgicos'     },
      { id: 'cfg_prov',     label: 'Proveedores'             },
      { id: 'cfg_esp',      label: 'Especialidad'            },
      { id: 'cfg_subesp',   label: 'Subespecialidad'         },
      { id: 'cfg_tipo_sub', label: 'Tipo de subespecialidad' },
      { id: 'cfg_kit',      label: 'Kit'                     },
      { id: 'cfg_sedes',    label: 'Sedes'                   },
      { id: 'cfg_quirof',   label: 'Quirófanos'              },
      { id: 'cfg_usuarios', label: 'Usuarios'                },
    ]
  }
];

const UsuariosScreen: React.FC = () => {
  const [isModalOpen, setIsModalOpen]         = useState(false);
  const [modalMode, setModalMode]             = useState<'create'|'view'|'edit'|'duplicate'>('create');
  const [showPassword, setShowPassword]       = useState(false);
  const [selectedModules, setSelectedModules] = useState<Record<string, boolean>>({});
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [openMenuIndex, setOpenMenuIndex]     = useState<number|null>(null);
  const menuRef                               = useRef<HTMLDivElement>(null);
  const fileInputRef                          = useRef<HTMLInputElement>(null);
  const [usersData, setUsersData]             = useState<any[]>([]);
  const [loading, setLoading]                 = useState(false);
  const [searchTerm, setSearchTerm]           = useState('');
  const [statusFilter, setStatusFilter]       = useState('');
  const [currentPage, setCurrentPage]         = useState(1);
  const [totalPages, setTotalPages]           = useState(1);
  const [totalRecords, setTotalRecords]       = useState(0);

  const initialForm = {
    id: null, nombre: '', apellido: '', empresa: '', cargo: '',
    email: '', password: '', rol: 'Administrador',
    esPropietario: false, registroContable: false, estado: true, fotoUrl: ''
  };
  const [formData, setFormData]     = useState<any>(initialForm);
  const [selectedFile, setSelectedFile] = useState<File|null>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    if (name === 'cargo' && CARGO_ROL_MAP[value]) {
      setFormData((p: any) => ({ ...p, cargo: value, rol: CARGO_ROL_MAP[value] }));
    } else if (name === 'esPropietario' && val === true) {
      setFormData((p: any) => ({ ...p, esPropietario: true, registroContable: false }));
    } else if (name === 'registroContable' && val === true) {
      setFormData((p: any) => ({ ...p, esPropietario: false, registroContable: true }));
    } else {
      setFormData((p: any) => ({ ...p, [name]: val }));
    }
  };

  const handleOpenModal = (mode: any, user: any = null) => {
    setModalMode(mode);
    setSelectedFile(null);
    setExpandedModules(new Set());
    if (user) {
      setFormData({ ...initialForm, ...user, password: '' });
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
      Swal.fire({ icon: 'warning', title: 'Formato inválido', text: 'Solo se permiten formatos JPG o PNG.', confirmButtonColor: '#3b82f6' });
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      Swal.fire({ icon: 'warning', title: 'Imagen muy grande', text: 'La imagen supera el tamaño máximo permitido (4MB).', confirmButtonColor: '#3b82f6' });
      return;
    }
    setSelectedFile(file);
    setFormData((p: any) => ({ ...p, fotoUrl: URL.createObjectURL(file) }));
  };

  const removePhoto = () => {
    setSelectedFile(null);
    setFormData((p: any) => ({ ...p, fotoUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ── Cierre con confirmación (flecha atrás y botón Cancelar en create/edit/duplicate) ── */
  const handleCancelClick = () => {
    if (modalMode === 'view') { setIsModalOpen(false); return; }
    Swal.fire({
      title: '¿Está seguro?',
      text: modalMode === 'create' || modalMode === 'duplicate'
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
    const regexAlfa  = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPass  = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.empresa ||
        !formData.cargo || !formData.email.trim() || !formData.rol) {
      Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Es necesario el diligenciamiento de todos los campos obligatorios (*).', confirmButtonColor: '#3b82f6' });
      return;
    }
    if (!regexAlfa.test(formData.nombre.trim()) || !regexAlfa.test(formData.apellido.trim())) {
      Swal.fire({ icon: 'warning', title: 'Formato inválido', text: 'Los campos Nombre y Apellido solo deben contener caracteres alfabéticos.', confirmButtonColor: '#3b82f6' });
      return;
    }
    if (!regexEmail.test(formData.email.trim())) {
      Swal.fire({ icon: 'warning', title: 'Correo inválido', text: 'El formato del correo electrónico es inválido.', confirmButtonColor: '#3b82f6' });
      return;
    }
    if (modalMode === 'create' || modalMode === 'duplicate' || (modalMode === 'edit' && formData.password)) {
      if (!regexPass.test(formData.password)) {
        Swal.fire({ icon: 'warning', title: 'Contraseña inválida', text: 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.', confirmButtonColor: '#3b82f6' });
        return;
      }
    }
    try {
      const method = (modalMode === 'create' || modalMode === 'duplicate') ? 'POST' : 'PUT';
      const url    = method === 'POST' ? 'http://localhost:4000/api/usuarios' : `http://localhost:4000/api/usuarios/${formData.id}`;
      const { id, ...rest } = formData;
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...rest, permisos: selectedModules }) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.msg || 'Error en el servidor'); }
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: modalMode === 'edit' ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.',
        confirmButtonColor: '#10b981',
        timer: 2000,
        showConfirmButton: false,
      });
      setIsModalOpen(false);
      fetchUsuarios();
    } catch (e: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: e.message || 'Ocurrió un error al guardar.', confirmButtonColor: '#ef4444' });
    }
  };

  const handleToggleStatus = (row: any) => {
    setOpenMenuIndex(null);
    const accion = row.estado ? 'deshabilitará' : 'habilitará';
    Swal.fire({
      title: '¿Está seguro?',
      html: `Se <b>${accion}</b> al usuario:<br/><span style="color:#475569;font-weight:600">${row.nombre} ${row.apellido}</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const nuevoEstado = !row.estado;
          const res = await fetch(`http://localhost:4000/api/usuarios/${row.id}/estado`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
          });
          if (!res.ok) { const err = await res.json(); throw new Error(err.msg); }
          Swal.fire({
            icon: 'success',
            title: 'Estado actualizado',
            text: `El usuario ha sido ${nuevoEstado ? 'habilitado' : 'deshabilitado'}.`,
            timer: 1500,
            showConfirmButton: false,
          });
          fetchUsuarios();
        } catch (e: any) {
          Swal.fire({ icon: 'error', title: 'Error', text: e.message || 'No se pudo cambiar el estado.', confirmButtonColor: '#ef4444' });
        }
      }
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedModules(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const getAllKeys = (children: any[]): string[] => {
    const keys: string[] = [];
    children.forEach(child => {
      if (!child.id || child.type === 'group_label') return;
      keys.push(child.id);
      child.permisos?.forEach((p: any) => keys.push(`${child.id}__${p.key}`));
      if (child.children) keys.push(...getAllKeys(child.children));
    });
    return keys;
  };

  const getConfigKeys = (topItem: any): string[] => {
    const keys: string[] = [];
    topItem.children.forEach((item: any) => {
      keys.push(item.id);
      topItem.tableColumns.forEach((col: any) => keys.push(`${item.id}__${col.key}`));
    });
    return keys;
  };

  const toggleTopLevel = (topItem: any) => {
    if (modalMode === 'view') return;
    const newVal = !selectedModules[topItem.id];
    const updates: Record<string, boolean> = { [topItem.id]: newVal };
    const keys = topItem.type === 'top_table' ? getConfigKeys(topItem) : getAllKeys(topItem.children);
    keys.forEach(k => { updates[k] = newVal; });
    setSelectedModules(prev => ({ ...prev, ...updates }));
  };

  const toggleSubAccordion = (subItem: any) => {
    if (modalMode === 'view') return;
    const newVal = !selectedModules[subItem.id];
    const updates: Record<string, boolean> = { [subItem.id]: newVal };
    getAllKeys(subItem.children).forEach(k => { updates[k] = newVal; });
    setSelectedModules(prev => ({ ...prev, ...updates }));
  };

  const toggleSectionCheckable = (section: any) => {
    if (modalMode === 'view') return;
    const newVal = !selectedModules[section.id];
    const updates: Record<string, boolean> = { [section.id]: newVal };
    getAllKeys(section.children).forEach(k => { updates[k] = newVal; });
    setSelectedModules(prev => ({ ...prev, ...updates }));
  };

  const toggleLeaf = (moduleId: string, permisos: any[]) => {
    if (modalMode === 'view') return;
    const newVal = !selectedModules[moduleId];
    const updates: Record<string, boolean> = { [moduleId]: newVal };
    permisos?.forEach((p: any) => { updates[`${moduleId}__${p.key}`] = newVal; });
    setSelectedModules(prev => ({ ...prev, ...updates }));
  };

  const togglePerm = (moduleId: string, permKey: string) => {
    if (modalMode === 'view') return;
    const key = `${moduleId}__${permKey}`;
    setSelectedModules(prev => {
      const newVal = !prev[key];
      const updates = { ...prev, [key]: newVal };
      if (newVal) updates[moduleId] = true;
      return updates;
    });
  };

  const renderPermChip = (moduleId: string, perm: any) => {
    const key         = `${moduleId}__${perm.key}`;
    const isModChk    = !!selectedModules[moduleId];
    const isPermChk   = !!selectedModules[key];
    const isReadOnly  = modalMode === 'view';
    const canInteract = isModChk && !isReadOnly;
    return (
      <label key={perm.key}
        onClick={e => { e.stopPropagation(); if (canInteract) togglePerm(moduleId, perm.key); }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium select-none transition-all ${
          isPermChk
            ? 'bg-blue-50 border-blue-300 text-blue-600 cursor-pointer'
            : canInteract
            ? 'bg-white border-slate-200 text-slate-500 cursor-pointer hover:border-blue-200 hover:bg-blue-50/40'
            : 'bg-slate-50/60 border-slate-100 text-slate-300 cursor-not-allowed'
        }`}>
        <input type="checkbox" checked={isPermChk} onChange={() => {}} disabled={!canInteract}
          className="w-3.5 h-3.5 rounded border-current text-blue-500 flex-shrink-0 pointer-events-none" />
        {perm.label}
      </label>
    );
  };

  const renderLeafRow = (module: any) => {
    if (module.type === 'group_label') {
      return (
        <div key={module.id} className="px-5 py-2 bg-slate-50/80 border-b border-slate-100">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">{module.label}</span>
        </div>
      );
    }
    const isChecked  = !!selectedModules[module.id];
    const isReadOnly = modalMode === 'view';
    return (
      <div key={module.id} className="flex flex-wrap items-start gap-3 px-5 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50/30 transition-colors">
        <div
          className={`flex items-center gap-2 w-44 flex-shrink-0 pt-1 ${!isReadOnly ? 'cursor-pointer' : ''}`}
          onClick={() => !isReadOnly && toggleLeaf(module.id, module.permisos || [])}>
          <input type="checkbox" checked={isChecked} onChange={() => {}} disabled={isReadOnly}
            className="w-4 h-4 rounded border-slate-300 text-blue-500 flex-shrink-0 pointer-events-none" />
          <span className="text-sm font-medium text-slate-600 leading-tight select-none">{module.label}</span>
        </div>
        <div className="flex flex-wrap gap-2 flex-1">
          {module.permisos?.map((perm: any) => renderPermChip(module.id, perm))}
        </div>
      </div>
    );
  };

  const renderSubAccordion = (child: any) => {
    const isSubExp   = expandedModules.has(child.id);
    const isSubChk   = !!selectedModules[child.id];
    const isReadOnly = modalMode === 'view';
    return (
      <div key={child.id} className="border-b border-slate-100 last:border-0">
        <div className="flex items-center gap-3 px-5 py-3.5 bg-white hover:bg-slate-50/40 transition-colors">
          <input type="checkbox" checked={isSubChk}
            onChange={e => { e.stopPropagation(); toggleSubAccordion(child); }}
            disabled={isReadOnly}
            className="w-4 h-4 rounded border-slate-300 text-blue-500 cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
          />
          <span className="flex-1 text-sm font-semibold text-blue-500 cursor-pointer select-none"
            onClick={() => toggleExpand(child.id)}>
            {child.label}
          </span>
          <button onClick={() => toggleExpand(child.id)}
            className="text-blue-400 hover:text-blue-600 transition-colors p-1 flex-shrink-0">
            {isSubExp ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
          </button>
        </div>
        {isSubExp && (
          <div className="bg-slate-50/20 ml-5 border-l-4 border-blue-100 divide-y divide-slate-100">
            {child.children.map((leaf: any) => renderLeafRow(leaf))}
          </div>
        )}
      </div>
    );
  };

  const renderSectionCheckable = (section: any) => {
    const isChecked  = !!selectedModules[section.id];
    const isReadOnly = modalMode === 'view';
    return (
      <div key={section.id} className="border-b border-slate-100 last:border-0">
        <div
          className={`flex items-center gap-3 px-5 py-3.5 transition-colors ${
            isChecked ? 'bg-blue-50' : 'bg-white hover:bg-slate-50/40'
          } ${!isReadOnly ? 'cursor-pointer' : ''}`}
          onClick={() => !isReadOnly && toggleSectionCheckable(section)}>
          <input type="checkbox" checked={isChecked} onChange={() => {}} disabled={isReadOnly}
            className="w-4 h-4 rounded border-slate-300 text-blue-500 flex-shrink-0 pointer-events-none"
            style={isChecked ? { accentColor: '#0ea5e9' } : undefined}
          />
          <span className="flex-1 text-sm font-semibold select-none text-blue-500">{section.label}</span>
        </div>
        <div className="divide-y divide-slate-100">
          {section.children.map((leaf: any) => renderLeafRow(leaf))}
        </div>
      </div>
    );
  };

  const renderConfigTable = (topItem: any) => {
    const isReadOnly = modalMode === 'view';
    const cols: { key: string; label: string }[] = topItem.tableColumns;
    const allChecked = topItem.children.every((item: any) =>
      selectedModules[item.id] && cols.every(c => selectedModules[`${item.id}__${c.key}`])
    );
    const toggleAllConfig = () => {
      if (isReadOnly) return;
      const newVal = !allChecked;
      const updates: Record<string, boolean> = {};
      topItem.children.forEach((item: any) => {
        updates[item.id] = newVal;
        cols.forEach(c => { updates[`${item.id}__${c.key}`] = newVal; });
      });
      setSelectedModules(prev => ({ ...prev, ...updates }));
    };
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200">
              <th className="px-5 py-3 text-left min-w-[200px]">
                <div className="flex items-center gap-2 cursor-pointer" onClick={toggleAllConfig}>
                  <input type="checkbox" checked={allChecked} onChange={() => {}} disabled={isReadOnly}
                    className="w-4 h-4 rounded border-slate-300 text-blue-500 pointer-events-none" />
                  <span className="text-sm font-semibold text-slate-600">Tablas maestras</span>
                  <ChevronDown size={13} className="text-slate-400" />
                </div>
              </th>
              {cols.map(col => (
                <th key={col.key} className="px-4 py-3 text-center w-24">
                  <span className="text-xs font-bold text-slate-500">{col.label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {topItem.children.map((item: any) => {
              const isItemChk = !!selectedModules[item.id];
              return (
                <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="px-5 py-3">
                    <div className={`flex items-center gap-2 ${!isReadOnly ? 'cursor-pointer' : ''}`}
                      onClick={() => !isReadOnly && toggleLeaf(item.id, cols.map(c => ({ key: c.key })))}>
                      <input type="checkbox" checked={isItemChk} onChange={() => {}} disabled={isReadOnly}
                        className="w-4 h-4 rounded border-slate-300 text-blue-500 pointer-events-none flex-shrink-0" />
                      <span className="text-sm text-slate-600 select-none">{item.label}</span>
                    </div>
                  </td>
                  {cols.map(col => {
                    const permKey    = `${item.id}__${col.key}`;
                    const isPermChk  = !!selectedModules[permKey];
                    const canInteract = isItemChk && !isReadOnly;
                    return (
                      <td key={col.key} className="px-4 py-3 text-center">
                        <input type="checkbox" checked={isPermChk}
                          onChange={() => togglePerm(item.id, col.key)}
                          disabled={!canInteract}
                          className={`w-4 h-4 rounded border-slate-300 text-blue-500 ${canInteract ? 'cursor-pointer' : 'cursor-not-allowed opacity-30'}`}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderPermisos = () => (
    <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-200">
      {PERMISOS_ESTRUCTURA.map(topItem => {
        const isTopExpanded = expandedModules.has(topItem.id);
        const isTopChecked  = !!selectedModules[topItem.id];
        const isReadOnly    = modalMode === 'view';
        return (
          <div key={topItem.id}>
            <div className={`flex items-center gap-3 px-5 py-4 select-none transition-colors ${
              isTopChecked ? 'bg-blue-500' : 'bg-slate-50 hover:bg-slate-100'
            }`}>
              <input type="checkbox" checked={isTopChecked}
                onChange={e => { e.stopPropagation(); toggleTopLevel(topItem); }}
                disabled={isReadOnly}
                className="w-4 h-4 rounded cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
                style={isTopChecked ? { accentColor: '#10b981' } : undefined}
              />
              <span
                className={`flex-1 text-sm font-bold cursor-pointer ${isTopChecked ? 'text-white' : 'text-slate-700'}`}
                onClick={() => toggleExpand(topItem.id)}>
                {topItem.label}
              </span>
              <button onClick={() => toggleExpand(topItem.id)}
                className={`p-0.5 flex-shrink-0 transition-colors ${isTopChecked ? 'text-white' : 'text-slate-500 hover:text-slate-800'}`}>
                {isTopExpanded ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
              </button>
            </div>
            {isTopExpanded && (
              <div className="bg-white">
                {topItem.type === 'top_table' ? renderConfigTable(topItem) : (
                  <div className="divide-y divide-slate-100">
                    {topItem.children.map((child: any) => {
                      if (child.type === 'sub_accordion')     return renderSubAccordion(child);
                      if (child.type === 'section_checkable') return renderSectionCheckable(child);
                      return renderLeafRow(child);
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const getTitle = () => ({ view:'Detalles del usuario', edit:'Editar usuario', duplicate:'Duplicar usuario', create:'Crear usuario' }[modalMode]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .u-save-btn { padding:11px 48px; border-radius:30px; border:none; cursor:pointer; background:linear-gradient(90deg,#60a5fa 0%,#34d399 100%); color:#fff; font-weight:700; font-size:14px; font-family:'Inter',sans-serif; box-shadow:0 4px 14px rgba(96,165,250,.4); transition:opacity .2s,transform .15s; }
        .u-save-btn:hover { opacity:.9; transform:translateY(-1px); }
        .u-cancel-btn { background:none; border:none; cursor:pointer; font-size:14px; font-weight:600; color:#64748b; font-family:'Inter',sans-serif; transition:color .2s; padding:0; }
        .u-cancel-btn:hover { color:#ef4444; }
        .u-search-icon { position:absolute; right:14px; top:50%; transform:translateY(-50%); pointer-events:none; color:#60a5fa; }
        .hide-scrollbar::-webkit-scrollbar { display:none; }
        .hide-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>

      {!isModalOpen ? (
        /* ═══════════════════════════════
           VISTA: GRILLA DE USUARIOS
           ═══════════════════════════════ */
        <div className="space-y-6 h-full flex flex-col font-sans relative" onClick={() => setOpenMenuIndex(null)}>
          <h1 className="text-3xl font-bold text-blue-500">Usuarios</h1>

          <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white p-3 rounded-[1.5rem] shadow-sm border border-slate-100">
            <div className="flex gap-3 flex-1 w-full md:w-auto items-center">
              <div style={{ width:170, flexShrink:0 }}>
                <UNotchSelect id="statusFilter" label="Estado" value={statusFilter} compact
                  onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
                  options={[{ value:'true', label:'Habilitado' }, { value:'false', label:'Deshabilitado' }]}
                />
              </div>
              <div style={{ position:'relative', flex:1, maxWidth:560 }}>
                <input type="text" placeholder="Buscar usuario..." value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  style={{ width:'100%', height:42, borderRadius:30, border:'1.5px solid #e2e8f0', background:'#f8fafc', padding:'0 40px 0 18px', fontSize:13, color:'#475569', outline:'none', boxSizing:'border-box', fontFamily:'Inter,sans-serif', transition:'border-color .2s' } as React.CSSProperties}
                  onFocus={e=>(e.target.style.borderColor='#3b82f6')} onBlur={e=>(e.target.style.borderColor='#e2e8f0')}
                />
                <Search className="u-search-icon" size={17}/>
              </div>
            </div>
            <button onClick={() => handleOpenModal('create')}
              className="flex items-center gap-2 text-blue-500 font-bold text-sm hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap">
              Crear usuario <PlusCircle size={18}/>
            </button>
          </div>

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
                            {row.fotoUrl ? <img src={row.fotoUrl} alt="perfil" className="w-full h-full rounded-full object-cover"/> : (row.nombre?.[0] || '?')}
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
                              <div className="h-px bg-slate-100 my-1"/>
                              <button onClick={() => handleToggleStatus(row)}
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
        </div>
      ) : (
        /* ═══════════════════════════════
           VISTA: CREAR / EDITAR / DETALLE
           ═══════════════════════════════ */
        <div className="space-y-5 h-full flex flex-col font-sans overflow-y-auto hide-scrollbar pb-10">

          {/* Encabezado */}
          <div className="flex items-center gap-3">
            {/* Flecha atrás — confirma si hay cambios sin guardar */}
            <button onClick={handleCancelClick} className="text-blue-500 hover:text-blue-700 transition-colors">
              <ChevronLeft size={28} strokeWidth={2.5}/>
            </button>
            <h1 className="text-3xl font-bold text-slate-800">{getTitle()}</h1>
          </div>

          {/* Bloque 1: Foto */}
          <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex items-center gap-5 flex-shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-300 overflow-hidden">
                {formData.fotoUrl ? <img src={formData.fotoUrl} alt="Perfil" className="w-full h-full object-cover"/> : <User size={32}/>}
              </div>
              {modalMode !== 'view' && (
                <div>
                  <h3 className="text-base font-bold text-blue-500 mb-2">Foto de perfil</h3>
                  <div className="flex gap-2">
                    <input type="file" accept=".jpg,.jpeg,.png" className="hidden" ref={fileInputRef} onChange={handleFileChange}/>
                    <button onClick={()=>fileInputRef.current?.click()} className="px-4 py-1.5 rounded-full border border-cyan-400 text-cyan-500 text-xs font-bold hover:bg-cyan-50 transition-colors whitespace-nowrap">Subir foto</button>
                    <button onClick={removePhoto} className="text-slate-400 text-xs font-semibold hover:text-red-500 transition-colors px-2">Eliminar</button>
                  </div>
                </div>
              )}
            </div>
            <div className="hidden md:block w-px h-14 bg-slate-200 mx-2 flex-shrink-0"/>
            <div className="text-sm text-slate-400">
              <p className="font-bold text-slate-500 mb-1">Requisitos de imagen:</p>
              <p>Mín. 400 x 400 píxeles | Máx. 4MB (JPG/PNG)</p>
              <p className="mt-1">Su cara o logotipo</p>
            </div>
          </div>

          {/* Bloque 2: Detalles del Usuario */}
          <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-800 mb-5">Detalles del usuario</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
              <UNotchInput id="nombre" label="Nombre" required value={formData.nombre} disabled={modalMode==='view'} onChange={v=>setFormData((p:any)=>({...p,nombre:v}))}/>
              <UNotchInput id="apellido" label="Apellido" required value={formData.apellido} disabled={modalMode==='view'} onChange={v=>setFormData((p:any)=>({...p,apellido:v}))}/>
              <UNotchSelect id="empresa" label="Empresa" required value={formData.empresa} disabled={modalMode==='view'}
                onChange={v=>setFormData((p:any)=>({...p,empresa:v}))}
                options={[
                  { value:'VIU',  label:'Clínica Oftalmológica Internacional SAS (VIU)' },
                  { value:'FOCA', label:'Fundacion Oftalmologica Del Caribe (FOCA)' },
                  { value:'ESCAF',label:'Inversiones Medicas Escaf Sales SAS' },
                ]}
              />
              <UNotchSelect id="cargo" label="Cargo" required value={formData.cargo} disabled={modalMode==='view'}
                onChange={v=>{ const autoRol = CARGO_ROL_MAP[v] || formData.rol; setFormData((p:any)=>({...p,cargo:v,rol:autoRol})); }}
                options={[
                  { value:'Administrador General', label:'Administrador General' },
                  { value:'Coordinador SST',       label:'Coordinador SST' },
                  { value:'Enfermera Jefe',        label:'Enfermera Jefe' },
                  { value:'Auxiliar',              label:'Auxiliar' },
                ]}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div style={{ position:'relative' }}>
                <UNotchInput id="password" label="Contraseña" required={modalMode!=='edit'} value={formData.password} disabled={modalMode==='view'} onChange={v=>setFormData((p:any)=>({...p,password:v}))} type={showPassword ? 'text' : 'password'}/>
                <button onClick={()=>setShowPassword(!showPassword)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#94a3b8', display:'flex', alignItems:'center' }}>
                  {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              <UNotchInput id="email" label="Correo electrónico" required value={formData.email} disabled={modalMode==='view'} onChange={v=>setFormData((p:any)=>({...p,email:v}))}/>
              <UNotchSelect id="rol" label="Rol" required value={formData.rol} disabled={modalMode==='view'}
                onChange={v=>setFormData((p:any)=>({...p,rol:v}))}
                options={[
                  { value:'Administrador', label:'Administrador' },
                  { value:'Supervisor',    label:'Supervisor'    },
                  { value:'Operario',      label:'Operario'      },
                ]}
              />
              <UNotchInput id="codigoUsuario" label="Código de usuario"
                value={modalMode==='create' ? 'Generado automático' : (formData.codigo || '—')}
                disabled onChange={()=>{}}/>
            </div>
          </div>

          {/* Bloque 3: Checkboxes especiales + Roles y permisos */}
          <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6">
            <div className="flex flex-wrap items-center gap-6 mb-6 pb-5 border-b border-slate-100">
              <label className={`flex items-center gap-2 text-sm font-medium select-none transition-opacity ${
                formData.registroContable ? 'text-slate-400 opacity-50' : 'text-slate-600 cursor-pointer'
              }`}>
                <input type="checkbox" name="esPropietario" checked={formData.esPropietario || false}
                  onChange={handleInputChange} disabled={modalMode==='view' || formData.registroContable}
                  className="w-4 h-4 rounded border-slate-300 text-blue-500 disabled:cursor-not-allowed cursor-pointer"/>
                Propietario del instrumentos
              </label>
              <label className={`flex items-center gap-2 text-sm font-medium select-none transition-opacity ${
                formData.esPropietario ? 'text-slate-400 opacity-50' : 'text-slate-600 cursor-pointer'
              }`}>
                <input type="checkbox" name="registroContable" checked={formData.registroContable || false}
                  onChange={handleInputChange} disabled={modalMode==='view' || formData.esPropietario}
                  className="w-4 h-4 rounded border-slate-300 text-blue-500 disabled:cursor-not-allowed cursor-pointer"/>
                Registro Contable
              </label>
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-4">Roles y permisos</h3>
            {renderPermisos()}
          </div>

          {/* Botones */}
          <div className="flex justify-end items-center gap-6 py-2">
            {modalMode !== 'view' ? (
              <>
                <button className="u-cancel-btn" onClick={handleCancelClick}>Cancelar</button>
                <button className="u-save-btn" onClick={handleSave}>{modalMode==='edit' ? 'Actualizar' : 'Guardar'}</button>
              </>
            ) : (
              <button className="px-12 py-3 rounded-full bg-slate-200 text-slate-600 font-bold hover:bg-slate-300 transition-colors" onClick={()=>setIsModalOpen(false)}>Cerrar</button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

/* ══ UNotchInput ══ */
interface UNotchInputProps { id:string; label:string; value:string; disabled?:boolean; required?:boolean; type?:string; onChange:(v:string)=>void; }
const UNotchInput: React.FC<UNotchInputProps> = ({ id, label, value, disabled=false, required=false, type='text', onChange }) => {
  const [focused, setFocused] = useState(false);
  const active  = focused || value.length > 0;
  const bgColor = disabled ? '#f8fafc' : '#fff';
  return (
    <div style={{ position:'relative' }}>
      <input id={id} type={type} value={value} disabled={disabled} placeholder=""
        onChange={e=>onChange(e.target.value)} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
        style={{ width:'100%', height:48, borderRadius:30, border:`1.5px solid ${focused?'#3b82f6':'#d1d5db'}`, background:bgColor, padding:active?'14px 16px 0 16px':'0 16px', fontSize:13.5, color:disabled?'#94a3b8':'#334155', outline:'none', boxSizing:'border-box', transition:'border-color .2s, padding .18s', fontFamily:'Inter,sans-serif', cursor:disabled?'not-allowed':'text' } as React.CSSProperties}
      />
      <label htmlFor={id} style={{ position:'absolute', left:18, top:active?0:'50%', transform:'translateY(-50%)', fontSize:active?10.5:13, color:focused?'#3b82f6':(active?'#6b7280':'#9ca3af'), pointerEvents:'none', transition:'all .18s ease', background:bgColor, padding:'0 4px', fontFamily:'Inter,sans-serif', whiteSpace:'nowrap' }}>
        {label}{required&&<span style={{color:'#ef4444',marginLeft:1}}>*</span>}
      </label>
    </div>
  );
};

/* ══ UNotchSelect ══ */
interface UNotchSelectProps { id:string; label:string; value:string; disabled?:boolean; required?:boolean; compact?:boolean; onChange:(v:string)=>void; options:{value:string|number;label:string}[]; }
const UNotchSelect: React.FC<UNotchSelectProps> = ({ id, label, value, disabled=false, required=false, compact=false, onChange, options }) => {
  const [focused, setFocused] = useState(false);
  const bgColor = disabled?'#f8fafc':(compact?(focused?'#fff':'#f8fafc'):'#fff');
  return (
    <div style={{ position:'relative' }}>
      <select id={id} value={value} disabled={disabled} onChange={e=>onChange(e.target.value)} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
        style={{ width:'100%', height:compact?42:48, borderRadius:30, border:`1.5px solid ${focused?'#3b82f6':'#d1d5db'}`, background:bgColor, padding:compact?'10px 36px 0 16px':'14px 36px 0 16px', fontSize:compact?13:13.5, color:value===''?'#9ca3af':(disabled?'#94a3b8':'#334155'), outline:'none', appearance:'none' as const, boxSizing:'border-box' as const, transition:'border-color .2s', fontFamily:'Inter,sans-serif', cursor:disabled?'not-allowed':'pointer' }}>
        <option value="" style={{color:'#9ca3af'}}>Seleccionar...</option>
        {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <label htmlFor={id} style={{ position:'absolute', left:18, top:0, transform:'translateY(-50%)', fontSize:10.5, color:focused?'#3b82f6':'#6b7280', pointerEvents:'none', background:bgColor, padding:'0 4px', fontFamily:'Inter,sans-serif', whiteSpace:'nowrap', transition:'color .18s' }}>
        {label}{required&&<span style={{color:'#ef4444',marginLeft:1}}>*</span>}
      </label>
      <ChevronDown size={15} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'#9ca3af' }}/>
    </div>
  );
};

export default UsuariosScreen;