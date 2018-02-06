# Knowledge Driven Monitoring and Orchestration System (KDMOS) for a Production Line

## Description of the Task
In this Task, a **knowledge-driven monitoring and orchestration system (KDMOS)** for an assembly line is built from scratch. The system is knowledge-driven, i.e. it uses either Knowledge base (OWL) to make decisions on operations. The operations may include, for example, decisions where the pallet should go next, what operations the robot should execute essentially mapping product needs and the production system capacity. The Knowledge base (KB) or Expert base (KB) also, for example, helps refining how to reach next destination in terms of the services that have to be invoked.

## Programming Environment
Language: JavaScript / nodeJs
IDE: Webstorm

## Physical Environment

<a href="https://drive.google.com/uc?export=view&id=1V7rXDKlPRdt0Ys3_nBNnIPnGuYmDiw1a"><img src="https://drive.google.com/uc?export=view&id=1V7rXDKlPRdt0Ys3_nBNnIPnGuYmDiw1a" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

The FASTory assembly line is used to assemble electronic devices. FASTory research environment is located in Tampere University of Technology, FAST-Lab., Finland. The FASTory line contains 10 identical workstations, which draw the main parts of three models of a mobile phone (WS 2-6 and 8-12). In addition, there is workstation, which is used to load raw materials (empty papers) and unload products (paper with mobile phone drawing) to/from pallets (WS 1). Finally, the twelfth workstation (WS7) is use for loading/ unloading pallets to the line

Before being called the FASTory line, the line was used for assembling real mobile phones. The pallets were equipped with a special jig for holding the mobile phones during the production process. See Figure 2. The line then was transformed for education and R&D
(research and development) purposes. The modification covered the pallets, end-effectors and sensors.

### Pneumatic System
The FASTory line requires an air pressure to work properly. The air pressure is used to actuate the track selector in the conveyor and the end effector in the robots. Thus, each work cell has a manual valve, pressure relief valve and solenoid valve

### Conveyors

Each workstation in the FASTory line consist of two conveyors; main and bypass. The main conveyor is used if the pallet requires service from the work cell. Meanwhile, the bypass is used if the work cell is in busy state (another pallet(s) [max 2 pallets] are in the cell) to bypass the pallet to the next work cell. 

There are five different types of zones. In each zone, there is one presence sensor that is used for detecting the pallet presence.
In addition, there is one stopper to stop the pallet when the conveyor is transferring other pallets. An RFID reader is located in each zone 1 for each workstation. This reader reads the pallet’s tags for identifying the entering pallet

### Robots

The factory line uses SONY SCARA robots for production. Each robot is represented as an RTU in the line. The robot has 4 DOF(X, Y, Z and Rz). The robot uses custom-made end-effector for grapping the pen. In this manner, a custom-made jig holds three different pens allowing the robot to pick the needed one

### Sensors

As highlighted in Conveyor Section, each zone in the conveyor has a presence magnetic proximity sensor to detect the presence of pallets.

### RFID Readers

In order to identify the pallets in the line, The FASTory line is equipped with RFID reader (in each Z1) that can read the attached tags beneath the pallets. The reading mechanism uses the RS-232 serial communication by the conveyor RTU.

### Actuators
In the FASTory line, there are two pneumatic actuators; stoppers and path selector. The stopper stops the pallet in each zone. Meanwhile, the path selector switches between main and bypass conveyors.

## Communication / Fastory RTU
The FASTory is equipped with INICO S1000 Remote Terminal Units (RTUs). INICO S1000 is a programmable RTU device, which offers process control capabilities, as well as a Web-based Human-Machine Interface (HMI), and it supports REST and DPWS Web Services. Each Robot and Conveyor is controlled by an RTU. The RTUs are connected to the FASTory local network 


----------------------------------------------------------------------------------------------------------------------------------------


# Solution

## System Vision
To develop a knowledge driven, monitoring and supervisory control system of the FASTory Line using knowledge base (OWL) to make operational decisions for carrying out the required tasks. The implementation of the system must be economically feasible and take the form of iterative and incremental development process following the **Unified Process methodology (UP)** in the following sequential steps; Inception, Elaboration, Construction, and Transition.

### Inception phase:
During the inception phase, a case for the system is established and the boundaries of the project scope is determined.
* **Analyze Project Requirement:** The requirements of the project is first studied.
* **Establish System Vision: The purpose:** justify strategic importance of new system
* **Prepare the Work Breakdown Structure:** WBS is subsequently prepared using a Top-Down approach using the scheduling tool Project Libre and the dependencies between the tasks are studied. Time required to carry out each task is studied and entered alongside each task. Key metrics such as Critical path, Slack time and Milestones are identified and a software generated Gantt chart is prepared
* **Initial Risk Assessment:** Risks involved with the project are identified and its technological feasibility (technological proficiency of group members), schedule feasibility (course workload for the semester).
* **Approximate Resource Utilization:** The tasks are allocated to various group members based on the results findings of the assessment in the previous step.
* **Estimate on Budget:** economic feasibility (Cost/benefit analysis) are studied. 

At the end of the inception phase is the first major project milestone: **the Project Objectives Milestone**. The project may be cancelled or considerably re-thought if it fails to pass this milestone.

### Elaboration Phase:
The primary goals of Elaboration are to address known risk factors and to establish and validate the system architecture.
* **Analyze Use Case models:** Prepare Use Case Models for the system
* **Finalizing Architecture:** The architecture of the system to be developed is finalized.12
* **Finalizing software requirements:** The integrated development environment for the system is agreed upon. In this case it was WebStorm, Jetbrains. Also, a basic pseudo code is designed
* **Finalizing the hardware requirements:** The hardware requirement for the project is next finalized. Most of it are them are available in the Fastory Line.
* **Analyzing Probability of Risk:** Based on the selected architecture, are finalized hardware and software a final risk assessment is carried out before moving to the next phase, i.e Construction.
* **Finalize Budget:** The budget for the project is finalized at the end of this stage. At the end of the elaboration phase is the second important project milestone, **the Project Architecture**. The project may be aborted or considerably re-thought if it fails
to pass this milestone.

### Construction Phase:
During the construction phase, all remaining components and application features are developed and integrated into the product, and all features are thoroughly tested.

* **Software development:** The software components of system is being constructed by using suitable web development tools and platforms. This part also involves development of different communication mediums which allows us to communicate between factory line with front end user interface.
* **Build user Interface:** This project part consists of building front-end UI and data retrieval implementation. The basic front-end UI will be built first and since it is an iterative activity. The modifications will happen later after inclusion of various operational features and experiencing different user experiences.
* **Introduce knowledge base:** The processing of data and building OWL Knowledge base will be completed in this phase. In order to develop a pre-knowledge based system an informative set of data collection is also included in this phase.
* **Prototype Testing:** It involves the testing and simulations of different software blocks on the Fastory Simulator.
* **Modification and debugging of Prototype:** Depending on the simulations and prototype testing results, some necessary modification to pre-developed prototype can be done in this span of time.
* **Project Deployment:** The software hardware integration and testing phase is planned for this phase. It includes several iterations since it is different to replicate the simulation results on hardware. Finding of the hardware constrains and implementation restrictions for full scale deployment is the major part of this phase. Other tasks include researching suitable methodology
for project integration and successful operational deployment.13
* **Project Output Assessment:** A detailed comparison between planned project proposal and achieved targets is carried out. This can be taken as an experience for future projects to avoid setting unrealistic or unclear goals.

At the end of the construction phase is the third major project milestone -**Initial Project Operational Capability Milestone**. At this point we decide if the project is ready to go operational, without exposing the it to high risks. This release is often called a “beta”
release.

### Transition Phase:
The purpose of the transition phase is to transition the software product to the user community.
* Detailed Analysis of beta version: The pre-release version is analyzed.
* Present Demo for user: A demo is presented to the user/customer.
* Analyze user feedback on Demo: Customer/User feedback is analyzed
* Make further correction / improvements: Any necessary corrections
stemming from user feedback is incorporated.
* Submit the final version: Final version is released/submitted. 

At the end of the transition phase is the fourth important project milestone, the **Product Release Milestone**

## UML Diagrams

### Deployment Diagram

<a href="https://drive.google.com/uc?export=view&id=13uVDgvBotSNP7BeOLaO-VpCc0exOnLAY"><img src="https://drive.google.com/uc?export=view&id=13uVDgvBotSNP7BeOLaO-VpCc0exOnLAY" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

### Class Diagram

<a href="https://drive.google.com/uc?export=view&id=1WmnXwgv1YDDihiXYGdKgXwqEZUMLXn1l"><img src="https://drive.google.com/uc?export=view&id=1WmnXwgv1YDDihiXYGdKgXwqEZUMLXn1l" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

### Use Case Diagram

<a href="https://drive.google.com/uc?export=view&id=1BjWC613F27eOFuaV7K2H-mfaPEk2QCXN"><img src="https://drive.google.com/uc?export=view&id=1BjWC613F27eOFuaV7K2H-mfaPEk2QCXN" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

### State Diagram

<a href="https://drive.google.com/uc?export=view&id=1pqljQ1qIKsgyZgrN_oXKDsu1yyZWrnOL"><img src="https://drive.google.com/uc?export=view&id=1pqljQ1qIKsgyZgrN_oXKDsu1yyZWrnOL" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

### Sequence Diagram

<a href="https://drive.google.com/uc?export=view&id=1mPiVwV2G95Rb7xcKz00FU4OUn0mvz-l-"><img src="https://drive.google.com/uc?export=view&id=1mPiVwV2G95Rb7xcKz00FU4OUn0mvz-l-" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

### Activity Diagram

<a href="https://drive.google.com/uc?export=view&id=19RmVqhN9-VBcXO6W7aRiW2UqONHKYQek-l-"><img src="https://drive.google.com/uc?export=view&id=19RmVqhN9-VBcXO6W7aRiW2UqONHKYQek" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

## Front End Development

<a href="https://drive.google.com/uc?export=view&id=1oT7rw3c9mQKmrl3sbpLjUiQ0gYEsRUgw"><img src="https://drive.google.com/uc?export=view&id=1oT7rw3c9mQKmrl3sbpLjUiQ0gYEsRUgw" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

### Features of the UI
* Uses Form Validation to not allow users to Place Order without entering vital information such as Name, Address and Phone number
* Uses CSS to remind user of the missing information.
* Enables User to enter multiple orders using the Add Order button
* Allows User to delete and order by ticking a check box and pressing the delete row button in case the user inputs an erroneous order.
* Shows a preview of the Order entered so far.

### How to place an Order
* Fill User details in the Name, Address and Phone number fields
* Select the Order Variant by the drop down menus
* Add multiple Orders using the Add row Button
* Delete any order if necessary by checking the box adjacent to the order and pressing the “delete order button”
* Press the send button to place the order


