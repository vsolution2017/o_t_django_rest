import json
import datetime
import time

from app.serializers import PrecioRubroFechaSerializer


def get_array(value,key,_array):
    _array = json.loads(_array)
    for item in _array:
        item[key] = value
    return _array

def parse_str_fecha(fecha):
    return datetime.datetime.strptime(fecha, '%Y%m%d').date()








