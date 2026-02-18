import React from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  Upload,
  Microwave,
  WashingMachine,
  Scissors,
  History,
  BarChart3,
  ClipboardList,
} from 'lucide-react';
import type { InformeOption } from '@/types';

const InformesScreen: React.FC = () => {
  const reportOptions: InformeOption[] = [
    {
      title: 'Instrumentos de 3ros',
      icon: Download,
      to: '/informes/ingreso-instrumentos',
    },
    {
      title: 'Indicador biologico statim',
      icon: Microwave,
      to: '/informes/indicador-biologico',
    },
    {
      title: 'Indicador a gas',
      icon: WashingMachine,
      to: '/informes/indicador-gas',
    },
    {
      title: 'Indicadoresde paquetes e instrumentales',
      icon: Scissors,
      to: '/informes/indicador-paquetes',
    },
    {
      title: 'Historial de traslados',
      icon: History,
      to: '/informes/historial-traslados',
    },
    {
      title: 'Indicador de primera carga',
      icon: BarChart3,
      to: '/informes/indicador-primera-carga',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-500">Informes</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportOptions.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all duration-300 border border-slate-50 group flex flex-col items-center justify-center text-center h-64 gap-6 cursor-pointer"
          >
            <div className="text-slate-400 group-hover:text-blue-500 transition-colors transform group-hover:scale-110 duration-300">
              <item.icon strokeWidth={1.5} size={64} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-400 text-lg leading-tight group-hover:text-slate-600 transition-colors">
                {item.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InformesScreen;
