import requests
import json

class WienerLinienAPI:
    """Client for the Wiener Linien real-time API"""
    
    BASE_URL = "https://www.wienerlinien.at/ogd_realtime/monitor"
    
    def __init__(self):
        """Initialize the API client"""
        self.session = requests.Session()
    
    def get_station_monitor(self, station_id=None, line=None, platform=None):
        """
        Get real-time information for a specific station
        
        Args:
            station_id (str, optional): The ID of the station (RBL number)
            line (str, optional): Filter by line
            platform (str, optional): Filter by platform/steig
            
        Returns:
            dict: The API response as a dictionary
        """
        params = {}
        
        if station_id:
            params['rbl'] = station_id
        if line:
            params['line'] = line
        if platform:
            params['platform'] = platform
            
        response = self.session.get(self.BASE_URL, params=params)
        
        if response.status_code == 200:
            return response.json()
        else:
            response.raise_for_status()
    
    def get_station_by_name(self, station_name):
        """
        This is a placeholder method since the API doesn't directly support
        searching by name. In a real application, you would need to use
        the static data files to map names to IDs.
        
        For testing, we'll use some known station IDs:
        - Stephansplatz: 4652
        - Karlsplatz: 1359, 4910, 5664
        - Praterstern: 1516, 5767
        """
        test_stations = {
            "stephansplatz": "4652",
            "karlsplatz": "1359",
            "praterstern": "1516"
        }
        
        normalized_name = station_name.lower().strip()
        if normalized_name in test_stations:
            return self.get_station_monitor(test_stations[normalized_name])
        else:
            return {"error": f"Station '{station_name}' not found in test data"}
            
    def check_api_status(self):
        """
        Simple method to check if the API is accessible
        
        Returns:
            bool: True if the API is accessible, False otherwise
        """
        try:
            response = self.session.get(self.BASE_URL)
            return response.status_code == 200
        except requests.RequestException:
            return False


# Simple test if run directly
if __name__ == "__main__":
    api = WienerLinienAPI()
    print(f"API Status: {'Online' if api.check_api_status() else 'Offline'}")
    
    # Test with a known station ID
    station_id = "4652"  # Stephansplatz
    print(f"\nTesting with station ID: {station_id}")
    try:
        result = api.get_station_monitor(station_id)
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"Error: {e}")
