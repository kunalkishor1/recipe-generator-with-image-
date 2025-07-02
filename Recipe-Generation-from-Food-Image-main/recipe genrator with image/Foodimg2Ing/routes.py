from flask import render_template ,url_for,flash,redirect,request
from Foodimg2Ing import app
from Foodimg2Ing.output import output
import os

# Create necessary directories if they don't exist
UPLOAD_FOLDER = os.path.join(app.root_path, 'static', 'images', 'demo_imgs')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/',methods=['GET'])
def home():
    return render_template('home.html')

@app.route('/about',methods=['GET'])
def about():
    return render_template('about.html')

@app.route('/',methods=['POST','GET'])
def predict():
    imagefile=request.files['imagefile']
    image_path = os.path.join(UPLOAD_FOLDER, imagefile.filename)
    imagefile.save(image_path)
    img = os.path.join('/images/demo_imgs', imagefile.filename).replace('\\', '/')
    title,ingredients,recipe = output(image_path)
    return render_template('predict.html',title=title,ingredients=ingredients,recipe=recipe,img=img)

@app.route('/<samplefoodname>')
def predictsample(samplefoodname):
    imagefile = os.path.join(app.root_path, 'static', 'images', f"{samplefoodname}.jpg")
    img = os.path.join('/images', f"{samplefoodname}.jpg").replace('\\', '/')
    title,ingredients,recipe = output(imagefile)
    return render_template('predict.html',title=title,ingredients=ingredients,recipe=recipe,img=img)