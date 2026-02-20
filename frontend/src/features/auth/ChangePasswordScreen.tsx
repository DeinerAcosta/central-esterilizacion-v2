import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChangePasswordScreen: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alerta, setAlerta] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const navigate = useNavigate();

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setAlerta(null);

    // Reglas del Tablero Sprint 1
    if (newPassword !== confirmPassword) {
      setAlerta('La contraseña no coinciden'); // Texto exacto del tablero
      return;
    }

    if (newPassword.length < 8) {
      setAlerta('Falta caracteres (Mínimo 8)');
      return;
    }

    // Si todo está bien
    setExito(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 font-sans p-4">
      <div className="bg-white w-full max-w-5xl h-[650px] rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row shadow-blue-200/50">
        
        {/* SECCIÓN IZQUIERDA: BRANDING COHERENTE */}
        <div className="hidden md:flex w-1/2 relative flex-col justify-end p-12 text-white">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-584820927498-3f5455fb49e7?q=80&w=2080&auto=format&fit=crop" 
              alt="Seguridad Médica" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-blue-800/40 to-transparent"></div>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 mb-2">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <h2 className="text-4xl font-bold leading-tight">Seguridad de <br/>la Cuenta</h2>
            <p className="text-blue-100 text-sm opacity-90 max-w-xs">Es necesario actualizar su contraseña provisional para garantizar la protección de su información.</p>
          </div>
        </div>

        {/* SECCIÓN DERECHA: FORMULARIO DE CAMBIO */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-10 md:px-20 py-12">
          
          <div className="mb-8">
            <h3 className="text-3xl font-black text-slate-800 mb-2">Nueva Contraseña</h3>
            <p className="text-slate-400 text-sm font-medium">Cree una combinación segura de letras y números.</p>
          </div>

          {/* ESTADOS DE ALERTA O ÉXITO */}
          {alerta && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-xs font-bold uppercase tracking-wider">
              <AlertCircle size={16} /> {alerta}
            </div>
          )}

          {exito && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-emerald-600 text-xs font-bold uppercase tracking-wider animate-bounce">
              <CheckCircle2 size={16} /> Contraseña actualizada exitosamente
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {/* Password Actual (Provisional) */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[2px] font-black text-slate-400 ml-4">Contraseña Actual</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full h-12 bg-slate-50 border-2 border-slate-100 rounded-full pl-14 pr-6 focus:border-blue-500 transition-all outline-none text-slate-600 text-sm"
                  placeholder="Ingrese clave provisional"
                />
              </div>
            </div>

            {/* Nueva Password */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[2px] font-black text-slate-400 ml-4">Nueva Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-12 bg-slate-50 border-2 border-slate-100 rounded-full pl-14 pr-6 focus:border-blue-500 transition-all outline-none text-slate-600 text-sm"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
            </div>

            {/* Confirmar Password */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[2px] font-black text-slate-400 ml-4">Confirmar Nueva Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-12 bg-slate-50 border-2 border-slate-100 rounded-full pl-14 pr-6 focus:border-blue-500 transition-all outline-none text-slate-600 text-sm"
                  placeholder="Repita su nueva contraseña"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-black uppercase tracking-widest text-xs rounded-full shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-8"
            >
              Actualizar y Entrar
              <ArrowRight size={18} />
            </button>
          </form>

          <button 
            onClick={() => navigate('/')}
            className="mt-6 text-[10px] font-bold text-slate-400 hover:text-red-400 uppercase tracking-widest transition-colors"
          >
            Cancelar y Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordScreen;