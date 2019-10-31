from miniBase import FlaskGateway


serverCfgPAth = "config.json"
logCfgPath    = "lib/log_config.json" # not require
app           = FlaskGateway(serverCfgPAth, logCfgPath)

if __name__ == '__main__':
    FLASK_APP=app
    app.start()