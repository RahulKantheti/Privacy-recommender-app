# SER-517_Team-27
Capstone Project of Group F-27 for Spring 2024

## Team members

Rahul Nanda Kantheti\
Sakshith Reddy Kasmola\
Keerthi Pendyala\
Wasim Ahamad Syed\
Vidit Sanghvi\

## Basic Overview
* Android App homepage and beacon detection
    * We have started on the home page, we are using react native via expo, this enables us to deploy our system on both IOS and Android devices.
    * Link for progress : Github
* Create a room map with a database model 
    * Room Table:
        * roomId (Primary Key): Unique identifier for each room.
        * roomName: Name or identifier for the room.
        * roomSizeX: Dimensions of the room along the X-axis.
        * roomSizeY: Dimensions of the room along the Y-axis.
    * Sensor Table:
        * sensorId (Primary Key): Unique identifier for each sensor.
        * sensorName: Name or identifier for the sensor.
        * roomId (Foreign Key): Linking the sensor to a specific room.
        * sensedDataStorageRetention: Retention period for sensed data storage.
        * sensedRange: Range of the sensor.
        * sensedDataType: Type of sensed data.
        * sensedDataPurpose: Purpose or context of the sensed data.
        * sensedDataAccess: Access control for the sensed data.
    * Bluetooth Beacon Table:
        * beaconId: Unique identifier for each bluetooth beacon.
        * beaconName: Name or identifier for the bluetooth beacon.
        * sensorId: Foreign key linking the bluetooth beacon to a specific sensor.
        * beaconLocationX and beaconLocationY: Coordinates of the bluetooth beacon in the room.
    * Strategy Table:
        * id (Primary Key): Unique identifier for each strategy.
        * msg: Message describing the strategy.
        * user_status: User status associated with the strategy.
        * sensor_status: Sensor status associated with the strategy.
    * Device Table:
        * deviceName (Primary Key): Name of the device.
        * sensing_range: Range of the device.
        * sensor_capabilities: List of capabilities of the device (e.g., Audio, Video).
        * activation: Activation status of the device.
        * retention: Retention period for data stored by the device.
        * storage_location: Locations where data from the device is stored (e.g., Local device, Cloud storage).
* Map the user's location
    * We will use the received signal strength information (RSSI) to estimate the distance between the phone and each beacon.
    * We will use the Free Space Path Loss (FSPL) model, which is a basic model to estimate the distance based on RSSI. distance = 10 ^ ((TxPower - RSSI) / (10 * n))
* Sensor proximity logic
    * We will use the trilateration method, which is using distance between the user and each beacon. 
    * The downside to this method is that we need a minimum of 3 beacons for the user's exact X and Y coordinates.
* Display privacy alerts and preemptive measures to user
    * These alerts can simply be sent via notifications on mobile devices. 
    * Preemptive measures are predefined actions users can do based on the sensor type and relevant research papers that we have gone through.
## Design and architecture

The project, "Privacy-related behavior recommendation for IoT sensors in our daily life," integrates front-end and back-end components to offer personalized privacy suggestions. The front-end mobile application, built with Expo React-Native, ensures simplified development and cross-platform compatibility, enhancing accessibility and efficiency. Users can authenticate and access sensor information and mitigation strategies through an intuitive interface. Utilizing sensors in IoT devices, the application dynamically adjusts recommendations based on user location and available sensors, improving relevance.

On the back end, Django powers data analysis and recommendation generation, leveraging stability, security, and scalability. It receives data from beacons, determines user location through triangulation, and retrieves nearby active devices to assess privacy hazards. Seamless communication between front-end and back-end components enables immediate and pertinent assistance to users in navigating privacy risks. The architecture prioritizes user-centricity, aiming to raise awareness of privacy risks in the IoT era through personalized recommendations and user-friendly interfaces.

![WhatsApp Image 2024-02-23 at 9 39 05 AM](https://github.com/skasmola/SER-517_Team-27/assets/112655036/741cfe69-ee55-4730-b626-1ee73c736b46)

## Demo Video Link:
https://drive.google.com/file/d/18pZo_IiJzKx_uJX-Tj9oe_QkmV8enBuz/view



