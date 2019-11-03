from redis import *


class RedisGateway(Redis):

    def __init__(self, config):
        self.host = config["host"] if config["host"] else 'localhost'
        self.port = config["port"] if config["port"] else 6379
        self.db   = config["db"]   if config["db"] else 0

        super().__init__(host=self.host, port=self.port, db=self.db)


config = {
    "host": 'localhost',
    "port": 6379,
    "db":   0
}

r = RedisGateway(config)
r.set("aas", "1awdda")
print(r.get("aas"))