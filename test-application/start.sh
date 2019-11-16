#!/bin/bash


start_redis()
{
    if [[ $1 != "wait" ]]; then
        . stop
        redis-server &
    fi

    if [[ $(pidof redis-server) == "" ]]; then
        sleep 5
        start_redis "wait"
    fi
}


source $PWD/venv/bin/activate
start_redis
python3 -b app.py
. stop.sh