import { spawnSync, SpawnSyncOptions } from "child_process";
import path from "path";

function execAndLog(command: string, args?: ReadonlyArray<string>, options?: SpawnSyncOptions) {
  console.log(`\n\nExecuting "${command} ${args && args.join(" ")}"`);
  const result = spawnSync(command, args, {
    ...options,
    stdio: "inherit"
  });

  console.log(`\n\nCommand "${command} ${args && args.join(" ")}" has finished. Result:\n${result && JSON.stringify(result)}`);
}

console.log(`Passed parameters:\n${process.argv}`);

const msRestJsDirectory = path.join(__dirname, "..");
console.log(`ms-rest-js directory: ${msRestJsDirectory}`);

const projectName = process.argv[2];
const projectDirectory = `.tmp/${projectName}`;
const gitHubUrl = `https://github.com/Azure/${projectName}.git`;

execAndLog("git", [ "clone", gitHubUrl, projectDirectory, "--recursive" ]);
execAndLog(`npm`, [ "install" ], { cwd: projectDirectory });
execAndLog(`npm`, [ "install", msRestJsDirectory ], { cwd: projectDirectory });

const additionalCommands: string[] = process.argv.slice(3);
additionalCommands.forEach(command => execAndLog(command, undefined, { cwd: projectDirectory }));

execAndLog(`npm`, [ "run", "test"], { cwd: projectDirectory });
execAndLog(`rm`, [ "-rf", projectDirectory ]);
