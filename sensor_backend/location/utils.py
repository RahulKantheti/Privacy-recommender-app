"""
File: utils.py
Programmer: [Vidit Sanghvi]
Copyright 2024 

Description:
This file contains utility functions for performing calculations related to RSSI and trilateration.

"""

"""
    Convert received signal strength indicator (RSSI) to distance.

    Args:
        rssi_rx (float): Received signal strength indicator.
        n (int, optional): Path-loss exponent. Defaults to 2.
        rssi_tx (float, optional): RSSI of the transmitter. Defaults to -59.

    Returns:
        float: Calculated distance based on RSSI.
 """
def rssi_to_distance(rssi_rx, n=2, rssi_tx=-59):
    
    return 10 ** ((rssi_tx - rssi_rx) / (10 * n))


"""
    Perform trilateration based on the positions and distances from three reference points.

    Args:
        pos1 (tuple): Coordinates of the first reference point.
        pos2 (tuple): Coordinates of the second reference point.
        pos3 (tuple): Coordinates of the third reference point.
        dist1 (float): Distance from the first reference point.
        dist2 (float): Distance from the second reference point.
        dist3 (float): Distance from the third reference point.

    Returns:
        tuple: Coordinates of the estimated location.
"""
def trilateration(pos1, pos2, pos3, dist1, dist2, dist3):
    
    A = 2 * pos2[0] - 2 * pos1[0]
    B = 2 * pos2[1] - 2 * pos1[1]
    C = dist1**2 - dist2**2 - pos1[0]**2 - pos1[1]**2 + pos2[0]**2 + pos2[1]**2
    D = 2 * pos3[0] - 2 * pos2[0]
    E = 2 * pos3[1] - 2 * pos2[1]
    F = dist2**2 - dist3**2 - pos2[0]**2 - pos2[1]**2 + pos3[0]**2 + pos3[1]**2

    x = (C * E - F * B) / (E * A - B * D)
    y = (C * D - A * F) / (B * D - A * E)

    return (x, y)