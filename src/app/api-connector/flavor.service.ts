import ***REMOVED*** Injectable ***REMOVED*** from '@angular/core';
import  ***REMOVED*** Flavor***REMOVED*** from '../virtualmachinemodels/flavor';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import ***REMOVED***URLSearchParams***REMOVED*** from "@angular/http";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class FlavorService ***REMOVED***

  constructor (private http: Http)***REMOVED******REMOVED***

  getFlavors(host:string,port:string) :Observable<Flavor[]> ***REMOVED***
     let urlSearchParams=new URLSearchParams();

     urlSearchParams.append('host',host);
      urlSearchParams.append('port',port);

    return this.http.get('https://portal-dev.denbi.de/connector/flavors/',***REMOVED***search:urlSearchParams***REMOVED***).map((res:Response) => res.json()).catch((error:any) => Observable.throw(error.json().error ||'Server error'))

  ***REMOVED***

***REMOVED***