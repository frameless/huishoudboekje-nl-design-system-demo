# Check if public/theme exists, if not, install default theme
if [ ! -d "./public/theme" ]; then
  echo "Theme does not exist"
  ./setTheme.sh
fi