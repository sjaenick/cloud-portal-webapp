import { Injectable } from '@angular/core';
import {URLSearchParams} from "@angular/http";
import {VirtualMachineComponent} from  '../applications/addvm.component'
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {observableToBeFn} from "rxjs/testing/TestScheduler";

@Injectable()
export class VirtualmachineService {

   constructor (private http: Http){}
  data:string;
   startVM(flavor :string,image :string,key:string ,servername:string ,):Observable<Response>{
    let urlSearchParams=new URLSearchParams();
    urlSearchParams.append('flavor',flavor);
    urlSearchParams.append('image',image);
    urlSearchParams.append('key',key);
    urlSearchParams.append('servername',servername);
     return this.http.post('https://localhost:8443/vms/',urlSearchParams)
   }

}
