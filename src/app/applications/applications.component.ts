import {Component, ViewChild} from '@angular/core';
import {ApplicationsService} from '../api-connector/applications.service'
import {SpecialHardwareService} from '../api-connector/special-hardware.service'
import {ApplicationStatusService} from '../api-connector/application-status.service'
import {ApiSettings} from '../api-connector/api-settings.service'
import {PerunSettings} from "../perun-connector/connector-settings.service";
import {Application} from "./application.model";
import {ApplicationStatus} from "./application_status.model";
import {SpecialHardware} from "./special_hardware.model";
import {ModalDirective} from "ngx-bootstrap";
import {ResourcesManager} from "../perun-connector/resources_manager";
import {GroupService} from "../api-connector/group.service";
import * as moment from 'moment';
import {UserService} from "../api-connector/user.service";
import {ApplicationExtension} from "./application_extension.model";
import {NgForm} from '@angular/forms';
import {forkJoin} from 'rxjs';
import {VoService} from "../api-connector/vo.service";
import {ComputecenterComponent} from "../projectmanagement/computecenter.component";
import {FacilityService} from "../api-connector/facility.service";
import {Project} from "../projectmanagement/project.model";
import {AbstractBaseClasse} from "../shared_modules/baseClass/abstract-base-class";

@Component({
    templateUrl: 'applications.component.html',
    providers: [FacilityService, VoService, UserService, GroupService, PerunSettings, ApplicationStatusService, ApplicationsService, SpecialHardwareService, ApiSettings]
})
export class ApplicationsComponent extends AbstractBaseClasse {

    /**
     * Applications of the user viewing the Application overview.
     * @type {Array}
     */
    user_applications: Application[] = [];

    /**
     * If the user is a vo admin.
     * @type {boolean}
     */
    is_vo_admin = false;

    /**
     * All Applications, just visibile for a vo admin.
     * @type {Array}
     */
    all_applications: Application[] = [];

    /**
     * Stati of the differen Applications.
     * @type {Array}
     */

    application_status: ApplicationStatus[] = [];
    /**
     * Avaiable Special Hardwares.
     * @type {Array}
     */
    special_hardware: SpecialHardware[] = [];

    /**
     * All available compute centers.
     * @type {Array}
     */
    computeCenters: ComputecenterComponent[] = [];

    /**
     * Selected Application.
     */
    selectedApplication: Application;

    /**
     * Id of the extension status.
     * @type {number}
     */
    extension_status = 0;
    /**
     * Id of Application set for deletion.
     */
    public deleteId: number;

    /**
     * If all userApplications are loaded, important for the loader.
     * @type {boolean}
     */
    isLoaded_userApplication = false;

    /**
     * If all Applications are loaded, important for the loader.
     * @type {boolean}
     */
    isLoaded_AllApplication = false;

    /**
     * User which requested the Application {id: Elixir Id of user : {name and email}}.
     * @type {{}}
     */
    application_user: { [id: string]: { [id: string]: string } } = {};

    /**
     * Special hardware id for FPGA.
     * @type {number}
     */
    public FPGA = 1;

    /**
     * Special hardware id for GPU.
     * @type {number}
     */
    public GPU = 2;


    /**
     * Constructor.
     * Loads all Applications if user is vo admin and all user_applications.
     * @param {ApplicationsService} applicataionsservice
     * @param {ApplicationStatusService} applicationstatusservice
     * @param {SpecialHardwareService} specialhardwareservice
     * @param {UserService} userservice
     * @param {GroupService} groupservice
     * @param {VoService} voService
     * @param {FacilityService} facilityService
     */
    constructor(private applicataionsservice: ApplicationsService,
                private applicationstatusservice: ApplicationStatusService,
                private specialhardwareservice: SpecialHardwareService,
                private userservice: UserService,
                private groupservice: GroupService,
                private voService: VoService,
                private facilityService: FacilityService) {
        super()

        this.voService.isVo().subscribe(result => {

            this.is_vo_admin = result['Is_Vo_Manager'];
            this.getUserApplications();
            this.getApplicationStatus();
            this.getSpecialHardware();
            if (this.is_vo_admin) {
                this.getAllApplications();
                this.getComputeCenters();


            }
            else {
                this.isLoaded_AllApplication = true;

            }

        })


    }

    /**
     * Gets all available compute centers and saves them in the computeCenters attribute.
     */
    getComputeCenters() {
        this.facilityService.getComputeCenters().subscribe(result => {
            for (let cc of result) {
                let compute_center = new ComputecenterComponent(cc['compute_center_facility_id'], cc['compute_center_name'], cc['compute_center_login'], cc['compute_center_support_mail'])
                this.computeCenters.push(compute_center)
            }

        })
    }

    /**
     * Gets all affialiations from a user.
     * @param {number} user
     */
    getUserAffilaitions(user: number) {
        this.userservice.getuserAffiliations(user).subscribe()
    }

    /**
     * Sets the selected application.
     * @param application
     */
    setSelectedApplication(application: any) {
        this.selectedApplication = application;
    }

    /**
     * Submits an renewal request for an application.
     * @param {NgForm} f
     */
    onSubmit(f: NgForm) {
        let values = {};
        values['project_application_renewal_special_hardware'] = this.special_hardware.filter(hardware => hardware.Checked).map(hardware => hardware.Id)
        for (let v in f.controls) {
            if (f.controls[v].value) {
                values[v] = f.controls[v].value;
            }
        }
        values['project_application_id'] = this.selectedApplication.Id;
        this.requestExtension(values);

    }

    /**
     * Sets the default values in the request renewal form.
     * @param {NgForm} f
     */
    ngFormSetDefault(f: NgForm) {
        f.reset({
            project_application_renewal_vms_requested: this.selectedApplication.VMsRequested,
            project_application_renewal_cores_per_vm: this.selectedApplication.CoresPerVM,
            project_application_renewal_ram_per_vm: this.selectedApplication.RamPerVM,
            project_application_renewal_volume_limit: this.selectedApplication.VolumeLimit,
            project_application_renewal_volume_counter: this.selectedApplication.VolumeCounter,
            project_application_renewal_object_storage: this.selectedApplication.ObjectStorage,
            project_application_renewal_comment: this.selectedApplication.Comment,


        })

    }

    /**
     * Gets all Application of the user viewing the application overview.
     * Saves them in the userApplication array.
     */
    getUserApplications() {
        this.applicataionsservice
            .getUserApplications().subscribe(result => {
            let res = result;
            if (Object.keys(res).length == 0) {
                this.isLoaded_userApplication = true;
            }
            for (let key in res) {
                let aj = res[key];
                let a = new Application();
                a.Id = aj["project_application_id"];
                a.Name = aj["project_application_name"];
                a.Shortname = aj["project_application_shortname"];
                a.Lifetime = aj["project_application_lifetime"];
                a.DateSubmitted = aj["project_application_date_submitted"];
                a.Status = aj["project_application_status"]["application_status_name"];
                a.Description = aj["project_application_description"];
                a.VMsRequested = aj["project_application_vms_requested"];
                a.RamPerVM = aj["project_application_ram_per_vm"];
                a.TotalRam = aj["project_application_total_ram"];
                a.TotalCores = aj["project_application_total_cores"];
                a.CoresPerVM = aj["project_application_cores_per_vm"];
                a.VolumeLimit = aj["project_application_volume_limit"];
                a.VolumeCounter = aj["project_application_volume_counter"];
                a.ObjectStorage = aj["project_application_object_storage"];
                a.SpecialHardware = aj["project_application_special_hardware"];
                a.OpenStackProject = aj["project_application_openstack_project"];
                a.Comment = aj["project_application_comment"];
                a.PerunId = aj['project_application_perun_id'];

                if (aj['projectapplicationrenewal']) {
                    let r = new ApplicationExtension();

                    r.Id = aj['projectapplicationrenewal']['project_application'];
                    r.Lifetime = aj['projectapplicationrenewal']['project_application_renewal_lifetime'];
                    r.VolumeLimit = aj['projectapplicationrenewal']['project_application_renewal_volume_limit'];
                    r.VolumeCounter = aj['projectapplicationrenewal']['project_application_renewal_volume_counter'];
                    r.VMsRequested = aj['projectapplicationrenewal']['project_application_renewal_vms_requested'];
                    r.Comment = aj['projectapplicationrenewal']['project_application_renewal_comment'];
                    r.CoresPerVM = aj['projectapplicationrenewal']['project_application_renewal_cores_per_vm'];
                    r.ObjectStorage = aj['projectapplicationrenewal']['project_application_renewal_object_storage'];
                    r.RamPerVM = aj['projectapplicationrenewal']['project_application_renewal_ram_per_vm'];
                    r.Comment = aj['projectapplicationrenewal']['project_application_renewal_comment'];
                    let special_hardware = [];
                    if (aj['projectapplicationrenewal']['project_application_renewalspecial_hardware'] != null) {
                        let special_hardware_string = aj['projectapplicationrenewal']['project_application_renewal_special_hardware'].toString();

                        for (let c = 0; c < special_hardware_string.length; c++) {
                            let sh = special_hardware_string.charAt(c) == this.FPGA ? "FPGA" : "GPU";
                            special_hardware.push(sh)

                        }

                        r.SpecialHardware = special_hardware;
                    }
                    a.ApplicationExtension = r;
                }
                this.user_applications.push(a)
            }
            this.isLoaded_userApplication = true;


        });
    }

    /**
     * Get all possible application stati.
     */
    getApplicationStatus() {
        this.applicationstatusservice.getAllApplicationStatus().toPromise()
            .then(result => {
                let res = result;
                for (let key in res) {
                    let asj = res[key];
                    let aj = new ApplicationStatus(asj["application_status_id"], asj["application_status_name"]);
                    this.application_status.push(aj)
                }
            });
    }

    /**
     * Get all available special hardware.
     */
    getSpecialHardware() {
        this.specialhardwareservice.getAllSpecialHardware().toPromise()
            .then(result => {
                let res = result;
                for (let key in res) {
                    let shj = res[key];
                    let sh = new SpecialHardware(shj["special_hardware_id"], shj["special_hardware_key"], shj["special_hardware_name"]);
                    this.special_hardware.push(sh)
                }
            });
    }

    /**
     * Get all Applications if user is admin.
     */
    getAllApplications() {
        //todo check if user is VO Admin

        if (this.is_vo_admin) {
            this.applicataionsservice.getAllApplications().subscribe(res => {
                if (Object.keys(res).length == 0) {
                    this.isLoaded_AllApplication = true;
                }

                for (let key in res) {

                    let aj = res[key];
                    let a = new Application();
                    a.Id = aj["project_application_id"];

                    a.Name = aj["project_application_name"];
                    a.Shortname = aj["project_application_shortname"];
                    a.Description = aj["project_application_description"];
                    a.Lifetime = aj["project_application_lifetime"];

                    a.VMsRequested = aj["project_application_vms_requested"];
                    a.RamPerVM = aj["project_application_ram_per_vm"];
                    a.TotalRam = aj["project_application_total_ram"];
                    a.TotalCores = aj["project_application_total_cores"];
                    a.CoresPerVM = aj["project_application_cores_per_vm"];
                    a.VolumeLimit = aj["project_application_volume_limit"];
                    a.VolumeCounter = aj["project_application_volume_counter"];

                    a.ObjectStorage = aj["project_application_object_storage"];
                    a.SpecialHardware = aj["project_application_special_hardware"];

                    a.Institute = aj["project_application_institute"];
                    a.Workgroup = aj["project_application_workgroup"];

                    a.DateSubmitted = aj["project_application_date_submitted"];
                    a.DateStatusChanged = aj["project_application_date_status_changed"];
                    a.User = aj["project_application_user"]["username"];
                    a.UserAffiliations = aj["project_application_user"]['profile']['affiliations'];
                    a.UserEmail = aj["project_application_user"]["email"];
                    a.Status = aj["project_application_status"];
                    if (a.Status == this.application_statuses.APPROVED) {
                        a.DaysRunning = Math.ceil((Math.abs(Date.now() - new Date(a.DateStatusChanged).getTime())) / (1000 * 3600 * 24));


                    }

                    a.Comment = aj["project_application_comment"];
                    a.PerunId = aj['project_application_perun_id'];
                    a.OpenStackProject = aj["project_application_openstack_project"];
                    if (aj['projectapplicationrenewal']) {
                        let r = new ApplicationExtension();

                        r.Id = aj['projectapplicationrenewal']['project_application'];
                        r.Lifetime = aj['projectapplicationrenewal']['project_application_renewal_lifetime'];
                        r.VolumeLimit = aj['projectapplicationrenewal']['project_application_renewal_volume_limit'];
                        r.VolumeCounter = aj['projectapplicationrenewal']['project_application_renewal_volume_counter'];
                        r.VMsRequested = aj['projectapplicationrenewal']['project_application_renewal_vms_requested'];
                        r.Comment = aj['projectapplicationrenewal']['project_application_renewal_comment'];
                        r.CoresPerVM = aj['projectapplicationrenewal']['project_application_renewal_cores_per_vm'];
                        r.ObjectStorage = aj['projectapplicationrenewal']['project_application_renewal_object_storage'];
                        r.RamPerVM = aj['projectapplicationrenewal']['project_application_renewal_ram_per_vm'];
                        r.Comment = aj['projectapplicationrenewal']['project_application_renewal_comment'];
                        let special_hardware = [];
                        if (aj['projectapplicationrenewal']['project_application_renewalspecial_hardware'] != null) {
                            let special_hardware_string = aj['projectapplicationrenewal']['project_application_renewal_special_hardware'].toString();

                            for (let c = 0; c < special_hardware_string.length; c++) {
                                let sh = special_hardware_string.charAt(c) == this.FPGA ? "FPGA" : "GPU";
                                special_hardware.push(sh)

                            }

                            r.SpecialHardware = special_hardware;
                        }
                        a.ApplicationExtension = r;

                    }

                    this.all_applications.push(a);

                }

                this.isLoaded_AllApplication = true;
                for (let app of this.all_applications) {
                    if (app.Status == this.application_statuses.WAIT_FOR_CONFIRMATION || app.Status == this.application_statuses.MODIFICATION_REQUESTED) {
                        this.getFacilityProject(app);
                    }
                }

            });
        }
        else {
            this.isLoaded_AllApplication = true;

        }


    }

    /**
     * Get the facility of an application.
     * @param {Application} app
     */
    public getFacilityProject(app: Application) {

        if (!app.ComputeCenter && app.Status.toString() != 'submitted') {
            this.groupservice.getFacilityByGroup(app.PerunId.toString()).subscribe(res => {
                let login = res['Login'];
                let suport = res['Support'];
                let facilityname = res['Facility'];
                let facilityId = res['FacilityId'];

                let cc = new ComputecenterComponent(facilityId, facilityname, login, suport);
                app.ComputeCenter = cc


            })
        }

    }

    /**
     * Updates an application with the actual values.
     * @param {Application} application
     */
    public getApplication(application: Application) {
        let index = this.all_applications.indexOf(application);

        this.applicataionsservice.getApplication(application.Id.toString()).subscribe(aj => {
            let a = new Application();
            a.Id = aj["project_application_id"];

            a.Name = aj["project_application_name"];
            a.Shortname = aj["project_application_shortname"];
            a.Description = aj["project_application_description"];
            a.Lifetime = aj["project_application_lifetime"];

            a.VMsRequested = aj["project_application_vms_requested"];
            a.RamPerVM = aj["project_application_ram_per_vm"];

            a.TotalRam = aj["project_application_total_ram"];
            a.TotalCores = aj["project_application_total_cores"];
            a.CoresPerVM = aj["project_application_cores_per_vm"];
            a.VolumeLimit = aj["project_application_volume_limit"];
            a.VolumeCounter = aj["project_application_volume_counter"];

            a.ObjectStorage = aj["project_application_object_storage"];
            a.SpecialHardware = aj["project_application_special_hardware"];

            a.Institute = aj["project_application_institute"];
            a.Workgroup = aj["project_application_workgroup"];

            a.DateSubmitted = aj["project_application_date_submitted"];
            a.DateStatusChanged = aj["project_application_date_status_changed"];
            a.User = aj["project_application_user"]["username"];
            a.UserAffiliations = aj["project_application_user"]['profile']['affiliations'];
            a.UserEmail = aj["project_application_user"]["email"];
            a.Status = aj["project_application_status"];
            if (a.Status == this.application_statuses.APPROVED) {
                a.DaysRunning = Math.ceil((Math.abs(Date.now() - new Date(a.DateStatusChanged).getTime())) / (1000 * 3600 * 24));


            }
            a.Comment = aj["project_application_comment"];
            a.PerunId = aj['project_application_perun_id'];
            a.OpenStackProject = aj["project_application_openstack_project"];
            if (aj['projectapplicationrenewal']) {
                let r = new ApplicationExtension();

                r.Id = aj['projectapplicationrenewal']['project_application'];
                r.Lifetime = aj['projectapplicationrenewal']['project_application_renewal_lifetime'];
                r.VolumeLimit = aj['projectapplicationrenewal']['project_application_renewal_volume_limit'];
                r.VolumeCounter = aj['projectapplicationrenewal']['project_application_renewal_volume_counter'];
                r.VMsRequested = aj['projectapplicationrenewal']['project_application_renewal_vms_requested'];
                r.Comment = aj['projectapplicationrenewal']['project_application_renewal_comment'];
                r.CoresPerVM = aj['projectapplicationrenewal']['project_application_renewal_cores_per_vm'];
                r.ObjectStorage = aj['projectapplicationrenewal']['project_application_renewal_object_storage'];
                r.RamPerVM = aj['projectapplicationrenewal']['project_application_renewal_ram_per_vm'];
                r.Comment = aj['projectapplicationrenewal']['project_application_renewal_comment'];
                let special_hardware = [];
                if (aj['projectapplicationrenewal']['project_application_renewalspecial_hardware'] != null) {
                    let special_hardware_string = aj['projectapplicationrenewal']['project_application_renewal_special_hardware'].toString();

                    for (let c = 0; c < special_hardware_string.length; c++) {
                        let sh = special_hardware_string.charAt(c) == this.FPGA ? "FPGA" : "GPU";
                        special_hardware.push(sh)

                    }

                    r.SpecialHardware = special_hardware;
                }
                a.ApplicationExtension = r;
            }
            this.getFacilityProject(a);

            this.all_applications[index] = a;

        })
    }

    /**
     * Gets a user application with the actual values.
     * @param {Application} application
     */
    public getUserApplication(application: Application) {
        let index = this.user_applications.indexOf(application);

        this.applicataionsservice.getUserApplication(application.Id.toString()).subscribe(aj => {
            let a = new Application();
            a.Id = aj["project_application_id"];
            a.Name = aj["project_application_name"];
            a.Shortname = aj["project_application_shortname"];
            a.Lifetime = aj["project_application_lifetime"];
            a.DateSubmitted = aj["project_application_date_submitted"];
            a.Status = aj["project_application_status"]["application_status_name"];
            a.Description = aj["project_application_description"];
            a.VMsRequested = aj["project_application_vms_requested"];
            a.RamPerVM = aj["project_application_ram_per_vm"];
            a.TotalRam = aj["project_application_total_ram"];
            a.TotalCores = aj["project_application_total_cores"];
            a.CoresPerVM = aj["project_application_cores_per_vm"];
            a.VolumeLimit = aj["project_application_volume_limit"];
            a.VolumeCounter = aj["project_application_volume_counter"];
            a.ObjectStorage = aj["project_application_object_storage"];
            a.SpecialHardware = aj["project_application_special_hardware"];
            a.OpenStackProject = aj["project_application_openstack_project"];
            a.Comment = aj["project_application_comment"];
            if (aj['projectapplicationrenewal']) {
                let r = new ApplicationExtension();

                r.Id = aj['projectapplicationrenewal']['project_application'];
                r.Lifetime = aj['projectapplicationrenewal']['project_application_renewal_lifetime'];
                r.VolumeLimit = aj['projectapplicationrenewal']['project_application_renewal_volume_limit'];
                r.VolumeCounter = aj['projectapplicationrenewal']['project_application_renewal_volume_counter'];
                r.VMsRequested = aj['projectapplicationrenewal']['project_application_renewal_vms_requested'];
                r.Comment = aj['projectapplicationrenewal']['project_application_renewal_comment'];
                r.CoresPerVM = aj['projectapplicationrenewal']['project_application_renewal_cores_per_vm'];
                r.ObjectStorage = aj['projectapplicationrenewal']['project_application_renewal_object_storage'];
                r.RamPerVM = aj['projectapplicationrenewal']['project_application_renewal_ram_per_vm'];
                r.Comment = aj['projectapplicationrenewal']['project_application_renewal_comment'];
                let special_hardware = [];
                if (aj['projectapplicationrenewal']['project_application_renewalspecial_hardware'] != null) {
                    let special_hardware_string = aj['projectapplicationrenewal']['project_application_renewal_special_hardware'].toString();

                    for (let c = 0; c < special_hardware_string.length; c++) {
                        let sh = special_hardware_string.charAt(c) == this.FPGA ? "FPGA" : "GPU";
                        special_hardware.push(sh)

                    }

                    r.SpecialHardware = special_hardware;
                }
                a.ApplicationExtension = r;
            }
            this.user_applications[index] = a;


        })


    }

    /**
     * Request an extension from an application.
     * @param data
     */
    public requestExtension(data) {
        this.applicataionsservice.requestRenewal(data).subscribe(result => {
            if (result['Error']) {
                this.extension_status = 2
            }
            else {
                this.extension_status = 1;
            }
            this.getUserApplication(this.selectedApplication);

            for (let app of this.all_applications) {
                if (this.selectedApplication.PerunId == app.PerunId) {
                    this.getApplication(app);
                    break;
                }

            }
        })


    }

    /**
     * Get details of member like name and email by elixir.
     * @param {string} elixir_id
     * @param {string} collapse_id
     */
    public getMemberDetailsByElixirIdIfCollapsed(elixir_id: string, collapse_id: string) {
        if (!this.getCollapseStatus(collapse_id)) {
            if (!(elixir_id in this.application_user)) {
                this.userservice.getMemberDetailsByElixirId(elixir_id).subscribe(result => {

                    let name = result['firstName'] + ' ' + result['lastName'];
                    let appuser: { [id: string]: string } = {};
                    appuser['name'] = name;
                    appuser['email'] = result['email'];
                    this.application_user[elixir_id] = appuser;
                })
            }
        }


    }

    /**
     * Approve an extension request.
     * @param {number} application_id
     */
    public approveExtension(application_id: number) {
        this.applicataionsservice.approveRenewal(application_id).subscribe(result => {
            if (result['Error']) {
                this.extension_status = 2
            }
            else {
                this.extension_status = 3;
            }
            this.getApplication(this.selectedApplication);

            for (let app of this.user_applications) {
                if (this.selectedApplication.PerunId == app.PerunId) {
                    this.getUserApplication(app);
                    break;
                }

            }
        })
    }

    /**
     * Decline an extension request.
     * @param {number} application_id
     */
    public declineExtension(application_id: number) {
        this.applicataionsservice.declineRenewal(application_id).subscribe(result => {
            if (result != null) {
                this.extension_status = 2
            }
            else {
                this.extension_status = 4;
            }
            this.getApplication(this.selectedApplication);

            for (let app of this.user_applications) {
                if (this.selectedApplication.PerunId == app.PerunId) {
                    this.getUserApplication(app);
                    break;
                }

            }
        })
    }


    /**
     * Get status name  by status id.
     * @param {number} id
     * @returns {string}
     */
    public getStatusById(id: number): string {
        let s = "Unknown";
        for (let status of this.application_status) {
            if (status.Id == id) {
                return status.Name;
            }
        }
        return s;
    }


    /**
     * Get id by status name.
     * @param {string} name
     * @returns {number}
     */
    public getIdByStatus(name: string): number {
        let s = -1;
        for (let status of this.application_status) {
            if (status.Name == name) {
                return status.Id;
            }
        }
        return s;
    }


    /**
     * Remove Application from facility , where it is for confirmation
     * @param {Application} application the application
     */
    removeApplicationFromFacilityConfirmation(application: Application) {
        this.groupservice.removeGroupFromResource(application.PerunId.toString()).subscribe(res => {
            this.getApplication(application)
        })

    }


    public createOpenStackProjectGroup(name, description, manager_elixir_id, application_id, compute_center) {
        //get memeber id in order to add the user later as the new member and manager of the group
        let manager_member_id: number;
        let manager_member_user_id: number;
        let new_group_id: number;

        this.userservice.getMemberByExtSourceNameAndExtLogin(manager_elixir_id).subscribe(member_raw => {
                let member = member_raw;
                manager_member_id = member["id"];
                manager_member_user_id = member["userId"];
                this.groupservice.createGroup(name, description).subscribe(group_raw => {
                    let group = group_raw;
                    new_group_id = group["id"];
                    this.groupservice.addMember(new_group_id, manager_member_id, compute_center).subscribe();
                    this.groupservice.addAdmin(new_group_id, manager_member_user_id, compute_center).subscribe(res => {
                        this.groupservice.setPerunGroupAttributes(application_id, new_group_id).subscribe(res => {
                            this.groupservice.assignGroupToResource(new_group_id.toString(), compute_center).subscribe(res => {
                                this.applicationstatusservice.setApplicationStatus(application_id, this.application_statuses.WAIT_FOR_CONFIRMATION, compute_center).subscribe(result => {
                                        if (result['Error']) {
                                            this.updateNotificationModal("Failed", result['Error'], true, "danger");

                                        }
                                        else {
                                            this.updateNotificationModal("Success", "The new project was created", true, "success");
                                        }
                                        for (let app of this.user_applications) {
                                            if (app.Id == application_id) {
                                                this.getUserApplication(app);
                                                break;

                                            }


                                        }
                                        for (let app of this.all_applications) {
                                            if (app.Id == application_id) {
                                                this.getApplication(app);
                                                break;

                                            }
                                        }
                                    }
                                )
                            });
                        })

                    })

                })
            }

            , error => {
                console.log(error);
                this.updateNotificationModal("Failed", "Project could not be created!", true, "danger");
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
    public createSimpleVmProjectGroup(name, description, manager_elixir_id, application_id, compute_center) {

        //get memeber id in order to add the user later as the new member and manager of the group
        let manager_member_id: number;
        let manager_member_user_id: number;
        let new_group_id: number;
        this.applicationstatusservice.setApplicationStatus(application_id, this.application_statuses.APPROVED, compute_center).subscribe(result => {
            if (result['Error']) {
                this.updateNotificationModal("Failed", result['Error'], true, "danger");
                this

            }
            else {


                this.userservice.getMemberByExtSourceNameAndExtLogin(manager_elixir_id).subscribe(member_raw => {
                    let member = member_raw;
                    manager_member_id = member["id"];
                    manager_member_user_id = member["userId"];
                    this.groupservice.createGroup(name, description).subscribe(group_raw => {
                        let group = group_raw;
                        new_group_id = group["id"];
                        this.groupservice.addMember(new_group_id, manager_member_id, compute_center).subscribe();
                        this.groupservice.addAdmin(new_group_id, manager_member_user_id, compute_center).subscribe(res => {
                            this.groupservice.setPerunGroupAttributes(application_id, new_group_id).subscribe(res => {
                                    if (result['Error']) {
                                        this.updateNotificationModal("Failed", result['Error'], true, "danger");

                                    }
                                    else {
                                        this.updateNotificationModal("Success", "The new project was created", true, "success");
                                    }

                                    for (let app of this.user_applications) {
                                        if (app.Id == application_id) {
                                            this.getUserApplication(app);
                                            break;

                                        }


                                    }
                                    for (let app of this.all_applications) {
                                        if (app.Id == application_id) {
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

        }, error => {
            console.log(error);
            this.updateNotificationModal("Failed", "Project could not be created!", true, "danger");
        })


    }

    assignGroupToFacility(group_id, application_id, compute_center) {
        if (compute_center != 'undefined') {
            this.groupservice.assignGroupToResource(group_id.toString(), compute_center).subscribe(res => {
                    this.applicationstatusservice.setApplicationStatus(application_id, this.application_statuses.WAIT_FOR_CONFIRMATION, compute_center).subscribe(res => {
                        for (let app of this.all_applications) {
                            if (app.Id == application_id) {
                                this.getApplication(app);

                                break;

                            }
                        }
                        this.updateNotificationModal("Success", "The  project was assigned to the facility.", true, "success");

                    })


                },
                error => {
                    console.log(error);
                    this.updateNotificationModal("Failed", "Project could not be created!", true, "danger");
                });
        }
        else{
             this.updateNotificationModal("Failed", "You need to select an compute center!", true, "danger");
        }

    }

    /**
     * Decline an application.
     * @param application_id
     */
    public declineApplication(application_id) {
        this.applicationstatusservice.setApplicationStatus(application_id, this.getIdByStatus("declined"), '').toPromise()
            .then(result => {
                this.all_applications = [];
                this.user_applications = [];
                this.getUserApplications();
                this.getAllApplications();
                this.updateNotificationModal("Success", "The Application was declined", true, "success");
            })
            .catch(error => {
                this.updateNotificationModal("Failed", "Application could be declined!", true, "danger");
            });
    }

    /**
     * Delete an application.
     * @param application_id
     */
    public deleteApplication(application_id) {
        this.applicataionsservice.deleteApplication(application_id).toPromise()
            .then(result => {
                this.updateNotificationModal('Success', 'The application has been successfully removed', true, 'success');
            }).then(result => {
            this.user_applications = [];
            this.all_applications = [];
            this.getUserApplications();
            this.getAllApplications();
        })
            .catch(error => {
                this.updateNotificationModal("Failed", "Application could not be removed!", true, "danger");
            });
    }

    /**
     * Check if active applications are available.
     * @returns {boolean}
     */
    public activeApplicationsAvailable(): boolean {
        for (let application of this.all_applications) {
            if (application.Status == 1 || application.Status == 4 || application.Status == 7 || application.Status == 6) {
                return true;
            }
        }
    }


    /**
     * Set the id of the application which should be deleted.
     * @param applicationId
     */
    public setDeleteId(applicationId) {
        this.deleteId = applicationId;
    }


    /**
     * Coming soon.
     */
    public comingSoon() {
        alert("This functinality will be implemented soon!")
    }


}
