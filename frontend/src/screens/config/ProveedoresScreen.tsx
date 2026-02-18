import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, PlusCircle, ChevronDown, MoreVertical, Edit, Ban, CheckCircle, 
  ChevronLeft, ChevronRight // <--- Importamos los iconos de paginación
} from 'lucide-react';

const ProveedoresScreen: React.FC = () => {
  // --- ESTADOS ---
  const [isModalOpen, setIsModalOpen] = useState<any>(false); // Modal Crear/Editar
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<any>(false); // Modal Alerta Estado
  
  const [openMenuIndex, setOpenMenuIndex] = useState<any>(null); 
  const menuRef = useRef(null); 
  const [isEditing, setIsEditing] = useState<any>(false); 

  // Proveedor seleccionado para editar o cambiar estado
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  // Datos iniciales
  const [proveedores, setProveedores] = useState<any>([
    { id: 1, tipo: 'Mantenimiento', nombre: 'Heiss Gmb & Co.', nit: '1532785742258-5', ciudad: 'Bogotá', tipoPersona: 'Jurídica', status: 'Habilitado' },
    { id: 2, tipo: 'Compras', nombre: 'GlobalTech Solutions', nit: '9876543214567-8', ciudad: 'Medellín', tipoPersona: 'Jurídica', status: 'Habilitado' },
    { id: 3, tipo: 'Mantenimiento', nombre: 'José David Bustamante', nit: '114009872654', ciudad: 'Barranquilla', tipoPersona: 'Natural', status: 'Deshabilitado' },
  ]);

  const initialFormState = { id: null, nombre: '', ciudad: '', tipoPersona: '', nit: '', tipo: '' };
  const [formData, setFormData] = useState<any>(initialFormState);

  // --- HANDLERS ---

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

  // Crear
  const handleOpenCreate: React.FC = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Editar
  const handleOpenEdit = (item) => {
    setFormData(item);
    setIsEditing(true);
    setIsModalOpen(true);
    setOpenMenuIndex(null);
  };

  // Abrir alerta de estado
  const handleOpenStatusModal = (item) => {
    setSelectedProvider(item);
    setOpenMenuIndex(null);
    setIsStatusModalOpen(true);
  };

  // Confirmar cambio de estado
  const confirmToggleStatus: React.FC = () => {
    if (!selectedProvider) return;

    setProveedores(prev => prev.map(p => {
        if (p.id === selectedProvider.id) {
            return { ...p, status: p.status === 'Habilitado' ? 'Deshabilitado' : 'Habilitado' };
        }
        return p;
    }));

    setIsStatusModalOpen(false);
    setSelectedProvider(null);
  };

  // Inputs del formulario
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="space-y-6 h-full flex flex-col font-sans relative" onClick={() => setOpenMenuIndex(null)}>
      
      <h1 className="text-3xl font-bold text-blue-500">Proveedores</h1>
      
      {/* BARRA DE HERRAMIENTAS */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-3 rounded-xl">
        <div className="flex gap-4 w-full md:w-auto">
           <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-500 text-sm font-medium">
              Estado <ChevronDown size={16} />
           </button>
           <div className="relative w-full md:w-[350px]">
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-5 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <Search className="absolute right-4 top-2.5 text-blue-400" size={18} />
           </div>
        </div>
        
        <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-2 text-blue-500 font-medium text-sm hover:text-blue-600 transition-colors"
        >
            Crear proveedor <PlusCircle size={18} />
        </button>
      </div>

      {/* TABLA DE DATOS */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden flex-1 flex flex-col">
        
        <div className="overflow-visible flex-1">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Tipo de proveedor</th>
                <th className="px-6 py-4">Nombre proveedor</th>
                <th className="px-6 py-4">NIT</th>
                <th className="px-6 py-4">Ciudad</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-4 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {proveedores.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-500 font-medium">{row.tipo}</td>
                  <td className="px-6 py-4 text-slate-500">{row.nombre}</td>
                  <td className="px-6 py-4 text-slate-500">{row.nit}</td>
                  <td className="px-6 py-4 text-slate-500">{row.ciudad}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                        row.status === 'Habilitado' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-red-50 text-red-500'
                    }`}>
                        {row.status}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4 text-right relative">
                    <button 
                        onClick={(e: any) => toggleMenu(i, e)}
                        className={`p-2 rounded-full transition-colors ${openMenuIndex === i ? 'bg-blue-50 text-blue-500' : 'text-slate-300 hover:text-blue-500 hover:bg-slate-50'}`}
                    >
                        <MoreVertical size={20} />
                    </button>

                    {/* MENÚ FLOTANTE */}
                    {openMenuIndex === i && (
                        <div ref={menuRef} className="absolute right-8 top-8 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                            <div className="flex flex-col py-1">
                                <button 
                                    onClick={() => handleOpenEdit(row)}
                                    className="flex items-center gap-3 px-4 py-3 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors text-left font-bold"
                                >
                                    <Edit size={16} /> Editar
                                </button>
                                <button 
                                    onClick={() => handleOpenStatusModal(row)}
                                    className={`flex items-center gap-3 px-4 py-3 text-xs hover:bg-slate-50 transition-colors text-left font-bold ${row.status === 'Habilitado' ? 'text-red-500' : 'text-emerald-500'}`}
                                >
                                    {row.status === 'Habilitado' ? <Ban size={16} /> : <CheckCircle size={16} />}
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

        {/* PAGINACIÓN */}
        <div className="mt-auto p-4 flex justify-between items-center text-xs text-slate-300 border-t border-slate-50">
            <span>Pág. 1 de 3 (10 encontrados)</span>
            <div className="flex items-center gap-2 font-medium text-blue-400">
                <button className="hover:text-blue-600 transition-colors"><ChevronLeft size={14} /></button>
                <span className="bg-blue-50 px-2 py-0.5 rounded text-blue-600 cursor-pointer">1</span>
                <span>/</span><span>3</span>
                <button className="hover:text-blue-600 transition-colors"><ChevronRight size={14} /></button>
            </div>
        </div>

      </div>

      {/* ================================================= */}
      {/* MODAL 1: CREAR / EDITAR PROVEEDOR                 */}
      {/* ================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[50] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
            <div className="relative bg-white w-full max-w-3xl rounded-[28px] px-10 py-10 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                <h2 className="text-center text-3xl font-bold text-blue-500 mb-8">
                    {isEditing ? 'Editar proveedor' : 'Crear proveedor'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-semibold text-slate-700">Nombre del proveedor*</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className="mt-2 w-full rounded-full border border-slate-200 px-5 py-3 text-slate-600 outline-none focus:ring-2 focus:ring-blue-100" />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700">Ciudad*</label>
                        <div className="relative mt-2">
                            <select name="ciudad" value={formData.ciudad} onChange={handleInputChange} className="w-full rounded-full border border-slate-200 px-5 py-3 appearance-none bg-white text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer">
                                <option value="">Seleccionar...</option><option value="Bogotá">Bogotá</option><option value="Medellín">Medellín</option><option value="Barranquilla">Barranquilla</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={18}/>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700">Tipo de persona*</label>
                        <div className="relative mt-2">
                            <select name="tipoPersona" value={formData.tipoPersona} onChange={handleInputChange} className="w-full rounded-full border border-slate-200 px-5 py-3 appearance-none bg-white text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer">
                                <option value="">Seleccionar...</option><option value="Natural">Natural</option><option value="Jurídica">Jurídica</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={18}/>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700">NIT*</label>
                        <input type="text" name="nit" value={formData.nit} onChange={handleInputChange} placeholder="Ej: 123456789-0" className="mt-2 w-full rounded-full border border-slate-200 px-5 py-3 text-slate-600 outline-none focus:ring-2 focus:ring-blue-100" />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700">Tipo de proveedor*</label>
                        <div className="relative mt-2">
                            <select name="tipo" value={formData.tipo} onChange={handleInputChange} className="w-full rounded-full border border-slate-200 px-5 py-3 appearance-none bg-white text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer">
                                <option value="">Seleccionar...</option><option value="Mantenimiento">Mantenimiento</option><option value="Compras">Compras</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={18}/>
                        </div>
                    </div>
                </div>
                <div className="mt-10 flex justify-center gap-6">
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-500 font-semibold hover:text-slate-700 px-4 py-2 transition-colors">Cancelar</button>
                    <button className="px-10 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-blue-500 to-emerald-400 hover:opacity-90 shadow-lg shadow-blue-200 transition-transform active:scale-95">{isEditing ? 'Actualizar' : 'Guardar'}</button>
                </div>
            </div>
        </div>
      )}

      {/* ================================================= */}
      {/* MODAL 2: CONFIRMACIÓN DE ESTADO (DISEÑO ALERTA)   */}
      {/* ================================================= */}
      {isStatusModalOpen && selectedProvider && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 font-sans">
             {/* Backdrop */}
             <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
                onClick={() => setIsStatusModalOpen(false)}
             />
             
             {/* Tarjeta de Alerta Compacta y Centrada */}
             <div className="relative bg-white w-full max-w-[400px] rounded-[30px] p-8 shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
                 
                 {/* Icono Grande con Sombra */}
                 <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm ${selectedProvider.status === 'Habilitado' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                    {selectedProvider.status === 'Habilitado' ? <Ban size={40} strokeWidth={1.5} /> : <CheckCircle size={40} strokeWidth={1.5} />}
                 </div>

                 {/* Título Grande y Claro */}
                 <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
                    {selectedProvider.status === 'Habilitado' ? 'Deshabilitar proveedor' : 'Habilitar proveedor'}
                 </h2>

                 {/* Mensaje descriptivo */}
                 <p className="text-slate-500 text-sm mb-8 px-2 leading-relaxed">
                    ¿Estás seguro de que deseas {selectedProvider.status === 'Habilitado' ? 'deshabilitar' : 'habilitar'} a <span className="font-bold text-slate-700">{selectedProvider.nombre}</span>?
                 </p>

                 {/* Botones Lado a Lado */}
                 <div className="flex gap-3 w-full">
                     <button 
                        onClick={() => setIsStatusModalOpen(false)}
                        className="flex-1 py-3 rounded-full border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors text-sm"
                     >
                        Cancelar
                     </button>
                     <button 
                        onClick={confirmToggleStatus}
                        className={`flex-1 py-3 rounded-full text-white font-bold shadow-lg transition-transform active:scale-95 text-sm bg-gradient-to-r ${
                            selectedProvider.status === 'Habilitado' 
                            ? 'from-red-500 to-rose-400 shadow-red-200' 
                            : 'from-blue-500 to-emerald-400 shadow-blue-200'
                        }`}
                     >
                        Sí, {selectedProvider.status === 'Habilitado' ? 'deshabilitar' : 'habilitar'}
                     </button>
                 </div>
             </div>
        </div>
      )}

    </div>
  );
};

export default ProveedoresScreen;