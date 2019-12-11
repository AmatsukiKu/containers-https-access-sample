#!/bin/bash

set -ex
echo 'building docker images...'
docker-compose build puppeteer
echo 'running test...'
docker-compose run --rm puppeteer
