from app import app

@app.route('/')
@app.route('/index')
def index():
    return "Hello, World!"

@app.route('/datasets/<dataset>')
def showDataHead(dataset):
    return dataset
