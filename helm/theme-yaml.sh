#!/bin/sh

THEME_DIR=${1:?Theme directory}

cat <<EOF
medewerker-frontend:
  theme:
EOF

cd ${THEME_DIR}
for f in *; do
  echo "    ${f}: |"
  sed 's/^/      /' "${f}"
done
