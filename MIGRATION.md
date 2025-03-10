# Midnight Magnolia Migration Guide

This guide will help you migrate from your existing repository to the new `midnight-magnolia-1` repository with Wix integration.

## Prerequisites

Before starting the migration, ensure you have:

1. Git installed on your local machine
2. Node.js and npm installed
3. Access to both GitHub repositories
4. Your Wix site ID and API credentials

## Step 1: Set Up the New Repository

```bash
# Clone the new repository
git clone https://github.com/your-username/midnight-magnolia-1.git
cd midnight-magnolia-1

# Run the setup script
node scripts/setup-new-repo.js

