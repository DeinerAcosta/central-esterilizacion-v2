import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, PlusCircle, ChevronDown, X, MoreVertical, Edit, Ban, CheckCircle, 
  ChevronLeft, ChevronRight 
} from 'lucide-react';

const SedesScreen: React.FC = () => {
  // --- ESTADOS ---
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [openMenuIndex, setOpenMenuIndex] = useState<any>(null);
  const menuRef = useRef(null);
  const [isEditing, setIsEditing] = useState<any>(false);

  // Datos simulados
  const [data, setData] = useState<any>([
    { 
      id: 1, 
      nombre: "Sala Azul Mall Plaza", 
      ciudad: "Barranquilla", 
      dir: "Cra. 55 #98a - 15", 
      resp: "Ana María Torres", 
      otroResp: "Juan Pérez", 
      status: "Habilitado" 
    },
    { 
      id: 2, 
      nombre: "Centro Comercial La Pradera", 
      ciudad: "Cali", 
      dir: "Av. 3N #25 - 45", 
      resp: "Carlos Alberto Ruiz", 
      otroResp: "Laura Gómez", 
      status: "Habilitado" 
    },
    { 
      id: 3, 
      nombre: "FOCA Valledupar", 
      ciudad: "Valledupar", 
      dir: "Cll. 16 #19A - 60", 
      resp: "Andrea Paola Contreras", 
      otroResp: "Luis Hernández", 
      status: "Deshabilitado" 
    },
  ]);

  // Estado del Formulario
  const initialFormState = { id: null, nombre: '', ciudad: '', dir: '', resp: '', otroResp: '' };
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
      <h1 className="text-3xl font-bold text-blue-500">Sedes</h1>

      {/* FILTROS */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-3 rounded-xl">

        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-500 text-sm font-medium">
            Estado <ChevronDown size={16} />
          </button>

          <div className="relative w-full md:w-[350px]">
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-5 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
            <Search className="absolute right-4 top-2.5 text-blue-400" size={18} />
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 text-blue-500 font-medium text-sm hover:text-blue-600"
        >
          Crear sede <PlusCircle size={18} />
        </button>
      </div>

      {/* TABLA + PAGINACIÓN */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden flex-1 flex flex-col">
        
        <div className="overflow-visible flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-700 font-bold">
                <tr>
                  <th className="px-6 py-4">Nombre de la sede</th>
                  <th className="px-6 py-4">Ciudad</th>
                  <th className="px-6 py-4">Dirección</th>
                  <th className="px-6 py-4">Responsable</th>
                  <th className="px-6 py-4">Otro responsable</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-4 py-4"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {data.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-medium">{row.nombre}</td>
                    <td className="px-6 py-4 text-slate-500">{row.ciudad}</td>
                    <td className="px-6 py-4 text-slate-500">{row.dir}</td>
                    <td className="px-6 py-4 text-slate-500">{row.resp}</td>
                    <td className="px-6 py-4 text-slate-500">{row.otroResp}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                          row.status === "Habilitado"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-red-50 text-red-500 border-red-100"
                        }`}
                      >
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

      {/* MODAL CREAR / EDITAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative bg-white w-full max-w-3xl rounded-[28px] px-10 py-10 shadow-xl animate-in fade-in zoom-in-95 duration-200">

            <div className="flex justify-between items-center mb-8">
                <h2 className="text-center text-3xl font-bold text-blue-500 flex-1">
                    {isEditing ? 'Editar sede' : 'Crear sede'}
                </h2>
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute right-8 top-8 text-slate-400 hover:text-red-500 transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="md:col-span-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Nombre*</label>
                <input 
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-full border border-slate-200 px-5 py-3 text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 font-medium" 
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 ml-1">Ciudad*</label>
                <div className="relative mt-2">
                  <select 
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleInputChange}
                    className="w-full rounded-full border border-slate-200 px-5 py-3 appearance-none text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer font-medium"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Barranquilla">Barranquilla</option>
                    <option value="Cali">Cali</option>
                    <option value="Valledupar">Valledupar</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 ml-1">Dirección*</label>
                <input 
                    name="dir"
                    value={formData.dir}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-full border border-slate-200 px-5 py-3 text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 font-medium" 
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 ml-1">Responsable*</label>
                <div className="relative mt-2">
                  <select 
                    name="resp"
                    value={formData.resp}
                    onChange={handleInputChange}
                    className="w-full rounded-full border border-slate-200 px-5 py-3 appearance-none text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer font-medium"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Ana María Torres">Ana María Torres</option>
                    <option value="Carlos Alberto Ruiz">Carlos Alberto Ruiz</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 ml-1">Otro responsable*</label>
                <div className="relative mt-2">
                  <select 
                    name="otroResp"
                    value={formData.otroResp}
                    onChange={handleInputChange}
                    className="w-full rounded-full border border-slate-200 px-5 py-3 appearance-none text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer font-medium"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Juan Pérez">Juan Pérez</option>
                    <option value="Laura Gómez">Laura Gómez</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-center gap-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 font-bold hover:text-slate-700 transition-colors"
              >
                Cancelar
              </button>

              <button className="px-10 py-3 rounded-full font-bold text-white bg-gradient-to-r from-blue-500 to-emerald-400 hover:opacity-90 shadow-lg shadow-blue-200 transition-transform active:scale-95">
                {isEditing ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SedesScreen;