#!/usr/bin/env bash

set -e -o pipefail
# shellcheck source=_config.sh
source "$(dirname "${BASH_SOURCE[0]}")/_config.sh"

TASK=${1:-compile-dirac-pseudo-names}

TMP_RELEASE_BUILD="$DEPOT_DIR/out/Default/resources/inspector"

cd "$ROOT"

set -x

"$SCRIPTS/check-versions.sh"
"$SCRIPTS/depot-sync.sh"
"$SCRIPTS/depot-clean.sh"
"$SCRIPTS/depot-build-devtools.sh" "$TASK"

rm -rf "$RELEASE_BUILD_DEVTOOLS_FRONTEND"
mkdir -p "$RELEASE_BUILD_DEVTOOLS_FRONTEND"
cp -rc "$TMP_RELEASE_BUILD/" "$RELEASE_BUILD_DEVTOOLS_FRONTEND"

# copy compiled extension code (produced by `lein compile-dirac`)
cp "$ROOT/target/resources/release/.compiled/background.js" "$RELEASE_BUILD/background.js"
cp "$ROOT/target/resources/release/.compiled/options.js" "$RELEASE_BUILD/options.js"
