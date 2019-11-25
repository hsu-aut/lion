import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  host: string;
  repository: string;

  constructor() {
    // default url
    this.host = 'lion_BE';
    this.repository = 'testdb';
  }

  // getter and setter for repository and host
  getHost() {
    return this.host;
  }
  setHost(hostName: string) {
    this.host = hostName;
  }
  getRepository() {
    return this.repository;
  }
  setRepository(repositoryName: string) {
    this.repository = repositoryName;
  }

}
