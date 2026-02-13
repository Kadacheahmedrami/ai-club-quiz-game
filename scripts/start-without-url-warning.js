// Suppress the specific deprecation warning for url.parse()
process.on('warning', (warning) => {
  if (warning.name === 'DeprecationWarning' && warning.code === 'DEP0169') {
    // Ignore this specific deprecation warning
    return;
  }
  // Log all other warnings normally
  console.warn(warning);
});

// Require the actual next.js server
require('next/dist/bin/next');