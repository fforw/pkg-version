# pkg-version

Prints and updates version differences between projects.

## Usage

```
    pkg-version <src> <dst> [<dst2> ...] [--update]
```

Looks for each dependency in the src package.json file and compares it with the version in dst, dst2 ...

If the dependency is also present but differs in version number (string comparison), the difference is printed.

If the --update flag is given, the dst package.json files are updated with the version in the src package.json.

