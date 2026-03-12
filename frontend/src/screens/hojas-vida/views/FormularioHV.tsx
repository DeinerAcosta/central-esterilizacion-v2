import React, { useRef } from 'react';
import { ChevronLeft, DollarSign } from 'lucide-react';
import { ModalNotchInput, ModalNotchSelect, ModalNotchFile } from '../../../components/ui/ModalNotch';

interface FormularioHVProps {
  viewState: 'create' | 'edit' | 'detail';
  form: any;
  setF: (key: string, val: any) => void;
  fotoFile: File | string | null; setFotoFile: any;
  garantiaFile: File | string | null; setGarantiaFile: any;
  invimaFile: File | string | null; setInvimaFile: any;
  codigoFile: File | string | null; setCodigoFile: any;
  especialidades: any[]; subespecialidades: any[]; tipos: any[];
  proveedores: any[]; propietarios: any[]; paises: any[];
  subespTieneTipos: boolean;
  cp: { esp: string; sub: string; tip: string };
  permisos: { puedeRegistrarContable: boolean };
  statusColor: (s: string) => string;
  handleSave: () => void;
  handleCancelCreate: () => void;
  resetView: () => void;
  validarArchivo: (e: React.ChangeEvent<HTMLInputElement>, setter: (f: File) => void, tipo: 'image' | 'pdf' | 'mixto') => void;
}

export const FormularioHV: React.FC<FormularioHVProps> = ({
  viewState, form, setF, fotoFile, setFotoFile, garantiaFile, setGarantiaFile,
  invimaFile, setInvimaFile, codigoFile, setCodigoFile, especialidades,
  subespecialidades, tipos, proveedores, propietarios, paises,
  subespTieneTipos, cp, permisos, statusColor, handleSave, handleCancelCreate, resetView, validarArchivo
}) => {
  const isView = viewState === 'detail';
  const isEdit = viewState === 'edit';
  const title = isView ? 'Detalles de hoja de vida' : (isEdit ? 'Editar hoja de vida' : 'Crear hoja de vida');

  const fotoRef = useRef<HTMLInputElement>(null);
  const garantiaRef = useRef<HTMLInputElement>(null);
  const invimaRef = useRef<HTMLInputElement>(null);
  const codigoRef = useRef<HTMLInputElement>(null);

  const renderFoto = () => {
    if (!fotoFile) return <div className="text-slate-300 flex items-center justify-center w-full h-full"><span className="text-xs">Sin foto</span></div>;
    if (typeof fotoFile === 'string') return <img src={fotoFile.startsWith('http') ? fotoFile : `http://localhost:4000${fotoFile}`} alt="preview" className="w-full h-full object-cover" />;
    return <img src={URL.createObjectURL(fotoFile as File)} alt="preview" className="w-full h-full object-cover" />;
  };

  const handleBackArrow = () => {
    if (isView) resetView();
    else handleCancelCreate();
  };

  return (
    <div className="h-full flex flex-col font-sans overflow-y-auto hide-scrollbar pb-12" style={{ gap: 0 }}>
      {/* ── Encabezado ── */}
      <div className="flex items-center gap-2 mb-5">
        <button onClick={handleBackArrow} className="text-sky-500 hover:text-sky-700 p-1 transition-colors">
          <ChevronLeft size={26} strokeWidth={2.5} />
        </button>
        <h1 className="text-2xl font-bold text-sky-500">{title}</h1>
        {(isView || isEdit || viewState === 'create') && (
          <span className={`ml-4 px-3 py-1 rounded-full text-xs font-bold border ${statusColor(form.estado || 'P. registrar')}`}>
            {form.estado || 'P. registrar'}
          </span>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        
        {/* ── 1. Requisitos Documentales ── */}
        <div className="flex flex-col lg:flex-row items-start gap-6 p-6 border-b border-slate-100">
          <div className="flex items-center gap-4 flex-shrink-0">
            <div>
              <p className="font-bold text-sky-500 text-sm">Foto de instrumento{!isView && <span className="text-red-500 ml-1">*</span>}</p>
              {!isView && <p className="text-[11px] text-slate-400 mt-0.5">Mín. 400×400 px | Máx. 2MB</p>}
            </div>
            <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 flex-shrink-0">
              {renderFoto()}
            </div>
            {!isView && (
              <div className="flex flex-col gap-1.5">
                <input type="file" className="hidden" ref={fotoRef} accept=".jpg,.jpeg,.png" onChange={e => validarArchivo(e, setFotoFile, 'image')} />
                <button onClick={() => fotoRef.current?.click()} className="px-4 py-1.5 rounded-full border-2 border-sky-400 text-sky-500 text-xs font-bold hover:bg-sky-50 transition-colors">Subir foto</button>
                <button onClick={() => { setFotoFile(null); if (fotoRef.current) fotoRef.current.value = ''; }} className="text-slate-400 text-xs font-semibold hover:text-red-400 text-center transition-colors">Eliminar</button>
              </div>
            )}
          </div>
          <div className="hidden lg:block w-px self-stretch bg-slate-100" />
          <div className="flex-1 w-full">
            <p className="font-bold text-slate-800 text-sm mb-4">Requisitos documentales:</p>
            {!isView && (
              <>
                <input type="file" className="hidden" ref={garantiaRef} accept=".pdf" onChange={e => validarArchivo(e, setGarantiaFile, 'pdf')} />
                <input type="file" className="hidden" ref={invimaRef} accept=".pdf" onChange={e => validarArchivo(e, setInvimaFile, 'pdf')} />
                <input type="file" className="hidden" ref={codigoRef} accept=".pdf,image/jpeg,image/png" onChange={e => validarArchivo(e, setCodigoFile, 'mixto')} />
              </>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ModalNotchFile label="Garantía (Solo PDF)" required={!isView} disabled={isView} file={garantiaFile} onClick={() => !isView && garantiaRef.current?.click()} />
              <ModalNotchFile label="Registro INVIMA (Solo PDF)" required={!isView} disabled={isView} file={invimaFile} onClick={() => !isView && invimaRef.current?.click()} />
              <ModalNotchFile label="Cód. Instrumento (PDF/IMG)" required={!isView} disabled={isView} file={codigoFile} onClick={() => !isView && codigoRef.current?.click()} />
            </div>
          </div>
        </div>

        {/* ── 2. Datos básicos + Código Centrado en la misma línea ── */}
        <div className="p-6 border-b border-slate-100">
          <p className="font-bold text-slate-800 text-sm mb-5">Datos básicos del instrumento</p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 24, background: 'linear-gradient(135deg,#f0f9ff,#e0f2fe)', border: '1.5px solid #bae6fd', borderRadius: 18, padding: '18px 24px' }}>
            <span style={{ color: '#0284c7', fontWeight: 800, fontSize: 15, letterSpacing: 0.5, whiteSpace: 'nowrap' }}>Código de Instrumento:</span>
            {!isView && !isEdit ? (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                {[
                  { chars: cp.esp.split(''), sub: '(Especialidad)' },
                  { chars: cp.sub.split(''), sub: '(Subespecialidad)' },
                  { chars: !subespTieneTipos ? ['-', '-'] : cp.tip.split(''), sub: '(Tipo)' },
                  { chars: ['0', '0', '0', '0'], sub: '(Consecutivo)' },
                ].map((g, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      {g.chars.map((c, j) => {
                        const inactive = ['0', '-', ' '].includes(c);
                        return (
                          <div key={j} style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${inactive ? '#e5e7eb' : '#06b6d4'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: inactive ? '#9ca3af' : '#0891b2', background: inactive ? '#f9fafb' : '#ecfeff' }}>{c}</div>
                        );
                      })}
                    </div>
                    <span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>{g.sub}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 22, fontFamily: 'monospace', fontWeight: 800, color: '#0369a1', letterSpacing: 4, background: '#fff', padding: '6px 20px', borderRadius: 30, border: '1.5px solid #bae6fd' }}>{form.codigo || '—'}</div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
            <ModalNotchInput label="Nombre" required={!isView} disabled={isView} fieldType="alphanumeric" value={form.nombre} onChange={v => setF('nombre', v)} />
            <ModalNotchSelect label="Especialidad" required={!isView} disabled={isView} value={form.especialidadId} onChange={v => { setF('especialidadId', v); setF('subespecialidadId', ''); setF('tipoId', ''); }} options={especialidades.map(e => ({ value: String(e.id), label: e.nombre }))} />
            <ModalNotchSelect label="Subespecialidad" required={!isView} disabled={isView || !form.especialidadId} value={form.subespecialidadId} onChange={v => { setF('subespecialidadId', v); setF('tipoId', ''); }} options={subespecialidades.filter(s => s.especialidadId === Number(form.especialidadId)).map(s => ({ value: String(s.id), label: s.nombre }))} />
            <ModalNotchSelect label="Tipo de subespecialidad" required={!isView && subespTieneTipos} disabled={isView || !form.subespecialidadId || (!isView && !subespTieneTipos)} value={form.tipoId} onChange={v => setF('tipoId', v)} options={tipos.filter(t => t.subespecialidadId === Number(form.subespecialidadId)).map(t => ({ value: String(t.id), label: t.nombre }))} />
            <ModalNotchInput label="KIT" disabled value={isView || isEdit ? (form.kit?.codigoKit || 'No asignado') : 'Asignación en TM Kit'} onChange={() => {}} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <ModalNotchInput label="Fabricante" required={!isView} disabled={isView} fieldType="alpha" value={form.fabricante} onChange={v => setF('fabricante', v)} />
            <ModalNotchInput label="No. de serie" required={!isView} disabled={isView} fieldType="alphanumericSpecial" value={form.numeroSerie} onChange={v => setF('numeroSerie', v)} />
            <ModalNotchInput label="No. registro INVIMA" required={!isView} disabled={isView} fieldType="alphanumericSpecial" value={form.registroInvima} onChange={v => setF('registroInvima', v)} />
            <ModalNotchSelect label="Proveedor (Compras)" required={!isView} disabled={isView} value={form.proveedorId} onChange={v => setF('proveedorId', v)} options={proveedores.map(p => ({ value: String(p.id), label: p.nombre }))} />
            {/* PAÍS ORIGEN: Alimentado por base de datos */}
            <ModalNotchSelect label="País origen" required={!isView} disabled={isView} value={form.paisOrigen} onChange={v => setF('paisOrigen', v)} options={paises.map(p => ({ value: p.nombre || p.name || String(p), label: p.nombre || p.name || String(p) }))} />
          </div>
        </div>

        {/* ── 3. Características técnicas (Mitad a Mitad 50/50) ── */}
        <div className="p-6 border-b border-slate-100">
          <p className="font-bold text-slate-800 text-sm mb-5">Características Técnicas</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ModalNotchSelect label="Material del instrumento" required={!isView} disabled={isView} value={form.material} onChange={v => { setF('material', v); setF('materialOtro', ''); }} options={[{ value: 'Titanium', label: 'Titanium' }, { value: 'Acero inoxidable', label: 'Acero inoxidable' }, { value: 'Carburo de tungsteno', label: 'Carburo de tungsteno' }, { value: 'Otros', label: 'Otros' }]} />
            <ModalNotchSelect label="Esterilización compatible" required={!isView} disabled={isView} value={form.esterilizacion} onChange={v => setF('esterilizacion', v)} options={[{ value: 'Vapor', label: 'Vapor' }, { value: 'Gas', label: 'Gas' }, { value: 'Ambas', label: 'Ambas' }]} />
            {form.material === 'Otros' && (
              <div className="md:col-span-2">
                <ModalNotchInput label="¿Cuál es el material?" required={!isView} disabled={isView} fieldType="alphanumeric" value={form.materialOtro} onChange={v => setF('materialOtro', v)} />
              </div>
            )}
          </div>
        </div>

        {/* ── 4. Mantenimiento y Calibración ── */}
        <div className="p-6 border-b border-slate-100">
          <p className="font-bold text-slate-800 text-sm mb-5">Mantenimiento y calibración</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ModalNotchSelect label="Frecuencia preventiva" required={!isView} disabled={isView} value={form.frecuenciaMantenimiento} onChange={v => setF('frecuenciaMantenimiento', v)} options={['Diario', 'Semanal', 'Quincenal', 'Mensual', 'Bimensual', 'Trimestral', 'Cuatrimestral', 'Semestral', 'Anual'].map(x => ({ value: x, label: x }))} />
            <ModalNotchInput label="Fecha de mantenimiento" disabled value={isView || isEdit ? (form.proximoMantenimiento ? new Date(form.proximoMantenimiento).toLocaleDateString() : 'Pendiente') : 'Calculado automático'} onChange={() => {}} />
            <div className="lg:col-span-2">
              <ModalNotchInput label="Observaciones del técnico" disabled={isView} fieldType="alpha" maxLength={500} value={form.observacionesTecnico || ''} onChange={v => setF('observacionesTecnico', v)} />
            </div>
          </div>
        </div>

        {/* ── 5. Uso y Trazabilidad (Observaciones a todo el ancho abajo) ── */}
        <div className="p-6 border-b border-slate-100">
          <p className="font-bold text-slate-800 text-sm mb-5">Uso y trazabilidad</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
            <ModalNotchInput label="Estado actual" disabled value={form.estadoActual || 'P. registrar'} onChange={() => {}} />
            <ModalNotchInput label="Ciclo de esterilización" disabled charType="number" value={form.cicloEsterilizacion?.toString() || '0'} onChange={() => {}} />
            <ModalNotchSelect label="Propietario" required={!isView} disabled={isView} value={form.propietarioId} onChange={v => setF('propietarioId', v)} options={propietarios.map(p => ({ value: String(p.id), label: `${p.nombre} ${p.apellido}` }))} />
          </div>
          <div className="w-full">
            <ModalNotchInput label="Notas y observaciones generales" disabled={isView} fieldType="alpha" maxLength={500} value={form.notasObservaciones || ''} onChange={v => setF('notasObservaciones', v)} />
          </div>
        </div>

        {/* ── 6. Registro Contable ── */}
        {isView && permisos.puedeRegistrarContable && (
          <div className="p-6 bg-emerald-50/40 rounded-b-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-400" />
            <p className="font-bold text-emerald-800 text-sm mb-5 flex items-center gap-2"><DollarSign size={16} className="text-emerald-500" /> Registro Contable Privado</p>
            {form.costo ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ModalNotchInput label="Fecha de compra" disabled value={new Date(form.fechaCompra).toLocaleDateString()} onChange={() => {}} />
                <ModalNotchInput label="Costo adquisición" disabled value={`$ ${Number(form.costo).toLocaleString()}`} onChange={() => {}} />
                <ModalNotchInput label="IVA" disabled value={form.iva ? `${form.iva}%` : 'N/A'} onChange={() => {}} />
                <ModalNotchInput label="No. Factura" disabled value={form.numeroFactura || ''} onChange={() => {}} />
              </div>
            ) : (
              <p className="text-sm text-emerald-600/70 italic font-medium">El instrumento aún no posee información contable registrada.</p>
            )}
          </div>
        )}

        {/* ── Botones ── */}
        <div className="flex justify-end items-center gap-6 p-5">
          {!isView && <button className="hv-cancel-btn" onClick={handleCancelCreate}>Cancelar</button>}
          {!isView && <button className="hv-save-btn" onClick={handleSave}>Guardar</button>}
          {isView && <button onClick={resetView} style={{ padding: '10px 40px', borderRadius: 30, background: '#f1f5f9', border: 'none', cursor: 'pointer', fontWeight: 700, color: '#475569', fontSize: 14 }}>Volver al listado</button>}
        </div>
      </div>
    </div>
  );
};