import { ExecOptions, execSync } from "child_process";
import path from "path";

function execAndLog(command: string, options?: ExecOptions) {
  console.log(`\n\nExecuting "${command}"`);
  execSync(command, {
    ...options,
    stdio: "inherit"
  });
}

console.log(`Passed parameters:\n${process.argv}`);

const msRestJsDirectory = path.join(__dirname, "..");
console.log(`ms-rest-js directory: ${msRestJsDirectory}`);

const projectName = process.argv[2];
const projectDirectory = `.tmp/${projectName}`;
const gitHubUrl = `https://github.com/Azure/${projectName}.git ${projectDirectory}`;

execAndLog(`git clone ${gitHubUrl} --recursive`);
execAndLog(`npm install`, { cwd: projectDirectory });
execAndLog(`npm install ${msRestJsDirectory}`, { cwd: projectDirectory });

const additionalCommands: string[] = process.argv.slice(3);
additionalCommands.forEach(command => execAndLog(command, { cwd: projectDirectory }));

execAndLog(`npm run test`, { cwd: projectDirectory });
execAndLog(`rm -rf ${projectDirectory}`);
