import path from "path";
import { run, RunResult, RunOptions, Command, commandToString } from "@ts-common/azure-js-dev-tools";

console.log("$$DEBUG$$");

async function execAndLog(executable: string, args?: string[], options?: RunOptions): Promise<any> {
  const command: Command = {
    executable,
    args,
  };

  console.log(`\n\nRunning ${commandToString(command)}`);

  const result: RunResult = await run(command, undefined, {
    ...options,
    log: console.log,
    showCommand: true,
    showResult: true,
  });

  console.log(`\nResult of "${commandToString(command)}" [Exit code: ${result.exitCode}]:\n` + result.stdout + "\n");

  if (result.exitCode) {
    console.error(`Error while running "${commandToString(command)}": ${result.error}`);
    throw new Error(result.stderr);
  }

  return Promise.resolve(result);
}

async function cloneRepository(projectName: string, projectDirectory: string) {
  const gitHubUrl = `https://github.com/Azure/${projectName}.git`;
  await execAndLog(`git`, ["clone", gitHubUrl, projectDirectory, "--recursive"]);
  await execAndLog(`npm`, [ "install" ], { executionFolderPath: projectDirectory });
}

async function buildAndTest(projectDirectory: string) {
  await execAndLog(`npm`, [ "run", "build" ], { executionFolderPath: projectDirectory });
  await execAndLog(`npm`, [ "run", "test" ], { executionFolderPath: projectDirectory });
}

async function cloneAndRunTest(msRestJsDirectory: string, projectName: string) {
  const projectDirectory = path.join(msRestJsDirectory, `../.tmp/${projectName}`);
  await cloneRepository(projectName, projectDirectory);

  await execAndLog(`npm`, [ "install", msRestJsDirectory ], { executionFolderPath: projectDirectory });

  const additionalCommands: string[] = process.argv.slice(3);
  for (const command of additionalCommands) {
    await execAndLog(command, undefined, { executionFolderPath: projectDirectory });
  }

  await buildAndTest(projectDirectory);
  await execAndLog(`rm`, [ "-rf", projectDirectory ]);
}

(async () => {
  try {
    console.log(`Passed parameters:\n${process.argv}`);
    const msRestJsDirectory = path.join(__dirname, "..");
    console.log(`ms-rest-js directory: ${msRestJsDirectory}`);

    const projectName = process.argv[2];
    await cloneAndRunTest(msRestJsDirectory, projectName);
  } catch (error) {
    process.exit(1);
  }
})();
