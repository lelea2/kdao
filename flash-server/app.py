from flask import Flask, render_template
from PIL import Image
import numpy as np
import cStringIO as StringIO

app = Flask(__name__)

@app.route('/api', methods = ['POST'])
def api_message():
  if request.headers['Content-Type'] == 'application/octet-stream':
    stream = StringIO.StringIO(request.data)
    img = Image.open(stream)
    img = np.array(img)
    im = Image.fromarray(img)
    im.save("static/test2.jpg")

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

