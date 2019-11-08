#!/bin/bash
source $PWD/venv/bin/activate
gnome-terminal -x sh -c ". ./bin/start_redis.sh; bash"
python3 app.py
deactivate
redis-cli shutdown
