#!/usr/bin/env python
"""
Simple script to test the Wiener Linien API directly from the command line
"""

from api_client import WienerLinienAPI
import json
import sys

def main():
    """Test the Wiener Linien API with a simple command-line interface"""
    api = WienerLinienAPI()
    
    # Check API status
    print("Checking API status...")
    status = api.check_api_status()
    print(f"API Status: {'Online' if status else 'Offline'}")
    
    if not status:
        print("API is not accessible. Exiting.")
        sys.exit(1)
    
    # Test with a known station ID
    test_stations = {
        "1": {"name": "Stephansplatz", "id": "4652"},
        "2": {"name": "Karlsplatz", "id": "1359"},
        "3": {"name": "Praterstern", "id": "1516"}
    }
    
    print("\nAvailable test stations:")
    for key, station in test_stations.items():
        print(f"{key}. {station['name']} (ID: {station['id']})")
    
    choice = input("\nSelect a station (1-3) or enter a custom station ID: ")
    
    if choice in test_stations:
        station_id = test_stations[choice]["id"]
        station_name = test_stations[choice]["name"]
        print(f"\nFetching data for {station_name} (ID: {station_id})...")
    else:
        station_id = choice
        print(f"\nFetching data for station ID: {station_id}...")
    
    try:
        result = api.get_station_monitor(station_id)
        
        # Check if we have monitor data
        if not result.get("data") or not result["data"].get("monitors") or len(result["data"]["monitors"]) == 0:
            print("No data found for this station.")
            return
        
        # Display station name
        station_name = result["data"]["monitors"][0]["locationStop"]["properties"]["title"]
        print(f"\nStation: {station_name}")
        
        # Process each monitor (platform/steig)
        for monitor in result["data"]["monitors"]:
            platform_name = monitor["locationStop"]["properties"]["title"]
            print(f"\nPlatform: {platform_name}")
            
            # Process each line at this platform
            if monitor.get("lines") and len(monitor["lines"]) > 0:
                for line in monitor["lines"]:
                    print(f"\nLine: {line['name']} - Direction: {line['towards']}")
                    
                    # Process departures for this line
                    if line.get("departures") and line["departures"].get("departure"):
                        print("Departures:")
                        for departure in line["departures"]["departure"]:
                            # Format departure time
                            departure_time = "Unknown"
                            if departure.get("departureTime") and departure["departureTime"].get("timeReal"):
                                departure_time = departure["departureTime"]["timeReal"]
                            
                            # Calculate delay if available
                            delay_info = ""
                            if (departure.get("departureTime") and 
                                departure["departureTime"].get("timePlanned") and 
                                departure["departureTime"].get("timeReal")):
                                
                                planned = departure["departureTime"]["timePlanned"]
                                real = departure["departureTime"]["timeReal"]
                                print(f"  Time: {departure_time} (Planned: {planned}, Real: {real})")
                            else:
                                print(f"  Time: {departure_time}")
                    else:
                        print("No departures available.")
            else:
                print("No lines at this platform.")
    
    except Exception as e:
        print(f"Error: {e}")
        
    # Option to view raw JSON
    view_raw = input("\nView raw JSON response? (y/n): ")
    if view_raw.lower() == 'y':
        print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
