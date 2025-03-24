from flask import Flask, render_template, request, jsonify
from api_client import WienerLinienAPI

app = Flask(__name__)
api_client = WienerLinienAPI()

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/api/status')
def api_status():
    """Check if the Wiener Linien API is accessible"""
    status = api_client.check_api_status()
    return jsonify({"status": "online" if status else "offline"})

@app.route('/api/station')
def get_station():
    """Get real-time information for a station"""
    station_id = request.args.get('id')
    if not station_id:
        return jsonify({"error": "Station ID is required"}), 400
    
    try:
        data = api_client.get_station_monitor(station_id)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/search')
def search_station():
    """Search for a station by name (using test data)"""
    station_name = request.args.get('name')
    if not station_name:
        return jsonify({"error": "Station name is required"}), 400
    
    try:
        data = api_client.get_station_by_name(station_name)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
