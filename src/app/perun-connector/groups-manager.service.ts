import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {PerunSettings}  from './connector-settings.service'
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import {ApiSettings} from "../api-connector/api-settings.service";
import {Project} from "../projectmanagement/project.model";

@Injectable()
export class GroupsManager {
  constructor(private http: Http, private settings: PerunSettings, private apiSettings: ApiSettings) {
  }

  getMemberGroups(member_id: number) {
    return this.http.get(this.settings.getPerunBaseURL() + 'groupsManager/getMemberGroups', {
      headers: new Headers({ 'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()}),
      params: {member: member_id}
    });
  }





  createGroup(group_name: string, group_description: string) {
    var parameter = JSON.stringify({
      vo: this.settings.getPerunVO(),
      group: {name: group_name, description: group_description}
    });
    return this.http.post(this.settings.getPerunBaseURL() + 'groupsManager/createGroup', parameter,
      {
        headers: new Headers({ 'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()}),
      });
  }

  getGroupRichMembers(group_id: number) {
    return this.http.get(this.settings.getPerunBaseURL() + 'groupsManager/getGroupRichMembers', {
      headers: new Headers({ 'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()}),
      params: {group: group_id}
    });
  }

  addMember(group_id: number, member_id: number) {
    var parameter = JSON.stringify({
      group: group_id,
      member: member_id
    });
    return this.http.post(this.settings.getPerunBaseURL() + 'groupsManager/addMember', parameter,
      {
      headers: new Headers({ 'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()}),
      });
  }

  addAdmin(group_id: number, user_id: number) {
    var parameter = JSON.stringify({
      group: group_id,
      user: user_id
    });
    return this.http.post(this.settings.getPerunBaseURL() + 'groupsManager/addAdmin', parameter,
      {
        headers: new Headers({ 'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()}),
      });
  }

  removeMember(group_id: number, member_id: number) {
    var parameter = JSON.stringify({
      group: group_id,
      member: member_id
    });
    return this.http.post(this.settings.getPerunBaseURL() + 'groupsManager/removeMember', parameter,
      {
        headers: new Headers({ 'Authorization': 'Bearer ' + this.apiSettings.getAccessToken()}),
      });
  }

}
