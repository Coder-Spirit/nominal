#!/bin/sh

mkdir -p ./deno \
&& cp -r ./src/* ./deno/ \
&& rm -rf ./deno/__tests__ \
&& rm ./deno/internal/Symbols.ts.esm \
&& ts-node ./scripts/adaptDeno.ts
