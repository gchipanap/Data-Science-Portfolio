import csv
import json
from datetime import datetime

def convert_csv_to_json(hour, csv_path):
    hour = int(hour)
    hour_data = {}
    print(hour)
    # Leer el archivo CSV
    try:
        with open(csv_path, 'r') as csvfile:
            reader = csv.reader(csvfile)
            next(reader)  # Saltar la primera fila de encabezados si es necesario

            # Iterar sobre las filas del CSV
            for row in reader:
                # Obtener la hora de inicio del viaje
                start_time = datetime.strptime(row[1], '%m/%d/%Y %H:%M')
                trip_hour = start_time.hour

                # Verificar si la hora coincide
                if trip_hour == hour:
                    # Obtener los datos necesarios para el nodo JSON
                    start_station_id = row[3]
                    start_station_name = row[4]
                    start_station_latitude = float(row[5])
                    start_station_longitude = float(row[6])
                    end_station_id = row[7]
                    end_station_name = row[8]
                    end_station_latitude = float(row[9])
                    end_station_longitude = float(row[10])

                    # Comprobar si la estación de inicio ya existe y actualizarla
                    if start_station_id in hour_data:
                        hour_data[start_station_id]['Nro. salidas'] += 1
                    else:
                        hour_data[start_station_id] = {
                            'Longitude': start_station_longitude,
                            'Latitude': start_station_latitude,
                            'Nombre': start_station_name,
                            'Nro. salidas': 1,
                            'Nro. llegadas': 0,
                            'Porcentaje de salidas': '',
                            'Porcentaje de llegadas': ''
                        }

                    # Comprobar si la estación de destino ya existe y actualizarla
                    if end_station_id in hour_data:
                        hour_data[end_station_id]['Nro. llegadas'] += 1
                    else:
                        hour_data[end_station_id] = {
                            'Longitude': end_station_longitude,
                            'Latitude': end_station_latitude,
                            'Nombre': end_station_name,
                            'Nro. salidas': 0,
                            'Nro. llegadas': 1,
                            'Porcentaje de salidas': '',
                            'Porcentaje de llegadas': ''
                        }
                else:
                    print('No coinciden')

        for station in hour_data:
            nro_salidas = hour_data[station]['Nro. salidas']
            nro_llegadas = hour_data[station]['Nro. llegadas']
            total_viajes = nro_salidas + nro_llegadas

            if total_viajes > 0:
                salida_porcentaje = (nro_salidas / total_viajes) * 100
                llegada_porcentaje = (nro_llegadas / total_viajes) * 100
                hour_data[station]['Porcentaje de salidas'] = f'{salida_porcentaje:.2f}%'
                hour_data[station]['Porcentaje de llegadas'] = f'{llegada_porcentaje:.2f}%'
            else:
                hour_data[station]['Porcentaje de salidas'] = '0.00%'
                hour_data[station]['Porcentaje de llegadas'] = '0.00%'

        # Escribir los datos en un archivo JSON
        path = f'static/data/hour_{hour}.json'
        with open(f'static/data/hour_{hour}.json', 'w') as jsonfile:
            json.dump(hour_data, jsonfile, indent=4)
        return path
    except FileNotFoundError:
        print("No se encontró el archivo CSV.")
    except IOError:
        print("Error al abrir el archivo CSV.")
# # Llamar a la función con la hora deseada
# csv_path = '2015/201501-citibike-tripdata.csv'
# hour = 0  # Reemplaza 0 con la hora que desees obtener
# convert_csv_to_json(hour, csv_path)
