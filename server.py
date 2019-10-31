from miniBase import *


serverCfgPAth = "config.json"
logCfgPath    = "log_config.json" # not require
app           = FlaskGateway(serverCfgPAth, logCfgPath)

if __name__ == '__main__':
    FLASK_APP=app
    app.start()