import pandas as pd
import pickle
import json
import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output

import plotly.express as px
import plotly.graph_objects as go

# read pickle plot df
plot_df = pd.read_pickle('citibike_plot_df.pkl')

plot_df_group = plot_df.groupby(['station_name']).first().reset_index()

fig2 = px.scatter_mapbox(data_frame=plot_df_group,
                            lat=plot_df_group['station_latitude'],
                            lon=plot_df_group['station_longitude'],
                            title='Citi Bike stations in NYC - Hover over them!',
                            zoom=11.6, 
                            width=550, 
                            height=700, #750
                            hover_name='station_name',
                            center={'lat': 40.72642, 'lon': -73.990},
                            labels={'station_latitude': 'latitude', 'station_longitude': 'longitude'})

fig2.update_layout(mapbox_style = 'carto-positron')               

available_stations = plot_df_group['station_name'].unique()

colors = {
    'background': '#EBEBEB', #'whitesmoke', #'#EBEBEB',
    'text': '#0F88C4',
    'prediction': '#F5B70A'
}

text_font = {'family':'sans serif'}

external_stylesheets = ['https://codepen.io/chriddyp/pen/bWLwgP.css']

app = dash.Dash(__name__, external_stylesheets=external_stylesheets)
server = app.server

app.layout = html.Div(style={'backgroundColor': 'white'}, children=[
    html.H1(children='Citi Bike Demand Forecaster',
        style={
            'textAlign': 'center',
            'color': 'white',
            'textfont': text_font['family'],
            'backgroundColor': '#4CAF50'
        }),
    
    html.Div([
        dcc.Dropdown(
            id='station_dropdown',
            options=[{'label': i, 'value': i} for i in available_stations],
            value='E 24 St & Park Ave S',
            style={'width': '100%', 'text-align': 'center'}
        ),
    ], 
        style={
            'width': '100%', 
            'float': 'center', #right #center
            #'display': 'inline-block',
            'padding': 0#,
            #'margin-left': 100
    }),

    html.Div([    
        html.Div([
            dcc.Graph(id='graph_id') 
        ],
            style={
                'color': colors['prediction'],
                #'backgroundColor': colors['background'],
                #'padding': 50,
                'display': 'inline-block',
                'width': '100%'#,
                #'height': 8000,
                #'vertical-align': 'top' #49%
        })
    ], style={'width': '100%', 'display': 'inline-block'}) #'height': 'auto'}), #'backgroundColor': 'whitesmoke', 

])

@app.callback(
    dash.dependencies.Output('graph_id', 'figure'),
    [dash.dependencies.Input('station_dropdown', 'value')])#,
def update_output(value):

    fig1 = px.line(plot_df[(plot_df.year < 2019) & 
                           (plot_df.station_name == value)], 
                    x='date', y='y', 
                    color='pred_vs_actual', 
                    color_discrete_sequence=['blue','orange'],
                    line_dash='pred_vs_actual',
                    line_dash_sequence=['solid', 'dot'])
    
    fig1.update_layout(title=f'Forecasted demand para {value} (2019):',
                   xaxis_title='Fecha',
                   yaxis_title='# of Trayectorias',
                   showlegend=False,
                   height=675) #720
    
    return fig1

@app.callback(
    dash.dependencies.Output('station_dropdown', 'value'),
    [dash.dependencies.Input('map_id', 'hoverData')])
def hover_value(value):
    return plot_df_group.iloc[value['points'][0]['pointIndex']]['station_name']
with open('available_stations.json', 'w') as f:
    json.dump(available_stations.tolist(), f)
if __name__ == '__main__':
    app.run_server(debug=True, host = '127.0.0.1')