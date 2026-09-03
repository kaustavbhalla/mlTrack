import { Goal, Category, DayOfWeek, CATEGORIES, DAYS_OF_WEEK, CATEGORY_CONFIG } from '@/lib/types';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';

interface GoalCardProps {
  goal: Goal;
  onUpdate?: (updates: Partial<Goal>) => void;
  onDelete?: () => void;
  readOnly?: boolean;
  showUser?: boolean;
}

export function GoalCard({ goal, onUpdate, onDelete, readOnly = false, showUser = false }: GoalCardProps) {
  const handleStatusChange = () => {
    if (readOnly || !onUpdate) return;
    const nextStatus = goal.status === 'todo' ? 'in_progress' : goal.status === 'in_progress' ? 'done' : 'todo';
    onUpdate({ status: nextStatus });
  };

  const handleDayToggle = (day: DayOfWeek) => {
    if (readOnly || !onUpdate) return;
    const currentDays = goal.day_of_week || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    onUpdate({ day_of_week: newDays });
  };

  const handleCategoryChange = (category: Category) => {
    if (readOnly || !onUpdate) return;
    onUpdate({ category });
  };

  const handleFocusHoursChange = (hours: number) => {
    if (readOnly || !onUpdate) return;
    onUpdate({ focus_hours: hours });
  };

  return (
    <div className={`bg-surface-container-lowest border border-outline-variant rounded-md p-4 ${
      goal.status === 'done' ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Checkbox
              checked={goal.status === 'done'}
              onChange={handleStatusChange}
              disabled={readOnly}
            />
            <h3 className={`font-medium text-on-surface ${goal.status === 'done' ? 'line-through' : ''}`}>
              {goal.title}
            </h3>
          </div>

          {goal.description && (
            <p className="text-sm text-on-surface-variant ml-7 mb-2">{goal.description}</p>
          )}

          {goal.link && (
            <a
              href={goal.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline ml-7 block mb-2 truncate"
            >
              {goal.link}
            </a>
          )}

          <div className="flex flex-wrap items-center gap-2 ml-7">
            <Badge category={goal.category} />

            {goal.focus_hours && (
              <span className="text-xs text-on-surface-variant">{goal.focus_hours}h</span>
            )}

            {showUser && (
              <span className="text-xs text-on-surface-variant font-medium">{goal.user}</span>
            )}
          </div>

          {!readOnly && (
            <div className="flex flex-wrap gap-1 mt-3 ml-7">
              {DAYS_OF_WEEK.map(day => (
                <button
                  key={day}
                  onClick={() => handleDayToggle(day)}
                  className={`px-2 py-0.5 text-xs rounded-full border transition-colors ${
                    goal.day_of_week?.includes(day)
                      ? 'bg-primary-container text-white border-primary-container'
                      : 'bg-white text-on-surface-variant border-outline-variant hover:border-outline'
                  }`}
                >
                  {day.charAt(0).toUpperCase()}
                </button>
              ))}
            </div>
          )}

          {readOnly && goal.day_of_week && goal.day_of_week.length > 0 && (
            <div className="flex gap-1 mt-2 ml-7">
              {goal.day_of_week.map(day => (
                <span key={day} className="px-2 py-0.5 text-xs rounded-full bg-surface-container text-on-surface-variant">
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </span>
              ))}
            </div>
          )}
        </div>

        {!readOnly && onDelete && (
          <button
            onClick={onDelete}
            className="text-on-surface-variant hover:text-error transition-colors p-1"
            aria-label="Delete goal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {!readOnly && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-outline-variant">
          <span className="text-xs text-on-surface-variant">Focus:</span>
          {[2, 4, 6].map(hours => (
            <button
              key={hours}
              onClick={() => handleFocusHoursChange(hours)}
              className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                goal.focus_hours === hours
                  ? 'bg-primary-container text-white border-primary-container'
                  : 'bg-white text-on-surface-variant border-outline-variant hover:border-outline'
              }`}
            >
              {hours}h
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
