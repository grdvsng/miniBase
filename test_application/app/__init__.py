from flask   import Flask
from os.path import dirname
from sys     import path as sysPath

sysPath.append(dirname(__file__))
from lib            import CoreHandler, osPath, getJsonContentFromFile, RedisGateway
from requestHandler import RequestHandler


class MiniBase(object):
	baseDir = osPath.dirname(__file__)
	_config = {}
	flask   = Flask(__name__)
	config  = flask.config
	run     = flask.run

	def __init__(self, serverCfgPAth, logCfgPath):
		RequestHandler(self)

		self._configPAth = osPath.join(self.baseDir, *osPath.split(serverCfgPAth))
		self.logParams   = osPath.join(self.baseDir, *osPath.split(logCfgPath))
		self.handler     = CoreHandler(self.logParams)
		self.jsonFiles   = [{
			"att": "_config",
			"path": self._configPAth
		}]

		self._initConfig()
		self._connectToBase()

	def _initConfig(self):
		self._setAttrsByJsonFiles()
		self.initBasicConfig()
		self.initContentConfig()

	def _connectToBase(self):
		if not self._config["base"]:
			self.handler("Base config not found...", "Server not stoped", 1)
		else:
			try:
				self.BaseConnector = RedisGateway(self._config["base"]);
				self.handler("Base connected!", "", 2)

			except:
				self.handler("Base server not availed!", "Critical error.", 0)

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
		self.handler("Server loading", "Server start running!", 2)
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