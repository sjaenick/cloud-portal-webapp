import { NgModule } from '@angular/core';
import { FacilityProjectsOverviewComponent} from "./facilityprojectsoverview.component";
import { TabsModule } from 'ngx-bootstrap/tabs';
import { OverviewComponent } from './overview.component';
import { ProjectManagementRoutingModule } from './projectmanagement-routing.module';
import {CommonModule} from "@angular/common";
import { ModalModule } from 'ngx-bootstrap/modal';
import {FormsModule} from '@angular/forms';
import {ImageTagComponent} from "./imagetags.component";
@NgModule({
  imports: [
    ProjectManagementRoutingModule,
    TabsModule,
      FormsModule,
    CommonModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    OverviewComponent,
      FacilityProjectsOverviewComponent,
      ImageTagComponent
  ]
})
export class ProjectManagementModule { }
