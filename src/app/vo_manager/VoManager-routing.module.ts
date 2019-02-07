import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {VoOverviewComponent} from "./VoOverviewComponent";
import {VoGuardService} from "./vo-guard.service";
import {ResourcesComponent} from "./resources/resources.component";


const routes: Routes = [
    {
        path: 'overview',
        component: VoOverviewComponent,
        canActivate: [VoGuardService],
        data: {
            title: 'Vo manager overview'
        }
    }
    , {
        path: 'resources',
        component: ResourcesComponent,
        canActivate: [VoGuardService],
        data: {
            title: 'Vo Resources'
        }


    },


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VoManagerRoutingModule {
}
