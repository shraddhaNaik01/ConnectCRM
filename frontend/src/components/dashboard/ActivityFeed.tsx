import React from 'react';
import { ActivityItem } from '@/types/crm';
import { ShoppingCart, Calendar, UserPlus, RefreshCw, FileText } from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const typeIconMap = {
  order_placed: ShoppingCart,
  followup_due: Calendar,
  customer_created: UserPlus,
  sync_completed: RefreshCw,
  note_added: FileText,
};

const badgeColorStyles: Record<string, string> = {
  blue: 'bg-blue-500/10 text-[#60A5FA] border-blue-500/20',
  amber: 'bg-amber-500/10 text-[#FBBF24] border-amber-500/20',
  emerald: 'bg-emerald-500/10 text-[#34D399] border-emerald-500/20',
  purple: 'bg-violet-500/10 text-[#A78BFA] border-violet-500/20',
  slate: 'bg-slate-500/10 text-[#94A3B8] border-slate-500/20',
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-[#94A3B8]">
        No recent activities recorded.
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, activityIdx) => {
          const Icon = typeIconMap[activity.type] || FileText;
          const badgeClass =
            badgeColorStyles[activity.badgeColor || 'slate'] || badgeColorStyles.slate;

          return (
            <li key={activity.id}>
              <div className="relative pb-8">
                {activityIdx !== activities.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-[#263449]"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1B2840] border border-[#263449] text-[#60A5FA] ring-4 ring-[#151F32]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-[#F1F5F9]">
                        {activity.title}
                      </p>
                      {activity.badge && (
                        <span
                          className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium border ${badgeClass}`}
                        >
                          {activity.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-[#94A3B8] leading-relaxed">
                      {activity.description}
                    </p>
                    <span className="mt-1 block text-[11px] text-[#94A3B8]/70">
                      {activity.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
