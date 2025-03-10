// deploy-to-wix.js - Modified for older Wix CLI
const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  gold: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  red: '\x1b[31m'
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to ask questions
function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Function to execute commands and log output
function executeCommand(command, description) {
  console.log(`${colors.blue}> ${description}...${colors.reset}`);
  try {
    const output = execSync(command, { encoding: 'utf8' });
    if (output.trim()) {
      console.log(`${colors.cyan}${output}${colors.reset}`);
    }
    console.log(`${colors.green}✓ Completed: ${description}${colors.reset}\n`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
    return false;
  }
}

// Check if Wix CLI is installed
function checkWixCli() {
  try {
    execSync('wix --version', { encoding: 'utf8' });
    return true;
  } catch (error) {
    return false;
  }
}

// Main function
async function main() {
  console.log(`${colors.gold}
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║  ${colors.magenta}Midnight Magnolia Wix Deployment${colors.gold}                       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);

  // Check if Wix CLI is installed
  if (!checkWixCli()) {
    console.log(`${colors.red}Wix CLI is not installed. Installing now...${colors.reset}`);
    executeCommand('npm install -g @wix/cli', 'Installing Wix CLI');
    
    if (!checkWixCli()) {
      console.log(`${colors.red}Failed to install Wix CLI. Please install it manually with 'npm install -g @wix/cli'${colors.reset}`);
      rl.close();
      return;
    }
  }

  // Get available Wix commands
  console.log(`${colors.blue}> Checking available Wix commands...${colors.reset}`);
  try {
    const helpOutput = execSync('wix --help', { encoding: 'utf8' });
    console.log(`${colors.cyan}Available Wix commands:${colors.reset}`);
    console.log(`${colors.cyan}${helpOutput}${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error checking Wix commands: ${error.message}${colors.reset}`);
  }

  // Ask which branch to deploy
  const branch = await askQuestion(`${colors.gold}Which branch would you like to deploy? (master/main/feature) ${colors.reset}`);
  
  // Checkout the selected branch
  if (!executeCommand(`git checkout ${branch}`, `Checking out ${branch} branch`)) {
    rl.close();
    return;
  }

  // Pull latest changes
  executeCommand(`git pull origin ${branch}`, `Pulling latest changes from ${branch}`);

  // Ask for confirmation
  const confirmation = await askQuestion(`${colors.gold}You are about to deploy the ${branch} branch to Wix. Continue? (y/n) ${colors.reset}`);
  
  if (confirmation.toLowerCase() !== 'y') {
    console.log(`${colors.blue}Deployment cancelled.${colors.reset}`);
    rl.close();
    return;
  }

  // Skip build step since it's not configured
  console.log(`${colors.blue}> Skipping build step (no build script found)...${colors.reset}`);
  console.log(`${colors.green}✓ Build step skipped${colors.reset}\n`);

  // Deploy to Wix
  console.log(`${colors.magenta}Deploying to Wix...${colors.reset}`);
  
  // Check if this is a production deployment
  const isProduction = await askQuestion(`${colors.gold}Is this a production deployment? (y/n) ${colors.reset}`);
  
  // Ask for the correct deploy command
  console.log(`${colors.yellow}The 'wix site deploy' command is not available in your Wix CLI version.${colors.reset}`);
  const deployCommand = await askQuestion(`${colors.gold}Please enter the correct Wix deploy command (e.g., 'wix publish'): ${colors.reset}`);
  
  if (!executeCommand(deployCommand, `Deploying ${branch} to Wix`)) {
    console.log(`${colors.yellow}Deployment command failed. Let's try alternative approaches.${colors.reset}`);
    
    // Try alternative deployment methods
    console.log(`${colors.blue}Attempting alternative deployment methods...${colors.reset}`);
    
    // Option 1: Try 'wix publish'
    console.log(`${colors.blue}Trying 'wix publish'...${colors.reset}`);
    if (executeCommand('wix publish', 'Publishing to Wix')) {
      console.log(`${colors.green}Successfully published to Wix using 'wix publish'${colors.reset}`);
    } else {
      // Option 2: Try 'wix deploy'
      console.log(`${colors.blue}Trying 'wix deploy'...${colors.reset}`);
      if (executeCommand('wix deploy', 'Deploying to Wix')) {
        console.log(`${colors.green}Successfully deployed to Wix using 'wix deploy'${colors.reset}`);
      } else {
        console.log(`${colors.red}Automatic deployment failed. Please refer to Wix CLI documentation for the correct deployment command.${colors.reset}`);
        rl.close();
        return;
      }
    }
  }

  console.log(`${colors.gold}
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║  ${colors.green}Deployment Complete${colors.gold}                                      ║
║                                                              ║
║  ${colors.cyan}Branch:${colors.gold} ${branch.padEnd(46)}║
║  ${colors.cyan}Environment:${colors.gold} ${isProduction.toLowerCase() === 'y' ? 'Production'.padEnd(41) : 'Preview'.padEnd(41)}║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);

  rl.close();
}

main().catch(error => {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  rl.close();
});
