import ***REMOVED***NgModule***REMOVED*** from '@angular/core';

import ***REMOVED***TabsModule***REMOVED*** from 'ngx-bootstrap/tabs';
import ***REMOVED***UserinfoComponent***REMOVED*** from './userinfo.component';
import ***REMOVED***UserinfoRoutingModule***REMOVED*** from './userinfo-routing.module';
import ***REMOVED***CommonModule***REMOVED*** from '@angular/common';
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import ***REMOVED***ModalModule***REMOVED*** from 'ngx-bootstrap/modal';
import ***REMOVED***AlertModule***REMOVED*** from 'ngx-bootstrap';
import ***REMOVED***PublicKeyModule***REMOVED*** from '../shared_modules/public-key/public-key.module';

@NgModule(***REMOVED***
    imports: [
        PublicKeyModule,
        UserinfoRoutingModule,
        TabsModule,
        CommonModule,
        FormsModule, ModalModule.forRoot(),
        AlertModule.forRoot()
    ],

    declarations: [
        UserinfoComponent,
    ],
    exports: [UserinfoComponent, UserinfoRoutingModule, TabsModule, CommonModule, FormsModule, ModalModule, AlertModule]
***REMOVED***)
export class UserinfoModule ***REMOVED***
***REMOVED***
