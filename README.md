# Event Chart Widget for Cumulocity [<img width="35" src="https://user-images.githubusercontent.com/32765455/211497905-561e9197-18b9-43d5-a023-071d3635f4eb.png"/>](https://github.com/SoftwareAG/cumulocity-event-chart-widget-plugin/releases/download/1.0.0-beta/event-chart-runtime-widget-1.0.0-beta.zip)

    
This Event Chart widget is the Cumulocity module federation plugin created using c8ycli. This plugin can be used in Application Builder or Cockpit.
The Event Chart widget help you to display the chart for the specific event type. It groups the events based on the entered group by parameter and displays the count for each group by the parameter value.


### Please note that this plugin is in currently under BETA mode.

### Please choose Event Chart release based on Cumulocity/Application builder version:

|APPLICATION BUILDER | CUMULOCITY  | EVENT CHART WIDGET |
|--------------------|-------------|--------------------|
| 2.x.x(coming soon) | >= 1016.x.x | 1.x.x              | 

  

The charts available include

  * Vertical Bar Chart

  * Horizontal Bar Chart

  * Donut Chart

  * Pie Chart

  * Radar Chart

  * Polar Chart

  * Stack Chart

  The widget also comes with an inbuilt color picker, which helps one to customize chart/border colors.
### Please choose Event Chart Widget release based on Cumulocity/Application builder version:

|APPLICATION BUILDER | CUMULOCITY | EVENT CHART WIDGET    |
|--------------------|------------|-----------------------|
| 1.3.x              | >= 1011.x.x| 2.x.x                 |
| 1.2.x              | 1010.x.x   | 1.x.x                 |  


![eventchart](https://user-images.githubusercontent.com/89508319/155273813-dbb310c6-78d4-49f6-b258-1fb7916e2c53.JPG)

    
## Features

*  **Support single device and group devices:** Based on widget configuration.
*  **Supports Event Chart:** It displays the Event chart for the selected Event Type and group by parameter in configuration.
*  **Supports Grouped charts and stack Charts:** Based on filter type selected in configuration.
*  **Supports different flavors charts:** Based on chart type field in configuration.

## Supported Cumulocity Environments:
  
*  **App Builder:** Tested with Cumulocity App Builder version 1.3.0   
   
## Installation

### Runtime Widget Deployment?

* This widget support runtime deployment. Download [Runtime Binary](https://github.com/SoftwareAG/cumulocity-event-chart-widget-plugin/releases/download/1.0.0-beta/event-chart-runtime-widget-1.0.0-beta.zip) and install via Administrations(Beta mode) --> Ecosystems --> Applications --> Packages.

**Prerequisites:**
  
* Git
  
* NodeJS (release builds are currently built with `v14.18.0`)
  
* NPM (Included with NodeJS)

**Instructions**

1. Clone the repository:
```
git clone https://github.com/SoftwareAG/cumulocity-event-chart-widget-plugin.git
```
2. Change directory:

  ```cd cumulocity-event-chart-widget-plugin```

3. run npm i command to install all library files specified in source code

  ```npm i ``` 

4. run npm run buildMinor command to create a binary file under dist folder

  ```npm run buildMinor ``` 

5. (Optional) Local development server:
  
  ```npm start```

6. Build the app:

  ```npm run build```

7. Deploy the app:
  ```npm run deploy```

## QuickStart

This guide will teach you how to add widget in your existing or new dashboard.

1. Open you application from App Switcher

2. Add new dashboard or navigate to existing dashboard

3. Click `Add Widget`

4. Search for `Event Chart`

5. Select `Target Assets or Devices`

7. Click `Save`

Congratulations! Event Chart is configured.


## User Guide

![EventChartConfig](https://user-images.githubusercontent.com/67993842/92461930-76bc1b00-f1e7-11ea-9ccd-08760d34487e.PNG)

1. Target Assets/Devices - deviceid/groupid of interest
2. Group By- provide the field name from the device managed object on which you want to group.
  For eg.
    * Set the value to Process if you want to group for each process 
    * Set the value to date if you want to see the result for each date.
    * set the value to time if you want to see the time chart.
3. Event Type - name of the event type for which you want chart.
  For eg.
    * c8y_ProcessStatusUpdate
    * s7y_BeaconLocationU
4. Legend - position of legend you want or you choose none if you don't want to see legend
5. Filter - provide the field name from event object, based on whose value the data will be filtered and will be displayed for each group selected in group by.
  For eg.
    * Set the value to classification if it is there in your event object. It will display the chart with different classsification for each group.
6. Chart Type - type of chart that you want to display.
  For eg.
    * Stack chart will work only if filter ffield value is set in configuration.
                
One can also select the custom chart color and Border color to beautify the chart, if not default colors will be picked.
  

------------------------------


This widget is provided as-is and without warranty or support. They do not constitute part of the Software AG product suite. Users are free to use, fork and modify them, subject to the license agreement. While Software AG welcomes contributions, we cannot guarantee to include every contribution in the master project.

_____________________


For more information you can Ask a Question in the [TECHcommunity Forums](https://tech.forums.softwareag.com/tags/c/forum/1/Cumulocity-IoT).


You can find additional information in the [Software AG TECHcommunity](https://tech.forums.softwareag.com/tag/Cumulocity-IoT).
