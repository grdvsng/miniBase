#!/bin/bash

__logger()
{
    logUrl="$basicPath/logs/install.log"
    msg="
        'user': '$USER'
        'Time': '`date -u`'
        'Event': '$1'
        ------------------------------------
    "

    sleep 2
    clear

    printf "$msg"
    printf "$msg" >> $logUrl

    if [[ $2 == 1 ]]; then
        exit
    fi
}

rm_old_instalation()
{
    basicFiles=$1

    . stop.sh

    for item in ${basicFiles[*]}; do
        if [ -d $item ]; then
            rm -R $item || __logger "Can't Remove: $item" 1
            __logger "Remove: $item"
        fi
    done
}

mk_log_dir()
{
    if ! [ -d "./logs/" ]; then
        mkdir "./logs/" || __logger "Error on log dir creation!" 1
    fi
}

python_setup()
{
    python3 -V || sudo apt install python3 || __logger "Error on python instalation!" 1
    pip3 -V || sudo apt-get install python3-pip || __logger "Error on pip instalation!" 1
}

install_venv()
{
    sudo pip3 install virtualenv || __logger "Error on venv instalation!" 1
    virtualenv venv || __logger "Error on venv creation!" 1
    source ./venv/bin/activate || __logger "Error on venv activate!" 1

    pip3 install redis || pip install redis || __logger "Error on redis instalation!" 1
    pip3 install flask || pip install flask || __logger "Error on flask instalation!" 1
}

install_redis()
{
    redisUrl=$1

    mkdir "./temp"
    wget $redisUrl -O "$PWD/temp/redis.gz" || __logger "Error on redis download!" 1
    tar --extract -f "$PWD/temp/redis.gz" -C "$PWD" || __logger "Error on redis extract!" 1
    rm -R "$PWD/temp"

    cd "redis-5.0.5"
    make

    sudo cp "src/redis-server" /usr/local/bin/
    sudo cp "src/redis-cli" /usr/local/bin/
    sudo cp "src/redis-cli" /usr/local/bin/
}

redis_generate_table_for_test_application()
{
    if [[ $1 != "wait" ]]; then
        . stop
        redis-server &
    fi

    if [[ $(pidof redis-server) == "" ]]; then
        sleep 5
        start_redis "wait"
    else
        # for 1 start
        if [[ $(redis-cli HGET "users_name_mail" "admin") != *"grdvsng@gmail.com"* ]]; then
            redis-cli HSET "users_name_mail" "admin" "grdvsng@gmail.com"
        fi
    fi
}

#basic cfg
basicFiles=("./temp" "./redis-5.0.5" "./venv")
redisUrl="http://download.redis.io/releases/redis-5.0.5.tar.gz";
basicPath=$PWD

__logger "Remove old instalation files"
rm_old_instalation $basicFiles
__logger "Create log dir"
mk_log_dir
__logger "Install Python"
python_setup
__logger "Install Venv"
install_venv
__logger "Install Redis"
install_redis $redisUrl
__logger "Generate test application table"
redis_generate_table_for_test_application
__logger "Continue"
cd $basicPath
. stop