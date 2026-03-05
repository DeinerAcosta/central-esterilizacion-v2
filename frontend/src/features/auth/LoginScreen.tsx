import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { authService } from '../../services/auth.service';

const DOCTOR_IMAGE_URL = '/assets/Imagen.png';

const LoginScreen: React.FC = () => {
  const [isRecovering, setIsRecovering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('remember_email');
    const savedPass = localStorage.getItem('remember_pass');
    if (savedEmail && savedPass) {
      setEmail(savedEmail);
      setPassword(atob(savedPass));
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      if (rememberMe) {
        localStorage.setItem('remember_email', email);
        localStorage.setItem('remember_pass', btoa(password));
      } else {
        localStorage.removeItem('remember_email');
        localStorage.removeItem('remember_pass');
      }
      localStorage.setItem('token', data.token || 'token_generado');
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      if (data.usuario.esPasswordProvisional) {
        Swal.fire({
          icon: 'warning', title: 'Contraseña Provisional',
          text: 'Por seguridad, debes cambiar tu contraseña antes de continuar.',
          confirmButtonColor: '#3b82f6', confirmButtonText: 'Cambiar ahora', allowOutsideClick: false,
        }).then(() => navigate('/cambio-password'));
      } else {
        const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2000, timerProgressBar: true });
        Toast.fire({ icon: 'success', title: 'Sesión iniciada correctamente' });
        navigate('/dashboard');
      }
    } catch {
      Swal.fire({ icon: 'error', title: 'Error de acceso', text: 'Usuario o contraseña incorrectos', confirmButtonColor: '#ef4444', confirmButtonText: 'Intentar de nuevo' });
    } finally { setLoading(false); }
  };

  const handleRecoverPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      Swal.fire({ icon: 'warning', title: 'Campo vacío', text: 'Por favor, ingrese su correo electrónico.', confirmButtonColor: '#f59e0b' });
      return;
    }
    setLoading(true);
    try {
      await authService.recover(email);
      Swal.fire({ icon: 'success', title: '¡Correo Enviado!', text: 'Se ha enviado una contraseña provisional a su correo electrónico.', confirmButtonColor: '#10b981' })
        .then(() => { setIsRecovering(false); setPassword(''); });
    } catch {
      Swal.fire({ icon: 'error', title: 'Atención', text: 'El correo ingresado no está registrado en el sistema.', confirmButtonColor: '#ef4444' });
    } finally { setLoading(false); }
  };

  const handleCancelRecovery = () => {
    setIsRecovering(false);
    if (!rememberMe) setEmail('');
    setPassword('');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        .notch-input {
          width: 100%;
          height: 52px;
          border-radius: 30px;
          border: 1.5px solid #d1d5db;
          background: #fff;
          padding: 0 16px;
          font-size: 14px;
          color: #1e293b;
          outline: none;
          transition: border-color 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .notch-input:focus { border-color: #3b82f6; }

        .notch-wrapper { position: relative; }

        .notch-label {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 13px;
          color: #9ca3af;
          pointer-events: none;
          transition: all 0.18s ease;
          background: transparent;
          padding: 0 4px;
          font-family: 'Inter', sans-serif;
          white-space: nowrap;
        }
        .notch-label .asterisk { color: #ef4444; margin-left: 1px; }

        .notch-wrapper.active .notch-label {
          top: 0;
          transform: translateY(-50%);
          font-size: 11px;
          color: #6b7280;
          background: #fff;
        }
        .notch-wrapper.focused .notch-label { color: #3b82f6; }
        .notch-wrapper.focused .notch-input { border-color: #3b82f6; }

        .right-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
        }

        .gradient-btn {
          width: 100%;
          height: 48px;
          border-radius: 30px;
          border: none;
          cursor: pointer;
          background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%);
          color: #fff;
          font-weight: 600;
          font-size: 15px;
          box-shadow: 0 4px 15px rgba(59,130,246,0.35);
          transition: opacity 0.2s, transform 0.15s;
          font-family: 'Inter', sans-serif;
        }
        .gradient-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .gradient-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .remember-checkbox {
          width: 15px; height: 15px;
          accent-color: #3b82f6; cursor: pointer;
        }
      `}</style>

      <div style={{
        minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontFamily: "'Inter', sans-serif", padding: 16,
        background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 55%, #818cf8 100%)',
      }}>
        <div style={{
          width: '100%', maxWidth: 980, display: 'flex', overflow: 'hidden',
          borderRadius: 28, minHeight: 580, boxShadow: '0 30px 70px rgba(0,0,0,0.28)',
        }}>

          {/* ── PANEL IZQUIERDO ── */}
          <div style={{
            width: '44%',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            overflow: 'hidden',
            background: 'linear-gradient(170deg, #38bdf8 0%, #22d3ee 40%, #34d399 100%)',
          }}>
            {/* Textura puntos */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.25) 1.5px, transparent 1.5px)',
              backgroundSize: '20px 20px',
            }} />
            {/* Doctor — ocupa todo el alto del panel sin cortarse */}
            <img
              src={DOCTOR_IMAGE_URL}
              alt="Doctor"
              style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'bottom center',
                display: 'block',
              }}
            />
          </div>

          {/* ── PANEL DERECHO ── */}
          <div style={{
            flex: 1,
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '48px 56px',
          }}>

            {/* Brand — CENTRADO */}
            <p style={{
              letterSpacing: '0.22em',
              fontSize: 11,
              color: '#94a3b8',
              fontWeight: 600,
              marginBottom: 14,
              marginTop: 0,
              textTransform: 'uppercase',
              textAlign: 'center',   /* ← CENTRADO */
            }}>
              Central de Esterilización
            </p>

            {/* Title */}
            <h2 style={{
              fontSize: 30,
              fontWeight: 700,
              color: '#2563eb',
              marginBottom: isRecovering ? 8 : 28,
              marginTop: 0,
              lineHeight: 1.15,
            }}>
              {isRecovering ? 'Contraseña olvidada' : 'Iniciar sesión'}
            </h2>

            {/* Subtítulo solo en recuperación */}
            {isRecovering && (
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 22, marginTop: 0 }}>
                Ingrese su correo electrónico registrado a continuación.
              </p>
            )}

            <form
              onSubmit={isRecovering ? handleRecoverPassword : handleLogin}
              style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
            >
              {/* Email */}
              <NotchInput
                id="email"
                label="Usuario o correo electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {/* ── LOGIN: Password + Recuérdame ── */}
              {!isRecovering && (
                <>
                  <div>
                    <NotchInput
                      id="password"
                      label="Contraseña"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      rightElement={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', padding: 0 }}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      }
                    />
                    <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 6, marginLeft: 4, marginBottom: 0 }}>
                      Debe ser una contraseña de mínimo 8 letras, números y símbolos.
                    </p>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#475569', userSelect: 'none', marginTop: -4 }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="remember-checkbox"
                    />
                    Recuérdame
                  </label>
                </>
              )}

              {/* ── RECOVERY: link antes del botón ── */}
              {isRecovering && (
                <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 2px 0' }}>
                  ¿Recuerdas la contraseña?{' '}
                  <button
                    type="button"
                    onClick={handleCancelRecovery}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#3b82f6', fontWeight: 600, padding: 0 }}
                  >
                    Iniciar sesión
                  </button>
                </p>
              )}

              {/* Botón principal */}
              <button
                type="submit"
                disabled={loading}
                className="gradient-btn"
                style={{ marginTop: 4 }}
              >
                {loading ? 'Procesando...' : isRecovering ? 'Enviar' : 'Iniciar sesión'}
              </button>
            </form>

            {/* Link inferior solo en login */}
            {!isRecovering && (
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => { setIsRecovering(true); setPassword(''); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#3b82f6', fontWeight: 500 }}
                >
                  ¿Has olvidado tu contraseña?
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

/* ── NotchInput ── */
interface NotchInputProps {
  id: string; label: string; type: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean; rightElement?: React.ReactNode;
}
const NotchInput: React.FC<NotchInputProps> = ({ id, label, type, value, onChange, required, rightElement }) => {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className={`notch-wrapper${active ? ' active' : ''}${focused ? ' focused' : ''}`}>
      <input
        id={id} type={type} value={value} onChange={onChange}
        required={required} placeholder=""
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="notch-input"
        style={{ paddingRight: rightElement ? '48px' : '16px' }}
      />
      <label htmlFor={id} className="notch-label">
        {label}{required && <span className="asterisk">*</span>}
      </label>
      {rightElement && <span className="right-icon">{rightElement}</span>}
    </div>
  );
};

export default LoginScreen;