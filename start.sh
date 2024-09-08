#!/bin/bash
cd /home/n25jiang/bager/backend
sudo ./gradlew bootRun &
cd /home/n25jiang/bager/website
npm start &
