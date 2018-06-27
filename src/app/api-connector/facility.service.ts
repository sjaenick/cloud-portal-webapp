import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {URLSearchParams} from '@angular/http';
import {ApiSettings} from './api-settings.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class FacilityService {
  constructor(private http: Http, private settings: ApiSettings) {
  }

  getManagerFacilities(): Observable<any> {

    return this.http.get(this.settings.getApiBaseURL()+ 'facilityManager/getFacilitiesWhereUserIsManager/', {
      withCredentials: true,
    }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))

  }

  getFacilityAllowedGroups(facility): Observable<any> {

       let urlSearchParams = new URLSearchParams();
    return this.http.get(this.settings.getApiBaseURL()+ 'facilityManager/getFacilityAllowedGroups/', {
        withCredentials: true,
        params: {facility_id: facility}
    }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))




  }

  sendMailToFacility(facility,subject,message,reply?): Observable<any> {
      let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('subject', subject);
    urlSearchParams.append('facility_id', facility);
    urlSearchParams.append('message',message);
    urlSearchParams.append('reply',reply)

     let header = new Headers({
      'X-CSRFToken': this.settings.getCSRFToken(),
    });
    return this.http.post(this.settings.getApiBaseURL()+ 'facilityManager/sendMailToAllMembers/',urlSearchParams, {
        withCredentials: true,
        headers: header,
    }).map((res: Response) => res.json()).catch((error: any) => Observable.throw(error.json().error || 'Server error'))






  }

}
