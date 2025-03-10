const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  gold: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  red: "\x1b[31m",
}

console.log(`${colors.gold}
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║  ${colors.magenta}Midnight Magnolia Repository Setup${colors.gold}                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`)

// Configuration
const NEW_REPO_NAME = "midnight-magnolia-1"
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "your-github-username"
const BRANCH_STRUCTURE = ["main", "staging", "development"]

// Create directory structure
const createDirectoryStructure = () => {
  console.log(`${colors.blue}Creating directory structure...${colors.reset}`)

  const directories = [
    "app",
    "app/midnight-menagerie",
    "components",
    "components/ui",
    "components/menagerie",
    "lib",
    "public",
    "scripts",
    "styles",
  ]

  directories.forEach((dir) => {
    const dirPath = path.join(process.cwd(), dir)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
      console.log(`  ${colors.green}Created directory: ${dir}${colors.reset}`)
    } else {
      console.log(`  ${colors.cyan}Directory already exists: ${dir}${colors.reset}`)
    }
  })
}

// Initialize Git repository
const initializeGitRepo = () => {
  console.log(`${colors.blue}Initializing Git repository...${colors.reset}`)

  try {
    // Check if .git directory exists
    if (!fs.existsSync(path.join(process.cwd(), ".git"))) {
      execSync("git init", { stdio: "inherit" })
      console.log(`  ${colors.green}Initialized Git repository${colors.reset}`)
    } else {
      console.log(`  ${colors.cyan}Git repository already initialized${colors.reset}`)
    }

    // Create .gitignore if it doesn't exist
    const gitignorePath = path.join(process.cwd(), ".gitignore")
    if (!fs.existsSync(gitignorePath)) {
      const gitignoreContent = `
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build
/dist

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# Wix
.wix/
`
      fs.writeFileSync(gitignorePath, gitignoreContent.trim())
      console.log(`  ${colors.green}Created .gitignore file${colors.reset}`)
    }

    // Set up remote
    try {
      const remoteUrl = `https://github.com/${GITHUB_USERNAME}/${NEW_REPO_NAME}.git`
      execSync("git remote -v", { stdio: "pipe" })

      // Check if origin already exists
      try {
        execSync("git remote get-url origin", { stdio: "pipe" })
        console.log(`  ${colors.cyan}Remote 'origin' already exists${colors.reset}`)

        // Update origin if it's different
        const currentRemote = execSync("git remote get-url origin", { encoding: "utf8" }).trim()
        if (currentRemote !== remoteUrl) {
          execSync(`git remote set-url origin ${remoteUrl}`, { stdio: "inherit" })
          console.log(`  ${colors.green}Updated remote 'origin' to ${remoteUrl}${colors.reset}`)
        }
      } catch (error) {
        // Add origin if it doesn't exist
        execSync(`git remote add origin ${remoteUrl}`, { stdio: "inherit" })
        console.log(`  ${colors.green}Added remote 'origin' as ${remoteUrl}${colors.reset}`)
      }
    } catch (error) {
      console.log(`  ${colors.cyan}Skipping remote setup${colors.reset}`)
    }

    // Create branch structure
    console.log(`${colors.blue}Setting up branch structure...${colors.reset}`)

    // Get current branch
    const currentBranch = execSync("git branch --show-current", { encoding: "utf8" }).trim()

    // Create branches if they don't exist
    BRANCH_STRUCTURE.forEach((branch) => {
      try {
        execSync(`git show-ref --verify --quiet refs/heads/${branch}`, { stdio: "pipe" })
        console.log(`  ${colors.cyan}Branch '${branch}' already exists${colors.reset}`)
      } catch (error) {
        // Branch doesn't exist, create it
        if (currentBranch) {
          execSync(`git checkout -b ${branch}`, { stdio: "inherit" })
        } else {
          // If no current branch (new repo), create and checkout
          execSync(`git checkout -b ${branch}`, { stdio: "inherit" })
        }
        console.log(`  ${colors.green}Created branch '${branch}'${colors.reset}`)
      }
    })

    // Switch back to main branch
    execSync("git checkout main", { stdio: "inherit" })
    console.log(`  ${colors.green}Switched to 'main' branch${colors.reset}`)
  } catch (error) {
    console.error(`  ${colors.red}Error initializing Git repository: ${error.message}${colors.reset}`)
  }
}

// Create package.json
const createPackageJson = () => {
  console.log(`${colors.blue}Creating package.json...${colors.reset}`)

  const packageJsonPath = path.join(process.cwd(), "package.json")
  if (!fs.existsSync(packageJsonPath)) {
    const packageJson = {
      name: NEW_REPO_NAME,
      version: "1.0.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint",
        "deploy:wix": "node scripts/deploy-wix.js",
      },
      dependencies: {
        next: "^14.0.0",
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        "framer-motion": "^10.16.4",
        "lucide-react": "^0.292.0",
        tailwindcss: "^3.3.5",
        autoprefixer: "^10.4.16",
        postcss: "^8.4.31",
        "@vercel/analytics": "^1.1.1",
      },
      devDependencies: {
        "@types/node": "^20.8.10",
        "@types/react": "^18.2.36",
        "@types/react-dom": "^18.2.14",
        typescript: "^5.2.2",
        eslint: "^8.53.0",
        "eslint-config-next": "^14.0.0",
      },
    }

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    console.log(`  ${colors.green}Created package.json${colors.reset}`)
  } else {
    console.log(`  ${colors.cyan}package.json already exists${colors.reset}`)
  }
}

// Create Wix configuration
const createWixConfig = () => {
  console.log(`${colors.blue}Creating Wix configuration...${colors.reset}`)

  const wixConfigPath = path.join(process.cwd(), "wix.config.json")
  if (!fs.existsSync(wixConfigPath)) {
    const wixConfig = {
      name: "Midnight Magnolia",
      siteId: "your-wix-site-id", // Replace with your actual Wix site ID
      components: {
        app: {
          path: "app/page.tsx",
          name: "HomePage",
        },
        menagerie: {
          path: "app/midnight-menagerie/page.tsx",
          name: "MidnightMenagerie",
        },
      },
      styles: {
        main: "styles/globals.css",
      },
      assets: {
        directory: "public",
      },
      deployment: {
        target: "wix",
        apiKey: "your-wix-api-key", // Replace with your actual Wix API key
      },
    }

    fs.writeFileSync(wixConfigPath, JSON.stringify(wixConfig, null, 2))
    console.log(`  ${colors.green}Created wix.config.json${colors.reset}`)
  } else {
    console.log(`  ${colors.cyan}wix.config.json already exists${colors.reset}`)
  }
}

// Create Wix deployment script
const createWixDeploymentScript = () => {
  console.log(`${colors.blue}Creating Wix deployment script...${colors.reset}`)

  const deployScriptPath = path.join(process.cwd(), "scripts", "deploy-wix.js")
  if (!fs.existsSync(deployScriptPath)) {
    const deployScript = `
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for terminal output
const colors = {
  reset: '\\x1b[0m',
  gold: '\\x1b[33m',
  blue: '\\x1b[34m',
  magenta: '\\x1b[35m',
  cyan: '\\x1b[36m',
  green: '\\x1b[32m',
  red: '\\x1b[31m'
};

console.log(\`\${colors.gold}
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║  \${colors.magenta}Midnight Magnolia Wix Deployment\${colors.gold}                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
\${colors.reset}\`);

// Configuration
const WIX_CONFIG_PATH = path.join(process.cwd(), 'wix.config.json');
const WIX_CLI_COMMAND = 'npx @wix/cli';

// Check if Wix config exists
if (!fs.existsSync(WIX_CONFIG_PATH)) {
  console.error(\`\${colors.red}Error: wix.config.json not found\${colors.reset}\`);
  process.exit(1);
}

// Read Wix config
const wixConfig = JSON.parse(fs.readFileSync(WIX_CONFIG_PATH, 'utf8'));

// Validate Wix config
if (!wixConfig.siteId) {
  console.error(\`\${colors.red}Error: Missing siteId in wix.config.json\${colors.reset}\`);
  process.exit(1);
}

// Install Wix CLI if not already installed
try {
  console.log(\`\${colors.blue}Checking Wix CLI installation...\${colors.reset}\`);
  execSync(\`\${WIX_CLI_COMMAND} --version\`, { stdio: 'pipe' });
  console.log(\`\${colors.green}Wix CLI is installed\${colors.reset}\`);
} catch (error) {
  console.log(\`\${colors.blue}Installing Wix CLI...\${colors.reset}\`);
  try {
    execSync('npm install -g @wix/cli', { stdio: 'inherit' });
    console.log(\`\${colors.green}Wix CLI installed successfully\${colors.reset}\`);
  } catch (installError) {
    console.error(\`\${colors.red}Error installing Wix CLI: \${installError.message}\${colors.reset}\`);
    process.exit(1);
  }
}

// Login to Wix if needed
try {
  console.log(\`\${colors.blue}Checking Wix authentication...\${colors.reset}\`);
  execSync(\`\${WIX_CLI_COMMAND} auth status\`, { stdio: 'pipe' });
  console.log(\`\${colors.green}Already authenticated with Wix\${colors.reset}\`);
} catch (error) {
  console.log(\`\${colors.blue}Authenticating with Wix...\${colors.reset}\`);
  try {
    execSync(\`\${WIX_CLI_COMMAND} auth login\`, { stdio: 'inherit' });
    console.log(\`\${colors.green}Authenticated with Wix successfully\${colors.reset}\`);
  } catch (authError) {
    console.error(\`\${colors.red}Error authenticating with Wix: \${authError.message}\${colors.reset}\`);
    process.exit(1);
  }
}

// Build the project
console.log(\`\${colors.blue}Building project...\${colors.reset}\`);
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log(\`\${colors.green}Build completed successfully\${colors.reset}\`);
} catch (buildError) {
  console.error(\`\${colors.red}Build failed: \${buildError.message}\${colors.reset}\`);
  process.exit(1);
}

// Deploy to Wix
console.log(\`\${colors.blue}Deploying to Wix...\${colors.reset}\`);
try {
  execSync(\`\${WIX_CLI_COMMAND} deploy --site-id=\${wixConfig.siteId}\`, { stdio: 'inherit' });
  console.log(\`\${colors.green}Deployment to Wix completed successfully\${colors.reset}\`);
} catch (deployError) {
  console.error(\`\${colors.red}Deployment failed: \${deployError.message}\${colors.reset}\`);
  process.exit(1);
}

console.log(\`\${colors.gold}
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║  \${colors.green}Midnight Magnolia Deployed Successfully\${colors.gold}               ║
║                                                              ║
║  \${colors.cyan}Visit your Wix site to see the changes\${colors.gold}                 ║
║  \${colors.cyan}Site ID: \${wixConfig.siteId}\${colors.gold}                          ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
\${colors.reset}\`);
`

    fs.writeFileSync(deployScriptPath, deployScript.trim())
    console.log(`  ${colors.green}Created scripts/deploy-wix.js${colors.reset}`)
  } else {
    console.log(`  ${colors.cyan}scripts/deploy-wix.js already exists${colors.reset}`)
  }
}

// Create Wix adapter component
const createWixAdapter = () => {
  console.log(`${colors.blue}Creating Wix adapter component...${colors.reset}`)

  const adapterPath = path.join(process.cwd(), "components", "wix-adapter.tsx")
  if (!fs.existsSync(adapterPath)) {
    const adapterComponent = `
"use client"

import { useEffect, useState } from 'react'

interface WixAdapterProps {
  children: React.ReactNode
}

export function WixAdapter({ children }: WixAdapterProps) {
  const [isWix, setIsWix] = useState(false)
  
  useEffect(() => {
    // Check if running in Wix environment
    const isWixEnvironment = 
      typeof window !== 'undefined' && 
      (window.location.hostname.includes('wix.com') || 
       window.location.hostname.includes('editorx.com') ||
       document.documentElement.classList.contains('wix-site'))
    
    setIsWix(isWixEnvironment)
    
    // Add Wix-specific class to body if in Wix environment
    if (isWixEnvironment) {
      document.body.classList.add('wix-environment')
    }
  }, [])
  
  return (
    <div className={\`midnight-magnolia-app \${isWix ? 'wix-mode' : ''}\`}>
      {children}
    </div>
  )
}
`

    fs.writeFileSync(adapterPath, adapterComponent.trim())
    console.log(`  ${colors.green}Created components/wix-adapter.tsx${colors.reset}`)
  } else {
    console.log(`  ${colors.cyan}components/wix-adapter.tsx already exists${colors.reset}`)
  }
}

// Create README.md
const createReadme = () => {
  console.log(`${colors.blue}Creating README.md...${colors.reset}`)

  const readmePath = path.join(process.cwd(), "README.md")
  if (!fs.existsSync(readmePath)) {
    const readme = `
# Midnight Magnolia

Midnight Magnolia is a digital entrepreneurship platform designed to empower Black women through digital innovation with Southern Gothic elegance.

## Repository Structure

This repository (\`${NEW_REPO_NAME}\`) is set up for Wix integration and deployment.

### Branch Structure

- \`main\`: Production-ready code
- \`staging\`: Pre-production testing
- \`development\`: Active development

## Setup

\`\`\`bash
# Clone the repository
git clone https://github.com/${GITHUB_USERNAME}/${NEW_REPO_NAME}.git
cd ${NEW_REPO_NAME}

# Install dependencies
npm install
\`\`\`

## Wix Integration

This project is configured for seamless Wix integration. The \`wix.config.json\` file contains the necessary configuration for deploying to Wix.

### Deployment

\`\`\`bash
# Deploy to Wix
npm run deploy:wix
\`\`\`

## Development

\`\`\`bash
# Start development server
npm run dev
\`\`\`

## Brand Guidelines

- **Colors:**
  - Midnight Blue (#0A192F)
  - Rich Gold (#D4AF37)
  - Magnolia White (#FAF3E0)
  - Sage Green (#A3B18A)
  - Deep Mahogany (#4A0D0D)
  - Midnight Teal (#0A3A40)

- **Typography:**
  - Headings: Playfair Display
  - Body: Lora
  - Navigation/Buttons: Montserrat
`

    fs.writeFileSync(readmePath, readme.trim())
    console.log(`  ${colors.green}Created README.md${colors.reset}`)
  } else {
    console.log(`  ${colors.cyan}README.md already exists${colors.reset}`)
  }
}

// Main function
const main = () => {
  try {
    createDirectoryStructure()
    initializeGitRepo()
    createPackageJson()
    createWixConfig()
    createWixDeploymentScript()
    createWixAdapter()
    createReadme()

    console.log(`${colors.gold}
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║  ${colors.green}Repository Setup Complete${colors.gold}                              ║
║                                                              ║
║  ${colors.cyan}Next Steps:${colors.gold}                                            ║
║  ${colors.cyan}1. Update wix.config.json with your Wix site ID${colors.gold}        ║
║  ${colors.cyan}2. Install dependencies: npm install${colors.gold}                   ║
║  ${colors.cyan}3. Add your components and assets${colors.gold}                      ║
║  ${colors.cyan}4. Deploy to Wix: npm run deploy:wix${colors.gold}                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`)
  } catch (error) {
    console.error(`${colors.red}Error setting up repository: ${error.message}${colors.reset}`)
    process.exit(1)
  }
}

main()

