## Getting Started

To start working with oye-jobs app you need to:

1. Get a copy of the code.
2. Install the dependencies if you don't already have them.
3. Get a copy of `oye-jobs-app` MySQL database and import database into local MySQL. 

### Install dependencies

#### Quickly Start(experienced users)

With Node.js installed, run the following from the root of your this oye-jobs download:
```sh
npm install -g gulp yarn && yarn install
```

#### Prerequisites 

This App requires the following major dependencies.

- [Node.js](https://nodejs.org/), used to run JavaScript tools from the command line.
- npm, the node package manager, installed with Node.js and used to install Node.js packages.
- gulp, a Node.js-based build tool.
- yarn, a Node.js-based super fast package manager used to install npm packages (like Angular and its components).

**Install dependencies:**

1)  Check your Node.js version.

```sh
node --version
```

The version should be at or above 4.4.x.

2)  If you don't have Node.js installed, or you have a lower version, go to [nodejs.org](https://nodejs.org) and download and install latest LTS version.

3)  Install `gulp` and `yarn` globally.

```sh
npm install -g gulp yarn
```

This lets you run `gulp` and `yarn` from the command line.

4)  Install oye-jobs App local `npm` dependencies.

```sh
cd oye-jobs && yarn install
```
### Directory Layout

Before you start, take a moment to see how the project structure looks like:

```
.
│   .babelrc                                 # Configuration file for Babel transpiler 
│   .editorconfig                            # Editor configuration file to maintain consistent coding style. Check learn more for more info.
│   .eslintignore                            # ESLint ignore file and directory configuration
│   .eslintrc.yml                            # ESLint configuration for maintain coding style
│   .gitattributes                           # GIT configuration to maintain line ending style on between different OS.
│   .gitignore                               # GIT configuration to ignore files and folder from GIT
│   gulpfile.babel.js                        # Gulp tasks file to start dev server and used to create automated task like build, test and linting etc.
│   package.json                             # The list of 3rd party libraries and utilities used in client and server side.
│   postcss.config.js                        # PostCSS configuration used with webpack plug-in. 
│   webpack.config.js                        # Webpack configurations for client-side and server-side bundles
│   yarn.lock                                # Fixed version for all the dependencies 
│
├───client                                   # The client side sources, configuration and assets.
│   │   index.html                           # Generated from _index.html by webpack with bundles
│   │   index.js                             # Main entry file for webpack and angular application
│   │   manifest.json                        # WebApp configuration file. Check the learn more for more info.
│   │   _index.html                          # Template for `index.html` file
│   │
│   ├───assets                               # All type assets for application lives here
│   │   ├───images/                          # All images for application
│   │   ├───manifest/                        # Icon files for manifest.json
│   │   └───svg                              # All svg files lives such as app icons and avatars
│   │
│   └───src                                  # The angular app components sources. Angular Material Design library has been used for UI components.
│       ├───app-menu/                        # Angular side nave app menu component
│       ├───auth/                            # Authentication module for client side including user service.
│       ├───croppie/                         # Croppie directive wrapper for image cropping. 
│       ├───date-input-row/                  # Component to input date, month and year
│       ├───day-input/                       # Component to input date    
│       ├───education/                       # Education data service module
│       ├───experience/                      # Experience data service module
│       ├───forgot-password/                 # Forgot password component and route view
│       ├───img-preview-dialog/              # Image preview dailog service
│       ├───infinite-items/                  # Infinite items list service used with compatible API
│       ├───job/                             # Job data service module
│       ├───job-detail/                      # Job Detail component and route view
│       ├───job-domain/                      # Job domain data service module
│       ├───job-type/                        # Job Type data service module
│       ├───job-users/                       # Job users component and route view used in admin panel
│       ├───job-write/                       # Job write component and route view for job edit and new job post
│       ├───jobs/                            # Job list component and route view for job listing
│       ├───manage/                          # Manage view component and route view
│       ├───manage-jobs/                     # Job management component and route view
│       ├───manage-roles/                    # Role management component and route view
│       ├───manage-scopes/                   # Scope management component and route view
│       ├───manage-users/                    # User management component and route view
│       ├───month-select/                    # Dropdown list component for month selection by name
│       ├───phone-input/                     # Component to input phone number
│       ├───profile/                         # Component and route view for user profile
│       ├───search-input/                    # Search component with auto-complete compatible with required API
│       ├───signin/                          # Signin component and route view
│       ├───signout/                         # Module used for sign out
│       ├───signup/                          # Signup component and route view
│       ├───oye-jobs-app/                # Main application wrapper component
│       ├───user-account/                    # Component and services used for user account editing and view
│       ├───user-education/                  # User education view component
│       ├───user-experience/                 # User experience view component
│       ├───user-jobs/                       # User jobs component for listing the jobs which were applied by user
│       ├───util/                            # Utilities service for application. It contains helper functions.
│       └───year-input/                      # Component for year input
├───dist/                                    # The folder for compiled output of client and server code in ES5 including webpack bundles for client side.
├───node_modules/                            # 3rd-party libraries and utilities
└───server/                                  # The server side sources and configuration
    │   app.js                               # Main node application entry point
    │   index.js                             # Entry point for babel transpiler
    │   routes.js                            # Main route file for API routing
    ├───api/                                 # API sources and database model
    │   ├───country/                         # Country data model and API
    │   ├───education/                       # Education data model and API
    │   ├───experience/                      # Experience data model and API
    │   ├───job/                             # Job data model and API
    │   ├───job-domain/                      # Job-Domain data model and API
    │   ├───job-type/                        # Job-Type data model and API
    │   ├───location/                        # Location data model and API
    │   ├───role/                            # Role data model and API
    │   ├───scope/                           # Scope data model and API for different -2 scopes used in app.
    │   └───user/                            # User data model and API for user data
    ├───auth/                                # Module to check required scopes and authentication of users.
    │   └───local/                           # PassportJS setup for email login
    ├───components/                          # Components used by API services
    │   ├───api-response/                    # Used for common API responses
    │   └───log/                             # Used for logging purpose
    ├───config/                              # Express server, environment configuration and database seeding
    │   └───environment/                     # Configuration for different-2 environments
    └───sqldb/                               # Main sequelize model setup and their relationships
```

### Learn More
  * [Editor Configuration](http://editorconfig.org/)
  * [Babel Configuration](https://babeljs.io/docs/usage/babelrc/)
  * [WebApp Menifest](https://developers.google.com/web/updates/2014/11/Support-for-installable-web-apps-with-webapp-manifest-in-chrome-38-for-Android)
  * [Croppie](https://foliotek.github.io/Croppie/)
  * [PostCSS](http://postcss.org/)
  * [Sequelize ORM](http://docs.sequelizejs.com/)
  * [AngularJS Material](https://material.angularjs.org)
  * [Learn ES6](https://babeljs.io/docs/learn-es6/), [ES6 Features](https://github.com/lukehoban/es6features#readme)


### Development workflow

#### Serve 
```sh
gulp serve
```
This start express server using nodemon module and outputs an IP address which you can use to test app locally and can used on devices connected to your network.


#### Run tests

```sh
gulp test:server
```
This runs unit tests defined in server directory except temp directory.

#### Build 
```sh
gulp
```
Create bundles for app. This create dist(distribution) directory, copy and create optimized files(CSS, JS, HTML Minification) for deployment.

#### Build and test
```sh
gulp serve:dist
```
Create build and start app server from dist directory for build test.


## Deploy

TODO
