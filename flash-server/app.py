from flask import Flask, render_template
import cv2
from PIL import Image
import numpy as np

app = Flask(__name__)

@app.route('/api', methods = ['POST'])
def api_message():
  if request.headers['Content-Type'] == 'application/octet-stream':
    nparr = np.fromstring(request.data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    im = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    im.save("static/images/test2.jpg")

@app.route("/")
def hello():
  return "Hello World!"

@app.route("/welcome")
def welcome():
  return render_template("welcome.html")

@app.errorhandler(404)
def page_not_found(error):
  """Custom 404 page."""
  return render_template('404.html'), 404

if __name__ == "__main__":
  port = int(os.environ.get("PORT", 5000))
  app.run(host='0.0.0.0', port=port)

