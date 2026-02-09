# Deploy to GitHub Pages

- Ensure `vite.config.js` has the correct `base` (e.g. `/portfolio/`).
- Build: `npm run build`.
- Checkout `gh-pages`, replace its contents with `dist/`, add `.nojekyll`.
- Commit and push: `git push origin gh-pages --force`.
