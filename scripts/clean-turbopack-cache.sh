#!/bin/bash
# Clears Turbopack's persistent dev cache, which grows unbounded over weeks of `next dev`.
# Run periodically (e.g. weekly) if .next is ballooning in size.
rm -rf .next/dev/cache/turbopack
echo "Cleared Turbopack persistent cache."
