#!/bin/bash


#Start server
source $PWD/venv/bin/activate
redis-server &
python3 -b app.py

#Stop server
. stop.sh