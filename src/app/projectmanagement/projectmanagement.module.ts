import {NgModule} from '@angular/core';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {OverviewComponent} from './overview.component';
import {ProjectManagementRoutingModule} from './projectmanagement-routing.module';
import {CommonModule} from '@angular/common';
import {ModalModule} from 'ngx-bootstrap/modal';
import {FormsModule} from '@angular/forms';
import {AccordionModule} from 'ngx-bootstrap';
import {ApplicationsModule} from '../applications/applications.module';

/**
 * Projectmanagment module.
 */
@NgModule({
            imports: [
              AccordionModule.forRoot(),
              ProjectManagementRoutingModule,
              TabsModule,
              FormsModule,
              CommonModule,
              ModalModule.forRoot(),
              ApplicationsModule
            ],
            declarations: [
              OverviewComponent

            ]
          })
export class ProjectManagementModule {
}
