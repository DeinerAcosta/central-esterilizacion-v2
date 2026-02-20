import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Activity, AlertCircle, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginScreen: React.FC = () => {
  // Estados de Formulario
  const [isRecovering, setIsRecovering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [alerta, setAlerta] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  const navigate = useNavigate();

  // Cargar "Recordarme" al iniciar (Requisito del Tablero)
  useEffect(() => {
    const savedEmail = localStorage.getItem('remember_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAlerta(null);

    if (!email || !password) {
      setAlerta('Usuario o contraseña incorrectos'); // Texto exacto del tablero
      return;
    }

    // Lógica Recordarme
    if (rememberMe) {
      localStorage.setItem('remember_email', email);
    } else {
      localStorage.removeItem('remember_email');
    }

    // SIMULACIÓN DE LOGIN (Aquí conectarás con tu MySQL después)
    console.log('Iniciando sesión...');
    navigate('/dashboard');
  };

  const handleRecoverPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setAlerta('El correo ingresado no está registrado en el sistema');
      return;
    }
    // Simulación envío correo (Sprint 1)
    setExito('Se ha enviado una contraseña provisional a su correo electrónico');
    setAlerta(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 font-sans p-4">
      <div className="bg-white w-full max-w-5xl h-[650px] rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row shadow-blue-200/50">
        
        {/* SECCIÓN IZQUIERDA: IMAGEN (Aquí va la imagen del médico que mencionas) */}
        <div className="hidden md:flex w-1/2 relative flex-col justify-end p-12 text-white">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-579684388220-3814467b7f6c?q=80&w=1974&auto=format&fit=crop" 
              alt="Médico Central de Esterilización" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-800/40 to-transparent"></div>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 mb-2">
              <Activity size={28} className="text-white" />
            </div>
            <h2 className="text-4xl font-bold leading-tight">
              Central de <br/>Esterilización
            </h2>
            <p className="text-blue-100 text-sm opacity-90 max-w-xs">
              Sistema integral de trazabilidad y gestión de instrumental quirúrgico 2026.
            </p>
          </div>
        </div>

        {/* SECCIÓN DERECHA: FORMULARIO DINÁMICO */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-10 md:px-20 py-12">
          
          <div className="mb-10">
            <h3 className="text-3xl font-black text-slate-800 mb-2">
              {isRecovering ? 'Recuperar Cuenta' : 'Bienvenido'}
            </h3>
            <p className="text-slate-400 text-sm font-medium">
              {isRecovering 
                ? 'Ingrese su correo para recibir una contraseña provisional.' 
                : 'Gestione sus procesos de forma segura.'}
            </p>
          </div>

          {/* ALERTAS */}
          {alerta && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-xs animate-pulse">
              <AlertCircle size={16} />
              <span className="font-bold uppercase tracking-wider">{alerta}</span>
            </div>
          )}
          {exito && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-emerald-600 text-xs font-bold uppercase tracking-wider">
              <Activity size={16} /> {exito}
            </div>
          )}

          <form onSubmit={isRecovering ? handleRecoverPassword : handleLogin} className="space-y-5">
            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest font-black text-slate-400 ml-4">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-full pl-14 pr-6 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-medium"
                  placeholder="usuario@hospital.com"
                />
              </div>
            </div>

            {/* PASSWORD (Solo si no está recuperando) */}
            {!isRecovering && (
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-widest font-black text-slate-400 ml-4">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-full pl-14 pr-14 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-medium"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {/* OPCIONES ADICIONALES (Recordarme / Olvidé) */}
            {!isRecovering && (
              <div className="flex items-center justify-between px-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700">Recordarme</span>
                </label>
                <button 
                  type="button"
                  onClick={() => { setIsRecovering(true); setAlerta(null); setExito(null); }}
                  className="text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors"
                >
                  ¿Olvidó su contraseña?
                </button>
              </div>
            )}

            {/* BOTÓN PRINCIPAL */}
            <button 
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-black uppercase tracking-widest text-xs rounded-full shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
            >
              {isRecovering ? 'Enviar Contraseña' : 'Entrar al Sistema'}
              <ArrowRight size={18} />
            </button>

            {/* VOLVER AL LOGIN */}
            {isRecovering && (
              <button 
                type="button"
                onClick={() => { setIsRecovering(false); setAlerta(null); setExito(null); }}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 mt-4 transition-colors"
              >
                <ChevronLeft size={16} /> Volver al inicio de sesión
              </button>
            )}
          </form>

          <p className="mt-auto text-center text-[10px] font-bold text-slate-300 uppercase tracking-[2px]">
            © 2026 Central de Esterilización v2.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;