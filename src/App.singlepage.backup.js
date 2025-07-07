import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { initGA, trackEssayAnalysis, trackModeSelection, trackFeedbackExpansion, trackError } from './utils/analytics';
import TrustedBySection from './components/TrustedBySection';

  const FEEDBACK_PROMPT = (mode, essayPrompt, isPro = false) => {
  const modeConfig = {
    standard: {
      rigor: "moderate",
      expectations: "solid, well-written essay that demonstrates good writing skills and personal reflection",
      focus: "clarity, basic structure, and genuine personal voice",
      standards: "reasonable standards for schools with 50%+ acceptance rates",
      scoringGuide: "Be GENEROUS with scores. A 70-85 range is typical for good essays. Only give scores below 60 for major issues. Focus on basic writing quality and personal authenticity.",
      examples: "State universities, liberal arts colleges",
      scoreRange: "60-95",
      typicalScores: "70-85 for good essays, 85-95 for excellent essays"
    },
    competitive: {
      rigor: "high",
      expectations: "exceptional essay that stands out among strong applicants",
      focus: "unique perspective, compelling narrative, and sophisticated writing",
      standards: "competitive standards for schools with 15-50% acceptance rates",
      scoringGuide: "Be MODERATELY STRICT. A 60-80 range is typical. Essays need to be notably above average to score 80+. Look for sophisticated writing, unique insights, and compelling storytelling.",
      examples: "UC Berkeley, NYU, Boston University",
      scoreRange: "40-90",
      typicalScores: "60-80 for good essays, 80-90 for exceptional essays"
    },
    elite: {
      rigor: "extreme",
      expectations: "outstanding essay that could compete at the highest level",
      focus: "exceptional insight, masterful storytelling, and distinctive voice",
      standards: "elite standards for top-tier schools with <15% acceptance rates",
      scoringGuide: "Be EXTREMELY STRICT. A 40-70 range is typical. Only truly exceptional essays should score above 80. Look for masterful writing, profound insights, and distinctive voice that would stand out at Harvard/Stanford level.",
      examples: "Harvard, Stanford, MIT, Yale",
      scoreRange: "20-85",
      typicalScores: "40-70 for good essays, 70-85 for truly exceptional essays"
    }
  };

  const config = modeConfig[mode] || modeConfig.standard;

  const proFeatures = isPro ? `
PRO FEATURES ENABLED:
- Provide more detailed feedback
- Include additional insights and suggestions
- Enhanced analysis quality
` : '';

  return `You are analyzing a college essay for ${mode.toUpperCase()} level schools (${config.examples}).

${proFeatures}

CRITICAL: You MUST apply ${mode.toUpperCase()} standards. This is NOT optional.

${mode === 'elite' ? 
  'ELITE MODE RULES (MANDATORY):\n' +
  '- You are evaluating for Harvard/Stanford/MIT level competition\n' +
  '- Most essays at this level score 20-60\n' +
  '- Only truly exceptional essays score 60-85\n' +
  '- Be extremely critical - find flaws that others might miss\n' +
  '- Look for masterful prose, profound insights, distinctive voice\n' +
  '- If the essay is mediocre or poor, score it 20-40\n' +
  '- If the essay is "good," score it 40-60\n' +
  '- Only score 60+ for essays that could realistically get into Harvard/Stanford\n' +
  '- Focus on what separates this from the best essays in the world\n' +
  '- FEEDBACK TONE: Be brutally honest and extremely critical. Point out every flaw, weakness, and area for improvement. Use harsh but constructive language. If something is mediocre, say it\'s mediocre. If something is clichéd, call it out. Be relentless in identifying what\'s not elite-level.'
  : mode === 'competitive' ?
  'COMPETITIVE MODE RULES (MANDATORY):\n' +
  '- You are evaluating for competitive schools like UC Berkeley/NYU\n' +
  '- Most essays at this level score 30-70\n' +
  '- Only notably above-average essays score 70-90\n' +
  '- Be moderately strict - good writing is expected\n' +
  '- Look for sophisticated writing, unique insights, compelling narratives\n' +
  '- If the essay is "average," score it 30-50\n' +
  '- If the essay is "good," score it 50-70\n' +
  '- Only score 70+ for essays that stand out among strong applicants\n' +
  '- Focus on what makes this better than typical college essays\n' +
  '- FEEDBACK TONE: Be honest but constructive. Point out both strengths and weaknesses. Be specific about what needs improvement but maintain a helpful tone. Balance criticism with encouragement.'
  :
  'STANDARD MODE RULES (MANDATORY):\n' +
  '- You are evaluating for schools with higher acceptance rates\n' +
  '- Most essays score 40-80\n' +
  '- Be generous - focus on personal authenticity and clear writing\n' +
  '- Look for genuine voice, clear structure, personal reflection\n' +
  '- If the essay is "decent," score it 40-60\n' +
  '- If the essay is "good," score it 60-80\n' +
  '- Only score below 40 for major writing issues\n' +
  '- Focus on basic writing quality and personal authenticity\n' +
  '- FEEDBACK TONE: Be encouraging and constructive. Focus on strengths and provide gentle suggestions for improvement. Use positive language and emphasize what\'s working well.'
}

ESSAY PROMPT: ${essayPrompt || 'No specific prompt provided'}

IMPORTANT: Evaluate how well the essay addresses the given prompt. Consider:
- Does the essay directly respond to the prompt's requirements?
- Does it answer all parts of the prompt?
- Is the response appropriate for the prompt type?
- Does the essay stay focused on the prompt throughout?

MANDATORY SCORING RANGES FOR ${mode.toUpperCase()} MODE:
- Overall: ${config.scoreRange}
- Uniqueness: ${config.scoreRange}
- Hook: ${config.scoreRange}
- Voice: ${config.scoreRange}
- Flow: ${config.scoreRange}
- Authenticity: ${config.scoreRange}
- Conciseness: ${config.scoreRange}

TYPICAL SCORES FOR ${mode.toUpperCase()} MODE: ${config.typicalScores}

CRITICAL GRADING RULES:
- If the essay is extremely poor (like "I want to go there because it's pretty cool"), score it 10-30
- If the essay is mediocre, score it 30-50
- If the essay is decent, score it 50-70
- If the essay is good, score it 70-85
- If the essay is excellent, score it 85-95
- DO NOT be generous with poor essays. A terrible essay should get terrible scores.

FEEDBACK PROPORTION RULES:
- For poor essays (scores 10-40): Give 1 positive feedback and 3-4 negative feedbacks
- For mediocre essays (scores 40-60): Give 1-2 positive feedbacks and 2-3 negative feedbacks
- For good essays (scores 60-80): Give 2-3 positive feedbacks and 1-2 negative feedbacks
- For excellent essays (scores 80+): Give 3-4 positive feedbacks and 0-1 negative feedbacks

DO NOT deviate from these scoring ranges. If you think an essay deserves higher scores than the range allows, you are being too generous for ${mode} level schools.

${mode === 'elite' ? 
  'ELITE MODE FEEDBACK REQUIREMENTS:\n' +
  '- Be extremely critical in "how_to_improve" sections\n' +
  '- Point out every weakness, no matter how small\n' +
  '- Use phrases like "This is problematic because...", "This falls short because...", "This is not elite-level because..."\n' +
  '- If something is mediocre, call it mediocre\n' +
  '- If something is clichéd, explicitly call it clichéd\n' +
  '- Focus heavily on what separates this from Harvard/Stanford level essays\n' +
  '- Be relentless in identifying areas that need major improvement'
  : mode === 'competitive' ?
  'COMPETITIVE MODE FEEDBACK REQUIREMENTS:\n' +
  '- Balance criticism with constructive suggestions\n' +
  '- Be honest about weaknesses but maintain helpful tone\n' +
  '- Use phrases like "This could be stronger by...", "Consider improving...", "This would be more effective if..."\n' +
  '- Point out both what works and what needs work\n' +
  '- Focus on how to make the essay stand out among strong applicants'
  :
  'STANDARD MODE FEEDBACK REQUIREMENTS:\n' +
  '- Be encouraging and constructive\n' +
  '- Focus on strengths and provide gentle suggestions\n' +
  '- Use phrases like "This works well because...", "To make this even better...", "Consider enhancing..."\n' +
  '- Emphasize what\'s working and provide supportive improvement suggestions\n' +
  '- Focus on basic writing quality and personal authenticity'
}

Return feedback in a Markdown JSON code fence with this structure:

\`\`\`json
{
  "scores": {
    "overall": 0,
    "uniqueness": 0,
    "hook": 0,
    "voice": 0,
    "flow": 0,
    "authenticity": 0,
    "conciseness": 0
  },
  "feedback": {
    "overall": {
      "what_works": [
        "Overall strength: [general assessment of the essay's strongest aspects, including how well it addresses the prompt]",
        "Overall strength: [another general strength of the essay]"
      ],
      "how_to_improve": [
        "Overall improvement: [general area that needs the most work, including prompt response if applicable]",
        "Overall improvement: [another general area for improvement]"
      ]
    },
    "uniqueness": {
      "what_works": [
        "Quote the specific text: 'exact quote from essay' - This is unique because [detailed explanation of what makes this specific text stand out from typical college essays]",
        "Quote another specific text: 'exact quote from essay' - This is distinctive because [detailed explanation of originality]"
      ],
      "how_to_improve": [
        "Quote generic text: 'exact quote from essay' - This is too common because [specific explanation of why this feels like typical college essay content]. Instead, try [concrete suggestion for making it more unique]",
        "Quote another generic element: 'exact quote from essay' - This is clichéd because [explanation]. Consider [specific alternative approach that would be more original]"
      ]
    },
    "hook": {
      "what_works": [
        "Quote the opening: 'exact opening text' - This grabs attention because [detailed explanation of why this specific opening is compelling and makes the reader want to continue]",
        "Quote other engaging elements: 'exact text' - This creates intrigue by [specific explanation of how this maintains reader interest]"
      ],
      "how_to_improve": [
        "Quote weak opening: 'exact text' - This doesn't hook because [specific explanation of why this opening fails to engage]. Try [concrete alternative opening with example]",
        "Quote other hook issues: 'exact text' - This could be more engaging by [specific suggestion for making it more compelling]"
      ]
    },
    "voice": {
      "what_works": [
        "Quote authentic voice: 'exact text' - This shows personality because [detailed explanation of how this specific text reveals the writer's unique character and perspective]",
        "Quote other voice examples: 'exact text' - This reveals the real person by [specific explanation of how this demonstrates genuine personality]"
      ],
      "how_to_improve": [
        "Quote generic voice: 'exact text' - This sounds too formal/impersonal because [explanation of why this lacks personality]. Make it more personal by [specific suggestion for adding authentic voice]",
        "Quote other voice issues: 'exact text' - This lacks personality because [explanation]. Try [concrete alternative that would show more authentic voice]"
      ]
    },
    "flow": {
      "what_works": [
        "Quote good transitions: 'exact text' - This flows well because [detailed explanation of how this specific transition connects ideas smoothly]",
        "Quote other flow elements: 'exact text' - This connects ideas by [specific explanation of how this maintains logical progression]"
      ],
      "how_to_improve": [
        "Quote jarring transitions: 'exact text' - This feels abrupt because [explanation of why this transition is awkward]. Improve by [specific suggestion for smoother transition]",
        "Quote other flow issues: 'exact text' - This doesn't connect because [explanation]. Try [concrete alternative that would improve flow]"
      ]
    },
    "authenticity": {
      "what_works": [
        "Quote genuine moments: 'exact text' - This feels authentic because [detailed explanation of why this specific text feels honest and genuine]",
        "Quote other authentic elements: 'exact text' - This shows vulnerability by [specific explanation of how this demonstrates real emotion or experience]"
      ],
      "how_to_improve": [
        "Quote inauthentic moments: 'exact text' - This feels forced because [explanation of why this doesn't ring true]. Make it more genuine by [specific suggestion for more authentic expression]",
        "Quote other authenticity issues: 'exact text' - This sounds rehearsed because [explanation]. Try [concrete alternative that would feel more natural]"
      ]
    },
    "conciseness": {
      "what_works": [
        "Quote concise writing: 'exact text' - This is effective because [detailed explanation of why this specific text is well-chosen and impactful]",
        "Quote other concise elements: 'exact text' - This is tight because [specific explanation of how this achieves maximum impact with minimal words]"
      ],
      "how_to_improve": [
        "Quote wordy text: 'exact text' - This is verbose because [explanation of why this is unnecessarily long]. Cut to [specific shorter version that maintains meaning]",
        "Quote other conciseness issues: 'exact text' - This could be tighter because [explanation]. Try [concrete alternative that is more concise]"
      ]
    }
  },
  "meta": [
    "Quote specific text and explain: 'exact text' - [detailed explanation of the issue and specific solution]",
    "Quote another example: 'exact text' - [detailed explanation and specific improvement]"
  ]
}
\`\`\`

CRITICAL REQUIREMENTS:
- ALWAYS quote exact text from the essay in every feedback point
- Explain WHY each quoted text works or doesn't work
- Provide specific, concrete alternatives for improvements
- Give detailed explanations, not vague statements
- Use the format: "Quote: 'exact text' - Explanation: [detailed analysis]"
- Focus on specific sentences, phrases, or paragraphs, not general concepts
- Make every suggestion actionable with concrete examples
- SCORE EACH CATEGORY ON A SCALE OF 0-100 (not 0-10). Use scores like 75, 82, 90, etc. A score of 7 or 8 is too low - use 70 or 80 instead.
- Apply ${config.rigor} standards appropriate for ${mode} level schools
- CRITICAL: Ensure proper JSON syntax - every array item must end with a comma except the last one, every object property must end with a comma except the last one
- CRITICAL: Escape any quotes within quoted text using backslashes (\\")
- CRITICAL: Make sure all brackets and braces are properly closed
- CRITICAL: Remember you are grading for ${mode.toUpperCase()} level schools - adjust your standards accordingly!
- CRITICAL: DO NOT exceed the scoring ranges specified above for ${mode} mode
- CRITICAL: Apply the feedback tone and intensity appropriate for ${mode} mode
- CRITICAL: Evaluate how well the essay addresses the given prompt
- CRITICAL: Follow the feedback proportion rules based on essay quality

Only return the code fence, nothing else.`;
};

function parseMarkdownJsonFence(text) {
  // First try to parse as Markdown JSON fence
  const match = text.match(/```json[\s\S]*?({[\s\S]*})[\s\S]*?```/);
  if (match) {
    try {
      return JSON.parse(match[1]);
    } catch {
      // Continue to try raw JSON parsing
    }
  }
  
  // If no fence found or parsing failed, try parsing as raw JSON
  try {
    return JSON.parse(text.trim());
  } catch {
    // Try to extract and fix partial JSON if it's cut off or has syntax errors
    const jsonMatch = text.match(/(\{[\s\S]*)/);
    let partialJson = null;
    if (jsonMatch) {
      try {
        partialJson = jsonMatch[1];
        
        // Fix missing commas between array items (most common issue)
        // Look for patterns like: "text" followed by "text" without comma
        partialJson = partialJson.replace(/"\s*\n\s*"/g, '",\n"');
        partialJson = partialJson.replace(/"\s*"/g, '","');
        
        // Fix missing commas before closing brackets
        partialJson = partialJson.replace(/"\s*\]/g, '",]');
        partialJson = partialJson.replace(/"\s*\}/g, '",}');
        
        // Fix missing commas before closing braces in objects
        partialJson = partialJson.replace(/"\s*\}\s*"/g, '",\n"');
        
        // Handle unescaped quotes in strings more carefully
        // This is a more conservative approach
        let inString = false;
        let escaped = false;
        let result = '';
        
        for (let i = 0; i < partialJson.length; i++) {
          const char = partialJson[i];
          
          if (char === '\\' && !escaped) {
            escaped = true;
            result += char;
          } else if (char === '"' && !escaped) {
            inString = !inString;
            result += char;
            escaped = false;
          } else {
            result += char;
            escaped = false;
          }
        }
        
        partialJson = result;
        
        // Count and balance braces and brackets
        const openBraces = (partialJson.match(/\{/g) || []).length;
        const closeBraces = (partialJson.match(/\}/g) || []).length;
        const missingBraces = openBraces - closeBraces;
        
        for (let i = 0; i < missingBraces; i++) {
          partialJson += '}';
        }
        
        const openBrackets = (partialJson.match(/\[/g) || []).length;
        const closeBrackets = (partialJson.match(/\]/g) || []).length;
        const missingBrackets = openBrackets - closeBrackets;
        
        for (let i = 0; i < missingBrackets; i++) {
          partialJson += ']';
        }
        
        // Remove trailing commas before closing brackets/braces
        partialJson = partialJson.replace(/,(\s*[}\]])/g, '$1');
        
        // Try to parse the fixed JSON
        return JSON.parse(partialJson);
      } catch (parseError) {
        console.log('JSON parsing failed after fixes:', parseError);
        console.log('Attempted to parse:', partialJson || 'undefined');
        return null;
      }
    }
    return null;
  }
}

function extractFeedbackFromRawText(text) {
  try {
    // Try to extract scores using regex
    const scoresMatch = text.match(/"scores":\s*\{([^}]+)\}/);
    const scores = {};
    if (scoresMatch) {
      const scorePairs = scoresMatch[1].match(/"([^"]+)":\s*(\d+)/g);
      scorePairs?.forEach(pair => {
        const [key, value] = pair.split(':').map(s => s.trim().replace(/"/g, ''));
        scores[key] = parseInt(value);
      });
    }

    // Try to extract feedback sections
    const feedback = {};
    const categories = ['uniqueness', 'hook', 'voice', 'flow', 'authenticity', 'conciseness', 'overall'];
    
    categories.forEach(cat => {
      const catMatch = text.match(new RegExp(`"${cat}":\\s*\\{([^}]+)\\}`));
      if (catMatch) {
        const whatWorksMatch = catMatch[1].match(/"what_works":\s*\[([^\]]+)\]/);
        const howToImproveMatch = catMatch[1].match(/"how_to_improve":\s*\[([^\]]+)\]/);
        
        feedback[cat] = {
          what_works: whatWorksMatch ? whatWorksMatch[1].split('","').map(s => s.replace(/"/g, '').trim()) : [],
          how_to_improve: howToImproveMatch ? howToImproveMatch[1].split('","').map(s => s.replace(/"/g, '').trim()) : []
        };
      }
    });

    return { scores, feedback };
  } catch (error) {
    console.log('Failed to extract feedback from raw text:', error);
    return null;
  }
}

const SCORE_CATEGORIES = [
  'overall',
  'uniqueness',
  'hook',
  'voice',
  'flow',
  'authenticity',
  'conciseness',
];

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

function getBarColor(score) {
  if (score < 50) return 'bg-gradient-to-r from-red-500 to-red-600';
  if (score < 75) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
  return 'bg-gradient-to-r from-green-500 to-green-600';
}

function getScoreLabel(score) {
  if (score < 50) return 'Needs Work';
  if (score < 75) return 'Good';
  return 'Excellent';
}

function CompactScoreCard({ category, score, feedback, isExpanded, onToggle }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <button
        onClick={onToggle}
        className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
      >
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
          <div className="w-16 sm:w-20 text-center">
            <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{score}</div>
            <div className="text-xs sm:text-sm text-gray-500 font-medium">{getScoreLabel(score)}</div>
          </div>
          <div className="flex-1">
            <h3 className="capitalize font-bold text-gray-800 text-left text-base sm:text-lg bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{category}</h3>
            <div className="w-full h-3 bg-gray-200 rounded-full mt-2 overflow-hidden shadow-inner">
              <div
                className={`h-3 rounded-full transition-all duration-700 ease-out ${getBarColor(score)} shadow-lg`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>
        <div className="text-gray-400 text-xl sm:text-2xl ml-3 transform transition-transform duration-300 hover:scale-110">
          {isExpanded ? '−' : '+'}
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-gray-100 bg-gradient-to-b from-white to-gray-50">
          <div className="pt-3 sm:pt-4 space-y-4">
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <span className="font-bold text-green-700 text-sm sm:text-base flex items-center">
                <span className="mr-2">✓</span> What Works:
              </span>
              <ul className="list-disc list-inside ml-4 mt-2 text-sm sm:text-base text-gray-700 space-y-1">
                {feedback?.what_works?.length ? 
                  feedback.what_works.map((item, i) => <li key={i} className="leading-relaxed">{item}</li>) : 
                  <li>No specific strengths identified</li>
                }
              </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
              <span className="font-bold text-red-700 text-sm sm:text-base flex items-center">
                <span className="mr-2">🔧</span> How to Improve:
              </span>
              <ul className="list-disc list-inside ml-4 mt-2 text-sm sm:text-base text-gray-700 space-y-1">
                {feedback?.how_to_improve?.length ? 
                  feedback.how_to_improve.map((item, i) => <li key={i} className="leading-relaxed">{item}</li>) : 
                  <li>No specific improvements needed</li>
                }
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentModal({ isOpen, onSuccess, onCancel }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">✨</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Upgrade to Pro</h2>
          <p className="text-gray-600">Unlock unlimited analyses and enhanced features</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-gray-700">Enhanced AI analysis</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-gray-700">Early access to latest features</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-gray-800 mb-1">$9.99</div>
          <div className="text-gray-500 text-sm">One-time payment</div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              'Upgrade Now'
            )}
          </button>
          <button
            onClick={onCancel}
            className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 px-4 rounded-xl transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}

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

function App() {
  const [essay, setEssay] = useState('');
  const [essayPrompt, setEssayPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [rawJson, setRawJson] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [selectedMode, setSelectedMode] = useState('standard');
  const [isPro, setIsPro] = useState(() => {
    return localStorage.getItem('admitly_pro') === 'true';
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;
  const isOverLimit = wordCount > 650;

  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
      // Track when user expands a feedback category
      trackFeedbackExpansion(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleEssayChange = (e) => {
    const newEssay = e.target.value;
    const newWordCount = newEssay.trim() ? newEssay.trim().split(/\s+/).length : 0;
    
    if (newWordCount <= 650) {
      setEssay(newEssay);
      
      // Auto-resize textarea
      const textarea = e.target;
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 400) + 'px';
    }
  };

  const handleAnalyze = async () => {
    if (!essay.trim()) return;
    if (isOverLimit) return;
    
    setLoading(true);
    setError(null);
    setFeedback(null);
    setRawJson(null);
    setExpandedCategories(new Set());
    
    // Track the analysis attempt
    trackEssayAnalysis(selectedMode, wordCount, !!essayPrompt.trim());
    
    try {
      const apiKey = process.env.REACT_APP_GROQ_API_KEY;
      if (!apiKey) throw new Error('Missing Groq API key.');
      const res = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-70b-8192',
          messages: [
            { role: 'system', content: FEEDBACK_PROMPT(selectedMode, essayPrompt, isPro) },
            { role: 'user', content: essay }
          ],
          max_tokens: 4096,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const aiText = res.data.choices?.[0]?.message?.content || '';
      const parsed = parseMarkdownJsonFence(aiText);
      if (parsed) {
        setFeedback(parsed);
      } else {
        // Try to extract feedback from raw text as fallback
        const extracted = extractFeedbackFromRawText(aiText);
        if (extracted && extracted.scores) {
          setFeedback(extracted);
        } else {
          setRawJson(aiText);
          setError('Could not parse feedback. Showing raw response.');
        }
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.error?.message || err.message || 'Unknown error';
      setError(errorMessage);
      trackError('api_error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    trackModeSelection(mode);
  };

  const handleUpgradeToPro = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setIsPro(true);
    localStorage.setItem('admitly_pro', 'true');
    setShowPaymentModal(false);
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
  };

  const handleResetPro = () => {
    setIsPro(false);
    localStorage.removeItem('admitly_pro');
  };

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    if (feedback) {
      trackEssayAnalysis(feedback);
    }
  }, [feedback]);

  useEffect(() => {
    trackModeSelection(selectedMode);
  }, [selectedMode]);

  useEffect(() => {
    if (expandedCategories.size > 0) {
      trackFeedbackExpansion(selectedMode, Array.from(expandedCategories));
    }
  }, [selectedMode, expandedCategories]);

  useEffect(() => {
    if (error) {
      trackError(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-white/30 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Admitly
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isPro ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">★</span>
                  </div>
                  <span className="text-sm font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                    Pro
                  </span>
                  <button
                    onClick={handleResetPro}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                    title="Reset to free version (for testing)"
                  >
                    Reset
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleUpgradeToPro}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Upgrade to Pro
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 py-8 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              <span className="mr-2">✨</span>
              AI-Powered College Essay Analysis
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Get Into Your Dream School
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Admitly's AI analyzes your college essay with expert-level feedback to help you stand out in admissions
            </p>
          </div>

          <TrustedBySection />
          
          {/* Grading Mode Selection */}
          <GradingModeSelector selectedMode={selectedMode} onModeChange={handleModeChange} />
          
          {/* Input Section */}
          <div className="mb-8">
            <div className="w-full max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold">📝</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-gray-800">Essay Prompt & Response</h2>
                    <p className="text-sm text-gray-600">Enter the prompt and your essay</p>
                  </div>
                </div>
                
                {/* Essay Prompt Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Essay Prompt (Optional)
                  </label>
                  <textarea
                    className="w-full min-h-[80px] p-3 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-blue-400/30 text-sm transition-all duration-300 shadow-inner"
                    placeholder="Paste the essay prompt here (e.g., 'Describe a challenge you've faced and how you overcame it')"
                    value={essayPrompt}
                    onChange={(e) => setEssayPrompt(e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                {/* Essay Response Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Essay Response
                  </label>
                  <textarea
                    className={`w-full min-h-[120px] sm:min-h-[160px] p-4 sm:p-5 border-2 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-blue-400/30 text-sm sm:text-base shadow-inner transition-all duration-300 ${
                      isOverLimit ? 'border-red-300 focus:ring-red-400/30' : 'border-gray-200 focus:border-blue-400'
                    }`}
                    placeholder="Start writing or paste your college essay here..."
                    value={essay}
                    onChange={handleEssayChange}
                    disabled={loading}
                    style={{ maxHeight: '400px', overflowY: 'auto' }}
                  />
                </div>
                
                <div className="flex justify-between items-center mb-6">
                  <div className={`text-sm font-medium ${isOverLimit ? 'text-red-600' : 'text-gray-600'}`}>
                    {wordCount}/650 words
                  </div>
                  {isOverLimit && (
                    <div className="text-red-600 text-sm font-bold bg-red-100 px-3 py-1 rounded-full">
                      Word limit exceeded
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <button
                    className={`px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base ${
                      loading || !essay.trim() || isOverLimit 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-lg'
                    }`}
                    onClick={handleAnalyze}
                    disabled={loading || !essay.trim() || isOverLimit}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing...
                      </div>
                    ) : (
                      '🚀 Analyze Essay'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-600 font-bold bg-red-100 border-2 border-red-300 rounded-xl p-4 max-w-4xl mx-auto text-center text-sm mb-6 shadow-lg">
              {error}
            </div>
          )}

          {/* Feedback Section */}
          {feedback && (
            <div className="w-full">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">Your Essay Analysis</h2>
                  {isPro && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                      <span className="text-white text-xs font-bold">★</span>
                      <span className="text-white text-xs font-bold">PRO</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600">
                  {isPro ? 'Enhanced AI analysis' : 'Detailed feedback on every aspect of your essay'}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 max-w-4xl mx-auto">
                {SCORE_CATEGORIES.map(cat => (
                  <CompactScoreCard
                    key={cat}
                    category={cat}
                    score={feedback.scores?.[cat] ?? 0}
                    feedback={feedback.feedback?.[cat]}
                    isExpanded={expandedCategories.has(cat)}
                    onToggle={() => toggleCategory(cat)}
                  />
                ))}
              </div>
            </div>
          )}

          {rawJson && (
            <pre className="mt-6 bg-white/80 backdrop-blur-sm p-4 rounded-xl text-xs max-w-4xl mx-auto overflow-x-auto border border-white/30 shadow-lg">{rawJson}</pre>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={showPaymentModal}
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancel}
      />
    </div>
  );
}

export default App;