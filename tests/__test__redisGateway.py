import unittest
import json

from time import time as timestamp
from os   import path as osPath
from sys  import path as sysPath

#Push all directory with test
sysPath.append(osPath.abspath(".."))
sysPath.append(osPath.abspath(osPath.join("..", "miniBase", "lib")))

from redisGateway import RedisGateway


configPAth = osPath.abspath(osPath.join("..", "miniBase", "config.json"))

with open(configPAth, "r") as file:
	config       = json.load(file)["base"]
	config["db"] = 1


class RedisGatewayTest(unittest.TestCase):

	def setUp(self):
		self.rg        = RedisGateway(config)
		self.testTable = {"bob": "bob@gmail.com"}

	def test_createTable(self):
		result = self.rg.createTable("users_name_mail", self.testTable)

		self.assertEqual(result, 0)

	def test_getTable(self):
		result = self.rg.getTable("users_name_mail")

		self.assertEqual(result, self.testTable)

	def test_pushInTable(self):
		result = self.rg.pushInTable("users_name_mail", "martin", "garrix@gmail.com")
		table  = self.rg.getTable("users_name_mail")

		self.assertIn("martin", table)

	def test_removeFromTable(self):
		result = self.rg.removeFromTable("users_name_mail", "martin")

		self.assertEqual(result, 0)

	def test_query(self):
		query  = {
		"tables": ["users_name_mail"],
		"method": "select",
		"params": "key == 'martin'"
		}
		result = self.rg.query(**query)

		self.assertEqual([['martin', 'garrix@gmail.com']], result)

	def test_removeTable(self):
		result = self.rg.removeTable("users_name_mail")

		self.assertEqual(result, 0)


unittest.main()

