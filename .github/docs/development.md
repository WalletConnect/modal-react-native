# Development

## Workspace setup

Install dependencies from the repository's root directory (this will also set up the example project workspace):

```bash
yarn
```

## ProjectID setup

Create an `.env` file in `<root>/example` with the following content:

```
EXPO_PUBLIC_PROJECT_ID="YOUR_CLOUD_ID"
```

To create your ProjectID, head to [cloud.walletconnect.com](https://cloud.walletconnect.com/)

## Commands

Execute all commands from the root.

- `yarn example ios` - Run the example project in an iOS simulator.
- `yarn example android` - Run the example project in an Android simulator.
- `yarn lint` - Run the linter.
- `yarn typecheck` - Run typescript checks.
- `yarn test` - Run jest tests.
