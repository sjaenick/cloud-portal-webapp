import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***Image***REMOVED*** from '../virtualmachines/virtualmachinemodels/image';
import ***REMOVED***SnapshotModel***REMOVED*** from '../virtualmachines/snapshots/snapshot.model';
import ***REMOVED***ApiSettings***REMOVED*** from './api-settings.service';
import ***REMOVED***Observable***REMOVED*** from 'rxjs';
import ***REMOVED***HttpClient, HttpHeaders, HttpParams***REMOVED*** from '@angular/common/http';
import ***REMOVED***Cookie***REMOVED*** from 'ng2-cookies/ng2-cookies';
import ***REMOVED***IResponseTemplate***REMOVED*** from './response-template';
import ***REMOVED***ImageTag***REMOVED*** from '../facility_manager/image-tag';

const header: HttpHeaders = new HttpHeaders(***REMOVED***
                                              'X-CSRFToken': Cookie.get('csrftoken')
                                            ***REMOVED***);

/**
 * Service which provides image methods.
 */
@Injectable()
export class ImageService ***REMOVED***
  constructor(private http: HttpClient) ***REMOVED***
  ***REMOVED***

  getImages(project_id: number): Observable<Image[]> ***REMOVED***
    const params: HttpParams = new HttpParams().set('project_id', project_id.toString());

    return this.http.get<Image[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***images/`, ***REMOVED***
      withCredentials: true,
      params: params
    ***REMOVED***)

  ***REMOVED***

  checkSnapshotNameAvailable(snapshot_name: string): Observable<IResponseTemplate> ***REMOVED***

    return this.http.get<IResponseTemplate>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***snapshots/names/`, ***REMOVED***
      withCredentials: true,
      params: ***REMOVED***snapshot_name: snapshot_name***REMOVED***

    ***REMOVED***)

  ***REMOVED***

  getSnapshot(openstack_id: string): Observable<Image> ***REMOVED***

    return this.http.get<Image>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***snapshots/$***REMOVED***openstack_id***REMOVED***/status/`, ***REMOVED***
      withCredentials: true
    ***REMOVED***)

  ***REMOVED***

  getImageTags(): Observable<any> ***REMOVED***
    return this.http.get(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***imageTags/`, ***REMOVED***
      withCredentials: true
    ***REMOVED***)

  ***REMOVED***

  addImageTags(imageTag: string, description: string): Observable<ImageTag> ***REMOVED***

    const params: HttpParams = new HttpParams().set('imageTag', imageTag).set('description', description);

    return this.http.post<ImageTag>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***imageTags/`, params, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)

  ***REMOVED***

  deleteImageTag(imageTag: string): Observable<IResponseTemplate> ***REMOVED***

    return this.http.delete<IResponseTemplate>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***imageTags/$***REMOVED***imageTag***REMOVED***/`, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)

  ***REMOVED***

  createSnapshot(snaptshot_instance: string, snapshot_name: string, description: string): Observable<SnapshotModel> ***REMOVED***

    const params: HttpParams = new HttpParams()
      .set('snapshot_name', snapshot_name)
      .set('snapshot_instance', snaptshot_instance)
      .set('description', description);

    return this.http.post<SnapshotModel>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***snapshots/`, params, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)

  ***REMOVED***

  deleteSnapshot(snapshot_id: string): Observable<IResponseTemplate> ***REMOVED***
    return this.http.delete<IResponseTemplate>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***snapshots/$***REMOVED***snapshot_id***REMOVED***/`, ***REMOVED***
      withCredentials: true,
      headers: header
    ***REMOVED***)

  ***REMOVED***

  getSnapshotsByUser(): Observable<SnapshotModel[]> ***REMOVED***

    return this.http.get<SnapshotModel[]>(`$***REMOVED***ApiSettings.getApiBaseURL()***REMOVED***snapshots/`, ***REMOVED***
      withCredentials: true
    ***REMOVED***)

  ***REMOVED***

***REMOVED***
