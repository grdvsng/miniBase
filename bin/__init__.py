import json
import warnings

from flask import (
	Flask,
	render_template,
	url_for,
	request as flaskRequest
)
from os import path as osPath
from datetime import datetime

class InnerApplicationError(Exception):
	pass


class InnerApplicationWarring(Warning):
	pass


class CoreError:
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


class CoreWarning:
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
		msg = "\n\tTitle:\t\t{0}\n\tDescription:\t{1}".format(self.title, self.message)

		warnings.warn(msg, InnerApplicationWarring)

		return msg


class CoreInfo:
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
		\nInformation:
			\n\tTitle: \t\t{0}
			\n\tDescription: \t{1}
		""".format(self.title, self.message)

		print(msg)

		return msg


class HTMLJsonGateway(object):

	def __init__(self):
		pass

	def generatProperty(self, propertyJson):
		propsStr = ""

		for k, v in propertyJson.items():
			propsStr += ' {0}="{1}" '.format(k, v)

		return propsStr

	def createElement(self, params):
		tag    = params["tag"]
		props  = self.generatProperty(params["property"]) if params["property"] else ""
		text   = params["innerText"] if params["innerText"] else ""
		items  = params["items"]
		parsed = "<{0}{1}>{2}".format(tag, props, text)

		if (items):
			for item in items:
				parsed += self.createElement(item)

		parsed += "</{0}>".format(tag)

		return parsed


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
	logName = "MiniBase Log File"
	handled = []
	log     = HTMLJsonGateway()
	logDeclare = {
		"tag": "html",

		"items": [{
			"tag": "head",

			"items": [{
				"tag": "style",
				"property": [{"type": "text/css",}],
				"innerText": """
					tr {
						border: 1px solid black
					}
				""",
			}, {
				"tag": "title",
				"innerText": logName
			}]
		}, {
			"tag": "body",

			"items": [{
				"tag": "tr",
				"items": [{
					"tag": "td",
					"innerText": "Title",
					"property": [{"class": "EventTitleHeader"}]
				}, {
					"tag": "td",
					"innerText": "Description",
					"property": [{"class": "EventDescriptionHeader"}]
				}, {
					"tag": "td",
					"innerText": "Time",
					"property": [{
                        "class": "EventTimeHeader"
                    }]
				}]
			}]
		}]
	}

	def __init__(self, logPath=None):
		self.logPath = logPath

		if (self.logPath):
			self._initLog()

	def _initLog(self):
		if not osPath.exists(self.logPath):
			content = self.log.createElement(self.logDeclare)

			with open(self.logPath, 'a+') as file:
				file.write(content)

	def handle(self, title, message, eventType=0):
		"""
		handle Event

		Parameters:
			title (string) - core event title
			message (string) - explanation of the event
			eventType (int=0) - index of event in self.events

		"""

		eventItem = self.events[eventType]
		event     = eventItem["_class"](title, message)

		self.handled.append(event)

		if self.logPath:
			self._appendNodeOnLogTable(eventItem.type, event.title, event.message)

		event()

	def _generateLogNode(self, event, title, description):
		return {
			"tag": "tr",
			"property": [{"class": event}],

			"items": [{
				"tag": "td",
				"innerText": title,
				"property": [{"class": "EventTitle"}]
			}, {
				"tag": "td",
				"innerText": description,
				"property": [{"class": "EventDescription"}]
			}, {
				"tag": "td",
				"innerText": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
				"property": [{"class": "EventTime"}]
			}]
		}

	def _appendNodeOnLogTable(self, event, title, description):
		el      = self._generateLogNode(event, title, description)
		content = self.log.createElement(el) + "<body></html>"

		with open(self.logPath, 'w') as file:
			doc = file.readAll().replace("</body>", "").replace("</html>", content)
			file.write(doc)

	def __call__(self, title, message, eventType=0):
		self.handle(title, message, eventType)


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
				self.handler("Main path not exists", "File: %s" % path, 0)

	def initConfig(self):
		pass


if __name__ == '__main__':
	FlaskGateway()




