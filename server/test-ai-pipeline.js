const fetch = require('node-fetch'); // Fallback for older node, but native fetch is available in Node 18+
const { spawn } = require('child_process');
const path = require('path');

async function runTest() {
  console.log('Starting server for testing...');
  const server = spawn('node', ['index.js'], { cwd: path.join(__dirname, '.') });

  server.stdout.on('data', (data) => {
    if (data.toString().includes('CricketIQ Data Engine running')) {
      console.log('Server is up! Running tests...');
      executeTests().then(() => {
        server.kill();
        process.exit(0);
      });
    }
  });

  server.stderr.on('data', (data) => {
    console.error(`Server Error: ${data}`);
  });
}

async function executeTests() {
  const query = 'Why did GT lose the powerplay?';
  const matchId = '123';

  console.log(`Testing query: "${query}"...`);

  try {
    const response = await fetch('http://localhost:3001/api/analyse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, matchId })
    });

    const data = await response.json();
    console.log('Received Response:', JSON.stringify(data, null, 2));

    const requiredFields = ['narrative', 'newbie_narrative', 'metrics', 'phase_data', 'bar_chart', 'worm_data', 'insight', 'follow_ups'];
    const missingFields = requiredFields.filter(field => !(field in data));

    if (missingFields.length > 0) {
      console.error('❌ TEST FAILED: Missing fields:', missingFields);
      process.exit(1);
    }

    console.log('✅ TEST PASSED: All required fields present and data retrieved.');
  } catch (error) {
    console.error('❌ TEST FAILED: Error during request:', error);
    process.exit(1);
  }
}

// Use native fetch if available, otherwise use node-fetch
if (typeof fetch === 'undefined') {
  console.error('Node.js version too old. Please use Node 18+ for native fetch.');
  process.exit(1);
}

runTest();
