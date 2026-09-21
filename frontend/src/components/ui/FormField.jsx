import useRefOptions from '../../hooks/useRefOptions.js';

export default function FormField({ field, value, onChange }) {
  const { name, label, type, required, placeholder, options, refEndpoint } = field;

  const set = (v) => onChange(name, v);

  const baseLabel = (
    <label className="label" htmlFor={name}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
  );

  if (type === 'ref-select') {
    return <RefSelectField field={field} value={value} onChange={onChange} />;
  }

  if (type === 'select') {
    return (
      <div>
        {baseLabel}
        <select
          id={name}
          className="input"
          value={value ?? ''}
          onChange={(e) => set(e.target.value)}
          required={required}
        >
          <option value="">Select {label}</option>
          {(options || []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div>
        {baseLabel}
        <textarea
          id={name}
          className="input min-h-[80px] resize-y"
          value={value ?? ''}
          placeholder={placeholder}
          onChange={(e) => set(e.target.value)}
          required={required}
        />
      </div>
    );
  }

  if (type === 'tags') {
    const strVal = Array.isArray(value) ? value.join(', ') : value ?? '';
    return (
      <div>
        {baseLabel}
        <input
          id={name}
          className="input"
          value={strVal}
          placeholder={placeholder}
          onChange={(e) =>
            set(
              e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
        />
      </div>
    );
  }

  if (type === 'date') {
    const dateVal = value ? String(value).slice(0, 10) : '';
    return (
      <div>
        {baseLabel}
        <input
          id={name}
          type="date"
          className="input"
          value={dateVal}
          onChange={(e) => set(e.target.value)}
          required={required}
        />
      </div>
    );
  }

  if (type === 'number') {
    return (
      <div>
        {baseLabel}
        <input
          id={name}
          type="number"
          step="any"
          className="input"
          value={value ?? ''}
          placeholder={placeholder}
          onChange={(e) => set(e.target.value === '' ? '' : Number(e.target.value))}
          required={required}
        />
      </div>
    );
  }

  // default: text
  return (
    <div>
      {baseLabel}
      <input
        id={name}
        type="text"
        className="input"
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => set(e.target.value)}
        required={required}
      />
    </div>
  );
}

function RefSelectField({ field, value, onChange }) {
  const { name, label, required, refEndpoint } = field;
  const { options, loading } = useRefOptions(refEndpoint);

  const currentValue =
    value && typeof value === 'object' ? value._id : value || '';

  return (
    <div>
      <label className="label" htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        className="input"
        value={currentValue}
        onChange={(e) => onChange(name, e.target.value)}
        required={required}
        disabled={loading}
      >
        <option value="">{loading ? 'Loading…' : `Select ${label}`}</option>
        {options.map((opt) => (
          <option key={opt._id} value={opt._id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}
