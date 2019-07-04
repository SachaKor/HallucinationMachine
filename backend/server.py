from flask import Flask, flash, request, redirect, url_for, session
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
import os
import json
import logging
import sys

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger('HELLO')

UPLOAD_FOLDER = './img'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# print('SYS PATH:', sys.path)
# sys.path.append('/anaconda3/envs/deep-dream/lib/python3.6/site-packages')

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/', methods=['GET', 'POST'])
# @cross_origin(headers=['Content-Type', 'application/json'])
def hello_world():
    if request.method == 'GET':
        resp = {
            "response": "Hello, GET"
        }
        return json.dumps(resp)
    elif request.method == 'POST':
        target = UPLOAD_FOLDER
        logger.info("welcome to upload")
        file = request.files['file']
        filename = secure_filename(file.filename)
        destination="/".join([target, filename])
        file.save(destination)
        session['uploadFilePath']=destination
        resp = {
            "response": "Something went perfectly fine"
        }
        return json.dumps(resp)

if __name__ == '__main__':
    app.secret_key = os.urandom(24)
    app.run(debug=True,host="0.0.0.0",use_reloader=False)

CORS(app, expose_headers='Authorization')
