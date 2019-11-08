#!/bin/bash

redisUrl="http://download.redis.io/releases/redis-5.0.5.tar.gz";
logUrl="./logs/install.log"
basicFiles=("./temp" "./redis-5.0.5" "./venv")
basicUrl=$PWD

if ! [ -d "./logs/" ]; then
    mkdir "./logs/"
fi

logger()
{
    msg="
'user': '$USER'
'Time': '`date -u`'
'Event': '$1'
------------------------------------
"
    sleep 5

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
sudo cp "src/redis-server" /usr/local/bin/
sudo cp "src/redis-cli" /usr/local/bin/
sudo cp "src/redis-cli" /usr/local/bin/
cd $basicUrl

logger "TestBase preinstalation"

gnome-terminal -x sh -c "redis-server"

logger "TestBase configurate"
redis-cli HSET "users_name_mail" "admin" "grdvsng@gmail.com"
redis-cli shutdown


#Continue
logger "Continue"
cd $basicUrl
deactivate

