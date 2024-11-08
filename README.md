# Jira-Work-Logger

A web app to easily add Jira worklogs (and to make a standalone
[Deno](https://deno.land/)/[React](https://www.reactjs.org/) WebApp POC).

## To run the WebApp :

First, you need deno : https://deno.land/#installation

The whole application is encapsulated in a single file, and could simply run
with :

```
deno -A https://raw.githubusercontent.com/jersou/jira-work-logger/main/main.ts
```

Then, go to [http://localhost:8000/](http://localhost:8000/) with a web browser
(this page open at app start-up if you use the `--allow-run` parameter).

Then, set the configuration in the bottom part to get Jira Issues and add
worklogs.

The `--allow-run` parameter can be skipped if you don't use
[Hamster](https://github.com/projecthamster/hamster) and if you don't want the
application to open in the default browser on startup.

If the script parameter `--dont-wait-and-close` is not present, the server will wait a
frontend connection, and it will stop by itself as soon as the frontend is
closed (a websocket check this).

## Install (by Deno)

```
deno install --name jira-work-logger  --unstable --allow-net --allow-run https://raw.githubusercontent.com/jersou/jira-work-logger/main/main.js
```

Then, simply run `jira-work-logger`

## Permissions

- `--allow-net` : to serve HTTP, send request to Jira server, and run Websocket
  (if --wait-and-close). You can adjust this permission:
  `--allow-net=127.0.0.1:8000,0.0.0.0:8001,my.own.domain.jira`
- `--allow-run` (optional) : to open the frontend in the default web browser and
  call [Hamster](https://github.com/projecthamster/hamster) on "Import from
  Hamster" button click, this feature use
  [Deno-Opn](https://github.com/hashrock/deno-opn)

## To update the WebApp :

Once run one time, the app is cached by Deno, to update the app :

```
deno cache --reload https://raw.githubusercontent.com/jersou/jira-work-logger/main/main.ts
```

or add the `--reload` parameter to the run command

## Screenshot

![screenshot](screenshot.png)

## Dependencies

- [Deno](https://deno.land/)
  - [Oak](https://oakserver.github.io/oak/)
  - [Deno-Opn](https://github.com/hashrock/deno-opn)
- [React](https://www.reactjs.org/)
  - [Create React App](https://reactjs.org/docs/create-a-new-react-app.html)
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
cd ../bundler/
deno run --unstable --allow-read --allow-write filesContentGenerator.ts
```

# Make the binary file

```
deno compile -A --target x86_64-unknown-linux-gnu --output bin/Linux/Jira-Work-Logger       main.ts --wait-and-close
deno compile -A --target x86_64-pc-windows-msvc   --output bin/Windows/Jira-Work-Logger.exe main.ts --wait-and-close
```
