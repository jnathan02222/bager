#!/bin/bash
cd /home/n25jiang/bager/backend
sudo ./gradlew bootRun &
cd /home/n25jiang/bager/website
npm start &
cd /home/n25jiang/bager/httpProxy
sudo /home/n25jiang/.nvm/versions/node/v20.17.0/bin/node index.js &


