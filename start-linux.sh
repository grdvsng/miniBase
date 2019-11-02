#!/bin/bash

logFile="./logs/start.json"


logger() {
    timestamp=`date '+%A %W %Y %X'`;

    if [ -f $2 ]; then
        sed -i -e 's/}]/}, /g' $2
    else
        echo '{\n\t"log": ['>>$2
    fi

    data='\t{\n\t\t"time": "'$timestamp'",\n\t\t"user": "'$USER'",\n\t\t"event": "'$1'"\n\t}]\n}';

    echo $data;
    echo $data >> $2;

}

logger "Redis starting" $logFile
gnome-terminal -e "sudo sh $PWD/redis-start.sh"
#-- || nome-terminal -e $cmd-- || xterm -e $cmd -- || konsole -e $cmd -- || terminal -e $cmd --

logger "Server starting" $logFile
#source venv/bin/activate
#python3 server.py


