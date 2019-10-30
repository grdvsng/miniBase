"""
    Application Handler
    author: Trishkin Sergey

"""

import warnings
import json

from os       import path as osPath
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


class HTMLJsonGateway:

	def __init__(self):
		pass

	def generatProperty(self, propertyJson):
		propsStr = ""

		for k, v in propertyJson.items():
			propsStr += ' {0}="{1}"'.format(k, v)

		return propsStr

	def getJsonContentFromFile(self, path):
		with open(path, 'r') as file:
			content = json.load(file)

		return content

	def _listToStr(self, _list, separator="\n"):
		curstr = ''

		if isinstance(_list, str):
			return _list

		else:
			for n in _list:
				curstr += n + separator if _list.index(n) != len(_list) else ""

			return curstr


	def createElement(self, params):
		tag    = params["tag"]
		props  = self.generatProperty(params["property"]) if "property"  in params.keys() else ""
		text   = self._listToStr(params["innerText"])     if "innerText" in params.keys() else ""
		items  = params["items"]                          if "items"     in params.keys() else ""
		parsed = "\n<{0}{1}>\n\t{2}".format(tag, props, text)

		if (items):
			for item in items:
				parsed += self.createElement(item)

		parsed += "\n</{0}>".format(tag)

		return parsed


class CoreHandler:
	footerTags = [
		"</html>",
		"</body>",
		"</table>",
		"</tbody>",
	]

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

	def __init__(self, logParamsPath):
		self.handled = []
		self.baseDir = osPath.dirname(__file__)

		if logParamsPath:
			self._initLog(logParamsPath)

	def _initLog(self, logParamsPath):

		if osPath.exists(logParamsPath):
			self.log       = HTMLJsonGateway()
			self.logParams = self.log.getJsonContentFromFile(logParamsPath)
			self.logPath   = osPath.join(self.baseDir, *osPath.split(self.logParams["path"]))

			self._generateLogFile()

	def _generateLogFile(self):
		if not osPath.exists(self.logPath):
			content = self.log.createElement(self.logParams["page"])

			with open(self.logPath, 'a+') as file: file.write(content)

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
			self._appendNodeOnLogTable(eventItem["type"], event.title, event.message)

		event()

	def _generateLogNode(self, event, title, description):
		return {
			"tag": "tr",
			"property": {"class": event},

			"items": [{
				"tag": "td",
				"innerText": title,
				"property": {
					"class": "EventTitle",
					"title": event
				}
			}, {
				"tag": "td",
				"innerText": description,
				"property": {"class": "EventDescription"}
			}, {
				"tag": "td",
				"innerText": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
				"property": {"class": "EventTime"}
			}, {
				"tag": "td",
				"innerText": event,
				"property": {"class": "EventType"}
			}]
		}
	def _FooterModify(self, content, mode='clear'):
		for tag in self.footerTags:

			if mode == 'clear':
				content = content.replace(tag, "")

			else:
				content += tag

		return content

	def _appendNodeOnLogTable(self, event, title, description):
		el      = self._generateLogNode(event, title, description)
		content = self.log.createElement(el)

		with open(self.logPath, 'r+') as file:
			doc = self._FooterModify(file.read(), 'clear') + content

		with open(self.logPath, 'w') as file: file.write("%s%s" % (doc,  self._FooterModify("", "")))

	def __call__(self, title, message, eventType=0):
		self.handle(title, message, eventType)