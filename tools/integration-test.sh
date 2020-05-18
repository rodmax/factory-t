#!/bin/sh
set -e

rootDir=$(git rev-parse --show-toplevel)
rootBuildDir=${rootDir}/build
packageArchive="${rootDir}/factory-t*.tgz"

demoAppDir=${rootDir}/demo-app
demoAppBuildDir=${demoAppDir}/build

echo "BEFORE ALL: cleanup"
rm -rf "${demoAppBuildDir}" "${rootBuildDir}" ${packageArchive}

echo "STEP 1: build factory-t library"
cd "$rootDir"
npm run build
npm pack


echo "STEP 2: install factory-t, build demo-app and test it"
cd "${demoAppDir}"
npm i --no-save ${packageArchive}
npm run test

echo "AFTER ALL: cleanup"
rm -rf "${demoAppBuildDir}" "${rootBuildDir}" ${packageArchive}