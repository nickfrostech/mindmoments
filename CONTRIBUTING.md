# Contributing to MindMoments

Thanks for your interest in improving MindMoments. Contributions of code,
documentation, design, testing, and thoughtful issue reports are welcome.

## Before you start

- Check the existing issues and pull requests so work is not duplicated.
- For a substantial change, open an issue first to discuss the approach.
- Keep pull requests focused and explain the user problem they address.
- Never include real diary entries, API keys, or other private information in
  issues, screenshots, tests, or commits. Use fictional sample data instead.

## Development setup

1. Install Node.js 20 or newer and pnpm.
2. From your local repository checkout, install dependencies:

   ```sh
   pnpm install
   ```

3. Start the development server:

   ```sh
   pnpm dev
   ```

4. To try AI features, configure a provider in the app settings or set the
   appropriate server environment variable. See the README for supported
   providers and privacy notes.

## Making a change

1. Create a branch for your change.
2. Follow the existing TypeScript, React, and Tailwind patterns.
3. Keep accessibility, responsive layouts, and reduced-motion preferences in
   mind when changing the interface.
4. Update the README or other documentation when behavior, setup, or supported
   providers change.
5. Before opening a pull request, run the relevant checks:

   ```sh
   pnpm lint
   pnpm build
   ```

   If a check cannot be run, say so in the pull request and include any
   alternative validation performed.

## Pull requests

Include a concise description, the motivation, and how you validated the
change. For visual updates, include screenshots at mobile and desktop sizes
when practical. Call out any changes that affect data handling, AI provider
requests, or user privacy.

By submitting a contribution, you agree that it may be distributed under the
project's [MIT License](./LICENSE). This does not change the separate terms
that apply to third-party models, services, and dependencies.
