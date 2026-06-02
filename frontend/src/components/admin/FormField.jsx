/**
 * FormField — universal form field component
 *
 * Props:
 *   label    {string}
 *   type     {'text'|'email'|'tel'|'number'|'date'|'select'|'textarea'|'checkbox'}
 *   name     {string}
 *   value    {string|number|boolean}
 *   onChange {(e) => void}
 *   options  {Array<{ value: string|number, label: string }>}  — for select
 *   required {boolean}
 *   error    {string}
 *   placeholder {string}
 *   rows     {number}  — for textarea
 *   disabled {boolean}
 */
export default function FormField({
  label,
  type = 'text',
  name,
  value,
  onChange,
  options = [],
  required = false,
  error,
  placeholder,
  rows = 4,
  disabled = false,
  ...rest
}) {
  const inputId = `field-${name}`;

  // ── Checkbox ──
  if (type === 'checkbox') {
    return (
      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <label
          htmlFor={inputId}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            cursor: disabled ? 'not-allowed' : 'pointer',
            userSelect: 'none',
          }}
        >
          <input
            id={inputId}
            type="checkbox"
            name={name}
            checked={!!value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            style={{
              width: 16, height: 16,
              accentColor: 'var(--crimson)',
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
            {...rest}
          />
          <span className="form-label" style={{ margin: 0 }}>
            {label}
            {required && <span style={{ color: 'var(--error)', marginLeft: 2 }}>*</span>}
          </span>
        </label>
        {error && (
          <p style={{ marginTop: '0.3rem', fontSize: '0.8rem', color: 'var(--error)', fontWeight: 500 }}>
            {error}
          </p>
        )}
      </div>
    );
  }

  // ── Select ──
  if (type === 'select') {
    return (
      <div className="form-group">
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span style={{ color: 'var(--error)', marginLeft: 2 }}>*</span>}
        </label>
        <select
          id={inputId}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="form-control"
          style={error ? { borderColor: 'var(--error)' } : {}}
          {...rest}
        >
          <option value="">— Select —</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p style={{ marginTop: '0.3rem', fontSize: '0.8rem', color: 'var(--error)', fontWeight: 500 }}>
            {error}
          </p>
        )}
      </div>
    );
  }

  // ── Textarea ──
  if (type === 'textarea') {
    return (
      <div className="form-group">
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span style={{ color: 'var(--error)', marginLeft: 2 }}>*</span>}
        </label>
        <textarea
          id={inputId}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          rows={rows}
          className="form-control"
          style={error ? { borderColor: 'var(--error)' } : {}}
          {...rest}
        />
        {error && (
          <p style={{ marginTop: '0.3rem', fontSize: '0.8rem', color: 'var(--error)', fontWeight: 500 }}>
            {error}
          </p>
        )}
      </div>
    );
  }

  // ── All other input types ──
  return (
    <div className="form-group">
      <label htmlFor={inputId} className="form-label">
        {label}
        {required && <span style={{ color: 'var(--error)', marginLeft: 2 }}>*</span>}
      </label>
      <input
        id={inputId}
        type={type}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        className="form-control"
        style={error ? { borderColor: 'var(--error)' } : {}}
        {...rest}
      />
      {error && (
        <p style={{ marginTop: '0.3rem', fontSize: '0.8rem', color: 'var(--error)', fontWeight: 500 }}>
          {error}
        </p>
      )}
    </div>
  );
}
