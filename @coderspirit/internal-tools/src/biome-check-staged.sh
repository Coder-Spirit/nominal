#!/bin/sh

set -eu;

unset CDPATH; # For safety
SCRIPT_DIR="$( cd -- "$( dirname -- "$0" )" &> /dev/null && pwd )";
SCRIPT_DIR="$(realpath "${SCRIPT_DIR}")";

DENO_FUTURE=1 "${SCRIPT_DIR}/biome-check-staged.ts" $@;
