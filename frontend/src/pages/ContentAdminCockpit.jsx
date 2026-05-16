import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { goldRates } from '../data/goldRates';
import { fuelPrices } from '../data/fuelPrices';
import newsData from '../data/news.json';
import { Icons } from '../components/Icons';

export default function ContentAdminCockpit() {
  const currentDate = new Date('2026-03-27T12:40:27+05:30');

  const contentSources = useMemo(() => {
    const sources = [];

    // 1. Gold Rates
    sources.push({
      id: 'gold',
      name: 'Gold & Silver Rates',
      category: 'Finance',
      page: '/rates/gold',
      file: 'src/data/goldRates.js',
      lastUpdated: goldRates.date,
      action: 'Update rate variables and history array',
    });

    // 2. Fuel Prices
    sources.push({
      id: 'fuel',
      name: 'Fuel Prices',
      category: 'Finance',
      page: '/rates/fuel',
      file: 'src/data/fuelPrices.js',
      lastUpdated: fuelPrices.date,
      action: 'Update petrol, diesel, CNG, LPG prices',
    });

    // 3. News Updates (Find newest item)
    let latestNewsDate = '2000-01-01';
    if (newsData && newsData.length > 0) {
      latestNewsDate = newsData.reduce((latest, item) => {
        if (!latest) return item.published;
        return new Date(item.published) > new Date(latest) ? item.published : latest;
      }, newsData[0].published);
    }
    
    sources.push({
      id: 'news',
      name: 'News Ticker & Portal',
      category: 'News',
      page: '/news',
      file: 'src/data/news.json',
      lastUpdated: latestNewsDate,
      action: 'Add new articles to JSON array',
    });

    // 4. Metro & MMTS (Using a mocked or semi-static date as Transport doesn't have daily timestamps)
    sources.push({
      id: 'transport',
      name: 'Metro & MMTS Info',
      category: 'Transport',
      page: '/transport/metro',
      file: 'src/data/transportData.js',
      lastUpdated: '2026-03-01', // Approx date based on "March 2026" text
      action: 'Verify operational status and crowd levels',
    });

    return sources.map(source => {
      const updatedDate = new Date(source.lastUpdated);
      const diffTime = Math.abs(currentDate - updatedDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let status = 'Old';
      let statusColor = 'bg-red-500/20 text-red-500 border-red-500/30';
      let icon = <Icons.Warning className="w-5 h-5 text-red-500" />;
      
      if (diffDays <= 2) {
        status = 'Updated';
        statusColor = 'bg-green-500/20 text-green-500 border-green-500/30';
        icon = <Icons.Check className="w-5 h-5 text-green-500" />;
      } else if (diffDays <= 7) {
        status = 'Stale';
        statusColor = 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
        icon = <Icons.Clock className="w-5 h-5 text-yellow-500" />;
      }

      return { ...source, diffDays, status, statusColor, icon };
    });
  }, []);

  const summary = useMemo(() => {
    return contentSources.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, { Updated: 0, Stale: 0, Old: 0 });
  }, [contentSources]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in pb-24">
      {/* Header */}
      <div className="mb-8 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-telangana-green/20 rounded-lg">
            <Icons.Monitor className="w-6 h-6 text-telangana-green" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Content Admin Cockpit</h1>
        </div>
        <p className="text-text-muted text-sm mt-2 max-w-2xl">
          System-wide diagnostic of static content freshness. Visually identify which pages and data files require administrative update actions to ensure citizens receive accurate information.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-dark-card border border-white/5 rounded-2xl p-6 shadow-lg flex flex-col justify-center items-center">
          <span className="text-text-muted text-xs uppercase tracking-wider mb-2 font-semibold">Total Sources</span>
          <span className="text-4xl font-bold text-white">{contentSources.length}</span>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 shadow-lg flex flex-col justify-center items-center">
          <span className="text-green-500/70 text-xs uppercase tracking-wider mb-2 font-semibold">Updated (&lt;2 Days)</span>
          <span className="text-4xl font-bold text-green-500">{summary.Updated}</span>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 shadow-lg flex flex-col justify-center items-center">
          <span className="text-yellow-500/70 text-xs uppercase tracking-wider mb-2 font-semibold">Stale (3-7 Days)</span>
          <span className="text-4xl font-bold text-yellow-500">{summary.Stale}</span>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 shadow-lg flex flex-col justify-center items-center">
          <span className="text-red-500/70 text-xs uppercase tracking-wider mb-2 font-semibold">Old (&gt;7 Days)</span>
          <span className="text-4xl font-bold text-red-500">{summary.Old}</span>
        </div>
      </div>

      {/* Data Source Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white mb-4">Content Registry Status</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {contentSources.map((source) => (
            <div key={source.id} className="bg-dark-card border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-opacity-20 border flex items-center justify-center ${source.statusColor}`}>
                    {source.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{source.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                      <span className="px-2 py-0.5 bg-white/5 rounded-md text-white/70 font-medium">{source.category}</span>
                      <span>•</span>
                      <span>Last updated: <span className="text-white/80">{source.lastUpdated}</span></span>
                      <span>({source.diffDays} days ago)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                  <span className="block text-[10px] uppercase text-text-muted font-bold tracking-wider mb-1">Affected Page</span>
                  <Link to={source.page} className="text-sm text-telangana-green hover:text-green-400 transition-colors truncate block">
                    {source.page}
                  </Link>
                </div>
                <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                  <span className="block text-[10px] uppercase text-text-muted font-bold tracking-wider mb-1">Source File</span>
                  <span className="text-sm text-gray-300 truncate block font-mono text-xs">{source.file}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5">
                <span className="block text-[10px] uppercase text-text-muted font-bold tracking-wider mb-2 flex items-center gap-1">
                  <Icons.Tools className="w-3 h-3" />
                  Action Required
                </span>
                <p className="text-sm text-gray-400">{source.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
