#!/bin/sh

# Default tenant
TENANT='sloothuizen'

if [ $# -eq 0 ]
  then
  echo Installing default default theme \"sloothuizen\"...
else
  TENANT=$1
fi

TENANT_THEME_DIR="../../theme/$TENANT"
PUBLIC_THEME_DIR="./public/theme"
rm $PUBLIC_THEME_DIR &> /dev/null
ln -s $TENANT_THEME_DIR $PUBLIC_THEME_DIR
echo Theme $TENANT installed.
