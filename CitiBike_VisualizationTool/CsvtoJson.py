import csv
import json

def generar_json(csv_file, json_file):
    estaciones = {}

    with open(csv_file, 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            start_station_id = row['start station id']
            end_station_id = row['end station id']
            start_station_name = row['start station name']
            start_station_latitude = float(row['start station latitude'])
            start_station_longitude = float(row['start station longitude'])
            end_station_name = row['end station name']
            end_station_latitude = float(row['end station latitude'])
            end_station_longitude = float(row['end station longitude'])

            if start_station_id not in estaciones:
                estaciones[start_station_id] = {
                    'Longitude': start_station_longitude,
                    'Latitude': start_station_latitude,
                    'Nombre': start_station_name,
                    'Nro. salidas': 1,
                    'Nro. llegadas': 0
                }
            else:
                estaciones[start_station_id]['Nro. salidas'] += 1

            if end_station_id not in estaciones:
                estaciones[end_station_id] = {
                    'Longitude': end_station_longitude,
                    'Latitude': end_station_latitude,
                    'Nombre': end_station_name,
                    'Nro. salidas': 0,
                    'Nro. llegadas': 1
                }
            else:
                estaciones[end_station_id]['Nro. llegadas'] += 1

    for estacion in estaciones.values():
        total_viajes = estacion['Nro. salidas'] + estacion['Nro. llegadas']
        estacion['Porcentaje de salidas'] = '{:.2f}%'.format(
            estacion['Nro. salidas'] / total_viajes * 100 if total_viajes > 0 else 0
        )
        estacion['Porcentaje de llegadas'] = '{:.2f}%'.format(
            estacion['Nro. llegadas'] / total_viajes * 100 if total_viajes > 0 else 0
        )
    estaciones = dict(sorted(estaciones.items(), key=lambda x: int(x[0]) if x[0] != 'NULL' else 0))
    with open(json_file, 'w') as file:
        json.dump(estaciones, file, indent=2)

# Uso del programa
csv_file = '2019/201910-citibike-tripdata.csv'
json_file = '201912.json'
generar_json(csv_file, json_file)
