from flask import (
	render_template,
	url_for,
	request as flaskRequest,
	jsonify
)

import json


def RequestHandler(miniBase):

	flask = miniBase.flask

	@flask.route("/")
	@flask.route("/index")
	def index():
		return render_template('index.html')

	@flask.route("/rest/api/pushUsers", methods=['POST'])
	def pushUsers():
		query = json.loads(flaskRequest.get_data())
		data  = miniBase.BaseConnector.query(**query)

		return jsonify(data)

	@flask.route("/rest/api/getUsers", methods=['POST'])
	def search():
		query = json.loads(flaskRequest.get_data())
		data  = miniBase.BaseConnector.query(**query)

		return jsonify(data)