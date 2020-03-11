import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiSettings} from './api-settings.service';
import {DenbiNews} from '../facility_manager/newsmanagement/news';

const header: HttpHeaders = new HttpHeaders({
                                              'X-CSRFToken': Cookie.get('csrftoken')
                                            });

/**
 * Service which provides methods for the facilities.
 */
@Injectable()
export class NewsService {
  constructor(private http: HttpClient) {
  }

  deleteNews(news_id: string): Observable<any> {
    const params: HttpParams = new HttpParams()
      .set('news_id', news_id);

    return this.http.delete(`${ApiSettings.getApiBaseURL()}news-management/`, {
                              withCredentials: true,
                              headers: header,
                              params: params
                            }
    )
  }

  addNews(news: DenbiNews): Observable<any> {
    return this.http.post(`${ApiSettings.getApiBaseURL()}news-management/`, news, {
      withCredentials: true,
      headers: header
    })
  }

  updateNews(news: DenbiNews): Observable<any> {
    return this.http.patch(`${ApiSettings.getApiBaseURL()}news-management/`, news, {
      withCredentials: true,
      headers: header
    })
  }

  getNews(facility_ids: string): Observable<DenbiNews[]> {
    const params: HttpParams = new HttpParams()
      .set('facility_ids', facility_ids);

    return this.http.get<DenbiNews[]>(`${ApiSettings.getApiBaseURL()}news-management/`, {
      withCredentials: true,
      headers: header,
      params: params
    })
  }
}
