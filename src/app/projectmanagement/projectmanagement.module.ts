import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';

import ***REMOVED*** TabsModule ***REMOVED*** from 'ngx-bootstrap/tabs';
import ***REMOVED*** OverviewComponent ***REMOVED*** from './overview.component';
import ***REMOVED*** ProjectManagementRoutingModule ***REMOVED*** from './projectmanagement-routing.module';
import ***REMOVED***CommonModule***REMOVED*** from "@angular/common";
import ***REMOVED*** ModalModule ***REMOVED*** from 'ngx-bootstrap/modal';
@NgModule(***REMOVED***
  imports: [
    ProjectManagementRoutingModule,
    TabsModule,
    CommonModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    OverviewComponent
  ]
***REMOVED***)
export class ProjectManagementModule ***REMOVED*** ***REMOVED***
