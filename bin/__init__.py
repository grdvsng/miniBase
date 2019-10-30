import json

from flask import (
	Flask,
	render_template,
	url_for,
	request as flaskRequest
)

from os import path as osPath


class InnerApplicationError(Exception):
	pass


class CoreError():
	"""
	Core Error event

	Attributes:
		title (string)- title of Error
		message (string) - explanation of the Error

	"""

	def __init__(self, title, message):
		self.title   = title
		self.message = message

	def __call__(self):
		raise InnerApplicationError(self.title, self.message)


class CoreWarning():
	"""
	Core Warning event

	Attributes:
		title (string)- title of warning
		message (string) - explanation of the warning

	"""

	def __init__(self, title, message):
		self.title   = title
		self.message = message

	def __call__(self):
		print(self.title, self.message)


class CoreInfo():
	"""
	Core Info event

	Attributes:
		title (string)- title of Info
		message (string) - explanation of the Info

	"""

	def __init__(self, title, message):
		self.title   = title
		self.message = message

	def __call__(self):
		msg = """
		\n"Information": {
			\n\t"Title":
				"\n\t\t{0}"
			\n\t"Description":
				"\n\t\t{0}\n"
		}""".format(self.title, self.message)

		print(msg)

		return msg


class CoreHandler():
	"""
	Handle application core event.

	"""

	events = [{
		"type": "Error",
		"_class": CoreError,
	}, {
		"type": "Warning",
		"_class": CoreWarning
	}, {
		"type": "Info",
		"_class": CoreInfo
	}]

	_log = []

	def __init__(self, logPath=None):
		self.logPath = logPath

	def handle(self, title, message, eventType=0):
		"""
		print Event s

		Parameters:
			title (string) - core event title
			message (string) - explanation of the event
			eventType (int=0) - index of event in self.events

		"""

		eventItem = self.events[eventType]
		event     = eventItem["_class"](title, message)

		self._log.append(event)

		if (self.logPath):
			self.appendEventInHTMLLogFile(event)

		event()

	def appendEventInHTMLLogFile(self, event):
		pass


class FlaskGateway(Flask):

	baseDir   = osPath.dirname(__file__)
	_config   = osPath.join(baseDir, "web", "config1.json")
	logPath   = osPath.join(baseDir, "log.html")
	handler   = CoreHandler(logPath)
	mainFiles = [
		_config
	]

	def __init__(self):
		super().__init__(__name__)

		self.onStart()
		self.initConfig()

	def onStart(self):
		for path in self.mainFiles:
			if not osPath.exists(path):
				self.handler.handle("Main path not exists", "File: %s" % path, 1)

	def initConfig(self):
		pass


if __name__ == '__main__':
	FlaskGateway()