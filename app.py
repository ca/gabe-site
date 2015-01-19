from flask import Flask, url_for, render_template, send_from_directory
app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/projects/<name>')
def projects(name=None):
	return render_template(name+'.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)