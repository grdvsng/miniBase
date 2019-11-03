#!/bin/bash

redisUrl="http://download.redis.io/releases/redis-5.0.5.tar.gz"

echo Download and unpack...                 > /dev/null
mkdir $PWD/temp                             > /dev/null
wget $redisUrl -O $PWD/temp/redis.gz        > /dev/null
tar --extract -f $PWD/temp/redis.gz -C $PWD > /dev/null
rm -R $PWD/temp                             > /dev/null

clear
echo Start install redis...
timeout 5



cd redis-5.0.5
make

#rm -R $PWD/temp

