#!/bin/bash
set -e
set -v
npm run changelog:build

git add -A CHANGELOG.md