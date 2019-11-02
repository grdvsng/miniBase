from flask import (
	Flask,
	render_template,
	url_for,
	request as flaskRequest,
	jsonify
)


class FlaskGateway(Flask):

	flask = Flask(__name__)

	def __init__(self):
		self.config = self.flask.config
		self.run    = self.flask.run

	@flask.route("/")
	@flask.route("/index")
	def index():
		return render_template('index.html')

	@flask.route("/rest/api/getUsers")
	def search():
		return jsonify({"Name": "Gomer"});
