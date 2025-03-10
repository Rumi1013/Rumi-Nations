# Rumi Nations - Wix Velo Project

This repository contains the Wix Velo (formerly Corvid) code for the Rumi Nations website.

## Project Structure

- `backend/`: Contains all backend code (Web Modules)
  - `data/`: Database and data-related functions
  - `http-functions/`: HTTP functions for API endpoints
- `public/`: Static assets
- `pages/`: Page code files
- `lightboxes/`: Lightbox component code
- `components/`: Reusable component code

## Development

1. Install Wix CLI (if not already installed):
   ```bash
   npm install -g @wix/cli
   ```

2. Login to your Wix account:
   ```bash
   wix login
   ```

3. Pull the latest changes from your Wix site:
   ```bash
   wix pull
   ```

4. Push changes to your Wix site:
   ```bash
   wix push
   ```

## Important Notes

- Always test your changes locally before pushing to production
- Keep sensitive information in Wix Secrets Manager
- Follow Wix Velo best practices for performance and security
