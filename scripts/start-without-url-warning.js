// Suppress the specific deprecation warning for url.parse()
const originalEmitWarning = process.emitWarning;
process.emitWarning = function (warning, ...args) {
  // Check if this is the specific deprecation warning we want to suppress
  if (typeof warning === 'object' && warning && warning.code === 'DEP0169') {
    return; // Skip this warning
  }
  if (typeof warning === 'string' && args[0] === 'DeprecationWarning' && warning.includes('url.parse()')) {
    return; // Skip this warning
  }
  
  // Call the original emitWarning function for all other warnings
  originalEmitWarning.call(this, warning, ...args);
};

// Require the actual next.js server
require('next/dist/bin/next');