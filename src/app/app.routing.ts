import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';
import ***REMOVED*** Routes, RouterModule ***REMOVED*** from '@angular/router';

// Layouts
import ***REMOVED*** FullLayoutComponent ***REMOVED*** from './layouts/full-layout.component';
import ***REMOVED*** SimpleLayoutComponent ***REMOVED*** from './layouts/simple-layout.component';

export const routes: Routes = [
  ***REMOVED***
    path: '',
    redirectTo: 'project-management',
    pathMatch: 'full',
  ***REMOVED***,
  ***REMOVED***
    path: '',
    component: FullLayoutComponent,
    data: ***REMOVED***
      title: 'de.NBI Portal'
    ***REMOVED***,
    children: [
      ***REMOVED***
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      ***REMOVED***,
      ***REMOVED***
        path: 'project-management',
        loadChildren: './projectmanagement/projectmanagement.module#ProjectManagementModule'
      ***REMOVED***
    ]
  ***REMOVED***
];

@NgModule(***REMOVED***
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
***REMOVED***)
export class AppRoutingModule ***REMOVED******REMOVED***
