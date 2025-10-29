from flask import Flask, jsonify
from datetime import datetime

app = Flask(__name__)

@app.route('/time')
def get_time():
    # current time with 1 decimal place for tenths of a second
    now = datetime.now()
    time_str = now.strftime("%H:%M:%S") + f".{int(now.microsecond / 100000)}"
    return jsonify({"time": time_str})

@app.route('/')
def index():
    return send_file('index.html')
    
if __name__ == '__main__':
    # Run on localhost; Nginx will proxy to this (e.g., 127.0.0.1:5000)
    app.run(host='127.0.0.1', port=5000)
