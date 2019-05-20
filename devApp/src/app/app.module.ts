// external modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Isa88Component } from './components/isa88/isa88.component';
import { Dinen61360Component } from './components/dinen61360/dinen61360.component';
import { VDI3682Component } from './components/vdi3682/vdi3682.component';
import { Vdi2206Component } from './components/vdi2206/vdi2206.component';
import { HomeComponent } from './components/home/home.component';
import { ISO22400Component } from './components/iso22400/iso22400.component';
import { BootstrapComponentsComponent } from './components/bootstrap-components/bootstrap-components.component';
import { ConfigurationsComponent } from './components/configurations/configurations.component';

@NgModule({
  declarations: [
    AppComponent,
    Isa88Component,
    Dinen61360Component,
    VDI3682Component,
    Vdi2206Component,
    HomeComponent,
    ISO22400Component,
    BootstrapComponentsComponent,
    ConfigurationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
