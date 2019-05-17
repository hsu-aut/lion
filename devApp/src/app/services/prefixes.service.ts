import { Injectable } from '@angular/core';
import { Namespace } from '../utils/prefixes';


@Injectable({
  providedIn: 'root'
})
export class PrefixesService {

  constructor() { }
  // consistency variables


  prefixes = new Namespace;

  getPrefixes() {
    return this.prefixes.PREFIXES;
  }
  addNamespace(PREFIX, NAMESPACE) {
    let pre = PREFIX;
    let name = NAMESPACE;
    let entry = { prefix: pre, namespace: name};
    this.prefixes.PREFIXES.push(entry);
  }

  editNamespace(key, userPrefix, userNamespace) {
    this.prefixes.PREFIXES[key].prefix = userPrefix;
    this.prefixes.PREFIXES[key].namespace = userNamespace;
  }

  deleteNamespace(key) {
    this.prefixes.PREFIXES.splice(key, 1);
  }

  getActiveNamespace(){
    return this.prefixes.activeNamespace;
  }

  setActiveNamespace(key){
    let max = this.prefixes.PREFIXES.length;

    if(key <= max) {
      this.prefixes.activeNamespace = key;
    }
  }

  // getActiveNamespace() {
  //   var key;
  //   let last;

  //   for (const i in this.prefixes.PREFIXES) {
  //     console.log(this.prefixes.PREFIXES[i].active);
  //     if (this.prefixes.PREFIXES[i].active) { key = i;console.log(key); break; }
  //   }
  //   console.log(key)
  //   console.log(this.prefixes.PREFIXES[key])
  // }







}
