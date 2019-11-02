from miniBase import Application


serverCfgPAth = "config.json"
logCfgPath    = "lib/log_config.json" # not require
app           = Application(serverCfgPAth, logCfgPath)

if __name__ == '__main__':
    FLASK_APP=app
    app.start()