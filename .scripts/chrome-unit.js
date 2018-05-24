const semver = require("semver");
if (semver.major(process.version) < 8) {
  // Ignore browser tests in pre-node 8 CI job
  console.log("node.js " + process.version + " too low. Exiting.");
  process.exit(0);
}

const { spawn, exec } = require("child_process");
const { join } = require("path");

const webpackDevServer = spawn(join(__dirname, "../node_modules/.bin/ts-node"), [join(__dirname, "../testserver")], { shell: true })

let mochaChromeRunning = false
const webpackDevServerHandler = (data) => {
  if (!mochaChromeRunning) {
    mochaChromeRunning = true
    const mochaChrome = spawn(
      join(__dirname, "../node_modules/.bin/mocha-chrome"),
      ["http://localhost:3001", JSON.stringify(['"--no-sandbox"'])],
      { shell: true, stdio: "inherit" });
    mochaChrome.on("exit", (status) => {
      webpackDevServer.stderr.destroy();
      webpackDevServer.stdout.destroy();
      webpackDevServer.kill();

      process.exit(status);
    });
  }
}

webpackDevServer.stderr.on('data', data => console.error(data.toString()));
webpackDevServer.stdout.on('data', webpackDevServerHandler);
webpackDevServer.on('exit', webpackDevServerHandler);