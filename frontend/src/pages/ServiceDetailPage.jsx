import { useParams, Link } from 'react-router-dom';
import { getGuideBySlug, getCategories } from '../utils/markdownParser';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft, BookOpen, Share2, Printer } from 'lucide-react';
import { trackEvent } from '../hooks/usePageTracking';
import { useEffect } from 'react';

// Helper to recursively get text from children nodes
const getText = (node) => {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(getText).join('');
  if (node.props && node.props.children) return getText(node.props.children);
  return '';
};

export default function ServiceDetailPage() {
  const { category, slug } = useParams();
  const guide = getGuideBySlug(category, slug);

  useEffect(() => {
    if (guide) {
      trackEvent('view_service_guide', { category: guide.categorySlug, slug: guide.fileSlug, title: guide.title });
    }
  }, [guide]);

  if (!guide) {
    return (
      <div className="p-12 text-center glass-card border border-white/[0.04] max-w-md mx-auto my-12">
        <span className="text-3xl" role="img" aria-label="warning">⚠️</span>
        <h3 className="text-white font-bold mt-4">Guide Not Found</h3>
        <p className="text-xs text-text-muted mt-2">The guide you are looking for does not exist.</p>
        <Link 
          to="/services" 
          className="mt-4 inline-block px-4 py-2 bg-telangana-green text-black rounded-lg text-xs font-bold hover:bg-telangana-green/90 transition-colors focus:outline-none focus:ring-2 focus:ring-telangana-green"
        >
          Back to Services Directory
        </Link>
      </div>
    );
  }

  const categories = getCategories();
  const currentCategory = categories.find(cat => cat.slug === category);
  const sisterGuides = currentCategory ? currentCategory.guides : [];

  // Clean the H1 title from the raw markdown content to avoid double headers
  const cleanedContent = guide.content.replace(/^#\s+.+$/m, '').trim();

  const handlePrint = () => {
    trackEvent('print_service_guide', { slug: guide.fileSlug });
    window.print();
  };

  const handleShare = () => {
    trackEvent('share_service_guide', { slug: guide.fileSlug });
    if (navigator.share) {
      navigator.share({
        title: `${guide.title} - Telangana.live`,
        text: `Check out this civic guide for ${guide.title}`,
        url: window.location.href,
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto px-4 mt-6 animate-fade-in print:p-0 print:m-0 print:pb-0">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <nav className="flex items-center gap-2 text-xs text-text-muted" aria-label="Breadcrumb">
          <Link to="/services" className="hover:text-white transition-colors focus:outline-none focus:underline p-1">
            Services Directory
          </Link>
          <span>/</span>
          <span className="text-text-secondary truncate max-w-[250px]" aria-current="page">
            {guide.title}
          </span>
        </nav>
        
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-white transition-colors group focus:outline-none focus:ring-2 focus:ring-telangana-green p-1.5 rounded-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Directory
        </Link>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Nav (1 Column, hidden on mobile) */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6 print:hidden">
          <div className="glass-card p-5 border border-white/[0.04] bg-white/[0.005] sticky top-6">
            <h3 className="text-xs font-black uppercase text-heritage-gold tracking-widest mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-heritage-gold" />
              {currentCategory?.title}
            </h3>
            <nav className="space-y-1" aria-label="Guides in this category">
              {sisterGuides.map(item => {
                const isActive = item.fileSlug === slug;
                return (
                  <Link
                    key={item.fileSlug}
                    to={`/services/${item.categorySlug}/${item.fileSlug}`}
                    aria-current={isActive ? 'page' : undefined}
                    className={`block p-2.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-telangana-green/10 border border-telangana-green/30 text-white font-bold'
                        : 'bg-transparent border border-transparent text-text-muted hover:text-white hover:bg-white/[0.02]'
                    } focus:outline-none focus:ring-2 focus:ring-telangana-green`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Article content (3 Columns) */}
        <article className="col-span-1 lg:col-span-3 space-y-6">
          <div className="glass-card p-6 sm:p-8 border border-white/[0.04] bg-white/[0.005] relative overflow-hidden print:border-none print:bg-transparent print:p-0">
            
            {/* Header section */}
            <header className="border-b border-white/[0.06] pb-6 mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="badge-live bg-telangana-green/15 text-green-400 border border-telangana-green/25">
                  {currentCategory?.title}
                </span>
                <span className="text-xs text-text-muted">Information Guide</span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight leading-tight">
                  {guide.title}
                </h1>
                
                {/* Print/Share Action Buttons */}
                <div className="flex items-center gap-2 print:hidden flex-shrink-0">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg bg-white/[0.03] border border-white/10 text-text-secondary hover:text-white hover:bg-white/[0.08] transition-all focus:outline-none focus:ring-2 focus:ring-telangana-green"
                    title="Share Guide"
                    aria-label="Share guide link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handlePrint}
                    className="p-2 rounded-lg bg-white/[0.03] border border-white/10 text-text-secondary hover:text-white hover:bg-white/[0.08] transition-all focus:outline-none focus:ring-2 focus:ring-telangana-green"
                    title="Print Guide"
                    aria-label="Print guide"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </header>

            {/* Markdown Body */}
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({node, ...props}) => (
                    <h1 className="text-2xl font-bold text-white mt-8 mb-4 font-heading" {...props} />
                  ),
                  h2: ({node, ...props}) => (
                    <h2 className="text-lg font-bold text-white mt-8 mb-4 border-b border-white/5 pb-2 font-heading tracking-tight" {...props} />
                  ),
                  h3: ({node, ...props}) => (
                    <h3 className="text-md font-bold text-white mt-6 mb-3 font-heading" {...props} />
                  ),
                  p: ({node, ...props}) => (
                    <p className="text-sm text-text-secondary leading-relaxed mb-4" {...props} />
                  ),
                  blockquote: ({node, children, ...props}) => {
                    const textContent = getText(children);
                    const isDisclaimer = textContent.toLowerCase().includes('disclaimer') || textContent.toLowerCase().includes('not an official');

                    if (isDisclaimer) {
                      return (
                        <div 
                          className="glass-card p-4 my-6 border-l-4 border-heritage-gold bg-heritage-gold/5 flex gap-3 text-text-secondary text-xs sm:text-sm"
                          role="alert"
                          {...props}
                        >
                          <div className="text-heritage-gold text-lg select-none">⚠️</div>
                          <div className="space-y-1">
                            <strong className="text-white block font-heading tracking-wide uppercase text-[10px]">Official Disclaimer</strong>
                            {children}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <blockquote className="border-l-4 border-telangana-green bg-white/[0.01] p-4 rounded-r-lg my-4 text-text-secondary italic" {...props}>
                        {children}
                      </blockquote>
                    );
                  },
                  ol: ({node, children, ...props}) => (
                    <ol className="relative pl-6 space-y-4 border-l border-white/[0.08] ml-2.5 my-6" {...props}>
                      {children}
                    </ol>
                  ),
                  ul: ({node, children, ...props}) => (
                    <ul className="space-y-2 my-4 pl-1" {...props}>
                      {children}
                    </ul>
                  ),
                  li: ({node, children, ordered, index, ...props}) => {
                    if (ordered) {
                      return (
                        <li className="relative mb-4 last:mb-0" {...props}>
                          <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 bg-dark-bg border-telangana-green flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-telangana-green" />
                          </div>
                          <div className="text-sm text-text-secondary leading-relaxed pl-2">
                            {children}
                          </div>
                        </li>
                      );
                    }
                    return (
                      <li className="flex items-start gap-2 text-sm text-text-secondary leading-relaxed mb-2" {...props}>
                        <span className="text-telangana-green font-bold select-none">✓</span>
                        <span>{children}</span>
                      </li>
                    );
                  },
                  a: ({node, children, href = '#', ...props}) => {
                    const isExternal = href.startsWith('http') || href.startsWith('//') || href === '#';
                    const textStr = getText(children);
                    const isApplyButton = textStr.toLowerCase().includes('apply') || 
                                          textStr.toLowerCase().includes('register') || 
                                          textStr.toLowerCase().includes('download') || 
                                          textStr.toLowerCase().includes('check status');

                    if (isApplyButton) {
                      return (
                        <a
                          href={href}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          className="inline-flex items-center gap-2 px-4 py-2 my-2 rounded-xl bg-telangana-green/10 hover:bg-telangana-green/20 border border-telangana-green/30 hover:border-telangana-green/50 text-telangana-green hover:text-white text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-telangana-green focus:ring-offset-2 focus:ring-offset-dark-bg"
                          {...props}
                        >
                          {children}
                          <span className="text-[10px]">↗</span>
                        </a>
                      );
                    }

                    return (
                      <a
                        href={href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="text-telangana-green hover:text-white underline hover:no-underline font-bold transition-all focus:outline-none focus:ring-2 focus:ring-telangana-green focus:rounded"
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  },
                  hr: ({node, ...props}) => <hr className="border-white/[0.06] my-6" {...props} />,
                }}
              >
                {cleanedContent}
              </ReactMarkdown>
            </div>
            
          </div>
        </article>
      </div>
    </div>
  );
}
