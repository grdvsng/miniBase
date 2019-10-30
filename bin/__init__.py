from flask import (
	Flask,
	render_template,
	url_for,
	request as flaskRequest
)

from os import path as osPath

"""

# Flask Config path
cfgPath = abspath('./bin/web/config.py')
app     = Flask(__name__)


@app.route("/")
@app.route("/index")
def main():
	print(abspath('./'))

	return render_template('index.html')

@app.route('/restapi/get/domain', methods=['GET'])
def getPerson():
	print(flaskRequest.url)

	return flaskRequest.url

if __name__ == '__main__':
	app.config.from_pyfile(cfgPath)
	app.run(host='127.0.1.1', port='8080')
"""

print(osPath.dirname(__file__))