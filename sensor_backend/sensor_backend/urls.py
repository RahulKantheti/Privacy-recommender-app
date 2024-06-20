"""
File: urls.py
Programmer: [Rahul Kantheti, Vidit Sanghvi]
Copyright 2024 

Description:
main Django urls to map location
"""
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('location.urls')),
]
