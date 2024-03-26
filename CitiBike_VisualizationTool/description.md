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
