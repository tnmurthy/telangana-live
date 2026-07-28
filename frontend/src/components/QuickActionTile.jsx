import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function QuickActionTile({ to, icon, label, description }) {
  return (
    <Link
      to={to}
      className="group flex min-w-0 items-center gap-3 rounded-card border border-white/10 bg-surface p-3 text-left transition-colors duration-150 hover:bg-surface-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-telangana-green focus-visible:outline-offset-2 motion-reduce:transition-none"
    >
      <span className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-[11px] bg-telangana-green/15 text-telangana-green [&>svg]:h-[18px] [&>svg]:w-[18px]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-white">{label}</span>
        <span className="block truncate text-xs text-text-secondary">{description}</span>
      </span>
      <ChevronRight aria-hidden="true" className="h-4 w-4 flex-shrink-0 text-text-muted transition-colors duration-150 group-hover:text-telangana-green motion-reduce:transition-none" />
    </Link>
  );
}
