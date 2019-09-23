# GitHub Stats Visualizer

Pull and view GitHub stats in a tabulated view.

## Development Setup

- Install yarn globally: `npm install -g yarn`
- Run `yarn` in package folder to install dependencies
- Run `yarn start` to start local server for development
- Run `yarn build` to build to docs folder
- Push to GitHub (on master branch) to deploy. 
    - Before pushing, building is not required since it's done in a pre-commit hook.
    - After pushing, changes will be immediately reflected on GitHub pages.
