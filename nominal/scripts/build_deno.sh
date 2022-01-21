#!/bin/sh

mkdir -p ./deno \
&& cp -r ./src/* ./deno/ \
&& rm -rf ./deno/__tests__ \
&& rm ./deno/internal/Symbols.ts \
&& mv ./deno/internal/Symbols.ts.esm ./deno/internal/Symbols.ts \
&& ts-node ./scripts/adaptDeno.ts
