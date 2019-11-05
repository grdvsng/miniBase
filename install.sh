#!/bin/bash


redisUrl="http://download.redis.io/releases/redis-5.0.5.tar.gz";

if [ -f "$PWD/temp" ]; then
    rm -R "$PWD/temp";
fi

if [ -f "$PWD/redis-5.0.5" ]; then
    rm -R "$PWD/redis-5.0.5";
fi

timestamp=(`date`)
echo "$timestamp\nDownload and unpack...">> ./logs/install.log
sleep 5;

mkdir "$PWD/temp";
wget $redisUrl -O "$PWD/temp/redis.gz";
tar --extract -f "$PWD/temp/redis.gz" -C "$PWD";
rm -R "$PWD/temp";
clear;


echo "$timestampStart install redis...">>./logs/install.log
sleep 5;

cd "redis-5.0.5";
make;
sudo cp "src/redis-server" /usr/local/bin/;
sudo cp "src/redis-cli" /usr/local/bin/;
clear;


echo "$timestamp\nStartPresseting redis...">>../logs/install.log
sleep 5;

cd ..
gnome-terminal -- "start_redis.sh" && python3 "install_db_presetting.py"

echo "$timestamp\nContinue...">>./logs/install.log
sleep 5;