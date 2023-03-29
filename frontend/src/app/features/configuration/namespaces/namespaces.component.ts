import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

import { PrefixesService, Prefix } from '@shared-services/prefixes.service';
import { MessagesService } from '@shared-services/messages.service';

@Component({
    selector: 'app-namespaces',
    templateUrl: './namespaces.component.html',
    styleUrls: ['./namespaces.component.scss']
})
export class NamespacesComponent implements OnInit {

  // util variables
  keys = Object.keys;
  userKey: any = "";

  // stats
  namespaceCount: number;

  // namespace config
  namespaceList: Array<string>;
  activeNamespace: string;
  PREFIXES: Array<Prefix>;

  // forms
  namespaceOption = this.fb.control('', Validators.required);
  namespaceFormEditDelete = this.fb.group({
      prefix: ["", [Validators.required, Validators.pattern('^[a-z|A-Z|0-9]+[^:]?:{1}$')]],
      namespace: ["", [Validators.required, Validators.pattern('(\w*(http:\/\/)\w*)|(\w*(urn:)\w*)')]],
  })
  namespaceFormCreate = this.fb.group({
      prefix: ["", [Validators.required, Validators.pattern('^[a-z|A-Z|0-9]+[^:]?:{1}$')]],
      namespace: ["", [Validators.required, Validators.pattern('(\w*(http:\/\/)\w*)|(\w*(urn:)\w*)')]],
  })

  constructor(
    private fb: FormBuilder,

    private prefixService: PrefixesService,
    private messageService: MessagesService
  ) { }

  ngOnInit() {
      this.PREFIXES = this.prefixService.getPrefixes();
      this.namespaceCount = this.prefixService.getPrefixes().length;
      this.activeNamespace = this.prefixService.getActiveNamespace().namespace;
  }

  setActiveNamespace(namespace: string) {
      if (this.namespaceOption.valid) {
          let namespaceKey: number;

          for (let i = 0; i < this.PREFIXES.length; i++) {
              if (namespace == this.PREFIXES[i].namespace) {
                  namespaceKey = i;
              }
          }

          this.prefixService.setActiveNamespace(namespaceKey);
          this.activeNamespace = this.prefixService.getActiveNamespace().namespace;
      } else if (this.namespaceOption.invalid) {
          this.messageService.warn('Ups!','It seems like you are missing some data here...')
      }

  }

  prefixTableClick(tableRow) {
      this.namespaceFormEditDelete.controls['prefix'].setValue(tableRow.prefix);
      this.namespaceFormEditDelete.controls['namespace'].setValue(tableRow.namespace);
      for (let i = 0; i < this.PREFIXES.length; i++) {
          if (tableRow.namespace == this.PREFIXES[i].namespace) { this.userKey = i; }
      }
  }

  editNamespace() {
      if (this.namespaceFormEditDelete.valid) {
          this.prefixService.editNamespace(this.userKey, this.namespaceFormEditDelete.controls['prefix'].value, this.namespaceFormEditDelete.controls['namespace'].value);
          this.PREFIXES = this.prefixService.getPrefixes();
          this.messageService.success('Edited namespace',`The namespace ${this.namespaceFormEditDelete.controls['namespace'].value} has been edited.`)

      } else if (this.namespaceFormEditDelete.invalid) {
          this.messageService.warn('Ups!','It seems like you are missing some data here...')
      }
  }
  createNamespace() {
      if (this.namespaceFormCreate.valid) {
          this.prefixService.addNamespace(this.namespaceFormCreate.controls['prefix'].value, this.namespaceFormCreate.controls['namespace'].value);
          this.PREFIXES = this.prefixService.getPrefixes();
          this.namespaceCount = this.PREFIXES.length;
          this.messageService.success('Added namespace',`The namespace ${this.namespaceFormCreate.controls['namespace'].value} has been added.`)

      } else if (this.namespaceFormCreate.invalid) {
          this.messageService.warn('Ups!','It seems like you are missing some data here...')
      }
  }

  deleteNamespace() {
      if (this.namespaceFormEditDelete.valid) {
          this.prefixService.deleteNamespace(this.userKey);
          this.PREFIXES = this.prefixService.getPrefixes();
          this.namespaceCount = this.PREFIXES.length;
          this.messageService.success('Deleted namespace',`The namespace ${this.namespaceFormEditDelete.controls['namespace'].value} has been deleted.`)

      } else if (this.namespaceFormEditDelete.invalid) {
          this.messageService.warn('Ups!','It seems like you are missing some data here...')
      }
  }

}
