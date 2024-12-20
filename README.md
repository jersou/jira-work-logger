# Jira-Work-Logger

A web app to easily add Jira worklogs.

## To run the WebApp :

First, you need deno : https://deno.land/#installation

And the app could simply be run with :

```shell
deno -A jsr:@jersou/jira-work-logger
# or deno -A https://raw.githubusercontent.com/jersou/jira-work-logger/main/jira-work-logger.ts
# or deno -A https://raw.githubusercontent.com/jersou/jira-work-logger/main/dist/jira-work-logger.bundle.esm.js
```

Then, go to [http://localhost:8000/](http://localhost:8000/) with a web browser.

Then, set the configuration in the bottom part to get Jira Issues and add
worklogs.

The `--allow-run` parameter can be skipped if you don't use
[Hamster](https://github.com/projecthamster/hamster) and if you don't want the
application to open in the default browser on startup.

If the script parameter `--not-exit-if-no-client` is not present, the server will wait a
frontend connection, and it will stop by itself as soon as the frontend is
closed (a websocket check this).

## Install (by Deno)

```
deno install --name jira-work-logger -A jsr:@jersou/jira-work-logger
```

Then, simply run `jira-work-logger`

## CLI usage

```shell
$ deno -A ./jira-work-logger.ts --help              
Usage: ./jira-work-logger.ts [Options] [--] [command [command args]]

Command:
  main [default]

Options:
 -h, --help                     Show this help                                                        [default: false]
     --hostname                 Server hostname                                                 [default: "localhost"]
     --port                     Server port                                                            [default: 8000]
     --open-in-browser          Open with chromium/chrome/gio if true or with the parameter [default: "google-chrome"]
     --open-in-browser-app-mode Add --app= to browser command if openInBrowser is used                 [default: true]
     --not-exit-if-no-client    Keep the server alive after the last client disconnects               [default: false]
```

## Screenshot

![screenshot](screenshot.png)

## Dependencies

- [Deno](https://deno.land/)
  - [std](https://jsr.io/@std)
  - [@david/dax](https://jsr.io/@david/dax)
  - [@jersou/clite](https://jsr.io/@jersou/clite)
  - [@jersou/desktop-web-app](https://jsr.io/@jersou/desktop-web-app)
- [React](https://www.reactjs.org/)
  - ViteJS
  - [Material UI](https://material-ui.com/)
  - [React Transition Group](https://github.com/reactjs/react-transition-group)
- [Redux](https://redux.js.org/)
  - [Reduxjs Toolkit](https://redux-toolkit.js.org/)
  - [React Redux](https://react-redux.js.org/)
  - [Immer](https://immerjs.github.io/immer/docs/introduction)
- [Dayjs](https://github.com/iamkun/dayjs)
- [Storybook](https://storybook.js.org/)
- [Typescript](https://www.typescriptlang.org/)
- [Prettier](https://prettier.io/)
- [Scss](https://sass-lang.com/)

# Make the bundle file

```
git clone https://github.com/jersou/jira-work-logger.git
cd jira-work-logger/frontend
npm install
npm run build
cd ..
deno run -A ./jira-work-logger.ts updateAssetsBundle
./bundle.ts
```

# Make the binary files

```
deno compile -A --target x86_64-unknown-linux-gnu --output bin/Linux/Jira-Work-Logger       jira-work-logger.ts
deno compile -A --target x86_64-pc-windows-msvc   --output bin/Windows/Jira-Work-Logger.exe jira-work-logger.ts
```
