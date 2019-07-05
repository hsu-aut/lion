# Lightweight Industrial Ontology Support Tool

This tool implements necessary functionalities to create and manipulate RDF/OWL data to describe manufacturing related knowledge like Products, Processes and Resources, as well as their properties. Whereby this tool offers two basic functionalities: Directly creating RDF/OWL data within a triple store owned by the user, or exporting of SPARQL INSERT templates that can be used by a Software developer to be executed by an application in a given event.

As there is no release so far, only development mode is currently available. A more convenient set up will follow with the first release. Currently supported is the creation of RDF models with the following TBox (see also `https://github.com/ConstantinHildebrandt/Industrial-Standard-Ontology-Design-Patterns`):
- VDI 3682 (Formalized Process Descriptions)
- VDI 2206 (Structures of Mechatronic Systems)
- DIN EN 61360 (Data elements and data element types)
- WADL (Web Application Description Language)
- ISO 22400-2 (Key performance indicators for manufacturing operations management)
- ISA 88 (State machines)

## How to set up LiOnS in development mode

The set up includes setting up LiOnS (front and backend) in development mode in visual studio code, setting up GraphDB and a local SQL database for ecl@ss properties (optional).

### Clone/download the repository

Clone/download the repository in the directory of your choice.

### Install LiOnS dependencies

For the back end, open a terminal in visual studio code. Then, run the following commands:
```
cd lion_backEnd
npm install
```
For the front end, open a fresh terminal in visual studio code. Then, run the following commands:
```
cd lion_master
npm install
```

### Install GraphDB

LiOnS requires a local (or remote) graph database. Currently, only GraphDB (see: `http://graphdb.ontotext.com/`) is supported. Get yourself a local (or remote) access, by installing GraphDB on your device for instance.

After having installed GraphDB, you will have to enable CORS, as the front end currently sends HTTP requests to the DB. This will be done by the back end in the future. However, in order to enable CORS, click on `Settings...` in your GraphDB instance (not the Workbench). By default, GraphDB should run on port `http://localhost:7200`. Set the port to `7200`. Write in the text area the following command in order to enable CORS:
```
-Dgraphdb.workbench.cors.enable=true
```
Open your browser and go to `http://localhost:7200`. Go to `"Setup" -> "Repositories" -> "Create new repository"`. Create a new repository called `testdb`. You can change this later on.

### Install MySQL database with ecl@ss properties (optional)

LiOnS enables an RDF Designer to model DIN EN 61360 properties in RDF with an eased interface. In order to use ecl@ss properties for this purpose in an efficient way, you will have to get a license for the ecl@ss database. Install a MySQL (see: `https://dev.mysql.com/downloads/installer/`) server and the MySQL Workbench (see: `https://www.mysql.com/products/workbench/`).

Set up a database called `eclass_basic_9_1_properties`. Download the ecl@ss content from `https://www.eclassdownload.com/catalog/index.php`. Get the table `eclass9_1_pr_en` for properties and `eclass9_1_un_en` for units of measures. Import them in the database with the names above. The SQL data base configuration should be as follows:
```
    "host": "127.0.0.1",
    "user": "root",
    "password": "123456",
    "database": "eclass_basic_9_1_properties"
```
The IP `127.0.0.1` is equivalent to `localhost`. If you would like to change this, open the file `lion_backEnd/bin/databaseConfig.json` and fill in your options.

### Start LiOnS

To start LiOnS you will have to start the back end first:
```
cd lion_backEnd/bin
node lion_BE
``` 
If you have not installed a MySQL server with a configuration known to the back end, you will receive an error message. That does only affect the ecl@ss property search.
To start the front end, run the following commands in another terminal: 
```
cd lion_master
ng serve --proxy-config proxy.conf.json --open
``` 


