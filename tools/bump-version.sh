#!/bin/bash
set -e
set -v
npm run build
npm run pre-push  # tihs run test not only for ts but and for built js files in build dir
npm run changelog:build

git add -A build CHANGELOG.md