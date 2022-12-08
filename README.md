<p align="center">
    <img height="150px" src="https://github.com/hsu-aut/lion/blob/documentation/images/images/LiOn-Logo.png?raw=true">
</p>
<h1 align="center">LiOn</h1>
<h2 align="center">A Lightweight Industrial Ontology Support Tool</h2>
<br>

Creating ontologies manually is complicated, tedious and error-prone. Especially the task of creating lots of individuals can become cumbersome very quickly. 
This tool provides functionalities to create and manipulate RDF/OWL data according to Ontology Design Patterns (ODPs) based on industry standards (see links [here](https://github.com/hsu-aut/Industrial-Standard-Ontology-Design-Patterns)).
Currently, the TBoxes according to the following industry standards are supported:
- VDI 3682 (Formalized Process Descriptions) to model processes with their in- and output in a generic way.
- VDI 2206 (Structures of Mechatronic Systems) to model systems and their components.
- DIN EN 61360 (Data elements and data element types) to model properties in a generic way.
- WADL (Web Application Description Language) to model web services and the requests and responses they can handle.
- ISO 22400-2 (Key performance indicators for manufacturing operations management) to model KPIs for various aspects.
- ISA 88 (State machines) to model state machines for all kinds of systems.

This tool offers two basic functionalities: 
- Directly create RDF/OWL data within your triple store through a simple user interface 
- Export SPARQL INSERT templates that can be used by a Software developer to be executed in another application.

# Setup

## Requirements
In order to run LiOnS, you must have Node.js installed. Download it from https://nodejs.org/en/download/ and install it as per the instructions.

## Running LiOnS in development mode

1. Clone or download the repository in the directory of your choice.
2. Start your own instance of [GraphDB](https://www.ontotext.com/products/graphdb/). Open your browser and go to `http://localhost:7200`. Go to `"Setup" -> "Repositories" -> "Create new repository"`. Create a new repository called `testdb`. You can change this later on.
3. Optional: Start your own ECLASS database (deprecated, we recommend adding your own certificate to be able to access ECLASS's web service). If you really want to setup your own DB, see [this info](https://github.com/hsu-aut/lion#setup-custom-eclass-database).
4. Open a terminal in both `backend` and `frontend` folder. Of course you can open a terminal in you IDE (e.g. VS Code) so that you have the code and the terminal in one place.
5. In both terminal, execute `npm install` to install all npm dependencies
6. As soon as `npm install` finished, execute `npm run start:dev` in both shells to start both backend and frontend in develoment mode. 
7. Both backend and frontend should now be starting. They both run in an interactive mode, i.e., as soon as you save changes, they will recompile / restart.
8. Open your browser at `localhost:4200` if it isn't opened automatically.


## Running a release version
:construction: Documentation coming soon :construction:

## Using Docker
:construction: Documentation coming soon :construction:


# Additional infos:

## Setup custom ECLASS database

LiOnS enables an RDF Designer to model DIN EN 61360 properties in RDF with an eased interface. In order to use ecl@ss properties for this purpose in an efficient way, you will have to get a license for the ecl@ss database. Install a MySQL (see: `https://dev.mysql.com/downloads/installer/`) server and the MySQL Workbench (see: `https://www.mysql.com/products/workbench/`).

Set up a database called `eclass_basic_9_1_properties`. Download the ecl@ss content from `https://www.eclassdownload.com/catalog/index.php`. Get the table `eclass9_1_pr_en` for properties and `eclass9_1_un_en` for units of measures. Import them in the database with the names above. The SQL data base configuration should be as follows:
```
    "host": "127.0.0.1",
    "user": "root",
    "password": "123456",
    "database": "eclass_basic_9_1_properties"
```
The IP `127.0.0.1` is equivalent to `localhost`. If you would like to change this, open the file `lion_backEnd/bin/databaseConfig.json` and fill in your options.