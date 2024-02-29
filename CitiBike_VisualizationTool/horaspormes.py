import pandas as pd
import json

# Leer el archivo CSV y almacenarlo en un DataFrame
df = pd.read_csv('2018/201810-citibike-tripdata.csv')

# Crear un diccionario para almacenar las estaciones y sus datos
estaciones_data = {}

# Iterar sobre cada fila del DataFrame y procesar los datos
for _, row in df.iterrows():
    start_station_id = row['start station id']
    end_station_id = row['end station id']
    start_time = pd.to_datetime(row['starttime']).hour
    end_time = pd.to_datetime(row['stoptime']).hour

    # Procesar la salida
    if start_station_id not in estaciones_data:
        estaciones_data[start_station_id] = {
            "Nombre": row['start station name'],
            "Nro. salidas": {str(i).zfill(2): 0 for i in range(24)},
            "Nro. llegadas": {str(i).zfill(2): 0 for i in range(24)}
        }
    estaciones_data[start_station_id]["Nro. salidas"][str(start_time).zfill(2)] += 1

    # Procesar la llegada
    if end_station_id not in estaciones_data:
        estaciones_data[end_station_id] = {
            "Nombre": row['end station name'],
            "Nro. salidas": {str(i).zfill(2): 0 for i in range(24)},
            "Nro. llegadas": {str(i).zfill(2): 0 for i in range(24)}
        }
    estaciones_data[end_station_id]["Nro. llegadas"][str(end_time).zfill(2)] += 1

# Crear el JSON con el formato deseado
json_data = json.dumps(estaciones_data, indent=4)

# Guardar el JSON en un archivo
with open('2018_10_hours.json', 'w') as file:
    file.write(json_data)
