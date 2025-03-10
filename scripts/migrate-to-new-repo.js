// Migrate the current repository to a new one with Wix integration
const { execSync } = require('child_process');

// Migrate the current repository to a new one with Wix integration
console.log('Migrating repository to new one with Wix integration...');

try {
  // Create and switch to a new branch
  execSync('git checkout -b wix-integration', { stdio: 'inherit' });

  // Add all changes
  execSync('git add .', { stdio: 'inherit' });

  // Commit changes
  execSync('git commit -m "Update with latest changes"', { stdio: 'inherit' });

  console.log('Migration completed successfully.');
} catch (error) {
  console.error('An error occurred during migration:', error);
}