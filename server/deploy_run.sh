#!/bin/bash
cd /client_portal
sudo pm2 delete -f client_portal
sudo pm2 start -f index.js --name client_portal
sudo pm2 save --name client_portal