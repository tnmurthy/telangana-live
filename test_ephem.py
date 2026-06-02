import ephem
import math
from datetime import datetime
try:
    dt = datetime.now()
    sun = ephem.Sun()
    sun.compute(dt)
    sun_lon = ephem.Ecliptic(sun).lon * 180.0 / math.pi
    print("Success:", sun_lon)
except Exception as e:
    print("Error:", repr(e))
