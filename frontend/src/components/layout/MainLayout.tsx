import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  RefreshCw,
  FileText,
  ClipboardList,
  Settings,
  Bell,
  ChevronDown,
  ChevronUp,
  FileBarChart,
} from 'lucide-react';
import { NavItemProps } from '@/types';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, dropdownItems, name }) => {
    const isActive = location.pathname.includes(to) && !dropdownItems;
    const isDropdownOpen = openDropdown === name;

    if (dropdownItems && name) {
      return (
        <div className="relative group">
          <button
            onClick={() => toggleDropdown(name)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition-colors ${
              isDropdownOpen ? 'bg-white/10 font-medium' : ''
            }`}
          >
            {Icon && <Icon size={18} />}
            <span className="text-sm font-medium">{label}</span>
            {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-slate-100 py-2 z-50 text-slate-700">
              {dropdownItems.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.to || '#'}
                  className="block px-4 py-2.5 hover:bg-slate-50 hover:text-blue-500 text-sm transition-colors text-slate-600"
                  onClick={() => setOpenDropdown(null)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        to={to}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
          isActive
            ? 'text-white font-bold bg-white/20'
            : 'text-white/80 hover:text-white hover:bg-white/10'
        }`}
      >
        {Icon && <Icon size={18} />}
        <span className="text-sm font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* HEADER con gradiente según Figma */}
      <header className="gradient-header text-white shadow-header">
        <div className="px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6 lg:gap-8">
            <div className="font-bold text-lg tracking-wider uppercase">
              Central de Esterilización
            </div>

            <nav className="hidden xl:flex items-center gap-1 text-sm">
              <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />

              <NavItem
                name="ciclo"
                label="Ciclo Esterilización"
                icon={RefreshCw}
                to="/ciclo/instrumentos"
                dropdownItems={[
                  { label: 'Trazabilidad Qx', to: '/ciclo/trazabilidad' },
                  { label: 'Instrumentos Qx', to: '/ciclo/instrumentos' },
                  { label: 'Insumos Qx', to: '/ciclo/insumos' },
                  { label: 'Histórico de ciclo', to: '/ciclo/historico' },
                  { label: 'Tablero de ciclos', to: '/ciclo/tablero' },
                  { label: 'Almacenamiento', to: '/ciclo/almacenamiento' },
                ]}
              />

              <NavItem to="/hojas-vida" icon={FileText} label="Hojas de vida" />
              <NavItem to="/reporte" icon={ClipboardList} label="Reporte" />
              <NavItem to="/informes" icon={FileBarChart} label="Informes" />

              <NavItem
                name="config"
                label="Configuración"
                icon={Settings}
                to="/config/especialidad"
                dropdownItems={[
                  { label: 'Insumos Quirúrgicos', to: '/config/insumos' },
                  { label: 'Proveedores', to: '/config/proveedores' },
                  { label: 'Especialidad', to: '/config/especialidad' },
                  { label: 'Subespecialidad', to: '/config/subespecialidad' },
                  { label: 'Tipo de subespecialidad', to: '/config/tipo-subespecialidad' },
                  { label: 'Kit', to: '/config/kit' },
                  { label: 'Sedes', to: '/config/sedes' },
                  { label: 'Quirófano', to: '/config/quirofano' },
                  { label: 'Usuarios', to: '/config/usuarios' },
                ]}
              />
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/20 rounded-full relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full border border-blue-500"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/20">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Juan"
                alt="Avatar"
                className="w-9 h-9 rounded-full bg-white/20 p-0.5"
              />
              <span className="font-medium text-sm hidden lg:block">Juan Pablo C.</span>
              <ChevronDown size={16} className="opacity-70" />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
