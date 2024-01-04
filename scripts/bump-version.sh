#!/bin/bash

# Get version from package.json
version=$(awk -F: '/"version":/ {print $2}' package.json | tr -d ' ",')
# File where VERSION is defined
file="src/constants/Config.ts"

# Use sed to replace VERSION
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/export const SDK_VERSION = '.*';/export const SDK_VERSION = '$version';/" $file
else
    # Linux
    sed -i "s/export const SDK_VERSION = '.*';/export const SDK_VERSION = '$version';/" $file
fi
