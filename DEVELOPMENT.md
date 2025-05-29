# Development

## Codebase health

To verify codebase health

```bash
npm test
```

## Tests

To decide what to test, keep in mind
[Use Case Coverage](https://kentcdodds.com/blog/how-to-know-what-to-test).

```bash
npm run test:unit

# watch mode
npm run test:unit:watch
```

## Workflow

We use the [commitizen](https://github.com/commitizen/cz-cli) tool and approach to
write commit messages.

If you decide to add more code to this project, please follow the
[conventional commits format](https://www.conventionalcommits.org/en/v1.0.0-beta.3/).

## Publish a new version

-   Checkout the latest `main` branch
-   Run `make version x.y.z`
-   Run `make publish`
-   Run `make push`
