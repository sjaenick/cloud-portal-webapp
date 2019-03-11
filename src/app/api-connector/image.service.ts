import {Injectable} from '@angular/core';
import {Image} from '../virtualmachines/virtualmachinemodels/image';
import {SnapshotModel} from '../virtualmachines/snapshots/snapshot.model';
import {ApiSettings} from './api-settings.service';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Cookie} from 'ng2-cookies/ng2-cookies';

const header: HttpHeaders = new HttpHeaders({
    'X-CSRFToken': Cookie.get('csrftoken')
});

/**
 * Service which provides image methods.
 */
@Injectable()
export class ImageService {
    constructor(private http: HttpClient) {
    }

    getImages(project_id: number): Observable<Image[]> {
        const params: HttpParams = new HttpParams().set('project_id', project_id.toString());

        return this.http.get<Image[]>(`${ApiSettings.getApiBaseURL()}images/`, {
            withCredentials: true,
            params: params
        })

    }

    getImagesSnapshotsNames(): Observable<any> {

        return this.http.get<Image[]>(`${ApiSettings.getApiBaseURL()}snapshots/names/`, {
            withCredentials: true
        })

    }

    checkSnapshotNameVaiable(snapshot_name: string): Observable<any> {

        return this.http.get<Image[]>(`${ApiSettings.getApiBaseURL()}snapshots/names/`, {
            withCredentials: true,
            params: {snapshot_name: snapshot_name}

        })

    }

    getSnapshot(openstack_id: string): Observable<Image> {

        return this.http.get<Image>(`${ApiSettings.getApiBaseURL()}snapshots/${openstack_id}/status/`, {
            withCredentials: true
        })

    }

    getImageTags(): Observable<any> {
        return this.http.get(`${ApiSettings.getApiBaseURL()}imageTags/`, {
            withCredentials: true
        })

    }

    addImageTags(imageTag: string, description: string): Observable<any> {

        const params: HttpParams = new HttpParams().set('imageTag', imageTag).set('description', description);

        return this.http.post(`${ApiSettings.getApiBaseURL()}imageTags/`, params, {
            withCredentials: true,
            headers: header
        })

    }

    deleteImageTag(imageTag: string): Observable<any> {

        return this.http.delete(`${ApiSettings.getApiBaseURL()}imageTags/${imageTag}/`, {
            withCredentials: true,
            headers: header
        })

    }

    createSnapshot(snaptshot_instance: string, snapshot_name: string): Observable<any> {

        const params: HttpParams = new HttpParams().set('snapshot_name', snapshot_name).set('snapshot_instance', snaptshot_instance);

        return this.http.post(`${ApiSettings.getApiBaseURL()}snapshots/`, params, {
            withCredentials: true,
            headers: header
        })

    }

    deleteSnapshot(snapshot_id: string): Observable<any> {
        return this.http.delete(`${ApiSettings.getApiBaseURL()}snapshots/${snapshot_id}/`, {
            withCredentials: true,
            headers: header
        })

    }

    getSnapshotsByUser(): Observable<SnapshotModel[]> {

        return this.http.get<SnapshotModel[]>(`${ApiSettings.getApiBaseURL()}snapshots/`, {
            withCredentials: true
        })

    }

}
