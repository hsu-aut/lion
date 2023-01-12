import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LionStoryComponent } from './lionStory.component';

import { LionStoryRoutingModule } from './lionStory-routing.module';

// child components
import { AboutComponent } from './about/about.component';
import { ModellingGuideComponent } from './modellingGuide/modellingGuide.component';


@NgModule({
    imports: [
        CommonModule,
        LionStoryRoutingModule
    ],
    declarations: [
        LionStoryComponent,
        AboutComponent,
        ModellingGuideComponent
    ]
})
export class LionStoryModule { }
