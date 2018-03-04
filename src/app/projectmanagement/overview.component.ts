import {Component, Input, ViewChild} from '@angular/core';
import {AuthzResolver} from '../perun-connector/authz-resolver.service'
import {GroupsManager} from '../perun-connector/groups-manager.service'
import {MembersManager} from '../perun-connector/members-manager.service'
import {UsersManager} from '../perun-connector/users-manager.service'
import {Http} from '@angular/http';
import {PerunSettings} from "../perun-connector/connector-settings.service";
import {Project} from './project.model';
import {ModalDirective} from 'ngx-bootstrap/modal/modal.component';
import {ProjectMember} from './project_member.model'
import {ResourcesManager} from "../perun-connector/resources_manager";
import 'rxjs/add/operator/toPromise';
import {isNumber} from "util";
import {environment} from '../../environments/environment'
import {ApiSettings} from "../api-connector/api-settings.service";
import {GroupService} from "../api-connector/group.service";

@Component({
    templateUrl: 'overview.component.html',
    providers: [GroupService, ResourcesManager, AuthzResolver, GroupsManager, MembersManager, UsersManager, PerunSettings, ApiSettings]
})
export class OverviewComponent {

  debug_module = false;

  @Input() voRegistrationLink: string = environment.voRegistrationLink;

  userprojects: {};
  userid: number;
  member_id: number;
  user_data: {};
  admingroups: {};
  adminvos: {};
  filteredMembers = null;
  projects: Project[] = new Array();

  // modal variables for User list
  public usersModal;
  public usersModalProjectMembers: ProjectMember[] = new Array;
  public usersModalProjectID: number;
  public usersModalProjectName: string;

  //modal variables for Add User Modal
  public addUserModal;
  public addUserModalProjectID: number;
  public addUserModalProjectName: string;
  public UserModalFacility: string;


  //notification Modal variables
  public notificationModal;
  public notificationModalTitle: string = "Notification";
  public notificationModalMessage: string = "Please wait...";
  public notificationModalType: string = "info";
  public notificationModalIsClosable: boolean = false;

  constructor(private authzresolver: AuthzResolver,
              private perunsettings: PerunSettings,
              private useresmanager: UsersManager,
              private groupsmanager: GroupsManager,
              private membersmanager: MembersManager,
              private  resourceManager: ResourcesManager,
             private groupservice: GroupService) {
    this.getUserProjects(groupsmanager, membersmanager, useresmanager);
  }

  public updateUserProjects() {
    this.projects = [];
    this.getUserProjects(this.groupsmanager, this.membersmanager, this.useresmanager);
  }



    getUserProjects(groupsmanager: GroupsManager,
                    membersmanager: MembersManager,
                    usersmanager: UsersManager) {
        let user_id: number;
        let member_id: number;
        let user_projects: {};
        let user_data: {};
        let admin_groups: {};
        let admin_vos: {};

        this.authzresolver
            .getLoggedUser().toPromise()
            .then(function (userdata) {
                //TODO catch errors
                let userid = userdata.json()["id"];
                user_id = userid;
                user_data = userdata.json();
                return membersmanager.getMemberByUser(userid).toPromise();
            })
            .then(function (memberdata) {
                let memberid = memberdata.json()["id"];
                member_id = memberid;
                return groupsmanager.getMemberGroups(memberid).toPromise();
            }).then(function (groupsdata) {
            user_projects = groupsdata.json();
        }).then(function () {
            return usersmanager.getGroupsWhereUserIsAdmin(user_id).toPromise();
        }).then(function (admingroups) {
            admin_groups = admingroups.json();
        }).then(function () {
            return usersmanager.getVosWhereUserIsAdmin(user_id).toPromise();
        }).then(function (adminvos) {
            admin_vos = adminvos.json();
        }).then(result => {

            //hold data in the class just in case
            this.userprojects = user_projects;
            this.userid = user_id;
            this.user_data = user_data;
            this.member_id = member_id;
            this.admingroups = admin_groups;
            this.adminvos = admin_vos;

            let is_admin = false;
            //check if user is a Vo admin so we can serv according buttons
            for (let vkey in this.adminvos) {
                if (this.adminvos[vkey]["id"] == this.perunsettings.getPerunVO().toString()) {
                    is_admin = true;
                    break;
                }
            }


            for (let key in this.userprojects) {
                let group = this.userprojects[key];
                let dateCreated = new Date(group["createdAt"]);
                let dateDayDifference = Math.ceil((Math.abs(Date.now() - dateCreated.getTime())) / (1000 * 3600 * 24));
                let is_pi = false;

                //check if user is a PI (group manager)
                if (!is_admin) {
                    for (let gkey in this.admingroups) {
                        if (group["id"] == this.admingroups[gkey]["id"]) {
                            is_pi = true;
                            break;
                        }
                    }
                } else {
                    is_pi = true;
                }
                this.resourceManager.getGroupAssignedResources(group['id']).subscribe(resource => {
                    try {
                        let resource_id = resource.json()[0]['id'];
                        this.resourceManager.getFacilityByResource(resource_id).subscribe(facility => {
                            let newProject = new Project(
                                group["id"],
                                group["name"],
                                group["description"],
                                dateCreated.getDate() + "." + (dateCreated.getMonth() + 1) + "." + dateCreated.getFullYear(),
                                dateDayDifference,
                                is_pi,
                                is_admin,
                                facility.json()['name'])
                            try {
                                this.groupservice.getComputeCentersDetails(resource_id).subscribe(details => {
                                    if (details) {
                                        let details_array = [];
                                        for (let detail in details) {
                                            let detail_as_string = detail + ': ' + details[detail];
                                            details_array.push(detail_as_string);
                                        }
                                        newProject.ComputecenterDetails = details_array;
                                    }
                                    this.projects.push(newProject);

                                })
                            }
                            catch(e){
                                this.projects.push(newProject);
                            }


                        })
                    }
                    catch (e) {

                        this.projects.push(new Project(
                            group["id"],
                            group["name"],
                            group["description"],
                            dateCreated.getDate() + "." + (dateCreated.getMonth() + 1) + "." + dateCreated.getFullYear(),
                            dateDayDifference,
                            is_pi,
                            is_admin,
                            'None')
                        );


                    }
                })


            }

        });
        // .then( function(){ groupsmanager.getGroupsWhereUserIsAdmin(this.userid); });
    }




  public resetAddUserModal() {
    this.addUserModalProjectID = null;
    this.addUserModalProjectName = null;
    this.UserModalFacility = null;
  }

  filterMembers(firstName: string, lastName: string, groupid: number) {
    this.membersmanager.getMembersOfdeNBIVo(firstName, lastName, groupid.toString()).subscribe(result => {
      this.filteredMembers = result;
    })
  }


  getMembesOfTheProject(projectid: number, projectname: string) {
    this.groupsmanager.getGroupRichMembers(projectid).toPromise()
      .then(function (members_raw) {
        return members_raw.json();
      }).then(members => {
      this.usersModalProjectID = projectid;
      this.usersModalProjectName = projectname;
      this.usersModalProjectMembers = new Array();
      for (let member of members) {
        let member_id = member["id"];
        let user_id = member["userId"];
        let fullName = member["user"]["firstName"] + " " + member["user"]["lastName"];
        this.usersModalProjectMembers.push(new ProjectMember(user_id, fullName, member_id));
      }

    });
  }

  public showMembersOfTheProject(projectid: number, projectname: string,facility:string) {
    this.getMembesOfTheProject(projectid, projectname);
    if (facility === 'None') {
      this.UserModalFacility = null;
    }
    else {
      this.UserModalFacility = facility;
    }
  }


  public resetNotificaitonModal() {
    this.notificationModalTitle = "Notification";
    this.notificationModalMessage = "Please wait...";
    this.notificationModalIsClosable = false;
    this.notificationModalType = "info";
  }

  public updateNotificaitonModal(title: string, message: string, closable: true, type: string) {
    this.notificationModalTitle = title;
    this.notificationModalMessage = message;
    this.notificationModalIsClosable = closable;
    this.notificationModalType = type;
  }

  public makeNotificationModalClosable(closable: boolean) {
    this.notificationModalIsClosable = closable;
  }

  public changeNotificationModalTitle(title: string) {
    this.notificationModalTitle = title;
  }

  public changeNotificationModalMessage(message: string) {
    this.notificationModalMessage = message;
  }

  public changeNotificationModalType(type: string) {
    this.notificationModalType = type;
  }

  public showAddUserToProjectModal(projectid: number, projectname: string, facility: string) {
      this.addUserModalProjectID = projectid;
      this.addUserModalProjectName = projectname;
      if (facility === 'None') {
          this.UserModalFacility = null;
      }
      else {
          this.UserModalFacility = facility;

      }
  }





    public addMember(groupid: number, memberid: number, firstName: string, lastName: string) {
        this.groupsmanager.addMember(groupid, memberid).toPromise()
            .then(result => {
                if (result.status == 200) {
                    this.updateNotificaitonModal("Success", "Member " + firstName + " " + lastName + " added.", true, "success");

                } else {
                    this.updateNotificaitonModal("Failed", "Member could not be added!", true, "danger");
                }
            }).catch(error => {
            this.updateNotificaitonModal("Failed", "Member could not be added!", true, "danger");
        });
    }

    public removeMember(groupid: number, memberid: number,name:string) {
        this.groupsmanager.removeMember(groupid, memberid).toPromise()
            .then(result => {
                if (result.status == 200) {
                    this.updateNotificaitonModal("Success", "Member " + name + " removed from the group", true, "success");

                } else {
                    this.updateNotificaitonModal("Failed", "Member"  + name + " could not be removed !", true, "danger");
                }
            }).catch(error => {
            this.updateNotificaitonModal("Failed", "Member"  + name + " could not be removed !", true, "danger");
        });
    }

    public comingSoon() {
        alert("This function will be implemented soon.")
    }
}
