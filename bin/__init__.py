from flask import (
	Flask,
	render_template,
	url_for,
	request as flaskRequest
)
from os import path as osPath
from sys import path as sysPath

sysPath.append(osPath.dirname(__file__))
from handler import * # Application Handler + LogWriter


class FlaskGateway(Flask):

	baseDir   = osPath.dirname(__file__)
	_config   = osPath.join(baseDir, "web", "config.json")
	logParams = osPath.join(baseDir, "logparams.json")
	handler   = CoreHandler(logParams)
	mainFiles = [
		_config
	]

	def __init__(self):
		super().__init__(__name__)

		self.handler("Start running", "File: %s" % path, 2)
		self.onStart()
		self.initConfig()

	def onStart(self):
		for path in self.mainFiles:
			if not osPath.exists(path):
				self.handler("Main path not exists", "File: %s" % path, 0)
			else:
				self.handler("File connected!", "File: %s" % path, 2)

	def initConfig(self):
		pass

if __name__ == '__main__':
	FlaskGateway()




