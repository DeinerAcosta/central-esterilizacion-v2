import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import { authService } from '../../services/auth.service';

const DOCTOR_IMAGE_URL = '/assets/Imagen.png';

const ChangePasswordScreen: React.FC = () => {
  const navigate = useNavigate();
  const [showActual, setShowActual]       = useState(false);
  const [showNueva, setShowNueva]         = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [passwordActual, setPasswordActual]     = useState('');
  const [nuevaPassword, setNuevaPassword]       = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nuevaPassword !== confirmarPassword) {
      Swal.fire({ icon: 'error', title: 'Error de validación', text: 'Las contraseñas no coinciden.', confirmButtonColor: '#ef4444' });
      return;
    }

    setLoading(true);
    try {
      const userStr = localStorage.getItem('usuario');
      const email   = userStr ? JSON.parse(userStr).email : '';
      await authService.changePassword(email, passwordActual, nuevaPassword);

      const usuarioActualizado = JSON.parse(userStr || '{}');
      usuarioActualizado.esPasswordProvisional = false;
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));

      Swal.fire({ icon: 'success', title: '¡Éxito!', text: 'Contraseña actualizada exitosamente.', confirmButtonColor: '#10b981' })
        .then(() => navigate('/dashboard'));
    } catch (err: any) {
      const msg = err.response?.data?.msg || 'Ocurrió un error al actualizar la contraseña. Intente nuevamente.';
      Swal.fire({ icon: 'error', title: 'Error de actualización', text: msg, confirmButtonColor: '#ef4444' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }

        /* ── Notch Input ── */
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
        .notch-wrapper.focused .notch-label  { color: #3b82f6; }
        .notch-wrapper.focused .notch-input  { border-color: #3b82f6; }

        .right-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
        }

        /* ── Gradient button ── */
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

        /* ── Cancel button ── */
        .cancel-btn {
          width: 100%;
          height: 48px;
          border-radius: 30px;
          border: 1.5px solid #d1d5db;
          background: #fff;
          color: #64748b;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .cancel-btn:hover:not(:disabled) { background: #f1f5f9; color: #ef4444; border-color: #ef4444; }
        .cancel-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div style={{
        minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontFamily: "'Inter', sans-serif", padding: 16,
        background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 55%, #818cf8 100%)',
      }}>
        <div style={{
          width: '100%', maxWidth: 980, display: 'flex', overflow: 'hidden',
          borderRadius: 28, minHeight: 620, boxShadow: '0 30px 70px rgba(0,0,0,0.28)',
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
            <img
              src={DOCTOR_IMAGE_URL}
              alt="Doctor"
              style={{
                position: 'relative', zIndex: 1,
                width: '100%', height: '100%',
                objectFit: 'contain', objectPosition: 'bottom center',
                display: 'block',
              }}
            />
          </div>

          {/* ── PANEL DERECHO ── */}
          <div style={{
            flex: 1, background: '#fff', display: 'flex',
            flexDirection: 'column', justifyContent: 'center', padding: '48px 56px',
          }}>

            {/* Brand — CENTRADO igual que el login */}
            <p style={{
              letterSpacing: '0.22em', fontSize: 11, color: '#94a3b8',
              fontWeight: 600, marginBottom: 14, marginTop: 0,
              textTransform: 'uppercase', textAlign: 'center',
            }}>
              Central de Esterilización
            </p>

            {/* Título */}
            <h2 style={{ fontSize: 30, fontWeight: 700, color: '#2563eb', marginBottom: 8, marginTop: 0, lineHeight: 1.15 }}>
              Nueva contraseña
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 28, marginTop: 0 }}>
              Por seguridad, debe actualizar su contraseña provisional para continuar.
            </p>

            <form onSubmit={handleGuardar} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Contraseña actual */}
              <NotchInput
                id="actual"
                label="Contraseña actual"
                type={showActual ? 'text' : 'password'}
                value={passwordActual}
                onChange={(e) => setPasswordActual(e.target.value)}
                required
                rightElement={
                  <button type="button" onClick={() => setShowActual(!showActual)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', padding: 0 }}>
                    {showActual ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              {/* Nueva contraseña */}
              <div>
                <NotchInput
                  id="nueva"
                  label="Contraseña nueva"
                  type={showNueva ? 'text' : 'password'}
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  required
                  rightElement={
                    <button type="button" onClick={() => setShowNueva(!showNueva)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', padding: 0 }}>
                      {showNueva ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
                <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 6, marginLeft: 6, marginBottom: 0 }}>
                  Debe ser una contraseña de mínimo 8 letras, números y símbolos.
                </p>
              </div>

              {/* Confirmar contraseña */}
              <NotchInput
                id="confirmar"
                label="Confirmar contraseña"
                type={showConfirmar ? 'text' : 'password'}
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                required
                rightElement={
                  <button type="button" onClick={() => setShowConfirmar(!showConfirmar)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', padding: 0 }}>
                    {showConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              {/* Botones */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                <button type="submit" disabled={loading} className="gradient-btn">
                  {loading ? 'Procesando...' : 'Restablecer contraseña'}
                </button>
                <button type="button" onClick={handleCancelar} disabled={loading} className="cancel-btn">
                  Cancelar
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

/* ── NotchInput — mismo componente que LoginScreen ── */
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

export default ChangePasswordScreen;