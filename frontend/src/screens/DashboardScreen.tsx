import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { FileText, Wrench, Calendar, ChevronDown } from 'lucide-react';
import type {
  TimeProcessData,
  RejectionData,
  RepetitionData,
  CycleData,
  KitUtilizationData,
  ConsumptionData,
} from '@/types';

const DashboardScreen: React.FC = () => {
  // Estados
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [selectedKitDate, setSelectedKitDate] = useState<string>('Fecha');

  // Datos mock - Promedio de Tiempo en Proceso
  const dataTimeProcess: TimeProcessData[] = [
    { name: 'Recepción', min: 10, max: 45, avg: 30 },
    { name: 'Lavado', min: 15, max: 35, avg: 25 },
    { name: 'Secado', min: 20, max: 50, avg: 35 },
    { name: 'Sellado', min: 10, max: 40, avg: 28 },
    { name: 'Rotulado', min: 15, max: 45, avg: 32 },
    { name: 'Esterilizado', min: 25, max: 60, avg: 45 },
  ];

  // Datos Instrumentos Rechazados
  const dataRejections: RejectionData[] = [
    { name: 'Oxidado', value: 65, color: '#3b82f6' },
    { name: 'Sucio', value: 45, color: '#f59e0b' },
    { name: 'Dañado', value: 30, color: '#ef4444' },
  ];

  // Datos Repeticiones por proceso
  const dataRepetitions: RepetitionData[] = [
    { name: 'Recepción', value: 80 },
    { name: 'Lavado', value: 90 },
    { name: 'Secado', value: 100 },
    { name: 'Sellado', value: 85 },
    { name: 'Rotulado', value: 75 },
    { name: 'Esterilizado', value: 90 },
  ];

  // Datos Ciclos de esterilización
  const dataCycles: CycleData[] = [
    { name: 'Exitosos', value: 90 },
    { name: 'Fallidos', value: 10 },
  ];
  const COLORS_CYCLES = ['#10b981', '#e2e8f0'];

  // Datos Kits
  const kitsData: KitUtilizationData[] = [
    { name: 'Cataratas - Kit 08', val: 91.2, status: 'up' },
    { name: 'Cornea - Kit 04', val: 84.5, status: 'down' },
    { name: 'Glaucoma - Kit 03', val: 80.8, status: 'down' },
    { name: 'Retina - Kit 02', val: 75.6, status: 'up' },
    { name: 'Catarata - Kit 01', val: 75.6, status: 'up' },
  ];

  // Datos Consumo Insumos
  const dataConsumption: ConsumptionData[] = [
    { month: 'Ene', current: 145, previous: 180 },
    { month: 'Feb', current: 165, previous: 170 },
    { month: 'Mar', current: 170, previous: 160 },
    { month: 'Abr', current: 155, previous: 190 },
    { month: 'May', current: 185, previous: 220 },
    { month: 'Jun', current: 210, previous: 200 },
    { month: 'Jul', current: 205, previous: 170 },
    { month: 'Ago', current: 220, previous: 155 },
    { month: 'Sept', current: 245, previous: 150 },
    { month: 'Oct', current: 250, previous: 180 },
    { month: 'Nov', current: 190, previous: 165 },
    { month: 'Dic', current: 195, previous: 150 },
  ];

  // Componente de Box Bar personalizado
  const CustomBoxBar: React.FC<any> = (props) => {
    const { x, y, width, height, fill } = props;
    const radius = 4;
    return (
      <g>
        {/* Línea gris del rango (Bigote) */}
        <line
          x1={x + width / 2}
          y1={y - 15}
          x2={x + width / 2}
          y2={y + height + 15}
          stroke="#cbd5e1"
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Barra del cuerpo (Box) */}
        <rect x={x} y={y} width={width} height={height} fill={fill} rx={radius} ry={radius} />
        {/* Triángulos decorativos extremos */}
        <path
          d={`M${x + width / 2 - 4},${y - 15} L${x + width / 2 + 4},${y - 15} L${x + width / 2},${y - 10} Z`}
          fill="#cbd5e1"
        />
        <path
          d={`M${x + width / 2 - 4},${y + height + 15} L${x + width / 2 + 4},${y + height + 15} L${x + width / 2},${y + height + 10} Z`}
          fill="#cbd5e1"
        />
      </g>
    );
  };

  return (
    <div className="space-y-6 pb-10">
      <h1 className="text-3xl font-bold text-blue-500">Dashboard</h1>

      {/* FILA 1: TIEMPOS, RECHAZOS, KITS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* A. Gráfico de Tiempos de Proceso */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl shadow-soft border border-slate-100 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-bold text-slate-700 text-sm">Promedio de Tiempo en Proceso</h3>
            <span className="px-3 py-1 bg-white text-blue-500 text-xs font-bold rounded-full border border-blue-200 shadow-sm">
              3:10 Tiempo promedio total
            </span>
          </div>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataTimeProcess} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <defs>
                  <linearGradient id="boxGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <Bar dataKey="avg" shape={<CustomBoxBar />} fill="url(#boxGradient)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* B. Instrumentos Rechazados */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-soft border border-slate-100 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-slate-700 text-sm leading-tight">
              Instrumentos rechazados
            </h3>
            <span className="px-2 py-0.5 bg-cyan-50 text-cyan-600 text-[10px] font-bold rounded-full border border-cyan-100">
              15700 Total reportes
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-6">
            {dataRejections.map((item, idx) => (
              <div key={idx} className="group">
                <div className="flex justify-between text-xs mb-2 text-slate-500 font-medium pl-1">
                  <span>{item.name}</span>
                  <span className="text-slate-400">{item.value}00</span>
                </div>
                <div className="h-4 w-full bg-slate-50 rounded-full relative">
                  <div
                    className="h-full rounded-full shadow-sm relative"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* C. Utilización de Kit */}
        <div className="lg:col-span-3 bg-white p-6 rounded-3xl shadow-soft border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-700 text-sm">Utilización de Kit</h3>
            <button 
              className="flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-xs hover:bg-slate-100 transition-colors"
              onClick={() => setSelectedKitDate(selectedKitDate === 'Fecha' ? '2025' : 'Fecha')}
            >
              <span>{selectedKitDate}</span>
              <Calendar size={12} className="text-slate-400" />
            </button>
          </div>
          <div className="space-y-4">
            {kitsData.map((kit, i) => (
              <div
                key={i}
                className="flex justify-between items-center pb-3 border-b border-slate-50 last:border-0"
              >
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">
                    {kit.name.split(' - ')[0]}
                  </div>
                  <div className="text-sm font-bold text-blue-600">{kit.name.split(' - ')[1]}</div>
                </div>
                <span
                  className={`text-xs font-bold flex items-center gap-1 ${
                    kit.status === 'up' ? 'text-emerald-500' : 'text-rose-500'
                  }`}
                >
                  {kit.status === 'up' ? '↑' : '↓'} {kit.val}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FILA 2: CICLOS, KPI, REPETICIONES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* D. Ciclos de Esterilización (Donut Chart) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-3xl shadow-soft border border-slate-100 relative flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-2">
            <h3 className="font-bold text-slate-700 text-sm">Ciclos de esterilización</h3>
          </div>
          <div className="w-full h-[180px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataCycles}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={75}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                  paddingAngle={5}
                >
                  {dataCycles.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_CYCLES[index]} cornerRadius={10} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Texto Centro */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-slate-700 tracking-tight">90%</span>
              <span className="text-xs text-slate-400 font-medium">Efectividad</span>
              <span className="text-[10px] text-cyan-500 font-bold mt-1">4000</span>
            </div>
          </div>

          <div className="flex gap-4 justify-center w-full mt-2 text-[10px] font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-emerald-500"></div>
              Exitosos
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-slate-200"></div>
              Fallidos
            </div>
          </div>
        </div>

        {/* E. Gestión Realizada (KPIs) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-3xl shadow-soft border border-slate-100 flex flex-col justify-center gap-8">
          <h3 className="font-bold text-slate-700 text-sm">Gestión realizada</h3>

          <div className="flex items-center gap-5">
            <div className="p-3.5 bg-blue-50 text-blue-500 rounded-2xl border border-blue-100">
              <FileText size={26} />
            </div>
            <div>
              <div className="text-3xl font-black text-blue-400 leading-none mb-1">3712</div>
              <div className="text-xs text-slate-400 font-medium">Reportes</div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
              <Wrench size={26} />
            </div>
            <div>
              <div className="text-3xl font-black text-blue-600 leading-none mb-1">4509</div>
              <div className="text-xs text-slate-400 font-medium">Mantenimientos</div>
            </div>
          </div>
        </div>

        {/* F. Repeticiones por Proceso */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl shadow-soft border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-700 text-sm">Repeticiones por proceso</h3>
            <button 
              className="border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-2 text-slate-500 text-xs hover:bg-slate-50 transition-colors"
              onClick={() => setSelectedYear(selectedYear === '2025' ? '2024' : '2025')}
            >
              <span>Año</span> <Calendar size={14} className="text-slate-400" />
            </button>
          </div>
          <div className="flex-1 space-y-4">
            {dataRepetitions.map((item, idx) => (
              <div key={idx} className="flex items-center text-xs gap-4">
                <span className="w-20 text-slate-400 font-medium text-right">{item.name}</span>
                <div className="flex-1 h-3.5 bg-slate-50 rounded-full overflow-hidden relative group cursor-pointer">
                  <div
                    className="h-full rounded-full transition-all duration-500 relative"
                    style={{
                      width: `${item.value}%`,
                      background:
                        idx === 2
                          ? '#10b981' // Secado (Green)
                          : idx === 4
                          ? '#f59e0b' // Rotulado (Yellow)
                          : '#3b82f6', // Default Blue
                    }}
                  >
                    {item.value === 100 && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-white font-bold">
                        4000
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FILA 3: CONSUMOS DE INSUMOS */}
      <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100">
        {/* Header con Filtros */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h3 className="font-bold text-slate-700 text-sm">
            Promedio de Consumos de Insumos Quirúrgicos
          </h3>

          <div className="flex flex-wrap items-center gap-3">
            {/* Leyenda Año Anterior */}
            <div className="flex items-center gap-2 mr-4">
              <div className="w-6 h-1 bg-slate-300 rounded-full"></div>
              <span className="text-xs text-slate-400 font-medium">Año anterior</span>
            </div>

            {/* Dropdowns */}
            <div className="flex gap-2">
              {['Año', 'Tipo de insumo', 'Proveedor'].map((label, i) => (
                <button
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-full text-xs text-slate-500 hover:border-blue-300 bg-white transition-colors"
                >
                  {label} <ChevronDown size={14} className="text-slate-300" />
                </button>
              ))}
            </div>

            {/* Botón Resumen */}
            <button className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">
              820 Consumo promedio
            </button>
          </div>
        </div>

        {/* Gráfico de Área */}
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={dataConsumption}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              />

              {/* Año Anterior (Gris) */}
              <Area
                type="monotone"
                dataKey="previous"
                stroke="#cbd5e1"
                strokeWidth={3}
                fill="transparent"
              />

              {/* Año Actual (Azul con Gradiente) */}
              <Area
                type="monotone"
                dataKey="current"
                stroke="#0ea5e9"
                strokeWidth={3}
                fill="url(#colorCurrent)"
                activeDot={{ r: 6, strokeWidth: 0, fill: '#0ea5e9' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
