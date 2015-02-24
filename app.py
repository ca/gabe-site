from flask import Flask, url_for, render_template
app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/projects/<name>')
def projects(name=None):
	return render_template(name+'.html')

@app.route('/resume')
def resume():
	return render_template('resume.html')

if __name__ == '__main__':
	# app.run()
    app.run(host='0.0.0.0', port=80)