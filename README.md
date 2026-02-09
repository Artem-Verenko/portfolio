# package.json

This template should help get you started developing with Vue 3 in Vite.

## 🖼️ Private Repository Images

**Important:** If you're using a **private GitHub repository**, images won't load with standard raw URLs.

✅ **Quick Fix:** Add `VITE_GITHUB_REPO_PRIVATE=true` to your `.env.local` file.

See [PRIVATE_REPO_IMAGES_QUICK.md](./PRIVATE_REPO_IMAGES_QUICK.md) for a 2-minute setup guide.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

git add dist -f
git subtree push --prefix dist origin gh-pages

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
