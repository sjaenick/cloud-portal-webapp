import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {VoOverviewComponent} from './VoOverviewComponent';
import {VoGuardService} from './vo-guard.service';
import {ResourcesComponent} from './resources/resources.component';
import {ClientOverviewComponent} from './clients/clientOverview.component';

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
  {
        path: 'clientsOverview',
        component: ClientOverviewComponent,
        canActivate: [VoGuardService],
        data: {
            title: 'Clients'
        }

    }

];

/**
 * Vo Manager routing module.
 */
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VoManagerRoutingModule {
}
