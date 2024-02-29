from flask import Flask, render_template, request, jsonify
import pandas as pd
import json
import TranslateToHours as h
import sankey as sk
from flask import redirect
# import historydemand as hd
nombre_file_stations = 'static/data/estaciones.json'

# initialize flask application
app = Flask(__name__)

# READING DATA
def readData(ruta):
    df = pd.read_csv(ruta)
    return df

df = readData("static/data/archivo_combinado.csv")

@app.route("/")
def heatmap():
    return render_template('index.html')
@app.route("/history-dynamic")
def execute_dash_app():
    return redirect("http://127.0.0.1:8050/")
@app.route("/trayectorias")
def trayectorias():
    return render_template('trayectorias.html')
@app.route("/get-stations", methods=['POST', 'GET'])
def get_stations():
    global nombre_file_stations
    if request.method == 'POST':
        if 'viaje-tipos' in request.form:
            option = request.form['viaje-tipos']
            if option == "viajes-todo":
                year = request.form['anio']
                mes = request.form.get('mes')
                hora = request.form.get('hora')  # Obtener el valor del mes seleccionado (puede ser None)
                if mes:
                    if hora: 
                        nombre_file_stations = h.convert_csv_to_json(hora, f'static/data/{year}/{year}0{mes}-citibike-tripdata.csv')
                    else:
                        nombre_file_stations = f'static/data/{year}json/{year}{mes}.json'
                else:
                    nombre_file_stations = f'static/data/{year}json/{year}.json'
            elif option == "viajes-salida" or "viajes-llegada":
                year = request.form['anio']
                mes = request.form.get('mes')
                if mes:
                    nombre_file_stations = f'static/data/{year}json/{year}{mes}.json'
                else:
                    nombre_file_stations = f'static/data/{year}json/{year}.json'
                with open(nombre_file_stations) as fp:
                    json_data = json.load(fp)
                nombre_file_stations = process_json(json_data, option, year)
        return render_template('index.html')
    else:
        with open(nombre_file_stations) as fp:
            return json.load(fp)
@app.route("/sankey", methods=['POST', 'GET'])
def sankey():
    if request.method == 'POST':
        ids = request.form['estaciones-input']
        ids = ids.split(",")
        ids = [int(i) for i in ids]
        mes = request.form.get('mes')
        dia = request.form.get('dia')
        hora = request.form.get('hora')
        if(hora != 'opcion'):
            sk.generate_json1(ids,mes,dia,hora)
        else :
            sk.generate_json(ids, mes ,dia)
        return render_template('index.html')
    else:
        with open('static/data/output.json') as fp:
            return json.load(fp)
def process_json(json_data, option, year, month=None):
    processed_data = {}

    if option == "viajes-salida":
        for node_id, node_data in json_data.items():
            processed_data[node_id] = {
                "Longitude": node_data["Longitude"],
                "Latitude": node_data["Latitude"],
                "Nombre": node_data["Nombre"],
                "Nro. salidas": node_data["Nro. salidas"]
            }
    elif option == "viajes-llegada":
        for node_id, node_data in json_data.items():
            processed_data[node_id] = {
                "Longitude": node_data["Longitude"],
                "Latitude": node_data["Latitude"],
                "Nombre": node_data["Nombre"],
                "Nro. llegadas": node_data["Nro. llegadas"]
            }

    if month:
        file_name = f'{year}{month}{option}.json'
    else:
        file_name = f'{year}{option}.json'

    save_data_to_json(processed_data, file_name)

    return f'static/data/{file_name}'
def save_data_to_json(data, file_name):
    file_path = f'static/data/{file_name}'
    with open(file_path, 'w') as fp:
        json.dump(data, fp, indent=4)

if __name__ == "__main__":
    app.debug = True
    app.run()