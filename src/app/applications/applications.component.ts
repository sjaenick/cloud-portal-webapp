import {Component, OnInit} from '@angular/core';
import {ApplicationsService} from '../api-connector/applications.service'
import {ApplicationStatusService} from '../api-connector/application-status.service'
import {ApiSettings} from '../api-connector/api-settings.service'
import {Application} from './application.model';
import {GroupService} from '../api-connector/group.service';
import {UserService} from '../api-connector/user.service';
import {NgForm} from '@angular/forms';
import {VoService} from '../api-connector/vo.service';
import {FacilityService} from '../api-connector/facility.service';
import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {FlavorService} from '../api-connector/flavor.service';
import {Client} from "../virtualmachines/clients/client.model";
import {ApplicationBaseClass} from '../shared/shared_modules/baseClass/application-base-class';
import {ComputecenterComponent} from '../projectmanagement/computecenter.component';
import {FlavorType} from '../virtualmachines/virtualmachinemodels/flavorType';
import {IResponseTemplate} from "../api-connector/response-template";
import {forkJoin} from "rxjs/index";

/**
 * Application Overview component.
 */
@Component({
  templateUrl: 'applications.component.html',
  providers: [FacilityService, VoService, UserService, GroupService, ApplicationStatusService,
    ApplicationsService, ApiSettings, FlavorService]
})
export class ApplicationsComponent extends ApplicationBaseClass implements OnInit {

  /**
   * All Applications, just visibile for a vo admin.
   * @type {Array}
   */
  all_applications: Application[] = [];


  /**
   * Limits information for Client tested/used for Simple Vm Project creation.
   */
  notificationClientInfo: Client[] = [];


  /**
   * id of the extension status.
   * @type {number}
   */
  extension_status: number = 0;
  /**
   * id of Application set for deletion.
   */
  public deleteId: number;

  private WAIT_FOR_EXTENSION_STATUS: number = 6;

  /**
   * Total number of cores.
   * @type {number}
   */
  public totalNumberOfCores: number = 0;
  /**
   * Total number of ram.
   * @type {number}
   */
  public totalRAM: number = 0;

  /**
   * Constructor.
   * Loads all Applications if user is vo admin and all user_applications.
   * @param {ApplicationsService} applicationsservice
   * @param {ApplicationStatusService} applicationstatusservice
   * @param {UserService} userservice
   * @param {GroupService} groupservice
   * @param {VoService} voService
   * @param {FacilityService} facilityService
   * @param {FlavorService} flavorService
   */
  constructor(applicationsservice: ApplicationsService,
              applicationstatusservice: ApplicationStatusService,
              userservice: UserService,
              private groupservice: GroupService,
              private voService: VoService,
              facilityService: FacilityService,
              private flavorService: FlavorService) {

    super(userservice, applicationstatusservice, applicationsservice, facilityService);
    this.voService.isVo().subscribe((result: IResponseTemplate) => {
      this.is_vo_admin = <boolean><Boolean>result.value;
      this.getUserApplications();
      this.getApplicationStatus();
      if (this.is_vo_admin) {
        this.getAllApplications();
        this.getComputeCenters();

      } else {
        this.isLoaded_AllApplication = true;

      }

    });
    this.getListOfFlavors();
    this.getListOfTypes();
  }

  ngOnInit(): void {


  }

  /**
   * Checks if the key given represents a flavor and if so returns the respective Flavor
   * @param key the key which is checked
   */
  isKeyFlavor(key: string): Flavor {
    for (const fkey in this.flavorList) {
      if (fkey in this.flavorList) {
        if (this.flavorList[fkey].name === key.substring(20)) {
          return this.flavorList[fkey];
        }
      }
    }

    return null;

  }

  checkIfTypeGotSimpleVmFlavor(type: FlavorType): boolean {
    for (const flav of this.flavorList) {
      if (flav.type.shortcut === type.shortcut && flav.simple_vm) {
        return true
      }

    }
    return false

  }

  /**
   * Get the facility of an application.
   * @param {Application} app
   */
  getFacilityProject(app: Application): void {

    if (!app.ComputeCenter && app.Status !== this.application_states.SUBMITTED && app.Status !== this.application_states.TERMINATED) {
      this.groupservice.getFacilityByGroup(app.PerunId.toString()).subscribe((res: object) => {
        const login: string = res['Login'];
        const suport: string = res['Support'];
        const facilityname: string = res['Facility'];
        const facilityId: number = res['FacilityId'];

        app.ComputeCenter = new ComputecenterComponent(facilityId.toString(), facilityname, login, suport);

      })
    }

  }

  /**
   * Get all Applications if user is admin.
   */
  getAllApplications(): void {
    // todo check if user is VO Admin

    if (this.is_vo_admin) {

      this.applicationsservice.getAllApplications().subscribe(res => {
        if (Object.keys(res).length === 0) {
          this.isLoaded_userApplication = true;
        }
        const newApps: Application [] = this.setNewApplications(res);
        this.all_applications.push.apply(this.all_applications, newApps);

        this.isLoaded_AllApplication = true;
        for (const app of this.all_applications) {
          if (app.Status === this.application_states.WAIT_FOR_CONFIRMATION ||
            app.Status === this.application_states.MODIFICATION_REQUESTED) {
            this.getFacilityProject(app);
          }
        }

      })
    }
  }

  /**
   * Updates an application with the actual values.
   * @param {Application} application
   */
  public getApplication(application: Application): void {
    const index: number = this.all_applications.indexOf(application);

    this.applicationsservice.getApplication(application.Id.toString()).subscribe((aj: object) => {
      const newApp: Application = this.setNewApplication(aj);
      this.all_applications[index] = newApp;
      this.getFacilityProject(newApp);
    });

  }


  /**
   * Gets all Application of the user viewing the application overview.
   * Saves them in the userApplication array.
   */
  getUserApplications(): void {
    this.applicationsservice
      .getUserApplications().subscribe((res: [{ [key: string]: string }]) => {
      if (Object.keys(res).length === 0) {
        this.isLoaded_userApplication = true;
      }
      const newApps: Application [] = this.setNewApplications(res);
      this.user_applications.push.apply(this.user_applications, newApps);
      this.isLoaded_userApplication = true;

    })


  }

  /**
   * Gets a user application with the actual values.
   * @param {Application} application
   */
  public getUserApplication(application: Application): void {
    let index: number = this.user_applications.indexOf(application);

    this.applicationsservice.getUserApplication(application.Id.toString()).subscribe(aj => {
      const newApp: Application = this.setNewApplication(aj);

      this.user_applications[index] = newApp;


    })


  }

  /**
   * Check if active applications are available.
   * @returns {boolean}
   */
  public activeApplicationsAvailable(): boolean {
    for (const application of this.all_applications) {
      if (application.Status === 1 || application.Status === 4 || application.Status === 7 || application.Status === 6) {
        return true;
      }
    }
  }


  /**
   * gets a list of all available Flavors from the flavorservice and puts them into the array flavorList
   */
  getListOfFlavors(): void {
    this.flavorService.getListOfFlavorsAvailable().subscribe((flavors: Flavor[]) => this.flavorList = flavors);
  }

  /**
   * gets a list of all available types of flavors from the flavorservice and uses them in the function setListOfTypes
   */
  getListOfTypes(): void {
    this.flavorService.getListOfTypesAvailable().subscribe((types: FlavorType[]) => this.setListOfTypes(types));
  }


  /**
   * Resets the values of totalRAM und totalNumberOfCores to 0 and changes the text at the end of the extension form.
   * @param elemIDcores the ID of the label containing the number of cores
   * @param elemIDram the ID of the label containing the amount of RAM
   */
  unsetValues(elemIDcores: string, elemIDram: string): void {
    this.totalRAM = 0;
    this.totalNumberOfCores = 0;
    //document.getElementById(elemIDcores).innerHTML = `Number of total cores:  ${this.totalNumberOfCores.toString()}`;
    //document.getElementById(elemIDram).innerHTML = `Total amout of RAM:  ${this.totalRAM.toString()} GB`;

  }

  calculateRamCores() {
    this.totalNumberOfCores = 0;
    this.totalRAM = 0;
    for (const key in this.selectedApplication.CurrentFlavors) {
      const flavor = this.selectedApplication.CurrentFlavors[key];
      if (flavor != null) {
        this.totalNumberOfCores = this.totalNumberOfCores + (flavor.vcpus * flavor.counter);
        this.totalRAM = this.totalRAM + (flavor.ram * flavor.counter);

      }

    }
  }

  /**
   * Called whenvalues of the flavor-input-fields are changed and if so changes the values shown at the end of the form.
   * @param form the form which contains the input-fields
   */
  protected valuesChanged(form: NgForm): void {
    this.totalNumberOfCores = 0;
    this.totalRAM = 0;
    for (const key in form.controls) {
      if (form.controls[key].value) {
        const flavor: Flavor = this.isKeyFlavor(key.toString());
        if (flavor != null) {
          this.totalNumberOfCores = this.totalNumberOfCores + (flavor.vcpus * form.controls[key].value);
          this.totalRAM = this.totalRAM + (flavor.ram * form.controls[key].value);
        }
      }
    }

    //  document.getElementById('corenumbers').innerHTML = `Number of total cores:  ${this.totalNumberOfCores.toString()}`;
    //document.getElementById('ramnumbers').innerHTML = `Total amout of RAM:  ${this.totalRAM.toString()} GB`;

  }


  /**
   * Submits an renewal request for an application.
   * @param {NgForm} form
   */
  onSubmit(form: NgForm): void {
    const values: { [key: string]: string | number | boolean } = {};
    for (const value in form.controls) {
      if (form.controls[value].disabled) {
        continue;
      }
      if (form.controls[value].value) {
        values[value] = form.controls[value].value;
      }
    }
    values['project_application_id'] = this.selectedApplication.Id;
    values['total_cores_new'] = this.totalNumberOfCores;
    values['total_ram_new'] = this.totalRAM;
    this.requestExtension(values);

  }


  /**
   * Returns a string with the end-date of a application which depends on the day it was approved and the lifetime in months
   * @param approval date in string when the application was approved
   * @param months number of months the application is permitted
   */
  getEndDate(months: number, approval?: string,): string {
    if (!approval) {
      return ''
    }
    let date1: Date = new Date(Number(approval.substring(0, 4)), Number(approval.substring(5, 7)) - 1, Number(approval.substring(8)));
    const month: number = date1.getMonth();
    if ((month + months) > 11) {
      date1 = new Date(date1.getFullYear(), (month + months - 12), date1.getDate());
    } else {
      date1.setMonth(date1.getMonth() + months);
    }

    return `${date1.getFullYear()}-${this.fillUp((date1.getMonth() + 1).toString())}-${this.fillUp(date1.getDate().toString())}`;
  }

  fillUp(date: string): string {
    if (date.length === 1) {
      return `0${date}`;
    }

    return date;
  }

  showLifetime(sa?: Application): string {
    if (!sa) {
      return
    }

    return `${sa.DateApproved} - ${this.getEndDate(sa.Lifetime, sa.DateApproved,)}`;
  }

  /**
   * Request an extension from an application.
   * @param data
   */
  public requestExtension(data: { [key: string]: string | number | boolean }): void {
    this.applicationsservice.requestRenewal(data).subscribe((result: { [key: string]: string }) => {
      if (result['Error']) {
        this.extension_status = 2
      } else {
        this.extension_status = 1;
      }
      this.getUserApplication(this.selectedApplication);

      for (const app of this.all_applications) {
        if (this.selectedApplication.PerunId === app.PerunId) {
          this.getApplication(app);
          break;
        }

      }
    })

  }

  /**
   * Terminateda project.
   * Deletes the Perun Group and sets the application status to terminated.
   * @param {Application} app
   */
  public terminateProject(app: Application): void {
    this.applicationstatusservice.setApplicationStatus(app.Id, this.application_states.TERMINATED).subscribe(res => {
      this.getApplication(app);
      if (res === 'null') {
        this.updateNotificationModal('Success', 'The  project was terminated.', true, 'success');

      } else {
        this.updateNotificationModal('Failed', 'The project could not be terminated.', true, 'danger');

      }

    })
  }

  /**
   * Approve an extension request.
   * @param {Application} app
   */
  public approveExtension(app: Application): void {

    if (app.OpenStackProject) {
      this.applicationstatusservice.setApplicationStatus(
        app.Id.toString(),
        this.WAIT_FOR_EXTENSION_STATUS.toString()).subscribe(() => {
        this.extension_status = 5;
        this.getApplication(app);
        this.getUserApplication(app);

        for (const appl of this.user_applications) {
          if (this.selectedApplication.Id.toString() === appl.Id.toString()) {
            this.getUserApplication(appl);
            break;
          }

        }
      })
    } else {
      this.applicationsservice.approveRenewal(app.Id).subscribe((result: { [key: string]: string }) => {
        if (result['Error']) {
          this.extension_status = 2
        } else {
          this.extension_status = 3;
        }
        this.getApplication(this.selectedApplication);

        for (const appl of this.user_applications) {
          if (this.selectedApplication.Id.toString() === appl.PerunId.toString()) {
            this.getUserApplication(appl);
            break;
          }

        }
      })
    }
  }

  /**
   * Decline an extension request.
   * @param {number} application_id
   */
  public declineExtension(application_id: number): void {
    this.applicationsservice.declineRenewal(application_id).subscribe((result: { [key: string]: string }) => {
      if (result != null) {
        this.extension_status = 2
      } else {
        this.extension_status = 4;
      }
      this.getApplication(this.selectedApplication);

      for (const app of this.user_applications) {
        if (this.selectedApplication.PerunId.toString() === app.PerunId.toString()) {
          this.getUserApplication(app);
          break;
        }

      }
    })
  }


  /**
   * Remove Application from facility , where it is for confirmation
   * @param {Application} application the application
   */
  removeApplicationFromFacilityConfirmation(application: Application): void {
    this.groupservice.removeGroupFromResource(application.PerunId.toString()).subscribe(() => {
      this.getApplication(application)
    })

  }

  /**
   * Create a new Group in perun with the specific attributes.
   * @param name
   * @param description
   * @param manager_elixir_id
   * @param application_id
   * @param compute_center
   */
  public createOpenStackProjectGroup(application: Application,
                                     compute_center: string): void {
    this.groupservice.createGroupOpenStack(application.Id, compute_center).subscribe((result: { [key: string]: string }) => {
        if (result['Error']) {
          this.updateNotificationModal('Failed', result['Error'], true, 'danger');

        } else {
          this.updateNotificationModal('Success', 'The new project was created', true, 'success');
        }
        this.getUserApplication(application);
        this.getApplication(application);
      },
      () => {
        this.updateNotificationModal('Failed', 'Project could not be created!', true, 'danger');
      })

  }

  public resetNotificationModal(): void {
    this.notificationModalTitle = 'Notification';
    this.notificationModalMessage = 'Please wait...';
    this.notificationModalIsClosable = false;
    this.notificationModalType = 'info';
    this.notificationClientInfo = [];
  }

  /**
   * Bugfix not scrollable site after closing modal
   */
  removeModalOpen(): void {
    document.body.classList.remove('modal-open');
  }

  /**
   * Create a new Group in perun with the specific attributes.
   * @param name
   * @param description
   * @param manager_elixir_id
   * @param application_id
   * @param compute_center
   */
  public createSimpleVmProjectGroup(app: Application,
                                    compute_center: string): void {
    //todo refactor this
    // get memeber id in order to add the user later as the new member and manager of the group
    let manager_member_id: string;
    let manager_member_user_id: string;
    let new_group_id: string;
    const manager_elixir_id: string = app.UserEmail;
    const description: string = app.Description;
    const application_id: string = <string>app.Id;
    const pi_elixir_id: string = app.PIElixir;
    const name: string = app.Shortname;
    this.applicationsservice.getApplicationClientAvaiable(application_id).subscribe(
      (res: Client) => {
        if (res['Info']) {
          if (res['Clients']) {
            for (const client of res['Clients']) {
              const newClient: Client = new Client(client['host'], client['port'], client['location'], client['id']);
              newClient.location = client.location;
              newClient.maxVolumeLimit = client.max_ressources.maxTotalVolumeGigabytes;
              newClient.maxVolumes = client.max_ressources.maxTotalVolumes;
              newClient.maxVMs = client.max_ressources.maxTotalInstances;
              newClient.assignedVMs = client.assigned_ressources.vms;
              newClient.assignedVolumes = client.assigned_ressources.volumes;
              newClient.assignedVolumesStorage = client.assigned_ressources.volumeLimit;
              this.notificationClientInfo.push(newClient);
            }
          }
          this.updateNotificationModal('Failed', res['Info'], true, 'danger');

        } else {
          this.applicationstatusservice.setApplicationStatus(
            application_id,
            this.application_states.APPROVED.toString()).subscribe((result: { [key: string]: string }) => {
            if (result['Error']) {

              this.updateNotificationModal('Failed', result['Error'], true, 'danger');

            } else {
              forkJoin(
                this.userservice.getMemberByExtSourceNameAndExtLogin(manager_elixir_id),
                this.userservice.getMemberByExtSourceNameAndExtLogin(pi_elixir_id)).subscribe(
                res => {
                  const manager_member = res[0];
                  manager_member_id = manager_member['id'];
                  manager_member_user_id = manager_member['userId'];
                  const pi = res[1];
                  const pi_member_id: string = pi['id'];
                  const pi_member_user_id: string = pi['userId'];
                  this.groupservice.createGroup(name, description).subscribe((group: { [key: string]: string }) => {
                    new_group_id = group['id'];
                    if (manager_elixir_id !== pi_elixir_id) {
                      forkJoin(
                        this.groupservice.addMember(new_group_id, pi_member_id, compute_center),
                        this.groupservice.addAdmin(new_group_id, pi_member_user_id, compute_center)).subscribe()
                    }
                    forkJoin(
                      this.groupservice.addMember(new_group_id, manager_member_id, compute_center),
                      this.groupservice.addAdmin(new_group_id, manager_member_user_id, compute_center)
                    ).subscribe(() => {
                      this.groupservice.setPerunGroupAttributes(application_id, new_group_id).subscribe(() => {
                          if (result['Info']) {
                            this.updateNotificationModal('Failed', result['Info'], true, 'danger');

                          } else {
                            this.applicationsservice.getApplicationClient(
                              application_id).subscribe((client: object) => {
                              const newClient: Client = new Client(client['host'], client['port'], client['location'], client['id']);
                              newClient.maxVolumeLimit = client['max_ressources']['maxTotalVolumeGigabytes'];
                              newClient.maxVolumes = client['max_ressources']['maxTotalVolumes'];
                              newClient.maxVMs = client['max_ressources']['maxTotalInstances'];
                              newClient.assignedVMs = client['assigned_ressources']['vms'];
                              newClient.assignedVolumes = client['assigned_ressources']['volumes'];
                              newClient.assignedVolumesStorage = client['assigned_ressources']['volumeLimit'];
                              this.notificationClientInfo.push(newClient);
                              this.updateNotificationModal(
                                'Success', `The new project was created and assigned to ${newClient.location}.`,
                                true,
                                'success');

                            });
                          }

                          for (const app of this.user_applications) {
                            if (app.Id.toString() === application_id.toString()) {
                              this.getUserApplication(app);
                              break;

                            }

                          }
                          for (const app of this.all_applications) {
                            if (app.Id.toString() === application_id.toString()) {
                              this.getApplication(app);
                              break;

                            }
                          }

                        }
                      )

                    });

                  });

                })
            }

          })
        }

      },
      (error: object) => {
        console.log(error);
        this.updateNotificationModal('Failed', 'Project could not be created!', true, 'danger');
      })

  }

  assignGroupToFacility(group_id: string, application_id: string, compute_center: string): void {
    if (compute_center !== 'undefined') {
      this.groupservice.assignGroupToResource(group_id, compute_center).subscribe(
        () => {
          this.applicationstatusservice.setApplicationStatus(
            application_id,
            this.application_states.WAIT_FOR_CONFIRMATION.toString())
            .subscribe(() => {
              for (const app of this.all_applications) {
                if (app.Id.toString() === application_id) {
                  this.getApplication(app);

                  break;

                }
              }
              this.updateNotificationModal('Success', 'The  project was assigned to the facility.', true, 'success');

            })

        },
        (error: object) => {
          console.log(error);
          this.updateNotificationModal('Failed', 'Project could not be created!', true, 'danger');
        });
    } else {
      this.updateNotificationModal('Failed', 'You need to select an compute center!', true, 'danger');
    }

  }

  /**
   * Decline an application.
   * @param application_id
   */
  public declineApplication(application_id: string): void {
    this.applicationstatusservice.setApplicationStatus(application_id, this.getIdByStatus('declined').toString()).toPromise()
      .then(() => {
        this.all_applications = [];
        this.user_applications = [];
        this.getUserApplications();
        this.getAllApplications();
        this.updateNotificationModal('Success', 'The Application was declined', true, 'success');
      })
      .catch(() => {
        this.updateNotificationModal('Failed', 'Application could be declined!', true, 'danger');
      });
  }

  /**
   * Delete an application.
   * @param application_id
   */
  public deleteApplication(application_id: string | number): void {
    this.applicationsservice.deleteApplication(application_id).toPromise()
      .then(() => {
        this.updateNotificationModal('Success', 'The application has been successfully removed', true, 'success');
      }).then(() => {
      this.user_applications = [];
      this.all_applications = [];
      this.getUserApplications();
      this.getAllApplications();
    })
      .catch(() => {
        this.updateNotificationModal('Failed', 'Application could not be removed!', true, 'danger');
      });
  }


  /**
   * Set the id of the application which should be deleted.
   * @param applicationId
   */
  public setDeleteId(applicationId: number): void {
    this.deleteId = applicationId;
  }


}
