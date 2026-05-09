module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview:lh',
      startServerReadyPattern: 'Local',
      startServerReadyTimeout: 30000,
      url: ['http://localhost:4322/'],
      numberOfRuns: 1,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage --disable-gpu',
      },
    },
    assert: {
      assertions: {
        'categories:performance':    ['warn',  { minScore: 0.90 }],
        'categories:accessibility':  ['error', { minScore: 0.95 }],
        'categories:best-practices': ['warn',  { minScore: 0.90 }],
        'categories:seo':            ['error', { minScore: 0.90 }],
      },
    },
  },
};
