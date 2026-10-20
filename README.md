# Open API Generator

This is a google chrome extension that filters requests given an URL and reverse engineers it to generate an Open API documentation that is compatible with Postman.

# Contribute

We use [Angular conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/#summary).

Merging to main will generate a release.

Requires Node 26 (`nvm use` picks it up from `.nvmrc`).

Run developer environment `npm i && npm run dev`

Create a PR to the main branch following the PR template.

# Commands

_dev_: copies static files to `dist` and compiles in watch mode

_build_: compiles and copies the static files, giving a loadable extension in `dist`

_compile_: compiles the TypeScript sources to `dist` with TypeScript 7 (tsgo)

_typecheck_: type-checks the sources and tests

_test_: runs tests with Vitest

_lint_: checks formatting with Prettier (`format` fixes it)
