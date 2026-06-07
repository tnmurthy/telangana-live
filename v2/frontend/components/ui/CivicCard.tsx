import { cn } from "@/lib/utils";

interface CivicCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  accentColor?: "blue" | "green" | "red" | "amber";
}

export default function CivicCard({ children, className, title, subtitle, accentColor }: CivicCardProps) {
  const accentClasses = {
    blue: "border-t-blue-500",
    green: "border-t-emerald-500",
    red: "border-t-red-500",
    amber: "border-t-amber-500"
  };

  return (
    <div className={cn(
      "bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col",
      accentColor && `border-t-4 ${accentClasses[accentColor]}`,
      className
    )}>
      {(title || subtitle) && (
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          {title && <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 leading-tight">{title}</h3>}
          {subtitle && <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="p-5 flex-grow">
        {children}
      </div>
    </div>
  );
}
