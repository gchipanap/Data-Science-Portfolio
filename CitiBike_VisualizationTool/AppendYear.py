import json

def combine_json_files(file_paths, output_file_path):
    combined_data = {}

    # Iterar sobre cada archivo JSON y combinar los datos para cada nodo
    for file_path in file_paths:
        with open(file_path, 'r') as json_file:
            data = json.load(json_file)
            
            for node, values in data.items():
                if node in combined_data:
                    combined_data[node]["Nro. salidas"] += values["Nro. salidas"]
                    combined_data[node]["Nro. llegadas"] += values["Nro. llegadas"]
                else:
                    combined_data[node] = values

    # Calcular los nuevos porcentajes de salida y llegada para cada nodo
    for node, values in combined_data.items():
        total_salidas = values["Nro. salidas"]
        total_llegadas = values["Nro. llegadas"]
        total_viajes = total_salidas + total_llegadas

        values["Porcentaje de salidas"] = f"{(total_salidas / total_viajes) * 100:.2f}%"
        values["Porcentaje de llegadas"] = f"{(total_llegadas / total_viajes) * 100:.2f}%"

    # Guardar los resultados en un nuevo archivo JSON
    with open(output_file_path, 'w') as output_file:
        json.dump(combined_data, output_file, indent=4)

# Lista de rutas de archivos JSON
file_paths = ['201901.json', '201902.json', '201903.json', '201904.json', '201905.json', '201906.json', '201907.json', '201908.json', '201909.json', '201910.json', '201911.json', '201912.json']

# Ruta del archivo de salida
output_file_path = 'resultados.json'

# Llamar a la función para combinar los archivos JSON y generar los resultados
combine_json_files(file_paths, output_file_path)

print("Archivos JSON combinados exitosamente. Resultados guardados en 'resultados.json'.")
