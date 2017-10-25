import json



def get_array(value,key,_array):
    _array = json.loads(_array)
    for item in _array:
        item[key] = value
    return _array


"""
json_horas = json.loads('[{"fecha":"2017-10-24","hora_entrada":"10:10","hora_salida":"15:15"},{"fecha":"2017-10-25","hora_entrada":"08:08","hora_salida":"16:16"}]')
for key in json_horas:
    key["orden"] = 0
    #print(key)

print(json_horas)
"""

# print(get_array("2","orden_trabajo",'[{\"id\": 0}]'))