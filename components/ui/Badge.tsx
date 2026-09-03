import { Category } from '@/lib/types';
import { CATEGORY_CONFIG } from '@/lib/types';

interface BadgeProps {
  category: Category;
  size?: 'sm' | 'md';
}

export function Badge({ category, size = 'sm' }: BadgeProps) {
  const config = CATEGORY_CONFIG[category];

  const sizes = {
    sm: 'px-2.5 py-0.5 text-[11px]',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold tracking-wider uppercase rounded-full border ${sizes[size]}`}
      style={{
        backgroundColor: config.bg,
        color: config.text,
        borderColor: config.border,
      }}
    >
      {category}
    </span>
  );
}

interface StatusBadgeProps {
  status: 'todo' | 'in_progress' | 'done' | 'missed';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    todo: { label: 'To Do', bg: '#efeeeb', text: '#424843' },
    in_progress: { label: 'In Progress', bg: '#ebf0f3', text: '#4d6475' },
    done: { label: 'Done', bg: '#caebd0', text: '#36533f' },
    missed: { label: 'Missed', bg: '#ffdad6', text: '#ba1a1a' },
  };

  const { label, bg, text } = config[status];

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold tracking-wider uppercase rounded-full"
      style={{ backgroundColor: bg, color: text }}
    >
      {label}
    </span>
  );
}
