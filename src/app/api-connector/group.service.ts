import {Injectable} from '@angular/core';
import {ApiSettings} from './api-settings.service';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {IResponseTemplate} from './response-template';
import {Client} from '../vo_manager/clients/client.model';
import {ProjectEnumeration} from '../projectmanagement/project-enumeration';
import {Doi} from '../applications/doi/doi';

/**
 * Service which provides Group methods.
 */
@Injectable()
export class GroupService {

  constructor(private http: HttpClient) {
  }

  getProjectOSDetails(groupId: number | string): Observable<object> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupId}/os_details/`, {
      withCredentials: true
    })

  }

  requestProjectTermination(appId: number | string): Observable<any> {
    return this.http.delete(`${ApiSettings.getApiBaseURL()}projects/${appId}/`, {
      withCredentials: true
    })

  }

  getFacilityByGroup(groupid: string): Observable<any> {

    return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/computecenter/`, {
      withCredentials: true
    })

  }

  getClient(groupid: string): Observable<Client> {

    return this.http.get<Client>(`${ApiSettings.getApiBaseURL()}projects/${groupid}/client/`, {
      withCredentials: true
    })

  }

  getClientBibigrid(groupid: string): Observable<Client> {

    return this.http.get<Client>(`${ApiSettings.getApiBaseURL()}projects/${groupid}/cluster/client/`, {
      withCredentials: true
    })

  }

  getClientForcUrl(groupid: string, isClient?: string): Observable<any> {
    if (isClient) {
      const params: HttpParams = new HttpParams().set('client', isClient);

      return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/client/getForc/`, {
        withCredentials: true,
        params: params
      })
    } else {
      return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/client/getForc/`, {
        withCredentials: true
      })
    }
  }

  assignGroupToResource(groupid: string, computecenter: string): Observable<any> {
    const params: HttpParams = new HttpParams().set('compute_center', computecenter);

    return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${groupid}/resource/`, params, {
      withCredentials: true
      // headers: header
    })

  }

  removeGroupFromResource(groupid: string): Observable<any> {

    return this.http.delete(`${ApiSettings.getApiBaseURL()}projects/${groupid}/resource/`, {
      withCredentials: true
    })

  }

  isUserAdminOfGroup(groupid: number | string, userid: number | string): Observable<any> {

    return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/members/${userid}/manager/`, {
      withCredentials: true
    })
  }

  getGroupAdminIds(groupid: number | string): Observable<any> {

    return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/admins/ids/`, {
      withCredentials: true
    })
  }

  getGroupRichMembers(groupid: number | string): Observable<any> {
    const params: HttpParams = new HttpParams().set('groupid', groupid.toString());

    return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/richMembers/`, {
      withCredentials: true,
      params: params
    })
  }

  addMember(group_id: string | number, member_id: string | number, facility_id?: string | number): Observable<any> {
    const params: HttpParams = new HttpParams();
    if (facility_id !== null) {
      params.set('facility_id', facility_id.toString())

    }

    return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${group_id}/members/${member_id}/`, params, {
      withCredentials: true,
      observe: 'response'
    })
  }

  addAdmin(group_id: string | number, user_id: string | number, facility_id?: string | number): Observable<any> {
    const params: HttpParams = new HttpParams();

    if (facility_id !== null) {
      params.set('facility_id', facility_id.toString())

    }

    return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${group_id}/admins/${user_id}/`, params, {
      withCredentials: true,
      observe: 'response'
    })
  }

  removeMember(group_id: number | string, member_id: number | string, facility_id?: number | string): Observable<any> {
    const params: HttpParams = new HttpParams();

    if (facility_id !== null) {
      params.set('facility_id', facility_id.toString())

    }

    return this.http.request('delete', `${ApiSettings.getApiBaseURL()}projects/${group_id}/members/${member_id}/`, {
      withCredentials: true,
      body: params,
      responseType: 'text',
      observe: 'response'
    })
  }

  removeAdmin(group_id: number | string, user_id: number | string, facility_id?: number | string): Observable<any> {

    const params: HttpParams = new HttpParams();

    if (facility_id !== null) {
      params.set('facility_id', facility_id.toString())

    }

    return this.http.request('delete', `${ApiSettings.getApiBaseURL()}projects/${group_id}/admins/${user_id}/`, {
      withCredentials: true,
      responseType: 'text',
      body: params,
      observe: 'response'
    })
  }

  setDescription(groupid: string, description: string): Observable<any> {

    const params: HttpParams = new HttpParams().set('description', description).set('groupid', groupid);

    return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/description/`, params, {
      withCredentials: true
    })

  }

  setPerunGroupStatus(group_id: string, status: string): Observable<any> {

    const params: HttpParams = new HttpParams().set('status', status);

    return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${group_id}/attributes/status/`, params, {
      withCredentials: true
      // headers: header
    })
  }

  setGroupVolumeLimit(group_id: number, value: number): Observable<any> {

    const params: HttpParams = new HttpParams().set('value', value.toString());

    return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${group_id}attributes/volumeLimit/`, params, {
      withCredentials: true
      // headers: header
    })
  }

  setGroupVolumeCounter(group_id: number, value: number): Observable<any> {

    const params: HttpParams = new HttpParams().set('value', value.toString());

    return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${group_id}/attributes/volumesCounter/`, params, {
      withCredentials: true
    })
  }

  setName(groupid: string, name: string): Observable<any> {
    const params: HttpParams = new HttpParams().set('name', name);

    return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/name/`, params, {
      withCredentials: true
    })
  }

  getName(groupid: string): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/name/`, {
      withCredentials: true
    })

  }

  setShortname(groupid: string, shortname: string): Observable<any> {
    const params: HttpParams = new HttpParams().set('shortname', shortname)

    return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/shortname/`, params, {
      withCredentials: true
    })

  }

  getShortame(groupid: string): Observable<any> {

    return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/shortname/`, {
      withCredentials: true,
      params: {groupid: groupid}
    })

  }

  getGroupsDetails(): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}projects/details/`, {
      withCredentials: true
    })
  }

  getGroupsEnumeration(): Observable<ProjectEnumeration[]> {
    return this.http.get<ProjectEnumeration[]>(`${ApiSettings.getApiBaseURL()}projects/enumeration/`, {
      withCredentials: true
    })
  }

  getGroupDetails(groupid: number | string): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/details/`, {
      withCredentials: true
    })
  }

  getGroupApplications(group: number | string): Observable<any> {
    return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${group}/applications/`, {
      withCredentials: true
    })

  }

  approveGroupApplication(groupid: number, application: number): Observable<any> {

    return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${groupid}/applications/${application}/status/`, null, {
      withCredentials: true
    })

  }

  rejectGroupApplication(groupid: number, application: number): Observable<any> {

    return this.http.delete(`${ApiSettings.getApiBaseURL()}projects/${groupid}/applications/${application}/status/`, {
      withCredentials: true
    })

  }

  getSimpleVmByUser(): Observable<any> {

    return this.http.get(`${ApiSettings.getApiBaseURL()}projects/simpleVm/`, {
      withCredentials: true

    })
  }

  getGroupDois(application_id: string | number): Observable<Doi[]> {
    const params: HttpParams = new HttpParams()
      .set('application', application_id.toString());

    return this.http.get<Doi[]>(`${ApiSettings.getApiBaseURL()}doi/`, {
      withCredentials: true,
      params: params
    })
  }

  addGroupDoi(application_id: string | number, doi: string): Observable<Doi[]> {
    const params: HttpParams = new HttpParams()
      .set('application', application_id.toString()).set('doi', doi);

    return this.http.post<Doi[]>(`${ApiSettings.getApiBaseURL()}doi/`, params, {
      withCredentials: true

    })
  }

  deleteGroupDoi(id: string | number): Observable<Doi[]> {
    return this.http.delete<Doi[]>(`${ApiSettings.getApiBaseURL()}doi/${id}/`, {
      withCredentials: true

    })
  }

  createGroupOpenStack(application_id: string | number, compute_center_id: string | number): Observable<any> {
    const params: HttpParams = new HttpParams()
      .set('application_id', application_id.toString())
      .set('compute_center_id', compute_center_id.toString());

    return this.http.post(`${ApiSettings.getApiBaseURL()}projects/openStack/`, params,
                          {
                            withCredentials: true
                          })
  }

  createGroupByApplication(application_id: string | number, compute_center_id?: string): Observable<any> {
    const params: HttpParams = new HttpParams()
      .set('application_id', application_id.toString()).set('compute_center_id', compute_center_id);

    return this.http.post(`${ApiSettings.getApiBaseURL()}projects/simple_vm/`, params,
                          {
                            withCredentials: true
                          })
  }

  getLifetime(groupid: string | number): Observable<IResponseTemplate> {

    return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/lifetime/`, {
      withCredentials: true
    })

  }

  getGroupMembers(groupid: string): Observable<any> {

    return this.http.get(`${ApiSettings.getApiBaseURL()}projects/${groupid}/members/`, {
      withCredentials: true

    })

  }

  getGroupMaxDiskspace(groupid: string): Observable<IResponseTemplate> {
    return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/approvedDiskspace/`, {
      withCredentials: true
    })

  }

  getGroupUsedDiskspace(groupid: string): Observable<IResponseTemplate> {
    return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/usedDiskspace/`, {
      withCredentials: true
    })

  }

  getGroupResources(groupid: string): Observable<IResponseTemplate> {
    return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/all/`, {
      withCredentials: true
    })

  }

  getVolumesUsed(groupid: string): Observable<IResponseTemplate> {
    return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/usedVolumes/`, {
      withCredentials: true
    })
  }

  getVolumeCounter(groupid: string): Observable<IResponseTemplate> {
    return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/volumesCounter/`, {
      withCredentials: true
    })
  }

  getGroupApprovedVms(groupid: string): Observable<IResponseTemplate> {

    return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/approvedVms/`, {
      withCredentials: true
    })

  }

  getGroupUsedVms(groupid: string): Observable<IResponseTemplate> {

    return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/usedVms/`, {
      withCredentials: true
    })

  }

  setPerunGroupAttributes(application_id: string, groupid: string): Observable<any> {
    const params: HttpParams = new HttpParams()
      .set('application_id', application_id.toString());

    return this.http.post(`${ApiSettings.getApiBaseURL()}projects/${groupid}/attributes/`, params, {
      withCredentials: true
    })
  }

  isFreemiumActive(): Observable<IResponseTemplate> {
    return this.http.get<IResponseTemplate>(`${ApiSettings.getApiBaseURL()}freemium/`, {
      withCredentials: true
    })
  }

  addMemberToFreemium(): Observable<any> {

    return this.http.post(`${ApiSettings.getApiBaseURL()}freemium/`, {
      withCredentials: true
    })
  }

}
