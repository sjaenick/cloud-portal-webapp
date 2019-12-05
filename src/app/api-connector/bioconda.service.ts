import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service'
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cookie} from 'ng2-cookies/ng2-cookies';

const header: HttpHeaders = new HttpHeaders({
                                              'X-CSRFToken': Cookie.get('csrftoken')
                                            });

/**
 * Bioconda service.
 */
@Injectable()
export class BiocondaService {

  constructor(private http: HttpClient) {
  }

  getAllTools(page: number, name?: string, version?: string, build?: string): Observable<any> {
    const params: HttpParams = new HttpParams()
      .set('page', page.toString())
      .set('build', build)
      .set('version', version)
      .set('name', name);

    return this.http.get(`${ApiSettings.getApiBaseURL()}conda/all/`, {
      headers: header,
      withCredentials: true,
      params: params
    })
  }

  getForcTemplates(clientid: string): Observable<any> {
    const params: HttpParams = new HttpParams()
      .set('clientid', clientid);

    return this.http.get(`${ApiSettings.getApiBaseURL()}forc/templates/`, {
      headers: header,
      withCredentials: true,
      params: params
    })
  }
}
