#!/bin/bash
source $PWD/venv/bin/activate
gnome-terminal -x sh -c ". ./start_redis.sh; bash"
python3 ./server(demo).py
deactivatez
. ./stop_redis.sh