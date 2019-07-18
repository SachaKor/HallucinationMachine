from flask import Flask, flash, request, redirect, url_for, session, send_file
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
import os
import json
import logging
import sys
import inception5h
import deepdream as dd

inception5h.maybe_download()

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger('DREAM')

os.environ['KMP_DUPLICATE_LIB_OK']='True' # for matplotlib

UPLOAD_FOLDER = './img'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def dream(layer):
    dd.dream('img/image.jpg', layer)


@app.route('/dream', methods=['POST'])
# @cross_origin(headers=['Content-Type', 'application/json'])
def hello_world():
    # layers contain the layers and the feature channels to amplify
    print('FORM:', request.form)
    layer = request.form.get('layer')
    logger.info('layer: %s', layer)
    layer = json.loads(layer)
    target = UPLOAD_FOLDER
    logger.info("uploading the image")
    # the file contains the image to process
    file = request.files['file']
    filename = secure_filename(file.filename)
    destination="/".join([target, filename])
    file.save(destination)
    logger.info('image uploaded')
    session['uploadFilePath']=destination
    logger.info('processing the image')
    dream(layer)
    logger.info('done')
    return send_file('img/deapdream_image.jpg', mimetype='image/jpg')

@app.route('/layers', methods=['GET'])
def get_layers():
    # dd.get_layers() returns a list containing the layer names and
    # the number of channels per layer, like:
    # [
    #     {
    #         'name': 'conv2d0:0',
    #         'nbChannels': 64,
    #     {
    #         'name': 'conv2d1:0',
    #         'nbChannels': 64
    #     }
    #     ...
    # ]
    layers = dd.get_layers()
    return json.dumps(layers)

if __name__ == '__main__':
    app.secret_key = os.urandom(24)
    app.run(debug=True,host="0.0.0.0",use_reloader=False)

CORS(app, expose_headers='Authorization')
