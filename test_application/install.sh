#!/bin/bash

redisUrl="http://download.redis.io/releases/redis-5.0.5.tar.gz";
logUrl="./logs/install.log"
basicFiles=("./temp" "./redis-5.0.5" "./venv")
basicUrl=$PWD

logger()
{
    msg="
'user': '$USER'
'Time': '`date -u`'
'Event': '$1'
------------------------------------
"

    clear

    printf "$msg"
    printf "$msg" >> $logUrl

    sleep 5
}


#Remove old instalation
for item in ${basicFiles[*]}; do
    if [ -d $item ]; then
        rm -R $item
        logger "Remove: $item"
    fi
done


#Virtual env install
logger "Install python3-pip"
sudo apt-get install python3-pip

logger "Install virtualenv"
sudo pip3 install virtualenv

logger "Create virtualenv"
virtualenv venv
source ./venv/bin/activate

logger "Install plugins"
pip3 install redis || pip install redis
pip3 install flask || pip install flask


#Redis install
logger "Download redis"
mkdir "./temp";
wget $redisUrl -O "$PWD/temp/redis.gz";

logger "Extract redis"
tar --extract -f "$PWD/temp/redis.gz" -C "$PWD";

logger "Remove temp files for redis"
rm -R "$PWD/temp";

logger "Install redis"
cd "redis-5.0.5"
make
sudo cp "src/redis-server" /usr/local/bin/;
sudo cp "src/redis-cli" /usr/local/bin/;
cd $basicUrl

logger "TestBase preinstalation"
gnome-terminal -x sh -c ". ./start_redis.sh; bash"
logger "TestBase configurate"
cd ./test_application/
python3 db_presetting.py
cd $basicUr


#Continue
logger "Continue"
. ./stop_redis.sh
cd $basicUrl
deactivate

