import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Image***REMOVED*** from '../virtualmachinemodels/image';
import ***REMOVED***Http, Response, Headers, RequestOptions***REMOVED*** from '@angular/http';
import ***REMOVED***Observable***REMOVED*** from 'rxjs/Rx';
import ***REMOVED***URLSearchParams***REMOVED*** from "@angular/http";
import ***REMOVED***ApiSettings***REMOVED*** from "./api-settings.service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class keyService ***REMOVED***
  baseKeysUrl = 'https://portal-dev.denbi.de/connector/keys/';

  constructor(private http: Http, private settings: ApiSettings) ***REMOVED***
  ***REMOVED***

  getKey(elixir_id: string): Observable<Response> ***REMOVED***
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('elixir_id', elixir_id);


    return this.http.get(this.baseKeysUrl + 'getPublicKeyByUser/', ***REMOVED***
      withCredentials: true,
      search: urlSearchParams
    ***REMOVED***).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

  ***REMOVED***

  postKey(elixir_id: string, public_key: string, keyname: string): Observable<Response> ***REMOVED***
    let header = new Headers(***REMOVED***
      'X-CSRFToken': this.settings.getCSRFToken(),
    ***REMOVED***);
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('elixir_id', elixir_id);
    urlSearchParams.append('public_key', public_key);
    urlSearchParams.append('keyname', keyname);

    return this.http.post(this.baseKeysUrl + 'importKey/', urlSearchParams, ***REMOVED***
      withCredentials: true,
      headers: header,
    ***REMOVED***);
  ***REMOVED***

  reimportKey(elixir_id: string, public_key: string, keyname: string): Observable<Response> ***REMOVED***
    let header = new Headers(***REMOVED***
      'X-CSRFToken': this.settings.getCSRFToken(),
    ***REMOVED***);
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('elixir_id', elixir_id);
    urlSearchParams.append('public_key', public_key);
    urlSearchParams.append('keyname', keyname);
    urlSearchParams.append('request', 'reimport');
    return this.http.post(this.baseKeysUrl + 'reimportKey/', urlSearchParams, ***REMOVED***
      withCredentials: true,
      headers: header,
    ***REMOVED***);
  ***REMOVED***
***REMOVED***
