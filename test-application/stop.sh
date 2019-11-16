#!/bin/bash


redis_killer()
{
    sudo redis-cli shutdown
    redisPids=$(ps aux | grep -i "redis" | awk '{print $11"__"$2}')

    for item in ${redisPids[*]}; do
        name=$(awk -F__ '{print $1}' <<<  $item)
        pid=$(awk -F__ '{print $2}' <<<  $item)

        if [[ $name != *"grep"* ]] && [[ $pid != "" ]]; then
            echo "kill $name $pid"
            sudo kill -9 $pid || "Error in stop.sh! Can't stop Redis! ($pid)"
        fi
    done
}


#save DB and exit env
deactivate
redis-cli SAVE || echo "Error in stop.sh! Can't save Redis!"
redis_killer