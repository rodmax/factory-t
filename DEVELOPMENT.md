# Development

## Tests

To decide what to test keep in mind [Use Case Coverage](https://kentcdodds.com/blog/how-to-know-what-to-test)

```bash
npm run test

# watch mode
npm run test:watch
```

## Workflow

We use [commitizen](https://github.com/commitizen/cz-cli) tool and approach to write commit messages

so if you decide to add some more code to this project,
please follow [conventional commits format](https://www.conventionalcommits.org/en/v1.0.0-beta.3/)

## Publish new version

-   checkout to latest `master` branch
-   run `make version x.y.z`
-   run `make publish`
-   run `make push`
