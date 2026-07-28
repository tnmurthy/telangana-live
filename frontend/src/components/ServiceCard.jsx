import { Link } from 'react-router-dom';
import { ExternalLink, ChevronRight } from 'lucide-react';

const destinationLabels = {
  'government-portal': 'Government portal',
  'in-app': 'In-app',
  directory: 'Directory',
};

export default function ServiceCard({ title, description, href, destinationType }) {
  const isExternal = /^https?:\/\//.test(href);
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-semibold text-white">{title}</span>
        <span className="rounded-full border border-telangana-green/20 bg-telangana-green/15 px-2 py-1 text-[10px] font-semibold text-telangana-green">
          {destinationLabels[destinationType]}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-text-secondary">{description}</p>
      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-telangana-green">
        {isExternal ? <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" /> : <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />}
        <span>{isExternal ? 'Visit portal' : 'View guide'}</span>
        {isExternal && <span className="sr-only">Opens government portal in new tab</span>}
      </div>
    </>
  );

  const className = "flex min-h-[156px] flex-col rounded-card border border-white/10 bg-surface p-4 transition-colors duration-150 hover:bg-surface-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-telangana-green focus-visible:outline-offset-2 motion-reduce:transition-none";

  return isExternal ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{content}</a>
  ) : (
    <Link to={href} className={className}>{content}</Link>
  );
}
