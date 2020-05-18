#!/bin/bash
set -e
set -v
npm run integration-test
npm run build
npm run pre-push