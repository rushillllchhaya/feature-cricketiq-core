import React, { useState } from 'react';
import QueryBar from './components/QueryBar';
import './styles/index.css';
import './styles/animations.css';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');

  const handleAnalyse = (q) => {
    setIsLoading(true);
    setQuery(q);
    // Mock loading
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-white font-ui flex flex-col overflow-hidden">
      {/* Main Grid Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 h-full overflow-hidden">

        {/* Left Sidebar / Controls - Hidden on small, 3 cols on large */}
        <aside className="hidden lg:col-span-3 bg-bg-secondary border-r border-bg-tertiary p-6 flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-accent-teal rounded-full flex items-center justify-center font-bold text-bg-primary">
              IQ
            </div>
            <h1 className="text-xl font-extrabold tracking-tighter">CRICKET<span className="text-accent-teal">IQ</span></h1>
          </div>

          <nav className="space-y-2">
            <div className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-4">Analyst Tools</div>
            <button className="w-full text-left px-4 py-2 rounded-md bg-bg-tertiary hover:bg-accent-teal/10 hover:text-accent-teal transition-colors duration-200 text-sm font-medium border border-transparent hover:border-accent-teal/30">
              Live Match Feed
            </button>
            <button className="w-full text-left px-4 py-2 rounded-md hover:bg-bg-tertiary transition-colors duration-200 text-sm font-medium text-gray-400">
              Player Comparison
            </button>
            <button className="w-full text-left px-4 py-2 rounded-md hover:bg-bg-tertiary transition-colors duration-200 text-sm font-medium text-gray-400">
              Historical Trends
            </button>
          </nav>
        </aside>

        {/* Center Hub - 6 cols on large */}
        <main className="col-span-1 lg:col-span-6 flex flex-col relative h-full border-r border-bg-tertiary">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Placeholder for Content */}
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold mb-2">Command Center</h2>
              <p className="text-gray-400 font-ai italic">Awaiting tactical input from the analyst...</p>
            </div>

            {isLoading && (
              <div className="space-y-4">
                <div className="h-4 w-3/4 shimmer-bg rounded"></div>
                <div className="h-4 w-1/2 shimmer-bg rounded"></div>
                <div className="h-32 w-full shimmer-bg rounded-xl"></div>
              </div>
            )}
          </div>

          {/* Query Bar Area - Bottom Fixed */}
          <div className="p-6 bg-gradient-to-t from-bg-primary to-transparent">
            <QueryBar
              isLoading={isLoading}
              onAnalyse={handleAnalyse}
            />
          </div>
        </main>

        {/* Right Ticker - 3 cols on large */}
        <aside className="hidden lg:col-span-3 bg-bg-primary p-6 flex flex-col gap-6 overflow-y-auto">
          <div className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Live Ticker</div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-3 bg-bg-secondary rounded-lg border-l-2 border-accent-teal animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="text-xs text-accent-teal font-stats font-bold mb-1">0.1 OVER</div>
                <div className="text-sm font-medium">Wicket! Bowler delivers a lethal yorker. 142km/h.</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default App;
