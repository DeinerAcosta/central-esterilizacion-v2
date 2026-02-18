import React, { useState, useEffect, useRef } from 'react';
import { Search, PlusCircle, ChevronDown, X, MoreVertical, Edit, Ban, CheckCircle } from 'lucide-react';
import type { Especialidad, EstadoGeneral } from '@/types';

interface FormData {
  id: number | null;
  codigo: string;
  nombre: string;
}

const EspecialidadScreen: React.FC = () => {
  // Estados
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Estado de los datos
  const [data, setData] = useState<Especialidad[]>([
    { id: 1, codigo: 'Oft-001', nombre: 'Oftalmología', status: 'Habilitado' },
    { id: 2, codigo: 'Oto-007', nombre: 'Otorrinolaringología', status: 'Deshabilitado' },
  ]);

  // Estado del Formulario
  const initialFormState: FormData = { id: null, codigo: '', nombre: '' };
  const [formData, setFormData] = useState<FormData>(initialFormState);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  // Abrir Modal para CREAR
  const handleOpenCreate = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Abrir Modal para EDITAR
  const handleOpenEdit = (item: Especialidad) => {
    setFormData({ id: item.id, codigo: item.codigo, nombre: item.nombre });
    setIsEditing(true);
    setIsModalOpen(true);
    setOpenMenuIndex(null);
  };

  // Cambiar Estado (Habilitar/Deshabilitar)
  const handleToggleStatus = (index: number) => {
    const newData = [...data];
    const currentStatus = newData[index].status;
    newData[index].status = currentStatus === 'Habilitado' ? 'Deshabilitado' : 'Habilitado';
    setData(newData);
    setOpenMenuIndex(null);
  };

  // Manejar escritura en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (isEditing) {
      // Actualizar
      setData(
        data.map((item) =>
          item.id === formData.id
            ? { ...item, codigo: formData.codigo, nombre: formData.nombre }
            : item
        )
      );
    } else {
      // Crear nuevo
      const newItem: Especialidad = {
        id: data.length + 1,
        codigo: formData.codigo,
        nombre: formData.nombre,
        status: 'Habilitado',
      };
      setData([...data, newItem]);
    }
    setIsModalOpen(false);
    setFormData(initialFormState);
  };

  return (
    <div
      className="space-y-6 h-full flex flex-col font-sans relative"
      onClick={() => setOpenMenuIndex(null)}
    >
      {/* TÍTULO */}
      <h1 className="text-3xl font-bold text-blue-500">Especialidad</h1>

      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-2 rounded-xl">
        <div className="flex gap-4 flex-1 w-full md:w-auto">
          <button className="flex items-center justify-between gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-500 text-sm font-medium w-40">
            <span>Estado</span>
            <ChevronDown size={16} />
          </button>
          <div className="relative flex-1 max-w-3xl">
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-5 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
            <Search className="absolute right-4 top-2.5 text-blue-400" size={18} />
          </div>
        </div>

        {/* BOTÓN CREAR */}
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 text-blue-500 font-medium text-sm hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Crear especialidad <PlusCircle size={18} />
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-[1.5rem] shadow-soft border border-slate-100 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-visible">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100/50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Especialidad</th>
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
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-bold border ${
                        row.status === 'Habilitado'
                          ? 'bg-emerald-50 text-emerald-500 border-emerald-100'
                          : 'bg-red-50 text-red-500 border-red-100'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>

                  {/* ACCIONES (MENÚ 3 PUNTOS) */}
                  <td className="px-4 py-4 text-right relative">
                    <button
                      onClick={(e) => toggleMenu(i, e)}
                      className={`p-2 rounded-full transition-colors ${
                        openMenuIndex === i
                          ? 'bg-blue-50 text-blue-500'
                          : 'text-slate-300 hover:text-blue-500 hover:bg-slate-50'
                      }`}
                    >
                      <MoreVertical size={20} />
                    </button>

                    {/* MENÚ DESPLEGABLE */}
                    {openMenuIndex === i && (
                      <div
                        ref={menuRef}
                        className="absolute right-8 top-8 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden text-left"
                      >
                        <div className="flex flex-col py-1">
                          <button
                            onClick={() => handleOpenEdit(row)}
                            className="flex items-center gap-3 px-4 py-3 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors font-bold"
                          >
                            <Edit size={16} /> Editar
                          </button>
                          <button
                            onClick={() => handleToggleStatus(i)}
                            className={`flex items-center gap-3 px-4 py-3 text-xs hover:bg-slate-50 transition-colors font-bold ${
                              row.status === 'Habilitado' ? 'text-red-500' : 'text-emerald-500'
                            }`}
                          >
                            {row.status === 'Habilitado' ? (
                              <>
                                <Ban size={16} /> Deshabilitar
                              </>
                            ) : (
                              <>
                                <CheckCircle size={16} /> Habilitar
                              </>
                            )}
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
        
        {/* PAGINACIÓN - Según Figma */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <div>Pág. 2 de 14 (135 encontrados)</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 hover:bg-slate-50 rounded transition-colors">«</button>
            <button className="px-3 py-1 hover:bg-slate-50 rounded transition-colors">‹</button>
            <button className="px-3 py-1 bg-blue-500 text-white rounded">1</button>
            <button className="px-3 py-1 hover:bg-slate-50 rounded transition-colors">/</button>
            <button className="px-3 py-1 hover:bg-slate-50 rounded transition-colors">3</button>
            <button className="px-3 py-1 hover:bg-slate-50 rounded transition-colors">›</button>
            <button className="px-3 py-1 hover:bg-slate-50 rounded transition-colors">»</button>
          </div>
        </div>
      </div>

      {/* MODAL CREAR / EDITAR ESPECIALIDAD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Fondo Oscuro */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Contenedor del Modal */}
          <div className="relative bg-white w-full max-w-3xl rounded-[28px] px-14 py-12 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-center text-3xl font-bold text-blue-500 flex-1">
                {isEditing ? 'Editar especialidad' : 'Crear especialidad'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-8 top-8 text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Formulario: UNA SOLA FILA (Grid 2 columnas) */}
            <div className="grid grid-cols-2 gap-8">
              {/* Campo: Código */}
              <div>
                <label className="text-sm font-bold text-slate-700 ml-1">Código</label>
                <input
                  type="text"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleInputChange}
                  className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-full px-6 py-3 text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 font-medium"
                />
              </div>

              {/* Campo: Especialidad */}
              <div>
                <label className="text-sm font-bold text-slate-700 ml-1">Especialidad</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
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

              <button
                onClick={handleSubmit}
                className="px-12 py-3 rounded-full text-white font-bold bg-gradient-to-r from-blue-500 to-emerald-400 hover:opacity-90 shadow-lg shadow-blue-200 transition-transform active:scale-95"
              >
                {isEditing ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EspecialidadScreen;
