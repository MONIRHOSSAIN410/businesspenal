#!/bin/bash
# Syntax-checks every .jsx file under a given directory using the esbuild
# binary bundled with the globally-installed `tsx` package (transform-only,
# no bundling, so it needs no project node_modules to be installed).
ESBUILD=/home/claude/.npm-global/lib/node_modules/tsx/node_modules/.bin/esbuild
DIR="${1:-src}"
fail=0
count=0
while IFS= read -r f; do
  count=$((count+1))
  out=$("$ESBUILD" "$f" --jsx=automatic --format=esm 2>&1 >/dev/null)
  if [ -n "$out" ]; then
    echo "FAIL: $f"
    echo "$out"
    fail=1
  fi
done < <(find "$DIR" -name "*.jsx")
if [ $fail -eq 0 ]; then
  echo "All $count .jsx files: syntax OK"
fi
