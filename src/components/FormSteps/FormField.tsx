import React from 'react';

interface BaseFieldProps {
  label: string;
  description?: string;
  required?: boolean;
  className?: string;
}

interface TextFieldProps extends BaseFieldProps {
  type?: 'text' | 'number';
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  prefix?: string;
  suffix?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  description,
  required,
  type = 'text',
  value,
  onChange,
  placeholder,
  readOnly,
  prefix,
  suffix,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-xs font-semibold text-slate-800">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {description && (
        <p className="text-[11px] text-slate-500 leading-normal">{description}</p>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-xs font-semibold text-slate-400 select-none">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full text-xs py-2.5 border rounded-xl outline-none transition ${
            prefix ? 'pl-9' : 'pl-3'
          } ${suffix ? 'pr-9' : 'pr-3'} ${
            readOnly
              ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'
              : 'border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900'
          }`}
        />
        {suffix && (
          <span className="absolute right-3 text-xs font-semibold text-slate-400 select-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

interface TextAreaFieldProps extends BaseFieldProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  description,
  required,
  value,
  onChange,
  placeholder,
  rows = 4,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-xs font-semibold text-slate-800">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {description && (
        <p className="text-[11px] text-slate-500 leading-normal">{description}</p>
      )}
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none leading-relaxed resize-y bg-white text-slate-900 transition"
      />
    </div>
  );
};
