#!/bin/bash

. $PWD/start_redis.sh
source $PWD/venv/activete
pytho3 server.py
