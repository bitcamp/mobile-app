# :fire: Bitcamp Mobile App

<p align="center"><img src="./screenshot.jpg" alt="App Screenshot" height="500"/></p>

This is the the cross-platform mobile app for Bitcamp's hackathon, which is built using React Native and Expo. It provides hackers with up-to-date schedule information, custom QR codes, event notifications, and more.

## :round_pushpin: Quick Start

1. Install [node.js](https://nodejs.org/en/) and [git](https://git-scm.com/)
2. Install [yarn](https://yarnpkg.com/en/docs/install)
3. Globally install [expo-cli](https://docs.expo.io/versions/latest/get-started/installation/)
   - Optionally create an [expo account](https://expo.io/), and download the [expo mobile app](https://expo.io/tools#client) so you can run the app on your mobile device
4. Clone the repository using `git clone https://github.com/bitcamp/mobile-app.git` (or using an SSH key, if you know how)
5. Download the dependencies using `yarn install`
6. Run the app using `expo start` or `yarn start`

## :man_technologist: Contribution Guide

### Adding New Dependencies
Since our project uses Expo, all of our dependency versions must be Expo-compatible. To download the correct version of dependencies, you should use the **`expo install <name of package>`** instead of `yarn add <name of package>`.

### Development Scripts
Our [`package.json`](https://github.com/bitcamp/mobile-app/blob/master/package.json) file exports many useful developmentscripts:
1. `yarn start`: Starts the expo development environment and the metro bundler.
2. `yarn android`: Althernative to `yarn start`, which starts expo and also automatically builds the Android `.apk` on the active Android emulator or device.
3. `yarn iOS`: Same as `yarn android`, but for iOS. Only works if you have a Mac. If you have a physical iOS device, you can still use the [expo mobile app](https://expo.io/tools#client) to preview the app live.
4. `yarn lint`: Reports style errors in your code using ESLint.
5. `yarn lint:fix`: Reports style errors in your code using ESLint, and fixes all auto-fixable errors.

### ESLint Setup

Our project uses ESLint to enforce style and formatting rules. To get automatic linting working (so your text editor automatically lints on save), follow these steps:

#### VSCode

1. Download the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for VSCode
2. Create a workspace configuration file at the root of your project (it should be called in `.vscode/settings.json`)
3. Copy the following settings into your config file

```js
{
  // Set up yarn as the default package manager
  "eslint.packageManager": "yarn",

  // Run eslint fix on save
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },

  // Don't apply prettier on any of the following files (eslint will take care of formatting since we use `eslint-plugin-prettier`)
  "prettier.disableLanguages": ["js", "jsx"]
}
```

4. Reload VSCode and start linting :smile:

#### Manual Linting

To manually lint, use `yarn lint` and `yarn lint:fix` from the command line.

### New Feature Step-by-Step Instructions

We follow the [GitHub flow](https://guides.github.com/introduction/flow/) for managing this repository, which means that each new feature gets a branch off of master. After you've assigned yourself to an [issue](https://github.com/bitcamp/mobile-app/issues) to work on, do the following to setup your local git environment:

1. To make a new branch off of master, run

```bash
$ git checkout master
$ git checkout -b <descriptive-branch-name>
```

2. Add commits using descriptive commit messages
3. Push your new branch to the repository
4. Submit a merge request on GitHub when your feature is ready for review

### FAQ

Here are some common development questions

- How do I pull down new changes from master into a local branch?

```bash
 $ git pull origin master
```

- I got an Expo error about using a LAN URL. How do I fix that?
   - Instead of running `yarn start`, run `yarn start --tunnel` \[[here's the Stack Overflow page for reference](https://stackoverflow.com/a/56738980)\]
   
- I got an error saying `Task :app:transformNativeLibsWithMergeJniLibsForDebug FAILED`. How do I fix that?
   - Just run `yarn android` again, which usually fixes the error.
