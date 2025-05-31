# Description of the control screens
## Introduction
This chapter provides an overview of the various screens of the control panel, starting with the general (setting)screens.  
  
The associated procedures are described in Chapter 8, with reference to the relevant control windows below.

## General concepts
- **Unit**: The machine
- **Equipment module**: Modules in the machine (base plate, conveyor belt, centering, handle station, hydraulics, etc.)
- **Control module**: Small modules in the machine that are used multiple times. These are modules such as cylinders, lifts, and axes.
- **Activate**: Start moving a cylinder to the end position
- **Deactivate**: Start moving a cylinder to the start (rest position)
- **Start feedback**: Feedback sensor at the start of a cylinder stroke (Note: when the cylinder is in the rest/deactivated position) 
- **End feedback**: Feedback sensor at the end of  a cylinder stroke (Note: when the cylinder is in its activated position)
- **Unlocked**: No machine part is blocking the stroke of a cylinder, which is then unlocked
- **Activation time**: Time used when no end feedback is available. It provides a delay to give the cylinder enough time to reach its end position before the next step is started.
- **Deactivation time**: Time used when no start feedback is available. It provides a delay to give the cylinder enough time to reach its start position before the next step is started.
- **On/Off delay time**: Extra time to create a delay before a cylinder is activated/deactivated

## General screens
### Home screen
This screen is displayed when the machine's main switch is turned on.
  
![Hmi-screen-home-1](assets/image/manual-hmi-screen-home-{{machine}}-{{language}}-01.png)

General considerations: 
In the second line of the screen are the following buttons from left to right:
- The home button.
- The alarm button.
- The general information button.
- The recipe button.
- The HMI / PLC settings button.
- The information button

At the bottom of the screen, the ribbon contains the following buttons / text fields (left to right):
- User level button (Key).
- Date and time text field and information of the actual user level and recipe.
- Signal field semi-automatic is on.
- Signal field I/O test is on.
- Signal field automatic is on.

At the left side of the screen are the buttons for selecting the equipment modules. E.g. {{#bmbmfbmm}}Infeed, conveyorbelt, baseplate{{/bmbmfbmm}}{{#iml}}Label picker 1, Label robot, Product robot, Product take-over{{/iml}}, etc.

On the main screen itself there are various buttons / counters.{{#bmbmfbmm}}
- Machine settings button for adjustments of the machine.
- Pump on/off button.
- Machine cycle time
- Intrusion time
- Batch run settings (see §7.6.1.1)
- Temporary without IML
- Run Empty button.
- Settings for stack height{{/bmbmfbmm}}{{#iml}}
- Machine settings button for adjustments of the machine.
- Pump on/off button.
- Machine cycle time
- Intrusion time
- Batch run settings (see §7.6.1.1)
- Temporary without IML
- Run Empty button.
- Settings for stack height{{/iml}}

In the following sections, the function of these buttons, signal and counters are explained, starting with the ribbon at the top of the screen.

## Upper ribbon: Home, Alarm, General Info, Recipe, PLC Settings, Info
### Home button
![Hmi-button-home-1](assets/image/manual-hmi-button-home-01.png)  
With this button, one will return to the main screen. 

### The information button
![Hmi-button-information-1](assets/image/manual-hmi-button-information-01.png)  
Behind this button, general information about the display colors and buttons can be found. In the first tab you find information about the used colors and what the indication of these colors is.  
![Hmi-screen-information-tab-1-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-information-tab-1-01.png)  
The second tab explains the function of the main screen buttons.  
![Hmi-screen-information-tab-2-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-information-tab-2-01.png)  
The third tab explains the function of the general buttons on the main screen.  
![Hmi-screen-information-tab-3-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-information-tab-3-01.png)  
The fourth tab explains the function of the buttons from the control modules in the machine.  
![Hmi-screen-information-tab-4-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-information-tab-4-01.png)  
Tabs 5 and 6 are not in use.  
Tab 7 displays the version of the PLC and HMI software.

### The alarm button
Pushing this button will open the alarm screen.  
![Hmi-button-alarm-1](assets/image/manual-hmi-button-alarm-01.png)  
In this screen all actual alarms are shown.  
![Hmi-screen-alarm-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-alarm-01.png)  
The first column denotes the severity of the alarms:
- ![Hmi-icon-urgent-alarm-1](assets/image/manual-hmi-icon-urgent-alarm-01.png) Urgent alarm. Machine has stopped by an highest level error (Emergency button pressed, safety not OK)
- ![Hmi-icon-warning-1](assets/image/manual-hmi-icon-warning-01.png) Warning. Machine has an a failure with one of the components during production. The machine should be stopped to take away the failure.
- ![Hmi-icon-message-1](assets/image/manual-hmi-icon-message-01.png) Message. When a message is shown an operator action is needed soon to stay in run mode.
  
The second column denotes:
- ![Hmi-icon-alarm-still-active-1](assets/image/manual-hmi-icon-alarm-still-active-01.png) Alarm still active
- ![Hmi-icon-alarm-not-active-any-more-1](assets/image/manual-hmi-icon-alarm-not-active-any-more-01.png) Alarm is not active any more (= shown in the alarm history)
  
The third column “message” contains a description of the issue.  
  
When several alarms have occurred over a period of time, it is possible to filter the alarms with the filter dropdown box in the left bottom corner of this page.  
  
With the sliders it is possible to scroll through the alarms or obtain more information on the time when the error occurred.  
  
![Hmi-screen-alarms-sliders-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-alarm-slider-01.png)  
![Hmi-screen-alarms-sliders-2](assets/image/manual-hmi-screen-{{machine}}-{{language}}-alarm-slider-02.png)

### The general information button.
![Hmi-button-general-information-1](assets/image/manual-hmi-button-general-information-01.png)  
When you press the general information button, one of the following five screens will open:
- Safety overview
- I/O overview{{#iml}}
- Euromap{{/iml}}
- PackML-status
- Counters overview
- Module cycle times

It will always open with the last opened screen. The screens are explained in the following sections

#### Safety overview
![Hmi-button-safety-overview-1](assets/image/manual-hmi-button-safety-overview-01.png)
The screen shows basic information about the status of the Emergency stop, Doors, Main pressure valve, and the pilot air is shown in this screen.  

![Hmi-screen](assets/image/manual-hmi-screen-{{machine}}-{{language}}-safety-overview-01.png)  

{{#iml}}
#### Euromap overview
![Hmi-button-euromap-overview-1](assets/image/manual-hmi-button-euromap-overview-01.png)
This screen gives an overview of the Euromap signals.
  
![Hmi-screen-euromap-overview-1](assets/image/manual-hmi-screen-euromap-overview-01.png)  
{{/iml}}

#### IO overview
![Hmi-button-io-overview-1](assets/image/manual-hmi-button-io-overview-01.png)
This screen opens with a checkbox to allow the activation of the output signals. This is denoted by "!-Output test enabled-!". With the arrow signs one can navigate from one module to the next to view (and activate) the corresponding in- and outputs.  

![Hmi-screen-io-overview-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-io-overview-01.png)  
![Hmi-screen-io-overview-2](assets/image/manual-hmi-screen-{{machine}}-{{language}}-io-overview-02.png)

#### PackML-status
![Hmi-button-packml-status-1](assets/image/manual-hmi-button-packml-status-01.png)  
Push the button to jump to the equipment module state overview screen.  

![Hmi-screen-packml-status-1](assets/image/manual-hmi-screen-packml-status-01.png)  

The status of the PackML of the unit is shown in this screen. PackML is used to show the state the machine is. The most important states are:
- **Idle** = Machine is in IO Mode
- **Starting** = Machine is starting (Pails run out, cylinders are running to there start position, referencing engines.)
- **Execute** = Machine is running in auto mode / Semi Auto
- **Held** = Machine is in an Open door state
- **Stopped** = Machine is stopped
- **Aborted** = An safety issue occurred the machine is brought to a safe state until the safety is reset.

#### Overview counters
![Hmi-button-machine-counters-1](assets/image/manual-hmi-button-machine-counters-01.png)  

This screen gives an overview of the counters present in the machine.  

![Hmi-screen-machine-counters-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-machine-counters-01.png)

#### Module cycle times
![Hmi-button-module-cycle-times-1](assets/image/manual-hmi-button-module-cycle-times-01.png)  

This screen displays the cycle times of the individual modules as well as the complte machine.  

![Hmi-screen-module-cycle-times-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-module-cycle-times-01.png)  
  
The time is shown in milliseconds.

### The recipe button
When you press this button ![Hmi-button-recipe-1](assets/image/manual-hmi-button-recipe-01.png) the recipe screen will open.  
  
![Hmi-screen-recipe-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-recipe-01.png)  
  
The machine is producing with the actual recipe which is displayed on top of the screen. The actual recipe is selected by pushing the Load button behind the desired recipe. In every recipe are the adjustments for one product saved.  
  
To make a copy of the actual recipe uses the save as button.  
  
![Hmi-screen-recipe-save-as-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-recipe-save-as-01.png)  
  
Here you are able to save the actual active recipe to another Recipe number. You could also choose the active Recipe number if you would like to change the name from the active recipe.  
  
Loading and "Save As" of a recipe is only possible when the machine is stopped.

### The configuration button
When you press the configuration button ![Hmi-button-configuration-1](assets/image/manual-hmi-button-configuration-01.png) three screens will become available:
- Language selection screen.
- Equipment module state overview
- The general configuration screen
- The product tracking oerview

#### The language setting screen
![Hmi-button-language-setting-1](assets/image/manual-hmi-button-language-setting-01.png)  
  
![Hmi-screen-language-setting-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-language-setting-01.png)  
  
In this screen you can change the language on the screen.

#### The general configuration screen
![Hmi-button-general-configuration-1](assets/image/manual-hmi-button-general-configuration-01.png)  
  
In this screen you can configure the network, the display, date and time of the touch screen. For more information about this screen see the Rockwell documentation.  
  
![Hmi-screen-general-configuration-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-general-configuration-01.png)

#### The equipment module state overview
![Hmi-button-equipment-module-state-1](assets/image/manual-hmi-button-equipment-module-state-01.png)  
  
The PackML state and the status of the module is shown for every equipment module. This overview is mainly used for Service purposes.  
  
![Hmi-screen-equipment-module-state-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-equipment-module-state-01.png)

#### The product tracking overview
![Hmi-button-product-tracking-overview-1](assets/image/manual-hmi-button-product-tracking-overview-01.png)  
  
This screen is manily used for debugging and troubleshooting purposes.  
  
![Hmi-screen-product-tracking-overview-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-product-tracking-overview-01.png)

## Ribbon on the left: Machine settings and Equipment modules
### The machine settings
The main settings button on the main screen opens general information and settings (options) for the complete machine. One can scroll through the options by using the slider on the right hand of the screen. Some settings are only adjustable when the machine is stopped. If some settings are changed they can be saved by pushing the save button on top of the screen. Leaving this screen by pushing escape will result in loading the original settings again.  
  
![Hmi-screen-machine-settings-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-machine-settings-01.png)

#### Machine speed percentage
This setting allows one to modify the speed of the machine expressed in %.

##### Run mode
With this option you can deterine in which mode the machine will work.

![Hmi-screen-machine-settings-run-mode-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-machine-settings-run-mode-01.png)

- Normal: The system is running in normal mode.
- Transport: In this mode the products will pass through the machine (no handle fitting or stacking).
- Stacking: In this mode the products will pass through the machine and will be stacked (no handle fitting).
- Stacking with ear block: In this mode the products will pass through the machine, the eare blocks are operational (N1, N2), but no handle will be fitted. This mode is mainly used for service purposes.
- Handles: In this mode the machine will only produce handles
- Bleed hydraulic: Bleed the hydraulic system.

#### Remove products at start
The option allows one to select what to do with the products in the machine when one starts up the machine or changes the run mode. When "Remove products at start" is switched off ("No" = selected) the machine will not run empty while starting. This means the products that were in the machine should be at the exact same position as they were when the machine was stopped. The machine will always run empty when the Emergency button is pressed.

#### Buzzer
Enable/disable the buzzer.

#### Handle grip
Produces handles with or without handle grip.

#### Product type
Here the product type can be selected. The possible product types are: Round, Oval, and rectangular.

#### Dry cycle mode
Selection of this mode allows the machine to run without products in several run modes (see 7.5.1.2). It is mainly intended for testing/servicing purposes.

### Settings of the modules: general navigation
If you select an equipment module by pushing one of the equipment module buttons on the left side of the main screen, a screen is displayed with a picture of the chosen module. On top of the screen you see the equipment module you are working with.  
  
The following holds for all setting screens:
- Changing a setting will result in the machine immediately using this setting.
- If you leave this screen by pushing escape ![Hmi-button-escape-1](assets/image/manual-hmi-button-escape-01.png), the original settings are loaded again.
- If you leave this screen by pushing save ![Hmi-button-save-1](assets/image/manual-hmi-button-save-01.png), the changed settings are saved and used.
- If you leave this screen by pushing home ![Hmi-button-home-1](assets/image/manual-hmi-button-home-01.png), settings will be saved and the main screen opens.
- These symbols ![Hmi-symbol-command-disabled-1](assets/image/manual-hmi-symbol-command-disabled-01.png) are commands that can be enabled / disabled.
- These symbols ![Hmi-symbol-status-output-module-1](assets/image/manual-hmi-symbol-status-output-module-01.png) give status info from outputs / module state info.

In the following sections a number of such equipment modules are discussed

### Infeed conveyor
In this paragraph we use the equipment module "Infeed conveyor" for exampe.  
  
![Hmi-screen-module-infeed-conveyor-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-module-infeed-conveyor-01.png)  
  
At the side of the screen, several control module buttons belonging to the chosen equipment module, are displayed. Two control modules will be discussed: The axis infeed conveyor and C1 Infeed blockage up.

#### Axis infeed conveyor
![Hmi-button-single-axis-motor-settings-1](assets/image/manual-hmi-button-single-axis-motor-settings-01.png)  
  
In general a control module depicted with this pictogram is used for servo or frequency controlled motors. When you push this button the next settings screen is displayed.  
  
![Hmi-screen-{{machine}}-{{language}}-module-axis-infeed-conveyor-1](assets/image/manual-hmi-screen-bm-en-module-axis-infeed-conveyor-01.png)  
  
In this example there is one motor with two velocities. For each velocity, the travel distance, speed, acceleration and deceleration can be set.  
  
For the Status and I/O control of the module push the I/O button at the top of the screen ![Hmi-button-io-overview-1](assets/image/manual-hmi-button-io-overview-01.png)

The next screen will be displayed.  
  
![Hmi-screen-{{machine}}-{{language}}-module-axis-infeed-conveyor-io-overview-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-module-axis-infeed-conveyor-io-overview-01.png)

This screen is divided in three parts:
- A command part
- Information part
- A status part

If the machine is in IO test mode and the module is not in failure then it is possible to give commands to the axis. To start a move from the axis in IO Test mode following commands should be given:
1. Press "ON" (=Motor will be energized)
1. Press "Home" if this command is unlocked (= Motor will be referenced to its zero position)
1. Fill in the move number from the "Move"you would like to see (Move No: ??)
1. Now the Motor starts moving
1. Make the Move No zero again (now you could start the next move)

##### Settings Inputs/Outputs. E.g. C1 Infeed blockage up
![Hmi-button-input-output-valves-or-motors-1](assets/image/manual-hmi-button-input-output-valves-or-motors-01.png)  
  
In general, this type fo control module is used for valves and direct (on/off) motors. When you push this button, the next configuration screen is displayed. It is divided into three parts:
- A command part on the left
- An Input/Output part in the middle
- A status part (according to PackMl) on the right.

![Hmi-screen-{{machine}}-{{language}}-input-output-valves-or-motors-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-input-output-valves-or-motors-01.png)  
  
If the machine is in test mode and the module is not in failure then it is possible to give commands to the valve. Push the buttons activate, deactivate or pressure less to test the valve.  
  
In this example there is a valve without feedback sensors is used. This is denoted by the absence of inputs. For these type of sensors it is possible to set a delay time on activation/deactivation of the valve by pressing the settings button.  
  
![Hmi-screen-{{machine}}-{{language}}-input-output-valves-or-motors-2](assets/image/manual-hmi-screen-{{machine}}-{{language}}-input-output-valves-or-motors-02.png)  
  
In the case of a valve with feedback sensors, it is possible to set a time-out on the valve.

### Infeed conveyor
![Hmi-screen-{{machine}}-{{language}}-infeed-conveyor-settings-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-infeed-conveyor-settings-01.png)  
  
The conveyor tab contains three control modules: Axis31 conveyor, E1 Lift Handle fitting pos and SC Push out wrong product. As the control module of the conveyor is similar to the one of the infeed (see 7.4.1.1), only the lift and pusher will be discussed in this section.

#### E1 Lift Handle fitting pos
![Hmi-button-lift-handle-fitting-pos-1](assets/image/manual-hmi-button-lift-handle-fitting-pos-01.png)  
  
When you push this button, the next configuration screen is displayed. It is divided into three parts:
- A command part on the left
- An Input/Output part in the middle
- A status part on the right

![Hmi-screen-{{machine}}-{{language}}-lift-handle-fitting-pos-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-lift-handle-fitting-pos-01.png)  
  
By presing the settings button, one can set several timers associated with this lift.  
  
![Hmi-screen-{{machine}}-{{language}}-lift-handle-fitting-pos-settings-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-lift-handle-fitting-pos-settings-01.png)  
  
- The 'Time out' denotes the time in milliseconds that is allowed between activation of the lift and the input signal that the lift has reached its destination.
- 'Vacuum on time' denotes a wait time between switching the vacuum on and start moving up and moving down.
- 'Lift up time' denotes the time the lift needs to be in its upper position.
- 'Lift down time' denotes the time that is needed to run down with the lift before vacuum is switched off and blow off is started. When this time is set longer than the time the lift needs to reach the sensor at the down position, this timer is switched off and vacuum will be set off and blow off will be activated upon reaching this sensor.
- 'Blow-off time' indicates the length of time the vacuum is blown off.

### Centring
![Hmi-screen-{{machine}}-{{language}}-centring-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-centring-01.png)  
  
The centring tab contains one control module: Axis32 Centring. The button Centring again and Teach Camera are enabled when the machine runs in Semi Auto mode.  
  
**Centring again**: This button can be pressed when the machine has centred a product in Semi Auto mode. By pressing this button the pail will be centred again. This button is mainly used for service / debug purposed.  
  
**Teach Camera *Optional***: This button will be available when the machine runs in Semi Auto mode with the option CWL Detection “ON”. When there is a pail clamped under the centering unit, the Child Warning Label on the pail can be teached following the steps that will appear on the HMI Screen.  
  
**Centring settings**: These settings are important to centre the products on the right way. The following three settings could be set up here: Centing method, tamper evident input oriëntation and Tamper evident stacking orientation.  
  
![Hmi-screen-{{machine}}-{{language}}-centring-settings-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-centring-settings-01.png)  
  
**Centring method**: There are two options to centre the products. The two options are “Direct” and “Earblock”. Direct centring is only possible when the machine runs with Rectangular or Oval products. When this setting is selected the products are rotated to a position that is set up directly without searching a detection point on the pail. When the setting “Earblock” is selected centring the product is done by searching the Earblock. When it is found the centring disk rotates to the end position with an offset that is set up by the user/operator (see paragraph: 7.4.3.1).  
  
![Hmi-screen-{{machine}}-{{language}}-centring-settings-centring-method-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-centring-settings-centring-settings-centring-method-01.png)  
  
**Tamper evident input orientation**: This setting has two options. The two options are “Left”and “Right”. This setting is only visible when the machine is running with rectangualar or oval products. This setting is used to ensure that the tamper evident ends in the right position after centring. The user/operator should set up or the tamper evident is on the left or on the right when the pail runs into the machine.  
  
![Hmi-screen-{{machine}}-{{language}}-centring-settings-temper-evident-input-orientation-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-centring-settings-temper-evident-input-orientation-01.png)  
  
**Tamper evident stacking orientation**: This setting has two options. The two options are “Front” and “Rear”. This option should be selected by the user/operater to be sure the product ends with the tamper evident in the right direction after centring. This could be in the front or on the rear side depending on the customer wishes.  
  
![Hmi-screen-{{machine}}-{{language}}-centring-settings-temper-evident-stacking-orientation-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-centring-settings-temper-evident-stacking-orientation-01.png)  
  
**Centring camera check *Optional***: This setting has two options. The two options are “on” or “Off”. This option should be On when a product should be centred with a logo on the product that always should end on the same position after centring. When the option is On the camera checks a teached point on the product while he is centring, and when the teached point is found the product rotates to the correct end position.  
  
![Hmi-screen-{{machine}}-{{language}}-centring-settings-camera-check-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-centring-settings-camera-check-01.png)

#### Axis 32 Centring
When you push this button, the configuration screen of the centring function is displayed. It is divided into three parts:
- A command part on the left
- An Input/Output part in the middle
- A status part on the right

![Hmi-screen-{{machine}}-{{language}}-axis-32-centring-io-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-axis-32-centring-io-01.png)  
  
By activating the settings button, one enters the following screen.  
  
![Hmi-screen-{{machine}}-{{language}}-axis-32-centring-settings-1](assets/image/manual-hmi-screen-{{machine}}-{{language}}-axis-32-centring-settings-01.png)  
  
- The ‘**Zero position**’ is only used for centering Oval and Rectangular products. This is the position whereby the centering disk in line with the conveyor. Besides the position, the speed, acceleration and deceleration for this movement can be set.  
  
![Conveyor-graphic-1](assets/image/manual-conveyor-graphic-01.png)  
  
- The ‘**Search position**’ is a fixed position but the speed, acceleration and deceleration can be set. These are used during searching the teached point on the pail (Earlock, Tamper evident or Handle hole).
- The ‘**Search End position (calc)**’ is a fixed calculated end position value. This is the position the centring disks rotates to after finding the teached point. The speed, acceleration and deceleration that are used during this movement can be set.
- The ‘**Search End position offset (set)**’ is an offset value that is used to calculate the end position from move 3 after finding the teached position. Here only the distance setting is used.
- The ‘**Direct End position (calc)**’ is a fixed calculated end position value. This is the position where the centring disk moves to when “Direct centring” is selected and the machine is running Oval / Rectangular products. The speed, acceleration and deceleration that are used during this movement can be set.
- The ‘**Direct End position (set)**’ is an offset value that is used to calculate the end position from move 5 after finding the teached position. Here only the distance setting is used.

## Settings on main screen
#### Run Empty
![Hmi-button-{{language}}-run-empty-1](assets/image/manual-hmi-button-{{language}}-run-empty-01.png)  
  
Pushing this button will result in all products (pails, handles) being removed from the machine. When the machine is empty, a message will appear to stop the machine or disable “Run empty”. 

#### Open clamps
![Hmi-button-{{language}}-open-clamps-1](assets/image/manual-hmi-button-{{language}}-open-clamps-01.png)  
  
This will open all clamps that are clamping a handle in order to remove these handles. After pressing “Open clamps” always remove the handles falling out of the clamps otherwise it will cause damage on the machine.

#### Stacker
The stacker window on the main screen contains
- A button to reset the stacker counts. Resetting the stacker counts ensures the stacker will run empty.
- A counter denoting Actual stack height.
- A counter for setting Stack height 1.
- A counter for setting Stack height 2.