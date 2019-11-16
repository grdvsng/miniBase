#!/bin/bash

deactivate
sudo redis-cli shutdown

#check than redis died
redisPids=$(ps aux | grep -i "redis" | awk '{print $11"__"$2}')
for item in ${redisPids[*]}; do
    name=$(awk -F__ '{print $1}' <<<  $item)
    pid=$(awk -F__ '{print $2}' <<<  $item)

    if [[ $name != *"grep"* ]] && [[ $pid != "" ]]; then
        echo "kill $name $pid"
        sudo kill -9 $pid
    fi
done