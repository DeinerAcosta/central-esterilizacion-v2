import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, PlusCircle, ChevronDown, X, MoreVertical, Edit, Ban, CheckCircle, 
  ChevronLeft, ChevronRight 
} from 'lucide-react';

const TipoSubespecialidadScreen: React.FC = () => {
  // --- ESTADOS ---
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [openMenuIndex, setOpenMenuIndex] = useState<any>(null);
  const menuRef = useRef(null);
  const [isEditing, setIsEditing] = useState<any>(false);

  // Datos simulados
  const [data, setData] = useState<any>([
    { id: 1, codigo: 'TS-001', esp: 'Oftalmología', sub: 'Catarata', nombre: 'Quirúrgica', status: 'Habilitado' },
    { id: 2, codigo: 'TS-002', esp: 'Oftalmología', sub: 'Cornea', nombre: 'Clínica', status: 'Habilitado' },
    { id: 3, codigo: 'TS-003', esp: 'Cirugía General', sub: 'Hernias', nombre: 'Diagnóstica', status: 'Deshabilitado' },
    { id: 4, codigo: 'TS-004', esp: 'Oftalmología', sub: 'Retina', nombre: 'Quirúrgica', status: 'Habilitado' },
  ]);

  // Estado del Formulario
  const initialFormState = { id: null, codigo: '', esp: '', sub: '', nombre: '' };
  const [formData, setFormData] = useState<any>(initialFormState);

  // --- HANDLERS ---

  // Cerrar menú al hacer clic fuera
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

  const handleOpenCreate: React.FC = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setFormData(item);
    setIsEditing(true);
    setIsModalOpen(true);
    setOpenMenuIndex(null);
  };

  const handleToggleStatus = (index) => {
    const newData = [...data];
    const currentStatus = newData[index].status;
    newData[index].status = currentStatus === 'Habilitado' ? 'Deshabilitado' : 'Habilitado';
    setData(newData);
    setOpenMenuIndex(null);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="space-y-6 h-full flex flex-col font-sans relative" onClick={() => setOpenMenuIndex(null)}>
      
      {/* TÍTULO */}
      <h1 className="text-3xl font-bold text-blue-500">Tipo de Subespecialidad</h1>
      
      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-2 rounded-xl">
        <div className="flex gap-4 flex-1 w-full md:w-auto">
           <button className="flex items-center justify-between gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-500 text-sm font-medium w-40">
              <span>Estado</span><ChevronDown size={16} />
           </button>
           <div className="relative flex-1 max-w-3xl">
              <input type="text" placeholder="Buscar..." className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-5 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-100"/>
              <Search className="absolute right-4 top-2.5 text-blue-400" size={18} />
           </div>
        </div>
        
        {/* BOTÓN CREAR */}
        <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-2 text-blue-500 font-medium text-sm hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
        >
            Crear tipo <PlusCircle size={18} />
        </button>
      </div>

      {/* TABLA + PAGINACIÓN */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden flex-1 flex flex-col">
        
        <div className="overflow-visible flex-1">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-100/50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                    <th className="px-6 py-4">Código</th>
                    <th className="px-6 py-4">Descripción</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-4 py-4"></th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                {data.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-medium">{row.codigo}</td>
                    <td className="px-6 py-4 text-slate-500">{row.nombre}</td>
                    <td className="px-6 py-4">
                        <span className={`px-4 py-1 rounded-full text-xs font-bold border ${
                            row.status === 'Habilitado' 
                            ? 'bg-emerald-50 text-emerald-500 border-emerald-100' 
                            : 'bg-red-50 text-red-500 border-red-100'
                        }`}>
                            {row.status}
                        </span>
                    </td>
                    
                    {/* ACCIONES (MENÚ 3 PUNTOS) */}
                    <td className="px-4 py-4 text-right relative">
                        <button 
                            onClick={(e: any) => toggleMenu(i, e)}
                            className={`p-2 rounded-full transition-colors ${openMenuIndex === i ? 'bg-blue-50 text-blue-500' : 'text-slate-300 hover:text-blue-500 hover:bg-slate-50'}`}
                        >
                            <MoreVertical size={20} />
                        </button>

                        {/* MENÚ DESPLEGABLE */}
                        {openMenuIndex === i && (
                            <div ref={menuRef} className="absolute right-8 top-8 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden text-left">
                                <div className="flex flex-col py-1">
                                    <button 
                                        onClick={() => handleOpenEdit(row)}
                                        className="flex items-center gap-3 px-4 py-3 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors font-bold"
                                    >
                                        <Edit size={16} /> Editar
                                    </button>
                                    <button 
                                        onClick={() => handleToggleStatus(i)}
                                        className={`flex items-center gap-3 px-4 py-3 text-xs hover:bg-slate-50 transition-colors font-bold ${row.status === 'Habilitado' ? 'text-red-500' : 'text-emerald-500'}`}
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

      {/* ======================================================= */}
      {/* MODAL CREAR / EDITAR TIPO */}
      {/* ======================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            
            {/* Fondo Oscuro */}
            <div 
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={() => setIsModalOpen(false)}
            />

            {/* Contenedor del Modal */}
            <div className="relative bg-white w-full max-w-4xl rounded-[28px] px-10 py-12 shadow-xl animate-in fade-in zoom-in-95 duration-200">

                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-center text-3xl font-bold text-blue-500 flex-1">
                        {isEditing ? 'Editar tipo de subespecialidad' : 'Crear tipo de subespecialidad'}
                    </h2>
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="absolute right-8 top-8 text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Formulario */}
                <div className="grid grid-cols-3 gap-6">

                    {/* 1. Código */}
                    <div>
                        <label className="text-sm font-bold text-slate-700 ml-1">Código</label>
                        <input 
                            type="text"
                            name="codigo"
                            value={formData.codigo}
                            onChange={handleInputChange}
                            placeholder="Ej: TS-001"
                            className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-full px-6 py-3 text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 font-medium" 
                        />
                    </div>

                    {/* 2. Especialidad */}
                    <div>
                        <label className="text-sm font-bold text-slate-700 ml-1">Especialidad</label>
                        <div className="relative mt-2">
                            <select 
                                name="esp"
                                value={formData.esp}
                                onChange={handleInputChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-full px-6 py-3 appearance-none text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer font-medium"
                            >
                                <option value="">Seleccionar...</option>
                                <option value="Oftalmología">Oftalmología</option>
                                <option value="Cirugía General">Cirugía General</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={18}/>
                        </div>
                    </div>

                    {/* 3. Subespecialidad */}
                    <div>
                        <label className="text-sm font-bold text-slate-700 ml-1">Subespecialidad</label>
                        <div className="relative mt-2">
                            <select 
                                name="sub"
                                value={formData.sub}
                                onChange={handleInputChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-full px-6 py-3 appearance-none text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer font-medium"
                            >
                                <option value="">Seleccionar...</option>
                                <option value="Catarata">Catarata</option>
                                <option value="Retina">Retina</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={18}/>
                        </div>
                    </div>

                    {/* 4. Descripción / Nombre del Tipo */}
                    <div className="col-span-3">
                        <label className="text-sm font-bold text-slate-700 ml-1">Nombre del Tipo / Descripción</label>
                        <input 
                            type="text" 
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            placeholder="Ej: Quirúrgica"
                            className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-full px-6 py-3 text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 font-medium" 
                        />
                    </div>

                </div>

                {/* Botones */}
                <div className="mt-12 flex justify-center gap-10">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-slate-500 font-bold hover:text-slate-700 transition-colors"
                    >
                        Cancelar
                    </button>

                    <button className="px-12 py-3 rounded-full text-white font-bold bg-gradient-to-r from-blue-500 to-emerald-400 hover:opacity-90 shadow-lg shadow-blue-200 transition-transform active:scale-95">
                        {isEditing ? 'Actualizar' : 'Guardar'}
                    </button>
                </div>

            </div>
        </div>
      )}

    </div>
  );
};

export default TipoSubespecialidadScreen;