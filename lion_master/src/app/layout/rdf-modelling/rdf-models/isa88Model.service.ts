import { Injectable } from '@angular/core';
import { SparqlQueriesService } from './services/sparql-queries.service';
import { PrefixesService } from './services/prefixes.service';
import { DataLoaderService } from '../../../shared/services/dataLoader.service';
import { take } from 'rxjs/operators';
import { Namespace } from '../utils/prefixes'

var nameService = new Namespace;

@Injectable({
        providedIn: 'root'
})
export class Isa88ModelService {

        isa88Data = new ISA88Data();
        isa88Insert = new ISA88Insert();

        constructor(
                private query: SparqlQueriesService,
                private nameService: PrefixesService,
                private loadingScreenService: DataLoaderService

        ) {

                this.initializeISA88();

        }

        public initializeISA88() {
                this.loadISA88BehaviorInfo().pipe(take(1)).subscribe((data: any) => {
                        this.loadingScreenService.stopLoading();
                        this.isa88Data.ALL_BEHAVIOR_INFO_TABLE = data;
                });
        }
        // isa 88 data
        public loadISA88BehaviorInfo() {
                this.loadingScreenService.startLoading();
                return this.query.selectTable(this.isa88Data.SPARQL_SELECT_BEHAVIOR_INFO);
        }

        public setISA88BehaviorInfo(table) {
                this.isa88Data.ALL_BEHAVIOR_INFO_TABLE = table;
        }
        public getISA88BehaviorInfo() {
                return this.isa88Data.ALL_BEHAVIOR_INFO_TABLE;
        }

        public insertStateMachine(variables: ISA88Variables) {
                var PREFIXES = this.nameService.getPrefixes();
                var namespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;

                var GRAPHS = this.nameService.getGraphs();
                var activeGraph = GRAPHS[this.nameService.getActiveGraph()];

                return this.query.insert(this.isa88Insert.buildISA88(variables, namespace, activeGraph));
        }
        public buildStateMachine(variables: ISA88Variables) {
                var PREFIXES = this.nameService.getPrefixes();
                var namespace = PREFIXES[this.nameService.getActiveNamespace()].namespace;

                var GRAPHS = this.nameService.getGraphs();
                var activeGraph = GRAPHS[this.nameService.getActiveGraph()];

                return this.isa88Insert.buildISA88(variables, namespace, activeGraph);
        }

}

class ISA88Data {



        public IRI: Array<String>;
        public ALL_BEHAVIOR_INFO_TABLE: Array<Object> = []
        public SPARQL_SELECT_BEHAVIOR_INFO = `
  PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>

  SELECT ?State ?Transition WHERE {
  ?StateType rdfs:subClassOf ISA88:State.
  ?State a ?StateType.
  ?State ISA88:State_is_connected_with_Transition ?Transition.
  ?Transition a ?TransitionType.
  ?TransitionType rdfs:subClassOf ISA88:Transition.
  FILTER (?StateType != ISA88:State)
  FILTER (?StateType != ISA88:Acting)
  FILTER (?StateType != ISA88:Wait)
  FILTER (?TransitionType != ISA88:Transition)
  FILTER (?TransitionType != ISA88:Command)
  FILTER (?TransitionType != ISA88:State_Complete)
}
 `;
}

export class ISA88Variables {
        SystemName: string;
        mode: string;
}

export class ISA88Insert {

        public buildISA88(variables: ISA88Variables, activeNameSpace: string, activeGraph: string): string {
                var namespace = activeNameSpace;
                var SystemName = nameService.parseToName(variables.SystemName);
                var SystemIRI = nameService.parseToIRI(variables.SystemName);
                var mode = variables.mode;

                var insertStringProduction = `      
# Necessary W3C ontologies
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

# Necessary standard ontologies
PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>


# ${mode} Mode

INSERT {
        GRAPH <${activeGraph}>{
# Declaration of individuals for states
  ?Aborting rdf:type ISA88:Aborting;         
      a owl:NamedIndividual.                    
  ?Clearing rdf:type ISA88:Clearing;         
      a owl:NamedIndividual.                    
  ?Complete rdf:type ISA88:Complete;
      a owl:NamedIndividual.
  ?Completing rdf:type ISA88:Completing;
      a owl:NamedIndividual.
  ?Execute rdf:type ISA88:Execute;               
      a owl:NamedIndividual.                    
  ?Holding rdf:type ISA88:Holding;           
      a owl:NamedIndividual.                    
  ?Resetting rdf:type ISA88:Resetting;       
      a owl:NamedIndividual.                    
  ?Starting rdf:type ISA88:Starting;         
      a owl:NamedIndividual.                    
  ?Stopping rdf:type ISA88:Stopping;         
          a owl:NamedIndividual.                    
  ?Suspending rdf:type ISA88:Suspending;
          a owl:NamedIndividual.
  ?Unholding rdf:type ISA88:Unholding;       
          a owl:NamedIndividual.                    
  ?Unsuspending rdf:type ISA88:Unsuspending;
          a owl:NamedIndividual.
  ?Aborted rdf:type ISA88:Aborted;                              
          a owl:NamedIndividual.                    
  ?Held rdf:type ISA88:Held;                 
          a owl:NamedIndividual.                    
  ?Idle rdf:type ISA88:Idle;                 
          a owl:NamedIndividual.                    
  ?Stopped rdf:type ISA88:Stopped;           
          a owl:NamedIndividual.                    
  ?Suspended rdf:type ISA88:Suspended;
          a owl:NamedIndividual.

  
# Declaration of individuals for transitions
  ?Abort_Command rdf:type ISA88:Abort_Command;         
      a owl:NamedIndividual.                              
  ?Clear_Command rdf:type ISA88:Clear_Command;         
          a owl:NamedIndividual.                              
  ?Hold_Command rdf:type ISA88:Hold_Command;           
          a owl:NamedIndividual.                              
  ?Reset_Command rdf:type ISA88:Reset_Command;         
          a owl:NamedIndividual.                              
  ?Start_Command rdf:type ISA88:Start_Command;         
          a owl:NamedIndividual.                              
  ?Stop_Command rdf:type ISA88:Stop_Command;           
          a owl:NamedIndividual.                              
  ?Suspend_Command rdf:type ISA88:Suspend_Command;
          a owl:NamedIndividual.
  ?Un_Hold_Command rdf:type ISA88:Un-Hold_Command;     
          a owl:NamedIndividual.                              
  ?Unsuspend_Command rdf:type ISA88:Unsuspend_Command;
          a owl:NamedIndividual.
  ?Aborting_State_Complete rdf:type ISA88:Aborting_State_Complete;         
          a owl:NamedIndividual.                                                  
  ?Clearing_State_Complete rdf:type ISA88:Clearing_State_Complete;         
          a owl:NamedIndividual.                                                  
  ?Completing_State_Complete rdf:type ISA88:Completing_State_Complete;
          a owl:NamedIndividual.
  ?Execute_State_Complete rdf:type ISA88:Execute_State_Complete;
          a owl:NamedIndividual.
  ?Holding_State_Complete rdf:type ISA88:Holding_State_Complete;           
          a owl:NamedIndividual.                                                  
  ?Resetting_State_Complete rdf:type ISA88:Resetting_State_Complete;       
          a owl:NamedIndividual.                                                  
  ?Starting_State_Complete rdf:type ISA88:Starting_State_Complete;         
          a owl:NamedIndividual.                                                  
  ?Stopping_State_Complete rdf:type ISA88:Stopping_State_Complete;         
          a owl:NamedIndividual.                                                  
  ?Suspending_State_Complete rdf:type ISA88:Suspending_State_Complete;
          a owl:NamedIndividual.
  ?Unholding_State_Complete rdf:type ISA88:Unholding_State_Complete;       
          a owl:NamedIndividual.                                                  
  ?Unsuspending_State_Complete rdf:type ISA88:Unsuspending_State_Complete;
          a owl:NamedIndividual.
  
# Declaration of ObjectProperties for states
      #state to transition
      ?Aborting ISA88:State_is_connected_with_Transition ?Aborting_State_Complete.           
      ?Clearing ISA88:State_is_connected_with_Transition ?Abort_Command;                     
          ISA88:State_is_connected_with_Transition ?Clearing_State_Complete.                       
      ?Complete ISA88:State_is_connected_with_Transition ?Abort_Command;
          ISA88:State_is_connected_with_Transition ?Reset_Command;
          ISA88:State_is_connected_with_Transition ?Stop_Command.
      ?Completing ISA88:State_is_connected_with_Transition ?Abort_Command;
          ISA88:State_is_connected_with_Transition ?Completing_State_Complete;
          ISA88:State_is_connected_with_Transition ?Stop_Command.
      ?Execute ISA88:State_is_connected_with_Transition ?Abort_Command;                      
          ISA88:State_is_connected_with_Transition ?Stop_Command;                                   
          ISA88:State_is_connected_with_Transition ?Execute_State_Complete;
          ISA88:State_is_connected_with_Transition ?Hold_Command;                                   
          ISA88:State_is_connected_with_Transition ?Suspend_Command.
      ?Holding ISA88:State_is_connected_with_Transition ?Abort_Command;                      
          ISA88:State_is_connected_with_Transition ?Stop_Command;                                   
          ISA88:State_is_connected_with_Transition ?Holding_State_Complete.                         
      ?Resetting ISA88:State_is_connected_with_Transition ?Abort_Command;                    
          ISA88:State_is_connected_with_Transition ?Stop_Command;                                   
          ISA88:State_is_connected_with_Transition ?Resetting_State_Complete.                               
      ?Starting ISA88:State_is_connected_with_Transition ?Abort_Command;                     
          ISA88:State_is_connected_with_Transition ?Stop_Command;                                   
          ISA88:State_is_connected_with_Transition ?Starting_State_Complete.                        
      ?Stopping ISA88:State_is_connected_with_Transition ?Abort_Command;                     
          ISA88:State_is_connected_with_Transition ?Stopping_State_Complete.                        
      ?Suspending ISA88:State_is_connected_with_Transition ?Abort_Command;
          ISA88:State_is_connected_with_Transition ?Stop_Command;
          ISA88:State_is_connected_with_Transition ?Suspending_State_Complete.
      ?Unholding ISA88:State_is_connected_with_Transition ?Abort_Command;                    
          ISA88:State_is_connected_with_Transition ?Stop_Command;                                   
          ISA88:State_is_connected_with_Transition ?Unholding_State_Complete.                       
      ?Unsuspending ISA88:State_is_connected_with_Transition ?Abort_Command;
          ISA88:State_is_connected_with_Transition ?Stop_Command;
          ISA88:State_is_connected_with_Transition ?Unsuspending_State_Complete.
      ?Aborted ISA88:State_is_connected_with_Transition ?Clear_Command.                      
      ?Held ISA88:State_is_connected_with_Transition ?Abort_Command;                         
          ISA88:State_is_connected_with_Transition ?Stop_Command;                                   
          ISA88:State_is_connected_with_Transition ?Un_Hold_Command.                                
      ?Idle ISA88:State_is_connected_with_Transition ?Abort_Command;                         
          ISA88:State_is_connected_with_Transition ?Stop_Command;                                   
          ISA88:State_is_connected_with_Transition ?Start_Command.                                  
      ?Stopped ISA88:State_is_connected_with_Transition ?Abort_Command;                      
          ISA88:State_is_connected_with_Transition ?Reset_Command.                                  
      ?Suspended ISA88:State_is_connected_with_Transition ?Abort_Command;
          ISA88:State_is_connected_with_Transition ?Stop_Command;
          ISA88:State_is_connected_with_Transition ?Unsuspend_Command.

      # transition to state
      ?Abort_Command ISA88:Transition_is_connected_with_State ?Aborting.                     
      ?Clear_Command ISA88:Transition_is_connected_with_State ?Clearing.                     
      ?Hold_Command ISA88:Transition_is_connected_with_State ?Holding.                       
      ?Reset_Command ISA88:Transition_is_connected_with_State ?Resetting.                    
      ?Start_Command ISA88:Transition_is_connected_with_State ?Starting.                     
      ?Stop_Command ISA88:Transition_is_connected_with_State ?Stopping.                      
      ?Suspend_Command ISA88:Transition_is_connected_with_State ?Suspending.
      ?Un_Hold_Command ISA88:Transition_is_connected_with_State ?Unholding.                  
      ?Unsuspend_Command ISA88:Transition_is_connected_with_State ?Unsuspending.
      ?Aborting_State_Complete ISA88:Transition_is_connected_with_State ?Aborted.            

      ?Aborting_State_Complete ISA88:Transition_is_connected_with_State ?Aborted.            
      ?Clearing_State_Complete ISA88:Transition_is_connected_with_State ?Stopped.            
      ?Completing_State_Complete ISA88:Transition_is_connected_with_State ?Complete.
      ?Execute_State_Complete ISA88:Transition_is_connected_with_State ?Completing.
      ?Holding_State_Complete ISA88:Transition_is_connected_with_State ?Held.                
      ?Resetting_State_Complete ISA88:Transition_is_connected_with_State ?Idle.              
      ?Starting_State_Complete ISA88:Transition_is_connected_with_State ?Execute.
      ?Stopping_State_Complete ISA88:Transition_is_connected_with_State ?Stopped.            
      ?Suspending_State_Complete ISA88:Transition_is_connected_with_State ?Suspended.
      ?Unholding_State_Complete ISA88:Transition_is_connected_with_State ?Execute.           
      ?Unsuspending_State_Complete ISA88:Transition_is_connected_with_State ?Execute.

      # defines the element to bind the states and transitions to
      ?SysBehaviorOrPOUIRI 
      #connected to states
      ISA88:described_by_ISA88_Element ?Aborting;
      ISA88:described_by_ISA88_Element ?Clearing;
      ISA88:described_by_ISA88_Element ?Complete;
      ISA88:described_by_ISA88_Element ?Completing;
      ISA88:described_by_ISA88_Element ?Execute;
      ISA88:described_by_ISA88_Element ?Holding;
      ISA88:described_by_ISA88_Element ?Resetting;
      ISA88:described_by_ISA88_Element ?Starting;
      ISA88:described_by_ISA88_Element ?Stopping;
      ISA88:described_by_ISA88_Element ?Suspending;
      ISA88:described_by_ISA88_Element ?Unholding;
      ISA88:described_by_ISA88_Element ?Unsuspending;
      ISA88:described_by_ISA88_Element ?Aborted;
      ISA88:described_by_ISA88_Element ?Held;
      ISA88:described_by_ISA88_Element ?Idle;
      ISA88:described_by_ISA88_Element ?Stopped;
      ISA88:described_by_ISA88_Element ?Suspended; 
      # connected to transitions 
      ISA88:described_by_ISA88_Element ?Abort_Command;
      ISA88:described_by_ISA88_Element ?Clear_Command;
      ISA88:described_by_ISA88_Element ?Hold_Command;
      ISA88:described_by_ISA88_Element ?Reset_Command;
      ISA88:described_by_ISA88_Element ?Start_Command;
      ISA88:described_by_ISA88_Element ?Stop_Command;
      ISA88:described_by_ISA88_Element ?Suspend_Command;
      ISA88:described_by_ISA88_Element ?Un_Hold_Command;
      ISA88:described_by_ISA88_Element ?Aborting_State_Complete;
      ISA88:described_by_ISA88_Element ?Clearing_State_Complete;
      ISA88:described_by_ISA88_Element ?Completing_State_Complete;
      ISA88:described_by_ISA88_Element ?Execute_State_Complete;
      ISA88:described_by_ISA88_Element ?Holding_State_Complete;
      ISA88:described_by_ISA88_Element ?Resetting_State_Complete;
      ISA88:described_by_ISA88_Element ?Starting_State_Complete;
      ISA88:described_by_ISA88_Element ?Stopping_State_Complete;
      ISA88:described_by_ISA88_Element ?Suspending_State_Complete;
      ISA88:described_by_ISA88_Element ?Unholding_State_Complete;
      ISA88:described_by_ISA88_Element ?Unsuspending_State_Complete;
      ISA88:described_by_ISA88_Element ?Unsuspend_Command. 
        }
} WHERE {

  { SELECT  
          # states
          ?Aborting ?Clearing ?Complete ?Completing ?Execute ?Holding
          ?Resetting ?Starting ?Stopping ?Suspending ?Unholding ?Unsuspending
          ?Aborted ?Held ?Idle ?Stopped ?Suspended 
          # transitions
          ?Abort_Command ?Clear_Command ?Hold_Command ?Reset_Command ?Start_Command ?Stop_Command
          ?Suspend_Command ?Un_Hold_Command ?Aborting_State_Complete ?Clearing_State_Complete ?Completing_State_Complete ?Execute_State_Complete
          ?Holding_State_Complete ?Resetting_State_Complete ?Starting_State_Complete ?Stopping_State_Complete ?Suspending_State_Complete ?Unholding_State_Complete
          ?Unsuspending_State_Complete ?Unsuspend_Command

          # system behavior individual to bind the states and transitions to
          ?SysBehaviorOrPOUIRI
          
  WHERE
  {
      # ----------------------------------------------------------------- #
      # The system type for which a ISA 88 state machine shall be created, comment the not applicable (POU vs System_Behavior)
      BIND(STR("${SystemName}") AS ?SystemType).
      BIND(STR("${SystemIRI}") AS ?SysBehaviorOrPOUIRI).
      # ----------------------------------------------------------------- #
      # Defines the general namespace for all individuals
      BIND(STR("${namespace}") AS ?NameSpace).
      # ----------------------------------------------------------------- #
      # states
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Aborting")) AS ?Aborting).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Clearing")) AS ?Clearing).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Complete")) AS ?Complete).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Completing")) AS ?Completing).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Execute")) AS ?Execute).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Holding")) AS ?Holding).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Resetting")) AS ?Resetting).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Starting")) AS ?Starting).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Stopping")) AS ?Stopping).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Suspending")) AS ?Suspending).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Unholding")) AS ?Unholding).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Unsuspending")) AS ?Unsuspending).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Aborted")) AS ?Aborted).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Held")) AS ?Held).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Idle")) AS ?Idle).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Stopped")) AS ?Stopped).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Suspended")) AS ?Suspended).
      # transitions
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Abort_Command")) AS ?Abort_Command).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Clear_Command")) AS ?Clear_Command).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Hold_Command")) AS ?Hold_Command).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Reset_Command")) AS ?Reset_Command).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Start_Command")) AS ?Start_Command).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Stop_Command")) AS ?Stop_Command).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Suspend_Command")) AS ?Suspend_Command).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Un_Hold_Command")) AS ?Un_Hold_Command).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Unsuspend_Command")) AS ?Unsuspend_Command).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Aborting_State_Complete")) AS ?Aborting_State_Complete).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Clearing_State_Complete")) AS ?Clearing_State_Complete).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Completing_State_Complete")) AS ?Completing_State_Complete).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Execute_State_Complete")) AS ?Execute_State_Complete).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Holding_State_Complete")) AS ?Holding_State_Complete).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Resetting_State_Complete")) AS ?Resetting_State_Complete).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Starting_State_Complete")) AS ?Starting_State_Complete).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Stopping_State_Complete")) AS ?Stopping_State_Complete).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Suspending_State_Complete")) AS ?Suspending_State_Complete).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Unholding_State_Complete")) AS ?Unholding_State_Complete).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Unsuspending_State_Complete")) AS ?Unsuspending_State_Complete).
      }
  }
}`;

                var insertStringMaintenance = `
# Necessary W3C ontologies
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

# Necessary SemAnz40 standard ontologies
PREFIX ISA88: <http://www.hsu-ifa.de/ontologies/ISA-TR88#>
PREFIX SA4: <http://www.hsu-ifa.de/ontologies/SemAnz40#>


# ${mode} Mode

INSERT {

# Declaration of individuals for states
  ?Aborting rdf:type ISA88:Aborting;     
      a owl:NamedIndividual.                 
      ?Clearing rdf:type ISA88:Clearing;       
      a owl:NamedIndividual.                  
  ?Execute rdf:type ISA88:Execute;        
      a owl:NamedIndividual.                  
  ?Holding rdf:type ISA88:Holding;         
      a owl:NamedIndividual.                 
  ?Resetting rdf:type ISA88:Resetting;     
      a owl:NamedIndividual.                  
  ?Starting rdf:type ISA88:Starting;      
      a owl:NamedIndividual.                 
  ?Stopping rdf:type ISA88:Stopping;       
          a owl:NamedIndividual.                  
  ?Unholding rdf:type ISA88:Unholding;     
          a owl:NamedIndividual.                 
  ?Aborted rdf:type ISA88:Aborted;                          
          a owl:NamedIndividual.                 
  ?Held rdf:type ISA88:Held;             
          a owl:NamedIndividual.                
  ?Idle rdf:type ISA88:Idle;             
          a owl:NamedIndividual.                
  ?Stopped rdf:type ISA88:Stopped;        
          a owl:NamedIndividual.                 


  
# Declaration of individuals for transitions
  ?Abort_Command rdf:type ISA88:Abort_Command;       
      a owl:NamedIndividual.                           
  ?Clear_Command rdf:type ISA88:Clear_Command;       
          a owl:NamedIndividual.                            
  ?Hold_Command rdf:type ISA88:Hold_Command;        
          a owl:NamedIndividual.                            
  ?Reset_Command rdf:type ISA88:Reset_Command;       
          a owl:NamedIndividual.                           
  ?Start_Command rdf:type ISA88:Start_Command;       
          a owl:NamedIndividual.                           
  ?Stop_Command rdf:type ISA88:Stop_Command;         
          a owl:NamedIndividual.                           
  ?Un_Hold_Command rdf:type ISA88:Un-Hold_Command;   
          a owl:NamedIndividual.                           
  ?Aborting_State_Complete rdf:type ISA88:Aborting_State_Complete;       
          a owl:NamedIndividual.                                                
  ?Clearing_State_Complete rdf:type ISA88:Clearing_State_Complete;       
          a owl:NamedIndividual.                                                
  ?Holding_State_Complete rdf:type ISA88:Holding_State_Complete;         
          a owl:NamedIndividual.                                                
  ?Resetting_State_Complete rdf:type ISA88:Resetting_State_Complete;     
          a owl:NamedIndividual.                                                
  ?Starting_State_Complete rdf:type ISA88:Starting_State_Complete;       
          a owl:NamedIndividual.                                                
  ?Stopping_State_Complete rdf:type ISA88:Stopping_State_Complete;       
          a owl:NamedIndividual.                                               
  ?Unholding_State_Complete rdf:type ISA88:Unholding_State_Complete;     
          a owl:NamedIndividual.                                               
  
# Declaration of ObjectProperties for states
      #state to transition
      ?Aborting ISA88:State_is_connected_with_Transition ?Aborting_State_Complete.         
      ?Clearing ISA88:State_is_connected_with_Transition ?Abort_Command;                   
          ISA88:State_is_connected_with_Transition ?Clearing_State_Complete.                    
       ?Execute ISA88:State_is_connected_with_Transition ?Abort_Command;                    
          ISA88:State_is_connected_with_Transition ?Stop_Command;                                 
          ISA88:State_is_connected_with_Transition ?Execute_State_Complete;
          ISA88:State_is_connected_with_Transition ?Hold_Command.                                 

      ?Holding ISA88:State_is_connected_with_Transition ?Abort_Command;                    
          ISA88:State_is_connected_with_Transition ?Stop_Command;                                  
          ISA88:State_is_connected_with_Transition ?Holding_State_Complete.                        
      ?Resetting ISA88:State_is_connected_with_Transition ?Abort_Command;                   
          ISA88:State_is_connected_with_Transition ?Stop_Command;                                  
          ISA88:State_is_connected_with_Transition ?Resetting_State_Complete.                              
      ?Starting ISA88:State_is_connected_with_Transition ?Abort_Command;                    
          ISA88:State_is_connected_with_Transition ?Stop_Command;                                  
          ISA88:State_is_connected_with_Transition ?Starting_State_Complete.                       
      ?Stopping ISA88:State_is_connected_with_Transition ?Abort_Command;                    
          ISA88:State_is_connected_with_Transition ?Stopping_State_Complete.                       
      ?Unholding ISA88:State_is_connected_with_Transition ?Abort_Command;                   
          ISA88:State_is_connected_with_Transition ?Stop_Command;                                  
          ISA88:State_is_connected_with_Transition ?Unholding_State_Complete.                      
      ?Aborted ISA88:State_is_connected_with_Transition ?Clear_Command.                     
      ?Held ISA88:State_is_connected_with_Transition ?Abort_Command;                        
          ISA88:State_is_connected_with_Transition ?Stop_Command;                                  
          ISA88:State_is_connected_with_Transition ?Un_Hold_Command.                               
      ?Idle ISA88:State_is_connected_with_Transition ?Abort_Command;                        
          ISA88:State_is_connected_with_Transition ?Stop_Command;                                  
          ISA88:State_is_connected_with_Transition ?Start_Command.                                 
      ?Stopped ISA88:State_is_connected_with_Transition ?Abort_Command;                     
          ISA88:State_is_connected_with_Transition ?Reset_Command.                                 

    # transition to state
      ?Abort_Command ISA88:Transition_is_connected_with_State ?Aborting.                    
      ?Clear_Command ISA88:Transition_is_connected_with_State ?Clearing.                    
      ?Hold_Command ISA88:Transition_is_connected_with_State ?Holding.                      
      ?Reset_Command ISA88:Transition_is_connected_with_State ?Resetting.                   
      ?Start_Command ISA88:Transition_is_connected_with_State ?Starting.                    
      ?Stop_Command ISA88:Transition_is_connected_with_State ?Stopping.                     
      ?Un_Hold_Command ISA88:Transition_is_connected_with_State ?Unholding.                 
      ?Aborting_State_Complete ISA88:Transition_is_connected_with_State ?Aborted.           

      ?Aborting_State_Complete ISA88:Transition_is_connected_with_State ?Aborted.           
      ?Clearing_State_Complete ISA88:Transition_is_connected_with_State ?Stopped.           


      ?Holding_State_Complete ISA88:Transition_is_connected_with_State ?Held.               
      ?Resetting_State_Complete ISA88:Transition_is_connected_with_State ?Idle.             
      ?Starting_State_Complete ISA88:Transition_is_connected_with_State ?Execute.             
      ?Stopping_State_Complete ISA88:Transition_is_connected_with_State ?Stopped.           
      ?Unholding_State_Complete ISA88:Transition_is_connected_with_State ?Execute.          

      # defines the element to bind the states and transitions to
      ?SysBehaviorOrPOUIRI 
      #connected to states
      ISA88:described_by_ISA88_Element ?Aborting;
      ISA88:described_by_ISA88_Element ?Clearing;
      ISA88:described_by_ISA88_Element ?Complete;
      ISA88:described_by_ISA88_Element ?Completing;
      ISA88:described_by_ISA88_Element ?Execute;
      ISA88:described_by_ISA88_Element ?Holding;
      ISA88:described_by_ISA88_Element ?Resetting;
      ISA88:described_by_ISA88_Element ?Starting;
      ISA88:described_by_ISA88_Element ?Stopping;
      ISA88:described_by_ISA88_Element ?Unholding;

      ISA88:described_by_ISA88_Element ?Aborted;
      ISA88:described_by_ISA88_Element ?Held;
      ISA88:described_by_ISA88_Element ?Idle;
      ISA88:described_by_ISA88_Element ?Stopped;
      # connected to transitions 
      ISA88:described_by_ISA88_Element ?Abort_Command;
      ISA88:described_by_ISA88_Element ?Clear_Command;
      ISA88:described_by_ISA88_Element ?Hold_Command;
      ISA88:described_by_ISA88_Element ?Reset_Command;
      ISA88:described_by_ISA88_Element ?Start_Command;
      ISA88:described_by_ISA88_Element ?Stop_Command;
      ISA88:described_by_ISA88_Element ?Un_Hold_Command;
      ISA88:described_by_ISA88_Element ?Aborting_State_Complete;
      ISA88:described_by_ISA88_Element ?Clearing_State_Complete;
      ISA88:described_by_ISA88_Element ?Completing_State_Complete;
      ISA88:described_by_ISA88_Element ?Execute_State_Complete;
      ISA88:described_by_ISA88_Element ?Holding_State_Complete;
      ISA88:described_by_ISA88_Element ?Resetting_State_Complete;
      ISA88:described_by_ISA88_Element ?Starting_State_Complete;
      ISA88:described_by_ISA88_Element ?Stopping_State_Complete;
      ISA88:described_by_ISA88_Element ?Unholding_State_Complete.

} WHERE {

  { SELECT  
            # states
            ?Aborting ?Clearing ?Complete ?Completing ?Execute ?Holding
            ?Resetting ?Starting ?Stopping  ?Unholding 
            ?Aborted ?Held ?Idle ?Stopped  
            # transitions
            ?Abort_Command ?Clear_Command ?Hold_Command ?Reset_Command ?Start_Command ?Stop_Command
            ?Un_Hold_Command ?Aborting_State_Complete ?Clearing_State_Complete ?Completing_State_Complete ?Execute_State_Complete
            ?Holding_State_Complete ?Resetting_State_Complete ?Starting_State_Complete ?Stopping_State_Complete ?Unholding_State_Complete
            

            # system behavior individual to bind the states and transitions to
            ?SysBehaviorOrPOUIRI
            
  WHERE
    {
      # ----------------------------------------------------------------- #
      # The system type for which a ISA 88 state machine shall be created
      BIND(STR("${SystemName}") AS ?SystemType).
      BIND(STR("${SystemIRI}") AS ?SysBehaviorOrPOUIRI).
      # ----------------------------------------------------------------- #
      # Defines the general namespace for all individuals
      BIND(STR("${namespace}") AS ?NameSpace).
      # ----------------------------------------------------------------- #
      # states
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Aborting")) AS ?Aborting).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Clearing")) AS ?Clearing).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Complete")) AS ?Complete).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Completing")) AS ?Completing).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Execute")) AS ?Execute).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Holding")) AS ?Holding).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Resetting")) AS ?Resetting).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Starting")) AS ?Starting).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Stopping")) AS ?Stopping).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Unholding")) AS ?Unholding).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Aborted")) AS ?Aborted).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Held")) AS ?Held).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Idle")) AS ?Idle).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Stopped")) AS ?Stopped).
      # transitions
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Abort_Command")) AS ?Abort_Command).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Clear_Command")) AS ?Clear_Command).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Hold_Command")) AS ?Hold_Command).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Reset_Command")) AS ?Reset_Command).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Start_Command")) AS ?Start_Command).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Stop_Command")) AS ?Stop_Command).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Un_Hold_Command")) AS ?Un_Hold_Command).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Aborting_State_Complete")) AS ?Aborting_State_Complete).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Clearing_State_Complete")) AS ?Clearing_State_Complete).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Completing_State_Complete")) AS ?Completing_State_Complete).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Execute_State_Complete")) AS ?Execute_State_Complete).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Holding_State_Complete")) AS ?Holding_State_Complete).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Resetting_State_Complete")) AS ?Resetting_State_Complete).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Starting_State_Complete")) AS ?Starting_State_Complete).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Stopping_State_Complete")) AS ?Stopping_State_Complete).
      BIND(IRI(CONCAT(?NameSpace,?SystemType,"_Unholding_State_Complete")) AS ?Unholding_State_Complete).
      }
  }
}



`;
                if (mode == "Production") { return insertStringProduction }
                if (mode == "Maintenance") { return insertStringMaintenance }

                ;
        }

}