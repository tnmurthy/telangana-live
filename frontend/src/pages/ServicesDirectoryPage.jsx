import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../utils/markdownParser';
import { 
  FileText, 
  CreditCard, 
  Home, 
  HeartHandshake, 
  GraduationCap, 
  MessageSquare, 
  Shield, 
  Scale, 
  Activity, 
  Award, 
  Search, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';

const categoryIconMap = {
  'documents-certificates': FileText,
  'bills-taxes': CreditCard,
  'land-property': Home,
  'ration-food-pensions': HeartHandshake,
  'jobs-education-scholarships': GraduationCap,
  'complaints-grievances': MessageSquare,
  'police-safety': Shield,
  'rti-courts-legal': Scale,
  'health-social-welfare': Activity,
  'elections-voting': Award
};

const categoryDescriptionMap = {
  'documents-certificates': 'Official certificates including birth, death, caste, income, and residence.',
  'bills-taxes': 'Pay property tax, electricity, water, vehicle tax, and traffic challans.',
  'land-property': 'Land registration, Dharani records, building permissions, and mutation.',
  'ration-food-pensions': 'Apply for new ration card, Aasara pensions, and food security benefits.',
  'jobs-education-scholarships': 'Scholarship applications, skill development programs, and TSPSC jobs.',
  'complaints-grievances': 'File complaints with GHMC, central PG portal, and Prajavani.',
  'police-safety': 'Online FIR registration, tenant verification, and women\'s safety services.',
  'rti-courts-legal': 'Access court case status, free legal aid, and Right to Information guides.',
  'health-social-welfare': 'Welfare schemes, healthcare services, and social support systems.',
  'elections-voting': 'Voter registration, address updates, and polling booth search.'
};

export default function ServicesDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const allCategories = useMemo(() => getCategories(), []);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return allCategories;
    const query = searchQuery.toLowerCase();
    
    return allCategories.map(cat => {
      // Filter guides inside this category that match query in title or content
      const matchedGuides = cat.guides.filter(guide => 
        guide.title.toLowerCase().includes(query) ||
        guide.content.toLowerCase().includes(query)
      );

      // Check if category name matches
      const categoryMatches = cat.title.toLowerCase().includes(query);

      // If category matches, include all its guides; otherwise, only matched guides
      const finalGuides = categoryMatches ? cat.guides : matchedGuides;

      if (categoryMatches || finalGuides.length > 0) {
        return {
          ...cat,
          guides: finalGuides
        };
      }
      return null;
    }).filter(Boolean);
  }, [searchQuery, allCategories]);

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto px-4 mt-6 animate-fade-in">
      {/* Premium Hero Banner */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden border border-white/5 bg-gradient-to-br from-dark-bg via-white/[0.02] to-dark-bg">
        <div className="absolute top-0 right-0 p-8 text-8xl opacity-[0.03] pointer-events-none select-none">📖</div>
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-telangana-green/10 rounded-full blur-[80px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge-live bg-telangana-green/15 text-green-400 border border-telangana-green/25">Civic Guides</span>
              <span className="text-xs text-text-muted font-bold">Information Directory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight leading-tight">
              Services Directory
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
              Understand the eligibility, step-by-step procedures, required documents, and official application links for 46 core civic services in Telangana.
            </p>
          </div>
          
          <div className="relative w-full md:max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">
              <Search className="w-4 h-4 text-text-muted" />
            </span>
            <input
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white focus:outline-none focus:border-telangana-green/45 placeholder:text-text-muted transition-colors focus:ring-1 focus:ring-telangana-green/30"
              aria-label="Search civic guides"
            />
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCategories.map(cat => {
            const IconComponent = categoryIconMap[cat.slug] || HelpCircle;
            const description = categoryDescriptionMap[cat.slug] || '';
            
            return (
              <div 
                key={cat.slug} 
                className="glass-card p-6 border border-white/[0.04] bg-white/[0.005] hover:border-telangana-green/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-telangana-green/10 flex items-center justify-center border border-telangana-green/20">
                      <IconComponent className="w-6 h-6 text-telangana-green" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white tracking-tight">
                        {cat.title}
                      </h2>
                      <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider mt-0.5">
                        {cat.guides.length} {cat.guides.length === 1 ? 'Guide' : 'Guides'}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-text-secondary leading-relaxed mb-4">
                    {description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {cat.guides.map(guide => (
                      <li key={guide.fileSlug}>
                        <Link 
                          to={`/services/${guide.categorySlug}/${guide.fileSlug}`}
                          className="flex items-center justify-between p-2 rounded-lg bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.02] text-xs text-text-secondary hover:text-white font-medium transition-all group"
                          aria-label={`Guide: ${guide.title}`}
                        >
                          <span className="truncate pr-2">{guide.title}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-text-muted group-hover:text-telangana-green transition-colors flex-shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center glass-card border border-white/[0.04] max-w-md mx-auto">
          <span className="text-3xl">🔍</span>
          <h3 className="text-white font-bold mt-4">No Guides Found</h3>
          <p className="text-xs text-text-muted mt-2">No categories or guides match your search term "{searchQuery}".</p>
          <button 
            onClick={() => setSearchQuery('')} 
            className="mt-4 px-4 py-2 bg-telangana-green text-black rounded-lg text-xs font-bold hover:bg-telangana-green/90 transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}
