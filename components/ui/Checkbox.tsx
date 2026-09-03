interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({ label, checked, onChange, disabled = false, className = '' }: CheckboxProps) {
  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`w-[18px] h-[18px] rounded-[4px] border-[1.5px] transition-colors ${
            checked
              ? 'bg-primary-container border-primary-container'
              : 'bg-white border-outline-variant'
          }`}
        >
          {checked && (
            <svg
              className="w-full h-full text-white p-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      {label && <span className="text-sm text-on-surface">{label}</span>}
    </label>
  );
}
