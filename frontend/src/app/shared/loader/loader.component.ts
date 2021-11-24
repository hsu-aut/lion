import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataLoaderService } from "../services/dataLoader.service";
import { Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";


@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {

  loading = 0;
  loadingSubscription: Subscription;

  constructor(private loadingScreenService: DataLoaderService) { }

  ngOnInit() {
      this.loadingSubscription = this.loadingScreenService.loadingStatus.pipe(
          debounceTime(400)
      ).subscribe((value) => {
          this.loading = value;
      });
  }

  ngOnDestroy() {
      this.loadingSubscription.unsubscribe();
  }

}
