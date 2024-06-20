"""
File: views.py
Programmer: [Rahul Kantheti, Vidit Sanghvi]
Copyright 2024 

Description:
This file contains views functions for performing calculations related to RSSI, trilateration and also CRUD calls for Admin to update JSON data.

"""
import math
import os
import time
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import utils
import json
current_directory = os.path.dirname(__file__)

# Create your views here.
@csrf_exempt
def location(request):
    """
    Handle POST requests to determine user location based on beacon signals.

    Args:
        request: The HTTP request object containing beacon signal data.

    Returns:
        HttpResponse: JSON response containing user location and sensor information.
    """
    user_position = None
    current_directory = os.path.dirname(__file__)
    # data = json.loads(request.body)
    # pass
    if request.method == 'POST':

        try:
            data = json.loads(request.body)
            # print(data)
            #trilateration from these 
            # data is always sorted
            
            json_file_path = os.path.join(current_directory, 'beacon.json')
            
            # Convert RSSI to distance for each beacon
            dist1 = utils.rssi_to_distance(data['beacons'][0]['rssi'])
            dist2 = utils.rssi_to_distance(data['beacons'][1]['rssi'])
            dist3 = utils.rssi_to_distance(data['beacons'][2]['rssi'])
            pos1=None
            pos2=None
            pos3=None

            # Extract beacon positions from JSON file
            with open(json_file_path, 'r') as json_file:
                beacons_data = json.load(json_file)
            for i in beacons_data["beacon_locations"]:
                if i["beacon_name"] == data['beacons'][0]['name']:
                    pos1 = (i['x'], i['y'])
                    break
            if pos1 is None:
                pos1 = (0, 0)  # Default value if beacon name not found

            for i in beacons_data["beacon_locations"]:
                if i["beacon_name"] == data['beacons'][1]['name']:
                    pos2 = (i['x'], i['y'])
                    break
            if pos2 is None:
                pos2 = (0, 0)  # Default value if beacon name not found

            for i in beacons_data["beacon_locations"]:
                if i["beacon_name"] == data['beacons'][2]['name']:
                    pos3 = (i['x'], i['y'])
                    break
            if pos3 is None:
                pos3 = (0, 0)  # Default value if beacon name not found
          
           # Perform trilateration to determine user position
            user_position = utils.trilateration(pos1, pos2, pos3, dist1, dist2, dist3)
           
            # Update sensors data with user's position
            json_file_path1 = os.path.join(current_directory, 'sensors.json')
            with open(json_file_path1, 'r+') as json_file:
                sensors_data = json.load(json_file)

            user_x, user_y = user_position
            new_entry = {
                "sensor_name": data['phoneid'],
                "sensor_id": "",
                "range": 10,
                "x": user_x,
                "y": user_y,
                "type": 2,
                "last_updated": int(time.time()),
                # Add any other data you need for the new entry
            }
            found=False
            sensors_in_range = []
            for sensor in sensors_data['sensor_list']:
                # check
                if sensor['sensor_name']==data['phoneid']:
                    index_to_delete = sensors_data['sensor_list'].index(sensor)
                    del sensors_data['sensor_list'][index_to_delete]
                    continue
                # check
                if sensor['type']==2 and int(time.time()) - sensor['last_updated'] >= 60:
                    index_to_delete = sensors_data['sensor_list'].index(sensor)
                    del sensors_data['sensor_list'][index_to_delete]
                    continue
                # update the sensor list with current calc mapped to generic phone type.
                sensor_x = sensor['x']
                sensor_y = sensor['y']
                distance = math.sqrt((sensor_x - user_x)**2 + (sensor_y - user_y)**2)

                
                if distance <= sensor['range']:
                    sensor1=sensor
                    sensor1['distance'] = distance
                    sensors_in_range.append(sensor1)
               
            sensors_data['sensor_list'].append(new_entry)

            # Write the updated JSON data back to the file
            with open(json_file_path1, 'w') as json_file:
                json.dump(sensors_data, json_file, indent=4)

            json_file_path2 = os.path.join(current_directory, 'sensor_info.json')
            with open(json_file_path2, 'r') as json_file:
                sensors_info = json.load(json_file)

            for sensor in sensors_in_range:
                sensor['sensor_info'] = sensors_info.get(sensor['sensor_name'], {})  # Using .get() to handle missing keys gracefully
                if(sensor['sensor_info']=={} and sensor['type']==2):
                    sensor['sensor_info']=sensors_info.get("generic",{})
                
            # iterate over sensor data and collect all moving and station sensors
            # Fetch sensor information and append it to sensors_in_range
            json_file_path3 = os.path.join(current_directory, 'mitigation_strategies.json')
            with open(json_file_path3, 'r') as json_file:
                strategies = json.load(json_file)
            
            print(data["moving"])
            if data['moving']==True:
                u_flag="moving"
            else:
                u_flag="not moving"
            s_flag=0
            for sensor in sensors_in_range:
                if s_flag!=0 and sensor['type']!=s_flag:
                    s_flag=3
                    break
                s_flag=sensor['type']
            s_boolean_flag=True
            strategy_list=[]
            if s_flag==1:
                s_flag="moving"
            elif s_flag==2:
                s_flag="not moving"
            else:
                s_boolean_flag=False
            for strategy in strategies['strategy-list']:
                if s_boolean_flag:
                    if s_flag==strategy['sensor_status'] and u_flag==strategy['user_status']:
                        strategy_list.append(strategy)
                else:
                    if u_flag==strategy['user_status']:
                        strategy_list.append(strategy)
            response_data = {
        'sensors_in_range': sensors_in_range,
        'strategy_list': strategy_list
            }
            response_json = json.dumps(response_data)

        except json.JSONDecodeError:
            print("Invalid JSON format. Please check your input.")
    return HttpResponse(response_json, content_type='application/json')

# Return the beacon data as JSON.

@csrf_exempt
def get_beacon_data(request):
    
    json_file_path = os.path.join(current_directory, 'beacon.json')
    try:
        with open(json_file_path, 'r') as file:
            data = json.load(file)
        return JsonResponse(data)
    except FileNotFoundError:
        return HttpResponse("Beacon data file not found.", status=404)

# Return the sensors data as JSON.
@csrf_exempt
def get_sensors_data(request):
    
    json_file_path = os.path.join(current_directory, 'sensors.json')
    try:
        with open(json_file_path, 'r') as file:
            data = json.load(file)
        return JsonResponse(data)
    except FileNotFoundError:
        return HttpResponse("Sensors data file not found.", status=404)

# Return the sensor info data as JSON.
@csrf_exempt
def get_sensor_info_data(request):
    
    json_file_path = os.path.join(current_directory, 'sensor_info.json')
    try:
        with open(json_file_path, 'r') as file:
            data = json.load(file)
        return JsonResponse(data)
    except FileNotFoundError:
        return HttpResponse("Sensor info data file not found.", status=404)
    
# Update a beacon entry in the 'beacon.json' file.    
def update_beacon_entry(request):
    
    current_directory = os.path.dirname(__file__)
    json_file_path = os.path.join(current_directory, 'beacon.json')
    if request.method == 'PUT':
        json_data = json.loads(request.body)
        try:
            with open(json_file_path, 'r+') as json_file:
                beacon_data = json.load(json_file)
                new_entry = {
                    "beacon_name": json_data['beacon_name'],
                    "x": json_data['x'],
                    "y": json_data['y']
                }
                beacon_data['beacon_locations'].append(new_entry)
                json_file.seek(0)
                json.dump(beacon_data, json_file, indent=4)
                json_file.truncate()
            return JsonResponse({"message": "Beacon entry updated successfully."})
        except FileNotFoundError:
            return JsonResponse({"error": "Beacon data file not found."}, status=404)
    else:
        return JsonResponse({"error": "PUT method required."}, status=400)
    
# Update a sensor entry in the 'sensors.json' file.
def update_sensor_entry(request):
    
    current_directory = os.path.dirname(__file__)
    json_file_path = os.path.join(current_directory, 'sensors.json')
    if request.method == 'PUT':
        json_data = json.loads(request.body)
        try:
            with open(json_file_path, 'r+') as json_file:
                sensors_data = json.load(json_file)
                new_entry = {
                    "sensor_name": json_data['sensor_name'],
                    "sensor_id": json_data['sensor_id'],
                    "range": json_data['range'],
                    "x": json_data['x'],
                    "y": json_data['y'],
                    "type": json_data['type'],
                    "last_updated": json_data['last_updated']
                }
                sensors_data['sensor_list'].append(new_entry)
                json_file.seek(0)
                json.dump(sensors_data, json_file, indent=4)
                json_file.truncate()
            return JsonResponse({"message": "Sensor entry updated successfully."})
        except FileNotFoundError:
            return JsonResponse({"error": "Sensors data file not found."}, status=404)
    else:
        return JsonResponse({"error": "PUT method required."}, status=400)
    
# Update a sensor info entry in the 'sensor_info.json' file.
def update_sensor_info_entry(request):
    
    current_directory = os.path.dirname(__file__)
    json_file_path = os.path.join(current_directory, 'sensor_info.json')
    if request.method == 'PUT':
        json_data = json.loads(request.body)
        try:
            with open(json_file_path, 'r+') as json_file:
                sensor_info_data = json.load(json_file)
                new_entry = {
                    json_data['sensor_name']: {
                        "sensing_range": json_data['sensing_range'],
                        "sensor_capabilities": json_data['sensor_capabilities'],
                        "activation": json_data['activation'],
                        "retention": json_data['retention'],
                        "storage_location": json_data['storage_location']
                    }
                }
                sensor_info_data.update(new_entry)
                json_file.seek(0)
                json.dump(sensor_info_data, json_file, indent=4)
                json_file.truncate()
            return JsonResponse({"message": "Sensor info entry updated successfully."})
        except FileNotFoundError:
            return JsonResponse({"error": "Sensor info data file not found."}, status=404)
    else:
        return JsonResponse({"error": "PUT method required."}, status=400)