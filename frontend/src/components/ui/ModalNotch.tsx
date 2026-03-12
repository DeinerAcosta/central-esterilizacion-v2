// src/components/ui/ModalNotch.tsx
import React, { useState } from 'react';
import { Calendar, ChevronDown, Paperclip } from 'lucide-react';

export type CharType = 'alpha' | 'alphanumeric' | 'alphanumericSpecial' | 'number' | 'free';

/* ══════════════════════════════════════════════════════════
   INPUT con label flotante
   ══════════════════════════════════════════════════════════ */
interface NotchInputProps {
  id?: string; label: string; value: string | number | null;
  disabled?: boolean; required?: boolean; type?: string;
  min?: string; max?: string; maxLength?: number;
  charType?: CharType;
  onChange: (value: string) => void;
}

export const ModalNotchInput: React.FC<NotchInputProps> = ({
  id, label, value, disabled = false, required = false,
  type = 'text', min, max, maxLength, charType = 'free', onChange
}) => {
  const [focused, setFocused] = useState(false);
  const safeValue = value === null || value === undefined ? '' : String(value);
  const active = focused || safeValue.length > 0 || type === 'date';

  const filterChar = (v: string): string => {
    switch (charType) {
      case 'alpha':         return v.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
      case 'alphanumeric':  return v.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, '');
      case 'number':        return v.replace(/[^0-9.]/g, '');
      default:              return v;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'];
    if (allowed.includes(e.key) || e.ctrlKey || e.metaKey || e.altKey) return;
    if (charType === 'number'       && !/^\d$/.test(e.key) && e.key !== '.') e.preventDefault();
    if (charType === 'alpha'        && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/.test(e.key)) e.preventDefault();
    if (charType === 'alphanumeric' && !/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]$/.test(e.key)) e.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = filterChar(e.target.value);
    if (maxLength && v.length > maxLength) v = v.slice(0, maxLength);
    onChange(v);
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        id={id}
        type={type === 'number' || charType === 'number' ? 'text' : type}
        inputMode={type === 'number' || charType === 'number' ? 'decimal' : undefined}
        value={safeValue} disabled={disabled} placeholder=""
        min={min} max={max}
        onChange={handleChange} onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', height: 48, borderRadius: 30,
          border: `1.5px solid ${focused ? '#3b82f6' : '#d1d5db'}`,
          background: disabled ? '#f8fafc' : '#fff',
          padding: active ? '14px 16px 0 16px' : '0 16px',
          fontSize: 13.5, color: disabled ? '#94a3b8' : '#334155',
          outline: 'none', boxSizing: 'border-box',
          transition: 'border-color 0.2s, padding 0.18s',
          cursor: disabled ? 'not-allowed' : 'text',
        }}
      />
      <label htmlFor={id} style={{
        position: 'absolute', left: 18,
        top: active ? 0 : '50%',
        transform: 'translateY(-50%)',
        fontSize: active ? 10.5 : 13,
        color: focused ? '#3b82f6' : (active ? '#6b7280' : '#9ca3af'),
        pointerEvents: 'none', transition: 'all 0.18s ease',
        background: disabled ? '#f8fafc' : '#fff',
        padding: '0 4px', whiteSpace: 'nowrap',
      }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: 1 }}>*</span>}
        {maxLength && (
          <span style={{ color: '#94a3b8', fontSize: 9.5, marginLeft: 4 }}>
            ({safeValue.length}/{maxLength})
          </span>
        )}
      </label>
      {type === 'date' && (
        <Calendar size={16} style={{
          position: 'absolute', right: 14, top: '50%',
          transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none'
        }} />
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   SELECT con label SIEMPRE fijo en el borde superior
   ══════════════════════════════════════════════════════════ */
interface NotchSelProps {
  id?: string; label: string; value: string | number | null;
  disabled?: boolean; required?: boolean; compact?: boolean;
  onChange: (v: string) => void;
  options: { value: string | number; label: string }[];
}

export const ModalNotchSelect: React.FC<NotchSelProps> = ({
  id, label, value, disabled = false, required = false,
  compact = false, onChange, options
}) => {
  const [focused, setFocused] = useState(false);
  const safeValue = value === null || value === undefined ? '' : String(value);
  const bgColor = disabled ? '#f8fafc' : (compact ? (focused ? '#fff' : '#f8fafc') : '#fff');

  return (
    <div style={{
      position: 'relative',
      flexShrink: 0,
      minWidth: compact ? 160 : '100%',
      opacity: disabled && compact ? 0.6 : 1,
    }}>
      <select
        id={id}
        value={safeValue}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          height: compact ? 42 : 48,
          borderRadius: 30,
          border: `1.5px solid ${focused ? '#3b82f6' : '#d1d5db'}`,
          background: bgColor,
          padding: compact ? '10px 36px 0 16px' : '14px 36px 0 16px',
          fontSize: compact ? 13 : 13.5,
          /* ── color gris si no hay selección, normal si hay ── */
          color: safeValue === '' ? '#9ca3af' : (disabled ? '#94a3b8' : '#334155'),
          outline: 'none', appearance: 'none',
          boxSizing: 'border-box',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {/*
          ✅ CORRECCIÓN CLAVE:
          La opción vacía es VISIBLE y SELECCIONABLE.
          Antes tenía display:'none' lo que impedía deseleccionar.
          Ahora muestra "Seleccionar..." en gris para que el usuario
          pueda volver a dejar el filtro en blanco.
        */}
        <option value="" style={{ color: '#9ca3af' }}>Seleccionar...</option>

        {options.map(opt => (
          <option key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Label SIEMPRE fijo en el borde superior — nunca flota */}
      <label htmlFor={id} style={{
        position: 'absolute',
        left: 18, top: 0,
        transform: 'translateY(-50%)',
        fontSize: 10.5,
        color: focused ? '#3b82f6' : '#6b7280',
        pointerEvents: 'none',
        background: bgColor,
        padding: '0 4px', whiteSpace: 'nowrap',
        transition: 'color 0.18s',
      }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: 1 }}>*</span>}
      </label>

      <ChevronDown size={15} style={{
        position: 'absolute', right: 14, top: '50%',
        transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af'
      }} />
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   FILE PICKER con estilo Notch
   ══════════════════════════════════════════════════════════ */
interface NotchFileProps {
  label: string; required?: boolean;
  file: File | string | null; onClick: () => void; disabled?: boolean;
}

export const ModalNotchFile: React.FC<NotchFileProps> = ({
  label, required, file, onClick, disabled
}) => {
  const isStr  = typeof file === 'string';
  const name   = isStr
    ? 'Ver Documento'
    : (file
        ? ((file as File).name.length > 22
            ? (file as File).name.slice(0, 22) + '…'
            : (file as File).name)
        : 'Subir archivo');
  const hasFile = file !== null && file !== '';
  const bgColor = hasFile && !disabled ? '#eff6ff' : (disabled ? '#f8fafc' : '#fff');

  return (
    <div
      style={{ position: 'relative', cursor: disabled ? 'not-allowed' : 'pointer' }}
      onClick={!disabled ? onClick : undefined}
    >
      <div style={{
        width: '100%', height: 48, borderRadius: 30,
        border: `1.5px solid ${hasFile && !disabled ? '#3b82f6' : '#d1d5db'}`,
        background: bgColor,
        padding: '14px 36px 0 16px',
        display: 'flex', alignItems: 'flex-end', paddingBottom: 6,
        boxSizing: 'border-box',
      }}>
        <span style={{
          flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          fontSize: 13.5,
          color: hasFile && !disabled ? '#2563eb' : (disabled ? '#94a3b8' : '#9ca3af'),
          fontWeight: hasFile ? 500 : 400,
          textDecoration: isStr ? 'underline' : 'none',
        }}>
          {name}
        </span>
        <Paperclip size={14} style={{
          position: 'absolute', right: 14, top: '50%',
          transform: 'translateY(-50%)', pointerEvents: 'none',
          color: hasFile && !disabled ? '#3b82f6' : '#d1d5db'
        }} />
      </div>
      <label style={{
        position: 'absolute', left: 18, top: 0,
        transform: 'translateY(-50%)',
        fontSize: 10.5,
        color: hasFile && !disabled ? '#3b82f6' : '#6b7280',
        pointerEvents: 'none',
        background: bgColor,
        padding: '0 4px', whiteSpace: 'nowrap',
      }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: 1 }}>*</span>}
      </label>
    </div>
  );
};