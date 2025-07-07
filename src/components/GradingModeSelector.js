import React from 'react';

const GRADING_MODES = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'For schools with 50%+ acceptance rates',
    difficulty: 'Moderate',
    examples: 'State universities, liberal arts colleges',
    color: 'from-green-500 to-green-600',
    bgColor: 'from-green-50 to-green-100',
    borderColor: 'border-green-200'
  },
  {
    id: 'competitive',
    name: 'Competitive',
    description: 'For schools with 15-50% acceptance rates',
    difficulty: 'High',
    examples: 'UC Berkeley, NYU, Boston University',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-200'
  },
  {
    id: 'elite',
    name: 'Elite',
    description: 'For top-tier schools with <15% acceptance rates',
    difficulty: 'Extreme',
    examples: 'Harvard, Stanford, MIT, Yale',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'from-purple-50 to-purple-100',
    borderColor: 'border-purple-200'
  }
];

function GradingModeSelector({ selectedMode, onModeChange }) {
  return (
    <div className="mb-6">
      <div className="text-center mb-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2">Select Your Target Level</h3>
        <p className="text-gray-600 text-sm">Choose the difficulty level that matches your target schools</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto">
        {GRADING_MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
              selectedMode === mode.id
                ? `bg-gradient-to-r ${mode.bgColor} ${mode.borderColor} shadow-lg`
                : 'bg-white/80 border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-left">
              <div className="flex items-center justify-between mb-2">
                <span className={`font-bold text-lg bg-gradient-to-r ${mode.color} bg-clip-text text-transparent`}>
                  {mode.name}
                </span>
                <div className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${mode.color} text-white`}>
                  {mode.difficulty}
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-2">{mode.description}</p>
              <p className="text-xs text-gray-500">{mode.examples}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default GradingModeSelector; 