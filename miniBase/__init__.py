from flask import (
	Flask,
	render_template,
	url_for,
	request as flaskRequest
)

from os.path import dirname
from sys import path as sysPath

sysPath.append(dirname(__file__))
from lib import CoreHandler, osPath, getJsonContentFromFile # Application event handler(+log writer)


class FlaskGateway(Flask):

	baseDir = osPath.dirname(__file__)
	_config = {}

	def __init__(self, serverCfgPAth, logCfgPath):
		super().__init__(__name__)

		self._configPAth = osPath.join(self.baseDir, *osPath.split(serverCfgPAth))
		self.logParams   = osPath.join(self.baseDir, *osPath.split(logCfgPath))
		self.handler     = CoreHandler(self.logParams)
		self.jsonFiles   = [{
			"att": "_config",
			"path": self._configPAth
		}]

		self._initConfig()

	def _initConfig(self):
		self._setAttrsByJsonFiles()
		self.initBasicConfig()
		self.initContentConfig()

	def _setAttrsByJsonFiles(self):
		for item in self.jsonFiles:
			path    = item["path"]
			attName = item["att"]

			if not osPath.exists(path):
				self.handler("Main path not exists", "File: %s" % path, 0)
			else:
				self._setAttFromJsonFile(attName, path)

	def _setAttFromJsonFile(self, attName, jsonPath):
			try:
				self.__setattr__(attName, getJsonContentFromFile(jsonPath))
				self.handler("Attribute connected!", "Attribute: %s" % attName, 2)

			except:
				self.handler("Error on file parse.", "File: %s" % jsonPath, 0)

	def start(self):
		@self.route("/")
		@self.route("/index")
		def main():
			print(self.template_folder, 777)
			return render_template('index.html')

		self.handler("Server start running!", 2)
		self.run(**self._config["connection"])

	def initContentConfig(self):

		for k, p in self._config["files"].items():
			absPath = osPath.join(self.baseDir, *osPath.split(p))

			if not osPath.exists(absPath):
				self.__setattr__(k, absPath)
				self.handler("Template file not exists.", "File: %s" % absPath, 1)

			else:
				self.handler("Template file connected.", "File: %s" % absPath, 2)

	def initBasicConfig(self):
		self.config.update(**self._config["basic"])




