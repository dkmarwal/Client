#!/bin/bash
cd /"$1"/client_portal
sudo pm2 stop -f client_portal_"$1"
sudo pm2 delete -f client_portal_"$1"
sudo NODE_ENV="$1" pm2 start -f index.js --name client_portal_"$1"
sudo pm2 save --name client_portal_"$1"