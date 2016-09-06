#!/usr/bin/env bash

# Linux
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    java -jar selenium/selenium-server-standalone-2.53.1.jar -Dwebdriver.chrome.driver=selenium/chromedriver.linux

# Mac OSX
elif [[ "$OSTYPE" == "darwin"* ]]; then
    java -jar selenium/selenium-server-standalone-2.53.1.jar -Dwebdriver.chrome.driver=selenium/chromedriver.mac

fi
