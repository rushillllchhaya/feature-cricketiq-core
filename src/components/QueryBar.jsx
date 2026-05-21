import React, { useState } from 'react';

const QueryBar = ({ isLoading, onAnalyse }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onAnalyse(input);
      setInput('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative group max-w-3xl mx-auto w-full"
    >
      <div className="relative flex items-center transition-all duration-300 focus-within:scale-[1.02]">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the Analyst (e.g., 'Analyze Kohli's form in death overs')"
          className="w-full bg-bg-secondary text-white px-6 py-4 pr-32 rounded-xl border-2 border-bg-tertiary
                     placeholder-gray-500 outline-none transition-all duration-300
                     focus:border-accent-teal focus:ring-4 focus:ring-accent-teal/10
                     font-ui text-lg"
        />

        <div className="absolute right-3 flex items-center gap-2">
          {isLoading && (
            <div className="animate-cricket-ball text-xl mr-2">
              ⚪
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-accent-teal hover:bg-accent-teal/90 disabled:bg-gray-700 disabled:text-gray-500
                       text-bg-primary font-bold px-6 py-2 rounded-lg transition-all duration-200
                       text-sm uppercase tracking-wider whitespace-nowrap"
          >
            Analyse
          </button>
        </div>

        {/* The sweeping underline */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-accent-teal w-0 group-focus-within:w-full transition-all duration-500 ease-out rounded-full"></div>
      </div>
    </form>
  );
};

export default QueryBar;
