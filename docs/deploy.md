# Deploy to GitHub Pages (stable)

- Make sure `vite.config.js` `base` is correct (e.g. `/portfolio/`).
- Build on `main`: `npm run build`.
- One-time: add a worktree for gh-pages: `git worktree add ../portfolio-gh-pages gh-pages`.
- For each deploy:
  1.  `cd ../portfolio-gh-pages && rm -rf ./*` (leave `.git` untouched)
  2.  `cp -r ../portfolio/dist/* .` and `touch .nojekyll`
  3.  `git add -A && git commit -m "Deploy to gh-pages" && git push origin gh-pages`
  4.  `cd ../portfolio`
