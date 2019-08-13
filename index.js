#!/usr/bin/env node
const argv = require("minimist")(process.argv.slice(2), { boolean: true});
const path = require("path");
const chalk = require("chalk");
const fs = require("fs");

function readPackageJSON(p)
{
    return JSON.parse(
        fs.readFileSync(p, "UTF-8")
    );
}


const files = argv._;
const update = !!argv.update;

if (files.length < 2)
{
    console.log(`
Usage: pkg-version ${chalk.dim("<src>")} ${chalk.dim("<dst>")} [ ${chalk.dim("<dst2>")} ... ]

Compares package versions`);
    console.log(chalk.red("\nERROR: Need package.json files\n"));
    process.exit(1);
}

const src = readPackageJSON(files[0]);



for (let i = 1 ; i < files.length; i++)
{
    const dst = readPackageJSON(files[i]);

    console.log(
        chalk.bold(`
${files[0]} vs ${files[i]}:
`));

    const longest = Object.keys(src.dependencies).concat(Object.keys(src.devDependencies)).map(n => n.length).reduce((a,b) => Math.max(a,b), 0);

    const cmp = (srcName, deps, dstName, pkgJSON) =>
    {
        let changed = false;
        for (let name in deps)
        {
            if (deps.hasOwnProperty(name))
            {
                const version = deps[name];

                if (pkgJSON.dependencies[name] && pkgJSON.dependencies[name] !== version)
                {
                    console.log(`${chalk.green(name.padStart(longest, " "))} : ${version} ${chalk.dim("!==")} ${pkgJSON.dependencies[name]}`);

                    if (update)
                    {
                        pkgJSON.dependencies[name] = version;
                        changed = true;
                    }

                }
                else if (pkgJSON.devDependencies[name] && pkgJSON.devDependencies[name] !== version)
                {
                    console.log(`${chalk.green(name.padStart(longest, " "))} : ${version} ${chalk.dim("!==")} ${pkgJSON.devDependencies[name]}`);

                    if (update)
                    {
                        pkgJSON.devDependencies[name] = version;
                        changed = true;
                    }
                }
            }
        }

        return changed;
    };


    const changedDeps = cmp(files[0], src.dependencies, files[i], dst);
    const changedDevDeps = cmp(files[0], src.devDependencies, files[i], dst);

    if (update && (changedDeps || changedDevDeps))
    {
        fs.writeFileSync(
            files[i],
            JSON.stringify(
                dst,
                null,
                4
            ),
            "UTF-8"
        );
    }
    cmp(files[0], src.devDependencies, files[i], dst);
}
