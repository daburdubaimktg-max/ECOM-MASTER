#!/usr/bin/env bash
# Brand Intelligence Engine — start on this Mac (or Linux) computer for your team.
# Double-click this file in Finder. Keep the window open while people use the app.
# Steps: back up the data, prepare the app, start it, then open a free Cloudflare link for the team.
cd "$(dirname "$0")" || exit 1

export BUILT_IN_SCHEDULER=true                 # background work every 5 minutes, inside the app
export ALLOWED_ORIGINS='*.trycloudflare.com'   # accept forms sent through the Cloudflare link
export PORT=3000

pause() { echo; read -r -p "Press Enter to close this window." _; }

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed. Install the LTS version from https://nodejs.org, then double-click this file again."
  pause; exit 1
fi
if [ ! -d node_modules ]; then
  echo "First start: installing the app's components (a few minutes)…"
  npm install || { echo "Installation failed — see the messages above."; pause; exit 1; }
fi

echo "Backing up your data…"
npm run --silent backup || { pause; exit 1; }

echo "Preparing the app (1–2 minutes)…"
npm run --silent build > .office-build.log 2>&1 || { echo "Preparing the app failed. Details are in .office-build.log"; pause; exit 1; }

echo "Starting the app…"
npm start > .office-app.log 2>&1 &
APP_PID=$!
trap 'echo; echo "Stopping the app…"; kill $APP_PID 2>/dev/null; wait $APP_PID 2>/dev/null' EXIT INT TERM

for _ in $(seq 1 60); do
  if curl -fsS "http://localhost:$PORT/api/health" >/dev/null 2>&1; then break; fi
  sleep 1
done
if ! curl -fsS "http://localhost:$PORT/api/health" >/dev/null 2>&1; then
  echo "The app did not start. Details are in .office-app.log"; pause; exit 1
fi
echo
echo "The app is running on this computer: http://localhost:$PORT"

if ! command -v cloudflared >/dev/null 2>&1; then
  echo
  echo "To share it with your team, install Cloudflare's free link program once:"
  echo "    brew install cloudflared        (Mac, with Homebrew)"
  echo "then close this window and double-click this file again."
  echo
  echo "Until then, only this computer can open the app. Press Ctrl+C to stop."
  wait $APP_PID
  exit 0
fi

echo
echo "Opening a free Cloudflare link for your team. Look below for an address ending in"
echo ".trycloudflare.com — send it to your team. It changes every time you start the app."
echo "Press Ctrl+C (or close this window) to stop."
echo
cloudflared tunnel --url "http://localhost:$PORT"
