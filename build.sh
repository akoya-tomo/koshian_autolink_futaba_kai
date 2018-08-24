#!/bin/bash
set -Ceu
cd `dirname $0`

TARGET_DIR="./koshian_autolink_futaba"
OUTPUT_DIR=".."

script_dir=$(cd $(dirname $0); pwd)
addon_name=${script_dir##*/}
cd ${TARGET_DIR}
addon_ver=$(jq -r '.version' manifest.json)
filename="${OUTPUT_DIR}/${addon_name}-${addon_ver}.zip"

zip -q -r -9 ${filename} * -x "*.bak" ".eslint*"
