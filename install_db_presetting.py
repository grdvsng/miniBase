import json

from sys import path as sysPath
from os  import path as osPath

sysPath.append(osPath.join(osPath.abspath("."), "miniBase", "lib"))
from redisGateway import RedisGateway


class miniBaseSetupErrors(Exception):
    pass


configPath = osPath.abspath(osPath.join(".", "miniBase", "config.json"))

with open(configPath, "r") as file:
	config = json.load(file)["base"]

r = RedisGateway(config)
t = r.createTable("users_name_mail", {"admin": "admin@minibase.com"})

if t != 0:
    raise miniBaseSetupErrors("Table not created")
else:
    print("Presetting installed!")
