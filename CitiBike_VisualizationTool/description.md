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
<img src="r[uta_de_la_imagen.jpg](https://github.com/gchipanap/Data-Science-Portfolio/blob/main/CitiBike_VisualizationTool/images/Screenshot%202024-03-25%20224742.png?raw=true)https://github.com/gchipanap/Data-Science-Portfolio/blob/main/CitiBike_VisualizationTool/images/Screenshot%202024-03-25%20224742.png?raw=true" alt="
Overview of the visualization tool's functionality." width="200" height="300">
