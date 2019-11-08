#!/bin/bash

source $PWD/venv/bin/activate
gnome-terminal -x sh -c "redis-server"
python3 app.py
deactivate
redis-cli shutdown
