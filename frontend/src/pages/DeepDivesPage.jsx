import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';

export default function DeepDivesPage() {
  const [flaps, setFlaps] = useState([]);
  const [activeFlap, setActiveFlap] = useState(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the generated metadata.json
    fetch('/data/flaps/metadata.json')
      .then(res => res.json())
      .then(data => {
        setFlaps(data);
        if (data.length > 0) {
          loadFlapContent(data[0].filename);
          setActiveFlap(data[0].id);
        }
      })
      .catch(err => {
        console.error("Failed to load flaps metadata", err);
        setIsLoading(false);
      });
  }, []);

  const loadFlapContent = (filename) => {
    setIsLoading(true);
    fetch(`/data/flaps/${filename}`)
      .then(res => res.text())
      .then(text => {
        setContent(text);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load flap content", err);
        setContent('Error loading content.');
        setIsLoading(false);
      });
  };

  const handleSelect = (flap) => {
    setActiveFlap(flap.id);
    loadFlapContent(flap.filename);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Deep Dives | Telangana Live</title>
        <meta name="description" content="One-page arguments and analytical essays." />
      </Helmet>

      <div className="min-h-screen bg-[#faf9f6] dark:bg-background pt-8 pb-20">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-text mb-4 tracking-tighter">
              Deep <span className="text-telangana-red">Dives</span>
            </h1>
            <p className="text-lg text-text-muted max-w-2xl font-medium">
              We take messy, noisy topics and find the one sharp idea hiding inside them. Not just news—perspective.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-1/3 flex flex-col gap-3 sticky top-24">
              <h3 className="font-bold text-text-muted uppercase tracking-widest text-xs mb-2">Available Essays</h3>
              {flaps.map((flap) => (
                <button
                  key={flap.id}
                  onClick={() => handleSelect(flap)}
                  className={`text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group ${
                    activeFlap === flap.id 
                      ? 'bg-telangana-red text-white border-telangana-red shadow-md' 
                      : 'bg-white dark:bg-card border-border hover:border-telangana-red/50 hover:shadow-sm text-text'
                  }`}
                >
                  <span className="font-bold text-sm leading-tight group-hover:translate-x-1 transition-transform">
                    {flap.title}
                  </span>
                  <ArrowRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${activeFlap === flap.id ? 'opacity-100' : ''}`} />
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="w-full lg:w-2/3 bg-white dark:bg-card rounded-3xl p-8 md:p-12 shadow-sm border border-border min-h-[600px] relative">
              {isLoading && (
                <div className="absolute inset-0 bg-white/50 dark:bg-card/50 backdrop-blur-sm flex items-center justify-center rounded-3xl z-10">
                  <div className="w-8 h-8 border-4 border-telangana-red border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              <article className="prose prose-lg dark:prose-invert prose-headings:font-black prose-h2:text-3xl prose-h2:text-telangana-red prose-a:text-telangana-red max-w-none">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                  {content}
                </ReactMarkdown>
              </article>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
