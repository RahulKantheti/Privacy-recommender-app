"""
File: tests.py
Programmer: [Keerthi Pendyala, Rahul Kantheti, Wasim Syed]
Copyright 2024 

Description:
This file contains unit tests for the Django application.

"""


from django.test import TestCase, Client
from django.urls import reverse
from unittest.mock import mock_open, patch
from .utils import rssi_to_distance, trilateration
import json

# Existing tests for utils.py functions
class UtilsTestCase(TestCase):
    def test_rssi_to_distance(self):
        # Test cases for rssi_to_distance
        self.assertAlmostEqual(rssi_to_distance(-50), 10 ** ((-59 + 50) / 20), places=5)
        self.assertAlmostEqual(rssi_to_distance(-70, n=2, rssi_tx=-59), 10 ** ((-59 + 70) / 20), places=5)

    def test_trilateration(self):
        # Test cases for trilateration
        pos1 = (0, 0)
        pos2 = (4, 0)
        pos3 = (0, 3)
        dist1 = 2
        dist2 = 2.236
        dist3 = 3.162

        expected_x, expected_y = (1.0, 2.0)  # Expected position
        result = trilateration(pos1, pos2, pos3, dist1, dist2, dist3)
        self.assertAlmostEqual(result[0], expected_x, places=5)
        self.assertAlmostEqual(result[1], expected_y, places=5)

# New tests for the location view
class LocationViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.location_url = reverse('location')  # Adjust if your view's URL name differs

    @patch('myapp.utils.rssi_to_distance')
    @patch('myapp.utils.trilateration')
    def test_location_success(self, mock_trilateration, mock_rssi_to_distance):
        mock_rssi_to_distance.side_effect = [2, 2.236, 3.162]
        mock_trilateration.return_value = (1.0, 2.0)

        data = json.dumps([
            {'rssi': -50},
            {'rssi': -60},
            {'rssi': -70}
        ])
        response = self.client.post(self.location_url, data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn("The users location is at coordinates: (1.0, 2.0)", response.content.decode())

    def test_location_invalid_json(self):
        data = 'Invalid JSON'
        response = self.client.post(self.location_url, data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        # Adjust the expected response based on actual error handling in your view
        self.assertIn("Invalid JSON format. Please check your input.", response.content.decode())

class LocationViewTests(TestCase):
    def setUp(self):
        # Set up the client to make requests
        self.client = Client()
        self.location_url = reverse('location')  # Assuming you have named your URL 'location'

    def test_post_valid_data(self):
        # Mocking the JSON data and the open function
        beacon_data = json.dumps({
            "beacon_locations": [
                {"beacon_name": "Beacon1", "x": 0, "y": 0},
                {"beacon_name": "Beacon2", "x": 10, "y": 0},
                {"beacon_name": "Beacon3", "x": 0, "y": 10}
            ]
        })
        sensors_data = json.dumps({"sensor_list": []})
        sensor_info_data = json.dumps({})

        with patch('builtins.open', mock_open(read_data=beacon_data)), \
             patch('json.load', side_effect=[json.loads(beacon_data), json.loads(sensors_data), json.loads(sensor_info_data)]):
            response = self.client.post(self.location_url, json.dumps({
                "beacons": [
                    {"name": "Beacon1", "rssi": -50},
                    {"name": "Beacon2", "rssi": -60},
                    {"name": "Beacon3", "rssi": -70}
                ],
                "phoneid": "phone123",
                "moving": True
            }), content_type='application/json')

            self.assertEqual(response.status_code, 200)
            response_data = json.loads(response.content)
            self.assertIn('sensors_in_range', response_data)
            self.assertIn('strategy_list', response_data)

    def test_post_invalid_json(self):
        # Test to ensure that invalid JSON results in a proper error message
        response = self.client.post(self.location_url, '{"beacons": "invalid"}', content_type='application/json')
        self.assertNotEqual(response.status_code, 200)

    def test_missing_beacon_data(self):
        # Test what happens if beacon data is missing or incomplete
        beacon_data = json.dumps({
            "beacon_locations": [
                {"beacon_name": "Beacon1", "x": 0, "y": 0}  # Only one beacon data
            ]
        })
        sensors_data = json.dumps({"sensor_list": []})

        with patch('builtins.open', mock_open(read_data=beacon_data)), \
             patch('json.load', side_effect=[json.loads(beacon_data), json.loads(sensors_data)]):
            response = self.client.post(self.location_url, json.dumps({
                "beacons": [
                    {"name": "Beacon1", "rssi": -50},
                    {"name": "Beacon2", "rssi": -60},
                    {"name": "Beacon3", "rssi": -70}
                ],
                "phoneid": "phone123",
                "moving": True
            }), content_type='application/json')
            self.assertEqual(response.status_code, 200)
            response_data = json.loads(response.content)
            self.assertEqual(response_data['sensors_in_range'], [])
            # Expect some handling of missing beacons in the actual view
    def test_invalid_beacon_names(self):
        """ Test the handling of non-existent beacon names in the request. """
        mock_beacon_data = json.dumps({
            "beacon_locations": [
                {"beacon_name": "Beacon1", "x": 0, "y": 0},
                {"beacon_name": "Beacon2", "x": 10, "y": 0}
            ]
        })
        with patch('builtins.open', mock_open(read_data=mock_beacon_data)), \
             patch('json.load', return_value=json.loads(mock_beacon_data)):
            response = self.client.post(self.location_url, json.dumps({
                "beacons": [
                    {"name": "NonExistentBeacon", "rssi": -50}
                ],
                "phoneid": "phone123",
                "moving": True
            }), content_type='application/json')
            self.assertEqual(response.status_code, 200)
            response_data = json.loads(response.content)
            self.assertIn("sensors_in_range", response_data)
# Additional tests for edge cases, different configurations, and error handling





