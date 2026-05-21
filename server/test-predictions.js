const { Heuristics } = require('./index');

function testExpectedTotal() {
  console.log('Testing Expected Total Calculation...');

  const matchData = {
    score: 100,
    wickets: 2,
    overs: 15.0,
    totalOvers: 20,
  };

  const phaseStats = {
    powerplay: { avgRR: 8.5 },
    middle: { avgRR: 7.5 },
    death: { avgRR: 13.0 }, // Using 13 for realistic death overs
  };

  const expected = Heuristics.calculateExpectedTotal(matchData, phaseStats);
  console.log(`Input: 100/2 in 15 overs. Expected Total: ${expected}`);

  if (expected >= 150 && expected <= 180) {
    console.log('✅ Test Passed: Expected total is within realistic range.');
  } else {
    console.log('❌ Test Failed: Expected total is outside realistic range.');
    process.exit(1);
  }
}

function testWinProbability() {
  console.log('\nTesting Win Probability Calculation...');

  const teamA = {
    currentRunRate: 9.0,
    wickets: 2,
  };

  const teamB = {
    currentRunRate: 6.0,
    wickets: 5,
  };

  const prob = Heuristics.calculateWinProbability(teamA, teamB);
  console.log(`Team A (9RR, 2w) vs Team B (6RR, 5w). Win Prob: ${prob}`);

  if (prob > 0.7) {
    console.log('✅ Test Passed: Win probability is high for stronger team.');
  } else {
    console.log('❌ Test Failed: Win probability should be higher.');
    process.exit(1);
  }
}

try {
  testExpectedTotal();
  testWinProbability();
  console.log('\nAll prediction tests passed successfully!');
} catch (error) {
  console.error('Test execution failed:', error);
  process.exit(1);
}
