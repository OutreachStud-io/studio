# Contributing to OutreachStudio

Below you'll find a set of guidelines for how to contribute to OutreachStudio.

## Opening issues

Before you submit an issue, please check all existing [open and closed issues](https://github.com/OutreachStud-io/studio/issues) to see if your issue has previously been resolved or is already known. If there is already an issue logged, feel free to upvote it by adding a :thumbsup: [reaction](https://github.com/blog/2119-add-reactions-to-pull-requests-issues-and-comments). If you would like to submit a new issue, please fill out our Issue Template to the best of your ability so we can accurately understand your report.

## Security issues & vulnerabilities

If you come across an issue related to security, or a potential attack vector within OutreachStudio or one of its dependencies, please DO NOT create a publicly viewable issue. Instead, please contact us directly at [`dev@outreachstud.io`](mailto:dev@outreachstud.io). We will do everything we can to respond to the issue as soon as possible.

## Documentation edits

OutreachStudio documentation can be found directly within its codebase, and you can feel free to make changes / improvements to any of it through opening a PR. We utilize these files directly in our website and will periodically deploy documentation updates as necessary.

## Building additional features

If you're an incredibly awesome person and want to help us make OutreachStudio even better through new features or additions, we would be thrilled to work with you.

## Design Contributions

When it comes to design-related changes or additions, it's crucial for us to ensure a cohesive user experience and alignment with our broader design vision. Before embarking on any implementation that would affect the design or UI/UX, we ask that you **first share your design proposal** with us for review and approval.

Our design review ensures that proposed changes fit seamlessly with other components, both existing and planned. This step is meant to prevent unintentional design inconsistencies and to save you from investing time in implementing features that might need significant design alterations later.

### Before Starting

To help us work on new features, you can create a new feature request post in [GitHub Discussion](https://github.com/OutreachStud-io/studio/discussions) or discuss it in our [Discord](https://discord.gg/E3PDtyTJ4M). New functionality often has large implications across the entire OutreachStudio repo, so it is best to discuss the architecture and approach before starting work on a pull request.

### Installation & Requirements

OutreachStudio is structured as a Monorepo, encompassing not only the core OutreachStudio platform but also various plugins and packages. To install all required dependencies, you have to run `pnpm install` once in the root directory. **PNPM IS REQUIRED!** Yarn or npm will not work - you will have to use pnpm to develop in the core repository. In most systems, the easiest way to install pnpm is to run `corepack enable` in your terminal.

If you're coming from a very outdated version of OutreachStudio, it is recommended to nuke the node_modules folder before running pnpm install. On UNIX systems, you can easily do that using the `pnpm clean:unix` command, which will delete all node_modules folders and build artefacts.

It is also recommended to use at least Node v18 or higher. You can check your current node version by typing `node --version` in your terminal. The easiest way to switch between different node versions is to use [nvm](https://github.com/nvm-sh/nvm#intro).

### Pull Requests

For all Pull Requests, you should be extremely descriptive about both your problem and proposed solution. If there are any affected open or closed issues, please leave the issue number in your PR description.

All commits within a PR are squashed when merged, using the PR title as the commit message. For that reason, please use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for your PR titles.

Here are some examples:

- `feat: add new feature`
- `fix: fix bug`
- `docs: add documentation`
- `test: add/fix tests`
- `refactor: refactor code`
- `chore: anything that does not fit into the above categories`

If applicable, you must indicate the affected packages in parentheses to "scope" the changes. Changes to the core package do not require scoping.

Here are some examples:

- `feat(ui): add new feature`
- `fix(richtext-lexical): fix bug`
