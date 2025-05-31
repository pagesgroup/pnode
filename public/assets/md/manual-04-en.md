# Description
## Type plate
  
![Type-plate](assets/image/manual-type-plate-{{language}}-01.png)
  
The type plate is located on the control box.

## Exploded view of machine and main components
  
![Exploded-view-1](assets/image/manual-exploded-view-{{machine}}-01.png)

## Workplaces and operating areas

![Workplace-and-operating-areas-1](assets/image/manual-workplace-and-operating-areas-{{machine}}-01.png)

## Operation of the machine
{{#bmbmfbmm}}
The Polymac bailing machine is designed to form metal handles and assemble the handles onto a plastic pail. The assembled product is checked{{#stacker}} and stacked{{/stacker}}.  
{{/bmbmfbmm}}

A magazine is filled with staight metal wires. The wire is formed into a handle, optionally with a grip inserted over the wire, in several steps. Simultaneously there is a feed of plastic pails to the machine by conveyor. The pails move into the machine one by one and are correctly positioned for assembly. The formed handle is moved in position for assembly and attached to the pail. Correct attachment is checked, incorrect assembled products exit the machine through a dedicated output.{{#stacker}} Correct products are stacked and complete stacks exit the machine by a {{discharge}}.
{{/stacker}}

{{#iml}}
The Polymac in-mould labelling machine is designed to insert labels in the mould and take completely injection moulded pails (with handles, if applicable) out of the mould.  The pails can optionally be checked and stacked.  
  
Labels are placed manually in a magazine from which a label is picked up by the label gripper and placed accurately on a positioning plate. Another label gripper then picks up the label from the positioning plate and gives it to the robot that inserts it in the mould. A second parallel-running robot takes the injection moulded pail and handle out of the mould and gives it to a take-over unit. The pails are then placed on a transport system. The pail and handle are brought together and the handle is attached. The pails are stacked and transported out of the machine by a conveyor and placed on {{dischargeBelt}}.
{{/iml}}

### Schematic of the machine
  
![Machine-schematic-1](assets/image/manual-machine-schematic-{{machine}}-01.png)

## Machine specifications
### Dimensions
- **Machine**: {{machineTitle}}
- **Type**: {{machineType}}
- **Make year**: {{makeYear}}
- **Modem** _(yes/no)_: {{modem}} {{#iml}}
- **Camera inspection** _(yes/no)_: {{cameraInspection}} {{/iml}}
- **Belt height from ground** _(feed-through)_: {{beltHeight}} mm
- **Floor area** _(without belts)_:  {{width}} x {{depth}} mm
- **Maximum machine height**: {{height}} mm
- **Outfeed Roller Conveyor Length**: {{discharge}} {{dischargeLength}} mm

### Options
Set options

### Technical specifications
- **Cycle time**: {{cycleTime}}
- **Voltage/frequency**: {{voltageFrequency}}
- **Air consumption**: {{airConsumption}} 
- **Power consumption**: {{powerConsumption}} kWh (4.3 sec / cycle)
- **Noise level**: {{noiseLevel}} dB(A), peak {{noiseLevelPeak}} dB(A) at compressed air exhaust from pneumatic equipment*
- **Weight**: {{weight}} kg
- **Pneumatic connection**: Minimum {{airMinBar}} bar (maximum {{airMaxBar}} bar)
- **Control**: PLC control
- **Operating temperature**: 10°C - 40°C

'*' Information extracted from similar system.

### Products to be processed

Name
Shape
Dimension A (mm)
Dimension B (mm)
Height (mm)
Handle shape
Rod diameter (mm)
Rod length (mm)