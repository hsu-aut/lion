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

## Setup ECLASS

LiOnS enables an RDF Designer to model DIN EN 61360 properties in RDF with an eased interface. ECLASS offers two options: Downloading full releases that can be hosted on your own SQL database or retrieving data from a webservice. Both options are supported by LiOnS and both options require some [license](`https://eclass.eu/en/eclass-standard/licenses).

### Setup ECLASS Webservice

In order to retrieve data from the ECLASS webservice, you need a valid certificate. The [ECLASS website](`https://eclass.eu/en/eclass-standard/licenses) explains how to get one. The certificate file (for example `xx-xx_Webservice.full.pfx`) has to be renamed to `eclass-webservice.pfx` and be placed inside the folder `backend/certificates`. 

### Setup CLASS MySQL database

Download an [ECLASS release](https://eclass.eu/shop/en/my-downloads). You will the properties and units table from an basic release. The filenames of those should look like this: `eClassxx_x_PR_xx.csv` `eClassxx_x_UN_xx.csv`, depending on the release and the language. 

Install [MySQL](https://dev.mysql.com/downloads/installer/). MySQL Server is the minimum, but installing MySQL Workbench will make the setup easier.

Set up a database called `eclass`. Create the tables `eclass_pr` for properties and `eclass_un` for units of measures from the `.csv` files you just downloaded. The SQL data base configuration should be as follows:

```
    "host": "127.0.0.1",
    "user": "root",
    "password": "root",
    "database": "eclass"
```

You can change this by editing the file `backend/eclass-db-config.json`.
