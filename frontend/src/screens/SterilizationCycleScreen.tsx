import React, { useState } from 'react';
import { Search, CheckCircle2, AlertCircle, Camera } from 'lucide-react';

const SterilizationCycleScreen: React.FC = () => {
  const [activeStep, setActiveStep] = useState<any>(0);
  
  const steps = [
    { id: 'recepcion', label: 'Recepción' },
    { id: 'lavado', label: 'Lavado' },
    { id: 'secado', label: 'Secado' },
    { id: 'sellado', label: 'Sellado' },
    { id: 'rotulado', label: 'Rotulado' },
    { id: 'esterilizado', label: 'Esterilizado' },
  ];

  const goodItems = [
    { name: 'Bisturí de córnea', qty: 1 },
    { name: 'Blefaróstato de Barraquer', qty: 1 },
    { name: 'Pinzas de iris', qty: 1 },
    { name: 'Portaagujas de Barraquer', qty: 1 },
  ];

  const badItems = [
    { name: 'Espátula de iris', qty: 2 },
    { name: 'Ganchos de iris', qty: 2 },
  ];

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      <div className="w-16 lg:w-64 bg-white rounded-xl shadow-sm border border-slate-100 hidden md:block overflow-hidden">
        <div className="p-4 border-b border-slate-100">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input type="text" placeholder="Buscar..." className="w-full bg-slate-50 pl-10 pr-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100"/>
            </div>
        </div>
        <div className="py-2">
            {steps.map((step, idx) => (
                <button 
                    key={step.id}
                    onClick={() => setActiveStep(idx)}
                    className={`w-full text-left px-6 py-4 flex items-center gap-3 ${idx === activeStep ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-500' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${idx === activeStep ? 'bg-blue-100' : 'bg-slate-100'}`}>
                        <span className="text-xs font-bold">{idx + 1}</span>
                    </div>
                    <span className="font-medium">{step.label}</span>
                </button>
            ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-wrap gap-4 text-sm text-slate-600 justify-between items-center">
            <div className="flex gap-6">
                <div>
                    <span className="block text-xs text-slate-400">Quirófano</span>
                    <span className="font-semibold text-slate-800">Quirófano 8</span>
                </div>
                <div className="w-px bg-slate-200 h-8"></div>
                <div>
                    <span className="block text-xs text-slate-400">Especialidad</span>
                    <span className="font-semibold text-slate-800">Oftalmología</span>
                </div>
                <div className="w-px bg-slate-200 h-8"></div>
                <div>
                    <span className="block text-xs text-slate-400">Kit</span>
                    <span className="font-semibold text-slate-  800 text-blue-600">KIT 01</span>
                </div>
            </div>
            <div>
                 <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">ID: 02/12/2025-Q1</span>
            </div>
        </div>
        <div className="flex-1 flex gap-6 min-h-0">
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col relative">
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                        <AlertCircle className="shrink-0 mt-0.5" size={18} />
                        <div className="text-sm">
                            <span className="font-bold block">Alerta: Faltan instrumentos</span>
                            <span className="opacity-80">Por favor, escanea o reporta los elementos pendientes.</span>
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-emerald-900/5 flex items-center justify-center">
                        <p className="text-slate-400 font-medium">Vista de Cámara / Detección IA</p>
                    </div>
                    <div className="absolute top-1/4 left-1/4 w-32 h-64 border-2 border-emerald-400 bg-emerald-400/10 rounded"></div>
                    <div className="absolute top-1/3 right-1/3 w-24 h-48 border-2 border-red-400 bg-red-400/10 rounded"></div>
                    <button className="absolute bottom-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-lg flex items-center gap-2 transition-transform active:scale-95">
                        <Camera size={18} />
                        Escanear
                    </button>
                </div>
            </div>
            <div className="w-80 flex flex-col gap-4 overflow-y-auto">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                    <h3 className="text-emerald-600 font-bold mb-3 flex items-center gap-2">
                        <CheckCircle2 size={18} /> Buen estado
                    </h3>
                    <div className="space-y-0">
                        {goodItems.map((item, i) => (
                            <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 text-sm">
                                <span className="text-slate-600 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                    {item.name}
                                </span>
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-xs text-slate-500">{item.qty}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 border-l-4 border-l-red-400">
                    <h3 className="text-red-500 font-bold mb-3 flex items-center gap-2">
                        <AlertCircle size={18} /> Mal estado
                    </h3>
                    <div className="space-y-0">
                        {badItems.map((item, i) => (
                            <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 text-sm">
                                <span className="text-slate-600 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-200"></span>
                                    {item.name}
                                </span>
                                <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-xs border border-red-100">{item.qty}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-auto flex gap-2 pt-2">
                    <button className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium">Atrás</button>
                    <button className="flex-1 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-200 text-sm font-medium">Guardar</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SterilizationCycleScreen;