import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initGA = () => {
  // Replace 'G-XXXXXXXXXX' with your actual GA4 Measurement ID
  const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
  
  if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
    ReactGA.initialize(GA_MEASUREMENT_ID);
    console.log('Google Analytics initialized');
  } else {
    console.log('Google Analytics not configured - set REACT_APP_GA_MEASUREMENT_ID');
  }
};

// Track page views
export const trackPageView = (page) => {
  ReactGA.send({ hitType: "pageview", page });
};

// Track custom events
export const trackEvent = (action, category, label, value) => {
  ReactGA.event({
    category: category || 'Essay Helper',
    action: action,
    label: label,
    value: value
  });
};

// Track essay analysis events
export const trackEssayAnalysis = (mode, wordCount, hasPrompt) => {
  trackEvent('analyze_essay', 'Essay Analysis', mode, wordCount);
  
  // Track additional details
  ReactGA.event({
    category: 'Essay Analysis',
    action: 'essay_analyzed',
    label: `${mode}_mode_${hasPrompt ? 'with_prompt' : 'no_prompt'}`,
    value: wordCount
  });
};

// Track mode selection
export const trackModeSelection = (mode) => {
  trackEvent('select_mode', 'Mode Selection', mode);
};

// Track feedback expansion
export const trackFeedbackExpansion = (category) => {
  trackEvent('expand_feedback', 'User Interaction', category);
};

// Track errors
export const trackError = (errorType, errorMessage) => {
  trackEvent('error_occurred', 'Error Tracking', errorType, 1);
};

// Track user engagement
export const trackUserEngagement = (action, details) => {
  trackEvent(action, 'User Engagement', details);
}; 