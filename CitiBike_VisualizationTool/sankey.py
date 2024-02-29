import pandas as pd
import json

# Lee el archivo CSV


def generate_json(nodes_list, mes, dia):
    print("entre"+mes)
    # Selecciona manualmente los nodos A deseados   
    df = pd.read_csv('static/data/2018/2018'+mes+'-citibike-tripdata.csv')
    selected_nodes_A = nodes_list
    dia = int(dia)
    print(dia)
    # Filtra el DataFrame para obtener solo las filas con los nodos A
    filtered_df = df[df['start station id'].isin(selected_nodes_A)]
    filtered_df = filtered_df[pd.to_datetime(filtered_df['starttime']).dt.day == dia]
    print(filtered_df)
    # Obtiene la cuenta de ocurrencias de cada nodo en 'end station id' después del primer filtro
    end_station_counts_after_filter = filtered_df['end station id'].value_counts()

    # Filtra los nodos B que tengan más de 10 ocurrencias
    selected_nodes_B = end_station_counts_after_filter[end_station_counts_after_filter >= 1].index.tolist()

    # Filtra nuevamente el DataFrame 'filtered_df' para incluir solo los nodos B seleccionados
    filtered_df = filtered_df[filtered_df['end station id'].isin(selected_nodes_B)]
    # Crea un diccionario para almacenar los nodos y enlaces
    nodes = {}
    links = {}

    # Genera los nodos A con sus nombres
    node_counter_A = 0
    for start_node_id in selected_nodes_A:
        nodes[f"{start_node_id}A"] = node_counter_A
        node_counter_A += 1

    # Genera los nodos B con sus nombres
    node_counter_B = len(selected_nodes_A)
    for end_node_id in filtered_df['end station id'].unique():
        nodes[f"{end_node_id}B"] = node_counter_B
        node_counter_B += 1

    # Procesa los datos para obtener los enlaces (links) entre nodos A y B
    for index, row in filtered_df.iterrows():
        start_node_id = row['start station id']
        end_node_id = row['end station id']
        
        source = nodes[f"{start_node_id}A"]
        target = nodes[f"{end_node_id}B"]
        
        key = (source, target)
        links[key] = links.get(key, 0) + 1

    # Genera la lista de nodos A y B en el formato deseado
    node_list = [{"node": value, "name": key} for key, value in nodes.items()]

    # Crea la lista de enlaces en el formato deseado
    link_list = [{"source": key[0], "target": key[1], "value": value} for key, value in links.items()]

    # Genera el JSON final
    result = {"nodes": node_list, "links": link_list}

    # Guarda el JSON en un archivo
    output_file = 'static/data/output.json'
    with open(output_file, 'w') as f:
        json.dump(result, f, indent=2)

    print(f"JSON generado y guardado en {output_file}.")

def generate_json1(nodes_list, mes, dia, hour):
    print(hour)
    hour = int(hour) # Selecciona manualmente los nodos A deseados   
    df = pd.read_csv('static/data/2018/2018'+mes+'-citibike-tripdata.csv')
    
    selected_nodes_A = nodes_list
    print(selected_nodes_A)
    # Filtra el DataFrame para obtener solo las filas con los nodos A
    filtered_df = df[df['start station id'].isin(selected_nodes_A)]
    # print(filtered_df)
    filtered_df = filtered_df[pd.to_datetime(filtered_df['starttime']).dt.hour == hour]
    print(filtered_df[pd.to_datetime(filtered_df['starttime']).dt.hour == 0])
    # Obtiene la cuenta de ocurrencias de cada nodo en 'end station id' después del primer filtro
    end_station_counts_after_filter = filtered_df['end station id'].value_counts()

    # Filtra los nodos B que tengan más de 10 ocurrencias
    selected_nodes_B = end_station_counts_after_filter[end_station_counts_after_filter >= 1].index.tolist()

    # Filtra nuevamente el DataFrame 'filtered_df' para incluir solo los nodos B seleccionados
    filtered_df = filtered_df[filtered_df['end station id'].isin(selected_nodes_B)]
    # Crea un diccionario para almacenar los nodos y enlaces
    nodes = {}
    links = {}

    # Genera los nodos A con sus nombres
    node_counter_A = 0
    for start_node_id in selected_nodes_A:
        nodes[f"{start_node_id}A"] = node_counter_A
        node_counter_A += 1

    # Genera los nodos B con sus nombres
    node_counter_B = len(selected_nodes_A)
    for end_node_id in filtered_df['end station id'].unique():
        nodes[f"{end_node_id}B"] = node_counter_B
        node_counter_B += 1

    # Procesa los datos para obtener los enlaces (links) entre nodos A y B
    for index, row in filtered_df.iterrows():
        start_node_id = row['start station id']
        end_node_id = row['end station id']
        
        source = nodes[f"{start_node_id}A"]
        target = nodes[f"{end_node_id}B"]
        
        key = (source, target)
        links[key] = links.get(key, 0) + 1

    # Genera la lista de nodos A y B en el formato deseado
    node_list = [{"node": value, "name": key} for key, value in nodes.items()]

    # Crea la lista de enlaces en el formato deseado
    link_list = [{"source": key[0], "target": key[1], "value": value} for key, value in links.items()]

    # Genera el JSON final
    result = {"nodes": node_list, "links": link_list}

    # Guarda el JSON en un archivo
    output_file = 'static/data/output.json'
    with open(output_file, 'w') as f:
        json.dump(result, f, indent=2)

    print(f"JSON generado y guardado en {output_file}.")