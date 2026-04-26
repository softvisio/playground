FROM ghcr.io/zerocluster/node/app

RUN --mount=type=secret,id=GITHUB_TOKEN,env=GITHUB_TOKEN \
    <<EOF
#!/usr/bin/env bash

set -Eeuo pipefail
trap 'echo "⚠  Error ($0:$LINENO, exit code: $?): $BASH_COMMAND" >&2' ERR

# install dependencies
NODE_ENV=production npm install-clean

# build frontend
pushd frontend
NODE_ENV=development npm install-clean
npm run build
mv www /tmp
rm -rf *
mv /tmp/www .
popd

# cleanup
script=$(curl -fsSL "https://raw.githubusercontent.com/softvisio/scripts/main/env-build-node.sh")
bash <(echo "$script") cleanup
EOF
