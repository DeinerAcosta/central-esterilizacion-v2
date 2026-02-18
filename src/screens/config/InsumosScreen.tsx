import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, PlusCircle, MoreVertical, ChevronDown, X, Edit, Ban, FileText, CheckCircle,
  ChevronLeft, ChevronRight // <--- Importamos los iconos de paginación
} from 'lucide-react';

const InsumosScreen: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [openMenuIndex, setOpenMenuIndex] = useState<any>(null);
  const menuRef = useRef(null);
  const [modalMode, setModalMode] = useState<any>('create');
  const [isAlertOpen, setIsAlertOpen] = useState<any>(false);
  const [itemToToggle, setItemToToggle] = useState<any>(null);
  const [isErrorOpen, setIsErrorOpen] = useState<any>(false);
  const [formData, setFormData] = useState<any>({
      nombre: '',
      unidad: '',
      pres: '',
      desc: '',
      status: 'Habilitado',
      reqEst: 'no',
      tipoEst: { gas: false, vapor: false }
  });

  const [data, setData] = useState<any>([
    { id: 1, nombre: 'Attest indicador biologico rapid 1219', unidad: 'centímetros', est: 'Autoclave', pres: 'Caja', status: 'Habilitado', desc: 'Indicador biológico para control de carga', reqEst: 'si', tipoEst: { gas: false, vapor: true } },
    { id: 2, nombre: 'Guantes de nitrilo talla m', unidad: 'unidad', est: 'No aplica', pres: 'Caja', status: 'Habilitado', desc: 'Guantes de examen sin polvo', reqEst: 'no', tipoEst: { gas: false, vapor: false } },
    { id: 3, nombre: 'Rollo para esterilizar', unidad: '2,00 mts x 15 cms', est: 'No aplica', pres: 'Rollo', status: 'Habilitado', desc: 'Rollo mixto para esterilización', reqEst: 'no', tipoEst: { gas: false, vapor: false } },
    { id: 4, nombre: 'Compresas quirúrgicas tela 4 capas', unidad: '45 cms x 45 cms', est: 'No aplica', pres: 'Caja', status: 'Habilitado', desc: 'Compresas abdominales estériles', reqEst: 'no', tipoEst: { gas: false, vapor: false } },
    { id: 5, nombre: 'Comply cinta control vapor 1355', unidad: 'centímetros', est: 'No aplica', pres: 'Caja', status: 'Deshabilitado', desc: 'Cinta testigo para vapor', reqEst: 'no', tipoEst: { gas: false, vapor: false } },
    { id: 6, nombre: 'Anios rl lubricante instrumental', unidad: '1 litro', est: 'No aplica', pres: 'Botella', status: 'Deshabilitado', desc: 'Lubricante hidrosoluble', reqEst: 'no', tipoEst: { gas: false, vapor: false } },
  ]);


  const toggleMenu = (index, e) => {
    e.stopPropagation();
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: any) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleCheckboxChange = (type) => {
      setFormData(prev => ({
          ...prev,
          tipoEst: { ...prev.tipoEst, [type]: !prev.tipoEst[type] }
      }));
  };
  const handleRadioChange = (val) => {
      setFormData(prev => ({ ...prev, reqEst: val }));
  };
  const handleCreate: React.FC = () => {
    setModalMode('create');
    setFormData({
        nombre: '',
        unidad: '',
        pres: '',
        desc: '',
        status: 'Habilitado',
        reqEst: 'no',
        tipoEst: { gas: false, vapor: false }
    });
    setIsModalOpen(true);
    setOpenMenuIndex(null);
  };

  const handleEdit = (item) => {
    setModalMode('edit');
    setFormData({
        ...item
    });
    setIsModalOpen(true);
    setOpenMenuIndex(null);
  };

  const handleView = (item) => {
    setModalMode('view');
    setFormData({
        ...item
    });
    setIsModalOpen(true);
    setOpenMenuIndex(null);
  };
  const handleSave: React.FC = () => {
      if (!formData.nombre.trim() || !formData.unidad || !formData.pres || !formData.desc.trim()) {
          setIsErrorOpen(true); // ABRIR ALERTA DE ERROR
          return;
      }

      console.log("Guardando...", formData);
      setIsModalOpen(false);
  };

  const handleToggleClick = (item, index) => {
    setItemToToggle({ ...item, index });
    setIsAlertOpen(true);
    setOpenMenuIndex(null);
  };

  const confirmToggle: React.FC = () => {
    if (itemToToggle) {
        const newData = [...data];
        const newStatus = itemToToggle.status === 'Habilitado' ? 'Deshabilitado' : 'Habilitado';
        newData[itemToToggle.index].status = newStatus;
        setData(newData);
    }
    setIsAlertOpen(false);
    setItemToToggle(null);
  };

  return (
    <div className="space-y-6 h-full flex flex-col font-sans relative" onClick={() => setOpenMenuIndex(null)}>
      
      <h1 className="text-3xl font-bold text-blue-500">Insumos Quirúrgicos</h1>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-2 rounded-xl">
        <div className="flex gap-4 flex-1 w-full md:w-auto">
           <div className="relative">
             <select className="appearance-none bg-slate-50 border border-slate-200 rounded-full pl-4 pr-10 py-2.5 text-slate-500 text-sm font-medium w-40 outline-none cursor-pointer">
                <option>Estado</option>
                <option>Habilitado</option>
                <option>Deshabilitado</option>
             </select>
             <ChevronDown size={16} className="absolute right-4 top-3 text-slate-400 pointer-events-none" />
           </div>

           <div className="relative flex-1 max-w-3xl">
              <input type="text" placeholder="Buscar..." className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-5 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-100 text-slate-600"/>
              <Search className="absolute right-4 top-2.5 text-blue-400" size={18} />
           </div>
        </div>
        <button 
            onClick={handleCreate}
            className="flex items-center gap-2 text-blue-500 font-bold text-sm hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
        >
            Crear insumo <PlusCircle size={18} />
        </button>
      </div>
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-visible flex-1 flex flex-col">
        <div className="overflow-visible flex-1">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Unidad de medida</th>
                <th className="px-6 py-4">Esterilización</th>
                <th className="px-6 py-4">Presentación</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-4 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-500 font-medium">{row.nombre}</td>
                  <td className="px-6 py-4 text-slate-500">{row.unidad}</td>
                  <td className="px-6 py-4 text-slate-500">{row.est}</td>
                  <td className="px-6 py-4 text-slate-500">{row.pres}</td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold border ${row.status === 'Habilitado' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                        {row.status}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4 text-right relative">
                    <button 
                        onClick={(e: any) => toggleMenu(i, e)}
                        className={`p-1 rounded-full transition-colors ${openMenuIndex === i ? 'bg-blue-50 text-blue-500' : 'text-slate-300 hover:text-blue-500 hover:bg-slate-50'}`}
                    >
                        <MoreVertical size={20} />
                    </button>
                    {openMenuIndex === i && (
                        <div ref={menuRef} className="absolute right-8 top-8 w-44 bg-white rounded-lg shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                            <div className="flex flex-col py-1">
                                <button 
                                    onClick={() => handleEdit(row)}
                                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors text-left font-medium"
                                >
                                    <Edit size={14} /> Editar
                                </button>
                                <button 
                                    onClick={() => handleToggleClick(row, i)} 
                                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-red-500 transition-colors text-left font-medium"
                                >
                                    {row.status === 'Habilitado' ? <Ban size={14} /> : <CheckCircle size={14} />} 
                                    {row.status === 'Habilitado' ? 'Deshabilitar' : 'Habilitar'}
                                </button>
                                <button 
                                    onClick={() => handleView(row)}
                                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-500 transition-colors text-left font-medium"
                                >
                                    <FileText size={14} /> Ver detalle
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
            <span>Pág. 1 de 3 (6 encontrados)</span>
            <div className="flex items-center gap-2 font-medium text-blue-400">
                <button className="hover:text-blue-600 transition-colors"><ChevronLeft size={14} /></button>
                <span className="bg-blue-50 px-2 py-0.5 rounded text-blue-600 cursor-pointer">1</span>
                <span>/</span><span>3</span>
                <button className="hover:text-blue-600 transition-colors"><ChevronRight size={14} /></button>
            </div>
        </div>

      </div>

      {isAlertOpen && itemToToggle && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 font-sans">
             <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity" onClick={() => setIsAlertOpen(false)} />
             
             <div className="relative bg-white w-full max-w-[400px] rounded-[30px] p-8 flex flex-col items-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="w-20 h-20 bg-amber-400 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <span className="text-white text-5xl font-bold">!</span>
                </div>
                <h3 className="text-2xl font-bold text-blue-500 mb-2">¿Está seguro?</h3>
                <p className="text-slate-400 text-center text-sm mb-8 px-4">
                    Se {itemToToggle.status === 'Habilitado' ? 'deshabilitará' : 'habilitará'} insumo: <br/>
                    <span className="text-slate-600 font-semibold">{itemToToggle.nombre}</span>
                </p>
                <div className="flex gap-6">
                    <button onClick={() => setIsAlertOpen(false)} className="text-slate-600 font-bold text-sm hover:text-slate-800 transition-colors">Cancelar</button>
                    <button onClick={confirmToggle} className="px-8 py-2.5 rounded-full text-white font-bold bg-gradient-to-r from-blue-400 to-emerald-400 hover:opacity-90 shadow-lg shadow-blue-200 transition-transform active:scale-95 text-sm">Si, continuar</button>
                </div>
             </div>
        </div>
      )}
      {isErrorOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 font-sans">
             <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity" onClick={() => setIsErrorOpen(false)} />
             
             <div className="relative bg-white w-full max-w-[400px] rounded-[30px] p-8 flex flex-col items-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="w-20 h-20 bg-red-400 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <X className="text-white" size={40} strokeWidth={4} />
                </div>
                <h3 className="text-2xl font-bold text-blue-500 mb-2">Error</h3>
                <p className="text-slate-400 text-center text-sm mb-8 px-4 font-medium">
                    Es necesario diligenciar todos los campos obligatorios.
                </p>
                <button 
                    onClick={() => setIsErrorOpen(false)} 
                    className="px-12 py-2.5 rounded-full text-white font-bold bg-gradient-to-r from-blue-400 to-emerald-400 hover:opacity-90 shadow-lg shadow-blue-200 transition-transform active:scale-95 text-sm"
                >
                    Aceptar
                </button>
             </div>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 font-sans">
          
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />

          <div className="relative bg-white w-[612px] rounded-[16px] pt-6 pr-[42px] pb-10 pl-[42px] shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-6">

            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors">
                <X size={24} />
            </button>

            <h2 className="text-center text-2xl font-bold text-blue-500 mb-2">
              {modalMode === 'create' && 'Crear insumo'}
              {modalMode === 'edit' && 'Editar insumo'}
              {modalMode === 'view' && 'Detalle del insumo'}
            </h2>
            <div className="grid grid-cols-10 gap-4">
                <div className="col-span-7">
                    <label className="text-sm font-bold text-slate-700 ml-2">Nombre<span className="text-red-500">*</span></label>
                    <input 
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        disabled={modalMode === 'view'}
                        className={`mt-2 w-full h-11 border border-slate-300 rounded-full px-6 text-slate-600 outline-none focus:border-blue-400 transition-colors text-sm ${modalMode === 'view' ? 'bg-slate-100 cursor-not-allowed' : 'bg-white'}`} 
                    />
                </div>
                <div className="col-span-3">
                    <label className="text-sm font-bold text-slate-700 ml-2">Presentación<span className="text-red-500">*</span></label>
                    <div className="relative mt-2">
                        <select 
                            name="pres"
                            value={formData.pres}
                            onChange={handleInputChange}
                            disabled={modalMode === 'view'}
                            className={`w-full h-11 border border-slate-300 rounded-full px-4 appearance-none text-slate-600 outline-none focus:border-blue-400 cursor-pointer text-sm ${modalMode === 'view' ? 'bg-slate-100 cursor-not-allowed' : 'bg-white'}`}
                        >
                            <option value="">Seleccionar</option>
                            <option>Caja</option>
                            <option>Rollo</option>
                            <option>Botella</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={16}/>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-10 gap-4">
                <div className="col-span-3">
                    <label className="text-sm font-bold text-slate-700 ml-2 whitespace-nowrap">Unidad de medida<span className="text-red-500">*</span></label>
                    <div className="relative mt-2">
                        <select 
                            name="unidad"
                            value={formData.unidad}
                            onChange={handleInputChange}
                            disabled={modalMode === 'view'}
                            className={`w-full h-11 border border-slate-300 rounded-full px-4 appearance-none text-slate-600 outline-none focus:border-blue-400 cursor-pointer text-sm ${modalMode === 'view' ? 'bg-slate-100 cursor-not-allowed' : 'bg-white'}`}
                        >
                            <option value="">Seleccionar</option>
                            <option>Unidad</option>
                            <option>Centímetros</option>
                            <option>1 litro</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={16}/>
                    </div>
                </div>
                <div className="col-span-7">
                    <label className="text-sm font-bold text-slate-700 ml-2">Descripción<span className="text-red-500">*</span></label>
                    <input 
                        name="desc"
                        value={formData.desc}
                        onChange={handleInputChange}
                        disabled={modalMode === 'view'}
                        className={`mt-2 w-full h-11 border border-slate-300 rounded-full px-6 text-slate-600 outline-none focus:border-blue-400 transition-colors text-sm ${modalMode === 'view' ? 'bg-slate-100 cursor-not-allowed' : 'bg-white'}`} 
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm font-bold text-slate-700 ml-2 mb-3">¿Requiere esterilización?</p>
                    <div className="flex gap-4 pl-2">
                    <label className={`flex items-center gap-2 cursor-pointer text-slate-600 text-sm font-medium transition-colors ${modalMode === 'view' ? 'cursor-not-allowed' : 'hover:text-blue-500'}`}>
                        <input
                        type="radio"
                        name="reqEst"
                        disabled={modalMode === 'view'}
                        className="accent-blue-500 w-4 h-4"
                        checked={formData.reqEst === "si"}
                        onChange={() => handleRadioChange("si")}
                        />
                        Sí
                    </label>
                    <label className={`flex items-center gap-2 cursor-pointer text-slate-600 text-sm font-medium transition-colors ${modalMode === 'view' ? 'cursor-not-allowed' : 'hover:text-blue-500'}`}>
                        <input
                        type="radio"
                        name="reqEst"
                        disabled={modalMode === 'view'}
                        className="accent-blue-500 w-4 h-4"
                        checked={formData.reqEst === "no"}
                        onChange={() => handleRadioChange("no")}
                        />
                        No aplica
                    </label>
                    </div>
                </div>

                <div>
                    <p className={`text-sm font-bold ml-2 mb-3 ${formData.reqEst === 'no' ? 'text-slate-300' : 'text-slate-700'}`}>Tipo de esterilización</p>
                    <div className="flex gap-6 pl-2">
                    <label className={`flex items-center gap-2 text-sm font-medium ${formData.reqEst === 'no' || modalMode === 'view' ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 cursor-pointer hover:text-blue-500'}`}>
                        <input 
                            type="checkbox" 
                            disabled={formData.reqEst === 'no' || modalMode === 'view'} 
                            checked={formData.tipoEst.gas}
                            onChange={() => handleCheckboxChange('gas')}
                            className="accent-blue-500 w-4 h-4 rounded"
                        /> Gas
                    </label>
                    <label className={`flex items-center gap-2 text-sm font-medium ${formData.reqEst === 'no' || modalMode === 'view' ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 cursor-pointer hover:text-blue-500'}`}>
                        <input 
                            type="checkbox" 
                            disabled={formData.reqEst === 'no' || modalMode === 'view'} 
                            checked={formData.tipoEst.vapor}
                            onChange={() => handleCheckboxChange('vapor')}
                            className="accent-blue-500 w-4 h-4 rounded"
                        /> Vapor
                    </label>
                    </div>
                </div>
            </div>

            <div className="mt-auto flex justify-center gap-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className={`text-slate-500 font-bold hover:text-red-500 transition-colors text-sm ${modalMode === 'view' ? 'px-8 py-2.5 border border-slate-300 rounded-full hover:border-red-500' : ''}`}
              >
                Cancelar
              </button>

              {modalMode !== 'view' && (
                  <button 
                    onClick={handleSave} // VALIDACIÓN AL GUARDAR
                    className="px-12 py-2.5 rounded-full text-white font-bold bg-gradient-to-r from-blue-400 to-emerald-400 hover:opacity-90 shadow-lg shadow-blue-200 transition-transform active:scale-95 text-sm"
                  >
                    Guardar
                  </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default InsumosScreen;