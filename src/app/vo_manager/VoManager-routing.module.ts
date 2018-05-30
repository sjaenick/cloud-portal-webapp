import ***REMOVED***NgModule***REMOVED*** from '@angular/core';
import ***REMOVED***Routes, RouterModule***REMOVED*** from '@angular/router';
import ***REMOVED***VoOverviewComponent***REMOVED*** from "./VoOverviewComponent";
import ***REMOVED***VoGuardService***REMOVED*** from "./vo-guard.service";


const routes: Routes = [
    ***REMOVED***
        path: 'overview',
        component: VoOverviewComponent,
        canActivate:[VoGuardService],
        data: ***REMOVED***
            title: 'Vo manager overview'
        ***REMOVED***

    ***REMOVED***,


];

@NgModule(***REMOVED***
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
***REMOVED***)
export class VoManagerRoutingModule ***REMOVED***
***REMOVED***
