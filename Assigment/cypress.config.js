import { defineConfig } from 'cypress';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  projectId: "ruevju",
  e2e: {
    baseUrl: 'https://opensource-demo.orangehrmlive.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    screenshotOnRunFailure: true,
    videoCompression: 32,
    videoUploadOnPasses: false,
    trashAssetsBeforeRuns: false, // Keep videos from all attempts
    
    // Enhanced retry configuration for flake detection
    retries: {
      runMode: 1,  // Only 1 retry (2 total attempts)
      openMode: 0,
    },
    
    // Timeouts
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    
    env: {
      username: 'Admin',
      password: 'admin123',
    },
    
    setupNodeEvents(on, config) {
      // Track test results for flake detection
      const testResults = [];
      const flakyTestsData = {};
      
      // Add console.log task for custom reporting
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        
        // Track flaky tests across attempts
        recordTestAttempt({ testTitle, attempt, state }) {
          if (!flakyTestsData[testTitle]) {
            flakyTestsData[testTitle] = {
              attempts: [],
              totalAttempts: 0,
              failedAttempts: 0,
              passedAfterRetry: false
            };
          }
          
          flakyTestsData[testTitle].attempts.push({ attempt, state, timestamp: Date.now() });
          flakyTestsData[testTitle].totalAttempts++;
          
          if (state === 'failed') {
            flakyTestsData[testTitle].failedAttempts++;
          }
          
          if (attempt > 1 && state === 'passed') {
            flakyTestsData[testTitle].passedAfterRetry = true;
          }
          
          return null;
        },
        
        // Save flaky test report
        saveFlakyReport() {
          const reportPath = path.join(config.videosFolder, '../flaky-tests-report.json');
          const timestamp = new Date().toISOString();
          
          const report = {
            timestamp,
            tests: flakyTestsData,
            summary: {
              totalTests: Object.keys(flakyTestsData).length,
              flakyTests: Object.values(flakyTestsData).filter(t => t.passedAfterRetry).length,
              totalRetries: Object.values(flakyTestsData).reduce((sum, t) => sum + (t.totalAttempts - 1), 0)
            }
          };
          
          fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
          console.log('\n📊 Flaky test report saved to:', reportPath);
          
          return null;
        }
      });
      
      on('after:run', (results) => {
        // Log test results
        console.log('\n📊 Test Run Summary:');
        console.log('═'.repeat(50));
        console.log('Total Tests:', results.totalTests);
        console.log('Passed:', results.totalPassed);
        console.log('Failed:', results.totalFailed);
        console.log('Pending:', results.totalPending);
        console.log('Skipped:', results.totalSkipped);
        console.log('Duration:', Math.round(results.totalDuration / 1000) + 's');
        console.log('═'.repeat(50));
        
        // Detailed failure and retry information
        const flakyTests = [];
        const permanentlyFailed = [];
        
        results.runs.forEach(run => {
          run.tests.forEach(test => {
            const testTitle = test.title.join(' > ');
            
            // Track flaky tests (passed after retry)
            if (test.attempts && test.attempts.length > 1 && test.state === 'passed') {
              const failedAttempts = test.attempts.filter(a => a.state === 'failed').length;
              flakyTests.push({
                title: testTitle,
                totalAttempts: test.attempts.length,
                failedAttempts: failedAttempts,
                video: run.video || 'N/A',
                // Get error from first failed attempt
                firstError: test.attempts[0].state === 'failed' && test.attempts[0].error 
                  ? test.attempts[0].error.message 
                  : 'N/A'
              });
            }
            
            // Track permanently failed tests (failed on all attempts)
            if (test.state === 'failed') {
              const totalAttempts = test.attempts ? test.attempts.length : 1;
              const lastAttempt = test.attempts ? test.attempts[test.attempts.length - 1] : null;
              permanentlyFailed.push({
                title: testTitle,
                attempts: totalAttempts,
                error: test.displayError ? test.displayError.split('\n')[0] : 'Unknown error',
                video: run.video || 'N/A',
                // Get stack trace for debugging
                stack: lastAttempt && lastAttempt.error ? lastAttempt.error.stack : test.displayError
              });
            }
          });
        });
        
        // Display permanently failed tests with detailed error info
        if (permanentlyFailed.length > 0) {
          console.log('\n❌ FAILED TESTS (Failed on all attempts):');
          console.log('─'.repeat(50));
          permanentlyFailed.forEach(test => {
            console.log(`\n  Test: ${test.title}`);
            console.log(`  Attempts: ${test.attempts} (Max: 2)`);
            console.log(`  Error: ${test.error}`);
            console.log(`  📹 Video: ${test.video}`);
            console.log(`\n  Full Error:`);
            console.log(test.stack ? test.stack.split('\n').slice(0, 5).join('\n') : 'No stack trace available');
          });
          console.log('─'.repeat(50));
        }
        
        // Display flaky tests with where they failed
        if (flakyTests.length > 0) {
          console.log('\n⚠️  FLAKY TESTS (Passed after retry):');
          console.log('─'.repeat(50));
          flakyTests.forEach(test => {
            console.log(`\n  Test: ${test.title}`);
            console.log(`  Total Attempts: ${test.totalAttempts} (Max: 2)`);
            console.log(`  Failed Attempts: ${test.failedAttempts}`);
            console.log(`  Flaky Count: ${test.failedAttempts}`);
            console.log(`  First Failure: ${test.firstError}`);
            console.log(`  📹 Video: ${test.video}`);
          });
          console.log('─'.repeat(50));
          console.log(`\n🔄 Total Flaky Tests: ${flakyTests.length}`);
        }
        
        // Video summary
        console.log('\n📹 Video Reports:');
        console.log('─'.repeat(50));
        console.log(`Videos saved to: ${config.videosFolder}`);
        if (results.runs && results.runs.length > 0) {
          results.runs.forEach(run => {
            if (run.video) {
              console.log(`  ✓ ${path.basename(run.spec.relative)}: ${run.video}`);
            }
          });
        }
        console.log('─'.repeat(50));
      });
      
      on('after:screenshot', (details) => {
        console.log('📸 Screenshot captured:', details.path);
      });
      
      return config;
    },
  },
});
