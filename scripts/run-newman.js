const fs = require('fs');
const path = require('path');
const newman = require('newman');

const root = path.join(__dirname, '..');
const collection = path.join(root, 'Collection', 'Toolshop_API_Automation.postman_collection.json');
const environment = path.join(root, 'Environment', 'Toolshop_Environment.postman_environment.json');
const reportDir = path.join(root, 'reports');

fs.mkdirSync(reportDir, { recursive: true });

if (process.env.API_BASE_URL) {
  process.env.base_url = process.env.API_BASE_URL.replace(/\/$/, '');
}

newman.run(
  {
    collection,
    environment,
    envVar: process.env.API_BASE_URL
      ? [{ key: 'base_url', value: process.env.API_BASE_URL.replace(/\/$/, '') }]
      : undefined,
    reporters: ['cli', 'htmlextra'],
    reporter: {
      htmlextra: {
        export: path.join(reportDir, 'newman-report.html'),
        title: 'Toolshop API — Newman Report',
        browserTitle: 'Toolshop API Newman',
        logs: true,
        showOnlyFails: false,
      },
    },
    timeoutRequest: 30000,
    bail: false,
  },
  (err, summary) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    const stats = summary.run.stats;
    console.log(
      `\nNewman finished: ${stats.assertions.total} assertions, ${stats.assertions.failed} failed, ${stats.requests.total} requests`,
    );
    process.exit(summary.run.failures.length > 0 ? 1 : 0);
  },
);
