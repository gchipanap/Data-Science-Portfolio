import pandas as pd
import json
import matplotlib.pyplot as plt

# Leer el archivo CSV y almacenarlo en un DataFrame
df = pd.read_csv('2018/201801-citibike-tripdata.csv')

# Crear un diccionario para almacenar las estaciones y sus datos
estaciones_data = {}

# Iterar sobre cada fila del DataFrame y procesar los datos
for _, row in df.iterrows():
    start_station_id = row['start station id']
    end_station_id = row['end station id']
    start_day = pd.to_datetime(row['starttime']).day
    end_day = pd.to_datetime(row['stoptime']).day

    # Procesar la salida
    if start_station_id not in estaciones_data:
        estaciones_data[start_station_id] = {
            "Nombre": row['start station name'],
            "Nro. salidas": {str(i).zfill(2): 0 for i in range(1, 32)},  # Rango de 1 al 31 para los días
            "Nro. llegadas": {str(i).zfill(2): 0 for i in range(1, 32)}
        }
    estaciones_data[start_station_id]["Nro. salidas"][str(start_day).zfill(2)] += 1

    # Procesar la llegada
    if end_station_id not in estaciones_data:
        estaciones_data[end_station_id] = {
            "Nombre": row['end station name'],
            "Nro. salidas": {str(i).zfill(2): 0 for i in range(1, 32)},
            "Nro. llegadas": {str(i).zfill(2): 0 for i in range(1, 32)}
        }
    estaciones_data[end_station_id]["Nro. llegadas"][str(end_day).zfill(2)] += 1

# Crear el JSON con el formato deseado
json_data = json.dumps(estaciones_data, indent=4)

# Guardar el JSON en un archivo
with open('2018_01_dia.json', 'w') as file:
    file.write(json_data)

# Crear los histogramas
# for estacion_id, data in estaciones_data.items():
#     plt.bar(data['Nro. salidas'].keys(), data['Nro. salidas'].values(), alpha=0.5, label='Salidas')
#     plt.bar(data['Nro. llegadas'].keys(), data['Nro. llegadas'].values(), alpha=0.5, label='Llegadas')
#     plt.xlabel('Día')
#     plt.ylabel('Cantidad')
#     plt.title(f'Estación {estacion_id} - {data["Nombre"]}')
#     plt.legend()
#     plt.xticks(rotation=45)
#     plt.tight_layout()
#     plt.show()
