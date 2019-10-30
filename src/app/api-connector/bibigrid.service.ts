import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cookie} from 'ng2-cookies/ng2-cookies';

const header: HttpHeaders = new HttpHeaders({
                                              'X-CSRFToken': Cookie.get('csrftoken')
                                            });

/**
 * Service which provides bibigrid methods.
 */
@Injectable()
export class BibigridService {

  constructor(private http: HttpClient) {
  }

  getClustersByClient(client_id: number | string): Observable<any> {

    return this.http.get(`${ApiSettings.getApiBaseURL()}bibigrid/${client_id}/clusters/`, {
      headers: header,
      withCredentials: true
    })
  }

  terminateCluster(client_id: number | string, cluster_id: string): Observable<any> {

    return this.http.delete(`${ApiSettings.getApiBaseURL()}bibigrid/${client_id}/clusters/${cluster_id}/`, {
      headers: header,
      withCredentials: true
    })
  }

    createCluster(client_id: number | string, masterInstance,w): Observable<any> {

    return this.http.delete(`${ApiSettings.getApiBaseURL()}bibigrid/${client_id}/clusters/${cluster_id}/`, {
      headers: header,
      withCredentials: true
    })
  }

}
