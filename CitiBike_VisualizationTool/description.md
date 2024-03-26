# Dynamic data visualization in the context of the City-bike system
## Introduction
Shared bicycle systems are services that promote a healthy lifestyle and provide a more agile and effective mobility alternative in urban areas. These systems consist of bicycle stations where users can pick up or drop off bicycles, and they can return a bicycle to a free dock at any other station. An example of these systems is City-bike, whose popularity and extensive usage generate high demand and pose challenges for management and informed decision-making for administrators.

To address this, administrators must be able to identify movement patterns, congestion, repetitive demand patterns at stations over time intervals, and flow volumes between stations. This becomes a challenge given the dynamic nature of the data collected in the City-bike dataset, the granularity of the data, and the periodicity of the time series.

In accordance with this context, the objective of this research project is to develop a prototype visualization tool that allows for granular exploration and understanding of the space-time dynamics of Citibike system stations according to the trips recorded in the dataset. The visualization techniques to be implemented in the tool must be able to show the spatial distribution of stations and their bike input and output demand at different time periods. It should also reveal repetitive patterns of City-bike system usage over the years. Additionally, the tool should allow for adjusting the granularity of the data to explore different levels of detail.

## Requeriments 

### Requirement 1: Interpretability
Discovery of multifaceted patterns and anomaly filtering. The system should create easy-to-understand designs to help users discover abnormal patterns and assist them in understanding "when and where, what could happen", with enriched spatiotemporal context.

### Requirement 2: Interactivity
Refers to administrators' participation in the information analysis process. Users should be able to provide their judgment during analysis and guide the system to produce refined analysis results in real-time.

### Requirement 3: Performance
The system must be capable of efficiently handling large volumes of data, ensuring fast processing and displaying user filter results.

### Requirement 4: Data Granularity
The visualization tool system must be able to adapt to and efficiently handle different levels of granularity present in the data to be visualized. It should allow users to explore and analyze information at various levels of detail.

## Architecture
The tool architecture includes the dataset module, which contains the information about the trips of the City-bike system, to be processed. Additionally, there is the time filter module, trip type filter (bike entry or exit), and filter for specific stations, ensuring that the user can interpret and interact with the data more effectively. To handle the large volume of data, .json files were used. To manage the large number of stations and compare them with each other, they were grouped using the Geo Clustering algorithm.

<img src="https://github.com/gchipanap/Data-Science-Portfolio/assets/64268942/65d1e470-d3fc-4786-8a9c-d7f4d102df92" alt="Overview of the visualization tool's functionality." width="400" height="500">


## Visualization and interaction

Information extraction tasks were designed to be useful for city-bike administrators. To do this, first, key features to be identified in the system were identified.

#### Task 1: Identify stations with high congestion in the shared bicycle system (Entries-Exits) over time.
#### Task 2: Identify groups of stations located in similar areas of the city, areas with high and low demand.
#### Task 3: Compare flow volumes from different stations over time to identify the temporal variation of flow volumes from a specific station as well as their dynamics.
#### Task 4: Identify seasonal patterns, revealing repetitive patterns that occur at regular intervals.

### User interface
The user interface was designed with different views according to the tasks previously formulated. The interface of the tool is shown in Figure 5.1. In Section 1, the time filters that can be applied to visualize trips are displayed, which also have a filter for trip type, entry, exit, or total trips taken. Then, we have the second section where we can observe, on the left, the heat map that maps the stations with a more intense red color as the number of trips taken to or from the station increases, and the shade decreases as the number of trips decreases, reaching a light yellow shade as the lowest. Consequently, the station with fewer trips. Finally, on the right, we have our bar charts. The first one shows the number of entries and exits per hour, and the second one shows the number of entries and exits based on days. This first interface fulfills Tasks 1 and 2 because it shows the stations with the highest congestion and also identifies groups of stations with high and low demand.
<img src="https://github.com/gchipanap/Data-Science-Portfolio/assets/64268942/3c00c9c7-6f43-4f23-a4f2-a411d61a16a4" alt="View 1" width="600" height="450">

Now we see the second view. In this one, we can select a specific station to then see a time series graph that shows the number of trips taken over an extended period. In this case, to be more specific, it shows the flow changes that occurred in the paths, displaying data from January 2015 to July 2018. This view perfectly fulfills Tasks 3 and 4 because it identifies the temporal variation that a specific station may have over time.
<img src="https://github.com/gchipanap/Data-Science-Portfolio/assets/64268942/c8da5b06-81e7-412d-84b5-1941622e25dd" alt="View 2" width="600" height="250">

Finally, we have the Trajectories interface, which is divided into two sections. The first one gives us the option to enter the ID of one or several stations, then it allows us to choose the month and the day to then display a graph where we can see, on the left, the ID of our origin station, and on the right, it shows the IDs of all the stations that were the destination of arrival. This section fulfills Task 1 as it shows us which stations have more congestion from a certain day, and in the second section, we observe our map just like in the previous points. We can use time filters to select a month and day on the map, where we will have a legend where each color refers to a specific location. This section groups the stations based on location and time, thus fulfilling Task 2.
<img src="https://github.com/gchipanap/Data-Science-Portfolio/assets/64268942/a897205f-d204-43d5-8faa-f562a8073ef0" alt="View 3" width="600" height="450">



