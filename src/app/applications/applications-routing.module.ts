import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplicationsComponent } from './applications.component';

import {AddsinglevmComponent} from './addsinglevm.component';
import {AddcloudapplicationComponent} from './addcloudapplication.component';


const routes: Routes = [
  {
    path: '',
    component: ApplicationsComponent,
    data: {
      title: 'Application overview'
    }

  },
  {
    path: 'newCloudApplication',
    component: AddcloudapplicationComponent,
    data: {
      title: 'New Application'
    }

  },
    {
        path: 'newSingleVmApplication',
    component: AddsinglevmComponent,
    data: {
      title: 'New Application'
    }


    }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationsRoutingModule {}
