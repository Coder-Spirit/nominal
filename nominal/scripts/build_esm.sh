#!/bin/sh

mv "${PWD}/src/internal/Symbols.ts" "${PWD}/src/internal/Symbols.ts.bak" \
&& cp "${PWD}/src/internal/Symbols.ts.esm" "${PWD}/src/internal/Symbols.ts" \
&& tsc -p ./tsconfig.esm.json \
&& ts-node ./scripts/adaptESM.ts

RESULT=$?

if [ -f "${PWD}/src/internal/Symbols.ts.bak" ]; then
  rm -f "${PWD}/src/internal/Symbols.ts";
  mv "${PWD}/src/internal/Symbols.ts.bak" "${PWD}/src/internal/Symbols.ts";
fi

exit $RESULT
