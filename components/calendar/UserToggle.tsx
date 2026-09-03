'use client';

interface UserToggleProps {
  users: [string, string];
  selectedUser: string;
  onSelect: (user: string) => void;
  completionRates?: { user1: number; user2: number };
}

export function UserToggle({ users, selectedUser, onSelect, completionRates }: UserToggleProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex bg-surface-container rounded-lg p-1">
        <button
          onClick={() => onSelect(users[0])}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            selectedUser === users[0]
              ? 'bg-primary-container text-white'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          {users[0] || 'User 1'}
        </button>
        <button
          onClick={() => onSelect(users[1])}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            selectedUser === users[1]
              ? 'bg-primary-container text-white'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          {users[1] || 'User 2'}
        </button>
      </div>

      {completionRates && (
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-container"></div>
            <span className="text-on-surface-variant">{users[0]}: {Math.round(completionRates.user1)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-domain-dl-text"></div>
            <span className="text-on-surface-variant">{users[1]}: {Math.round(completionRates.user2)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
