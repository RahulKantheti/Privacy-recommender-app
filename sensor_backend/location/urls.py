"""
File: urls.py
Programmer: [Rahul Kantheti]
Copyright 2024 

Description:
This file contains URL patterns for the Django application.

"""
from django.urls import path
from . import views

urlpatterns = [
    path('location/', views.location, name='location' ),
    path('get_beacon_data/', views.get_beacon_data, name='get_beacon_data'),
    path('get_sensors_data/', views.get_sensors_data, name='get_sensors_data'),
    path('get_sensor_info_data/', views.get_sensor_info_data, name='get_sensor_info_data'),
    path('update_beacon_entry/', views.update_beacon_entry, name='update_beacon_entry'),
    path('update_sensor_entry/', views.update_sensor_entry, name='update_sensor_entry'),
    path('update_sensor_info_entry/', views.update_sensor_info_entry, name='update_sensor_info_entry')
]