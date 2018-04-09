# Component Builder Kit Rename Me :|

@HyperSprite/component-builder-kit-rename-me is a repo to help create, test, and publish components to npm.

Sample readme.md
````md
# Rename Me

Some nice one line description

## Usage

### Install
```npm install --save @hypersprite/rename-me```

### Import
```import ReanameMe from '@hypersprite/rename-me';```

### Usage
```js
<rename-me />
```

### Scripts

use `npm run <script>`

* `lint` - runs linter
* `test` - runs test
* `test:dev` - runs test in watch mode
* `build` - runs build
* `build:dev` - runs build in watch mode

`npm version <major | minor | patch>`

### API

#### Receives Props

| prop name | type | values | description |
| --------- | ---- | ------ | ----------- |
|  |  |  |   |
|  |  |  |   |
|  |  |  |   |

#### New Passed Props

| prop name | type | values | description |
| --------- | ---- | ------ | ----------- |
|  |  |  |   |
|  |  |  |   |
|  |  |  |   |
|  |  |  |   |

````




## Component Builder Kit

This is a component builder kit to build and test isolated React and plain ES6 components (for pain ES6, remove React dependencies before publishing).

### Workflow

* Build the component in isolation with tests.
* Use `npm link` to add the isolated component to node_modules of a working dev environment. It could be a vanilla Create React App.
* Work on style using the `npm run build:watch` in one terminal and Create React App's `npm run start` in another and the the component will automatically updated in the browser.
* Deploy using `npm publish`
* Iterate

### Includes

* Testing includes Jest testing with Enzyme for mounting and rendering and Istanbul for coverage reporting.
* Linting provided by ESlint with AirBnB presets with some modifications, see the `eslint` key in `package.json` and `.eslintignore` file.
* Modern JavaScript and JSX via babel, see `.babelrc` file.
* Git precommit hooks to run npm scripts before commit, see `precommit` key in `package.json`.

### Setup

> I am using bash on linux, I assume these instructions work on Mac, sorry Windows, you're on your own.

```bash
git clone https://github.com/HyperSprite/component-builder-kit-rename-me.git
mv component-builder-kit name-of-component
cd name-of-component
rm -rf .git
git init
npm install
```

Work through the `rename-me` sections and do the first commit.

### Adding package to local app for development

> This will not work if you need to run sudo to to install npm modules, [see this article here](see this http://justjs.com/posts/npm-link-developing-your-own-npm-modules-without-tears) if you need help fixing that.

Note that link syslinks the whole module, src and all so if you are doing anything hacky whacky, your local results may not match your published results. After linking, drill down into node_modules and take a look.

A bit about naming. NPM will install the package based on the `name` key in the package.json file regardless of the folder it lives in.

Open package.json and check the name, in this case:
  "name": "@hypersprite/rename-me",

Assuming you have a flat folder structure e.g.:

 * Documents/
   * code/
     * your-working-app/
     * rename-me/

From inside `your-working-app` run the following command:
```bash
npm link ../rename-me
```

If you look in node_modules, you will now see a directory that matches the name.

> One nice thing about scoped npm module names is that you don't have to worry about name collisions with modules outside of your own scope. Not that I would recommend creating a scoped `lodash` or 'react' but you could.  

```@hypersprite``` with a sub directory ```rename-me```

You can use your local version inside your app as if it was a published module
```js
import rename-me from '@hypersprite/rename-me';
// or
const rename-me = require('@hypersprite/rename-me');

```

#### Things to remember about npm link that are most likely to cause issues.


* Link will overwrite real packages of the same name.
* Make sure to remember to run `npm run build` after editing your source, or the `dst` folder will be out of date.
* If you run npm `install` or `update` on your working app and you still need your link, you will need to rerun the link command. Here's an example of a script you could use to link multiple local packages after an install.

package.json
```json
"scripts": {
  "localmodules": "npm link ../rename-me ../some-other-local-project"
}
```

## Testing

Testing provided by Jest, Enzyme and coverage report by Istanbul

* ```npm test``` Runs all tests `/src` with `*.spec.*` in the name.
* ```npm run test:dev``` Same but uses watch mode.

## Versions and Publishing to NPM

This setup includes a package called `pre-commit` that will run npm scripts using a git precommit hook. Make sure you `git init` the project before

Publishing a package

### Add+Commit, Version

> The branch must be clean to version and publish

* Add
* Commit, which will:
 * Run linting and tests with pre-commit hooks.

```bash
git commit -am 'some totally useful comment'
```

Next, we need to Version:


#### Initial Publish:
```bash
// manually build your dst
npm run build
// publish your module
// --access public if this is a scoped module and you want it public
// By default this is private, private requires a paid npm subscription
npm publish --access public
// Pick option
npm version <major | minor | patch>
```

Version will:
* Rerun linting and tests
* Updates the package.json version number based on Major, Minor and Patch
* Git add package.json using the version number as the commit message
* Push the changes to Github
* Transpile the JSX to ES5 with babel into the dst/ directory
* Publish to npm
* Delete the dst directory

For subsequent publishing the workflow ends up"
```bash
git add .
git commit -m 'something totally meaningful'
git version
```
