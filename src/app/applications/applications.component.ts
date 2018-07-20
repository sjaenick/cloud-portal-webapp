import ***REMOVED***Component, ViewChild***REMOVED*** from '@angular/core';
import 'rxjs/add/operator/toPromise';
import ***REMOVED***ApplicationsService***REMOVED*** from '../api-connector/applications.service'
import ***REMOVED***SpecialHardwareService***REMOVED*** from '../api-connector/special-hardware.service'
import ***REMOVED***ApplicationStatusService***REMOVED*** from '../api-connector/application-status.service'
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service'
import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***Application***REMOVED*** from "./application.model";
import ***REMOVED***ApplicationStatus***REMOVED*** from "./application_status.model";
import ***REMOVED***SpecialHardware***REMOVED*** from "./special_hardware.model";
import ***REMOVED***ModalDirective***REMOVED*** from 'ngx-bootstrap/modal/modal.component';
import ***REMOVED***ResourcesManager***REMOVED*** from "../perun-connector/resources_manager";
import ***REMOVED***GroupService***REMOVED*** from "../api-connector/group.service";
import * as moment from 'moment';
import ***REMOVED***UserService***REMOVED*** from "../api-connector/user.service";
import ***REMOVED***ApplicationExtension***REMOVED*** from "./application_extension.model";
import ***REMOVED***NgForm***REMOVED*** from '@angular/forms';


@Component(***REMOVED***
    templateUrl: 'applications.component.html',
    providers: [UserService, GroupService, PerunSettings, ApplicationsService, ApplicationStatusService, SpecialHardwareService, ApiSettings]
***REMOVED***)
export class ApplicationsComponent ***REMOVED***

    user_applications: Application[] = [];
    is_vo_admin = false;
    all_applications: Application[] = [];
    application_status: ApplicationStatus[] = [];
    all_applications_renewal: ApplicationExtension[] = [];
    special_hardware: SpecialHardware[] = [];
    computeCenters: [string, number][];
    selectedApplication: Application;
    public deleteId: number;

    //notification Modal variables
    public notificationModal;
    public notificationModalTitle: string = "Notification";
    public notificationModalMessage: string = "Please wait...";
    public notificationModalType: string = "info";
    public notificationModalIsClosable: boolean = false;
    private APPROVED_STATUS = 2;
    private EXTENSION_STATUS = 4;
    private EXTENSTION_STATUS_STRING = 'extension requested';
    public FPGA = 1;
    public GPU = 2;

    collapse_status: ***REMOVED*** [id: string]: boolean ***REMOVED*** = ***REMOVED******REMOVED***;

    constructor(private applicataionsservice: ApplicationsService,
                private applicationstatusservice: ApplicationStatusService,
                private specialhardwareservice: SpecialHardwareService,
                private perunsettings: PerunSettings,
                private userservice: UserService,
                private groupservice: GroupService) ***REMOVED***

        this.getUserApplications();
        this.getAllApplications();
        this.getApplicationStatus();
        this.getSpecialHardware();
        this.getComputeCenters()



    ***REMOVED***

    getComputeCenters() ***REMOVED***
        this.groupservice.getComputeCenters().subscribe(result => ***REMOVED***
            this.computeCenters = result;
        ***REMOVED***)
    ***REMOVED***


    setSelectedApplication(application: any) ***REMOVED***
        this.selectedApplication = application;
    ***REMOVED***

    onSubmit(f: NgForm) ***REMOVED***
        let values = ***REMOVED******REMOVED***;
        values['project_application_renewal_special_hardware'] = this.special_hardware.filter(hardware => hardware.Checked).map(hardware => hardware.Id)
        for (let v in f.controls) ***REMOVED***
            if (f.controls[v].value) ***REMOVED***
                values[v] = f.controls[v].value;
            ***REMOVED***
        ***REMOVED***
        values['project_application_id'] = this.selectedApplication.Id;
        this.requestExtension(values);

    ***REMOVED***

    ngFormSetDefault(f: NgForm) ***REMOVED***
        f.reset(***REMOVED***
            project_application_renewal_vms_requested : this.selectedApplication.VMsRequested,
            project_application_renewal_cores_per_vm : this.selectedApplication.CoresPerVM,
            project_application_renewal_ram_per_vm : this.selectedApplication.RamPerVM,
            project_application_renewal_volume_limit: this.selectedApplication.VolumeLimit,
            project_application_renewal_volume_counter: this.selectedApplication.VolumeCounter,
            project_application_renewal_object_storage: this.selectedApplication.ObjectStorage,
            project_application_renewal_comment: this.selectedApplication.Comment,


        ***REMOVED***)

    ***REMOVED***

    getUserApplications() ***REMOVED***
        this.applicataionsservice
            .getUserApplications().toPromise()
            .then(result => ***REMOVED***
                let res = result.json();
                for (let key in res) ***REMOVED***
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
                    a.CoresPerVM = aj["project_application_cores_per_vm"];
                    a.VolumeLimit = aj["project_application_volume_limit"];
                    a.VolumeCounter = aj["project_application_volume_counter"];
                    a.ObjectStorage = aj["project_application_object_storage"];
                    a.SpecialHardware = aj["project_application_special_hardware"];
                    a.OpenStackProject = aj["project_application_openstack_project"];
                    a.Comment = aj["project_application_comment"];
                    if (a.Status.toString() == this.EXTENSTION_STATUS_STRING) ***REMOVED***
                        this.applicataionsservice.getApplicationsRenewalRequest(a.Id).subscribe(result => ***REMOVED***
                            res = result.json();
                            let r = new ApplicationExtension();


                            r.Id = res['project_application'];
                            r.Lifetime = res['project_application_renewal_lifetime'];
                            r.VolumeLimit = res['project_application_renewal_volume_limit'];
                            r.VolumeCounter = res['project_application_renewal_volume_counter'];
                            r.VMsRequested = res['project_application_renewal_vms_requested'];
                            r.Comment = res['project_application_renewal_comment'];
                            r.CoresPerVM = res['project_application_renewal_cores_per_vm'];
                            r.ObjectStorage = res['project_application_renewal_object_storage'];
                            r.RamPerVM = res['project_application_renewal_ram_per_vm'];
                            r.Comment = res['project_application_renewal_comment'];
                            let special_hardware = [];
                            if (res['project_application_renewal_special_hardware'] != null) ***REMOVED***
                                let special_hardware_string = res['project_application_renewal_special_hardware'].toString();

                                for (let c = 0; c < special_hardware_string.length; c++) ***REMOVED***
                                    let sh = special_hardware_string.charAt(c) == this.FPGA ? "FPGA" : "GPU";
                                    special_hardware.push(sh)

                                ***REMOVED***

                                r.SpecialHardware = special_hardware;
                            ***REMOVED***
                            a.ApplicationExtension = r;
                            this.user_applications.push(a)
                        ***REMOVED***)

                    ***REMOVED***
                    else ***REMOVED***
                        this.user_applications.push(a)
                    ***REMOVED***


                ***REMOVED***
            ***REMOVED***);
    ***REMOVED***

    getApplicationStatus() ***REMOVED***
        this.applicationstatusservice.getAllApplicationStatus().toPromise()
            .then(result => ***REMOVED***
                let res = result.json();
                for (let key in res) ***REMOVED***
                    let asj = res[key];
                    let aj = new ApplicationStatus(asj["application_status_id"], asj["application_status_name"]);
                    this.application_status.push(aj)
                ***REMOVED***
            ***REMOVED***);
    ***REMOVED***

    getSpecialHardware() ***REMOVED***
        this.specialhardwareservice.getAllSpecialHardware().toPromise()
            .then(result => ***REMOVED***
                let res = result.json();
                for (let key in res) ***REMOVED***
                    let shj = res[key];
                    let sh = new SpecialHardware(shj["special_hardware_id"], shj["special_hardware_key"], shj["special_hardware_name"]);
                    this.special_hardware.push(sh)
                ***REMOVED***
            ***REMOVED***);
    ***REMOVED***

    getAllApplicationsExtensions() ***REMOVED***

    ***REMOVED***

    getAllApplications() ***REMOVED***
        //todo check if user is VO Admin
        let user_id: number;
        let admin_vos: ***REMOVED******REMOVED***;
        this.userservice
            .getLoggedUser().toPromise()
            .then(userdata => ***REMOVED***
                //TODO catch errors
                user_id = userdata.json()["id"];
                return this.userservice.getVosWhereUserIsAdmin(user_id).toPromise();
            ***REMOVED***).then(function (adminvos) ***REMOVED***
            admin_vos = adminvos.json();
        ***REMOVED***).then(result => ***REMOVED***
                //check if user is a Vo admin so we can serv according buttons
                for (let vkey in admin_vos) ***REMOVED***
                    if (admin_vos[vkey]["id"] == this.perunsettings.getPerunVO().toString()) ***REMOVED***
                        this.is_vo_admin = true;
                        this.applicataionsservice
                            .getAllApplications().toPromise()
                            .then(result => ***REMOVED***
                                let res = result.json();

                                for (let key in res) ***REMOVED***

                                    let aj = res[key];
                                    let a = new Application();
                                    a.Id = aj["project_application_id"];

                                    a.Name = aj["project_application_name"];
                                    a.Shortname = aj["project_application_shortname"];
                                    a.Description = aj["project_application_description"];
                                    a.Lifetime = aj["project_application_lifetime"];

                                    a.VMsRequested = aj["project_application_vms_requested"];
                                    a.RamPerVM = aj["project_application_ram_per_vm"];
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
                                    a.UserEmail = aj["project_application_user"]["email"];
                                    a.Status = aj["project_application_status"];
                                    if (a.Status == this.APPROVED_STATUS) ***REMOVED***
                                        a.DaysRunning = Math.ceil((Math.abs(Date.now() - new Date(a.DateStatusChanged).getTime())) / (1000 * 3600 * 24));


                                    ***REMOVED***

                                    a.Comment = aj["project_application_comment"];
                                    a.OpenStackProject = aj["project_application_openstack_project"];
                                    if (a.Status !== 1) ***REMOVED***
                                        if (aj['project_application_perun_id']) ***REMOVED***
                                            this.groupservice.getFacilityByGroup(aj['project_application_perun_id']).subscribe(result => ***REMOVED***

                                                let details = result['Details'];
                                                let details_array = [];
                                                for (let detail in details) ***REMOVED***
                                                    let detail_tuple = [detail, details[detail]];
                                                    details_array.push(detail_tuple);
                                                ***REMOVED***

                                                a.ComputecenterDetails = details_array;
                                                a.ComputeCenter = [result['Facility'], result['FacilityID']];

                                                if (a.Status == this.EXTENSION_STATUS) ***REMOVED***
                                                    this.applicataionsservice.getApplicationsRenewalRequest(a.Id).subscribe(result => ***REMOVED***
                                                        res = result.json()
                                                        let r = new ApplicationExtension();

                                                        r.Id = res['project_application'];
                                                        r.Lifetime = res['project_application_renewal_lifetime'];
                                                        r.VolumeLimit = res['project_application_renewal_volume_limit'];
                                                        r.VolumeCounter = res['project_application_renewal_volume_counter'];
                                                        r.VMsRequested = res['project_application_renewal_vms_requested'];
                                                        r.Comment = res['project_application_renewal_comment'];
                                                        r.CoresPerVM = res['project_application_renewal_cores_per_vm'];
                                                        r.ObjectStorage = res['project_application_renewal_object_storage'];
                                                        r.RamPerVM = res['project_application_renewal_ram_per_vm'];
                                                        r.Comment = res['project_application_renewal_comment'];
                                                        let special_hardware = [];
                                                        if (res['project_application_renewal_special_hardware'] != null) ***REMOVED***
                                                            let special_hardware_string = res['project_application_renewal_special_hardware'].toString();

                                                            for (let c = 0; c < special_hardware_string.length; c++) ***REMOVED***
                                                                let sh = special_hardware_string.charAt(c) == this.FPGA ? "FPGA" : "GPU";
                                                                special_hardware.push(sh)

                                                            ***REMOVED***

                                                            r.SpecialHardware = special_hardware;
                                                        ***REMOVED***
                                                        a.ApplicationExtension = r
                                                        this.all_applications.push(a)
                                                    ***REMOVED***)

                                                ***REMOVED***
                                                else ***REMOVED***
                                                    this.all_applications.push((a))
                                                ***REMOVED***

                                            ***REMOVED***)

                                        ***REMOVED***
                                    ***REMOVED***
                                    else ***REMOVED***
                                        a.ComputeCenter = ['None', -1]

                                        if (a.Status == this.EXTENSION_STATUS) ***REMOVED***
                                            this.applicataionsservice.getApplicationsRenewalRequest(a.Id).subscribe(result => ***REMOVED***
                                                res = result.json()
                                                let r = new ApplicationExtension();

                                                r.Id = res['project_application'];
                                                r.Lifetime = res['project_application_renewal_lifetime'];
                                                r.VolumeLimit = res['project_application_renewal_volume_limit'];
                                                r.VolumeCounter = res['project_application_renewal_volume_counter'];
                                                r.VMsRequested = res['project_application_renewal_vms_requested'];
                                                r.Comment = res['project_application_renewal_comment'];
                                                r.CoresPerVM = res['project_application_renewal_cores_per_vm'];
                                                r.ObjectStorage = res['project_application_renewal_object_storage'];
                                                r.RamPerVM = res['project_application_renewal_ram_per_vm'];
                                                r.Comment = res['project_application_renewal_comment'];
                                                let special_hardware = [];
                                                if (res['project_application_renewal_special_hardware'] != null) ***REMOVED***
                                                    let special_hardware_string = res['project_application_renewal_special_hardware'].toString();

                                                    for (let c = 0; c < special_hardware_string.length; c++) ***REMOVED***
                                                        let sh = special_hardware_string.charAt(c) == this.FPGA ? "FPGA" : "GPU";
                                                        special_hardware.push(sh)

                                                    ***REMOVED***

                                                    r.SpecialHardware = special_hardware;
                                                ***REMOVED***

                                                a.ApplicationExtension = r
                                                this.all_applications.push(a)
                                            ***REMOVED***)

                                        ***REMOVED***
                                        else ***REMOVED***
                                            this.all_applications.push((a))
                                        ***REMOVED***


                                    ***REMOVED***

                                ***REMOVED***
                            ***REMOVED***);
                        break;
                    ***REMOVED***
                ***REMOVED***

            ***REMOVED***
        )
    ***REMOVED***


    public requestExtension(data) ***REMOVED***

        this.applicataionsservice.requestRenewal(data).subscribe(result => ***REMOVED***
            this.user_applications = [];
            this.all_applications = [];
            this.getUserApplications();
            this.getAllApplications();
        ***REMOVED***)


    ***REMOVED***

    public approveExtension(application_id: number) ***REMOVED***
        this.applicataionsservice.approveRenewal(application_id).subscribe(result => ***REMOVED***
            this.user_applications = [];
            this.all_applications = [];
            this.getUserApplications();
            this.getAllApplications();
        ***REMOVED***)
    ***REMOVED***


      public declineExtension(application_id: number) ***REMOVED***
        this.applicataionsservice.declineRenewal(application_id).subscribe(result => ***REMOVED***
            this.user_applications = [];
            this.all_applications = [];
            this.getUserApplications();
            this.getAllApplications();
        ***REMOVED***)
    ***REMOVED***


    public getCollapseStatus(id: string) ***REMOVED***
        if (id in this.collapse_status) ***REMOVED***
            return this.collapse_status[id];
        ***REMOVED*** else ***REMOVED***
            this.collapse_status[id] = true;
            return true;
        ***REMOVED***
    ***REMOVED***

    public switchCollapseStatus(id: string) ***REMOVED***
        this.collapse_status[id] = !this.getCollapseStatus(id);
    ***REMOVED***


    public getStatusById(id: number): string ***REMOVED***
        let s = "Unknown";
        for (let status of this.application_status) ***REMOVED***
            if (status.Id == id) ***REMOVED***
                return status.Name;
            ***REMOVED***
        ***REMOVED***
        return s;
    ***REMOVED***

    public lifeTimeReached(lifetime: number, running: number, status_changed_string: string): string ***REMOVED***
        let status_changed = new Date(status_changed_string);
        let LifetimeDays = Math.ceil(Math.abs(moment(status_changed).add(lifetime, 'months').toDate().getTime() - status_changed.getTime())) / (1000 * 3600 * 24)

        return (LifetimeDays - running) < 0 ? "red" : "black";
    ***REMOVED***

    public getIdByStatus(name: string): number ***REMOVED***
        let s = -1;
        for (let status of this.application_status) ***REMOVED***
            if (status.Name == name) ***REMOVED***
                return status.Id;
            ***REMOVED***
        ***REMOVED***
        return s;
    ***REMOVED***

    public resetNotificationModal() ***REMOVED***
        this.notificationModalTitle = "Notification";
        this.notificationModalMessage = "Please wait...";
        this.notificationModalType = "info";
        this.notificationModalIsClosable = false;
    ***REMOVED***

    public updateNotificaitonModal(title: string, message: string, closable: true, type: string) ***REMOVED***
        this.notificationModalTitle = title;
        this.notificationModalMessage = message;
        this.notificationModalIsClosable = closable;
        this.notificationModalType = type;
    ***REMOVED***


    public createGroup(name, description, manager_elixir_id, application_id, compute_center, openstack_project, numberofVms, volumelimit, lifetime, longname, volumecounter) ***REMOVED***

        //get memeber id in order to add the user later as the new member and manager of the group
        let manager_member_id: number;
        let manager_member_user_id: number;
        let new_group_id: number;

        let re = /[-:. ,/]/gi
        let  shortNameDate=name + (new Date(Date.now()).toLocaleString().replace(re,''));
        this.userservice.getMemberByExtSourceNameAndExtLogin(manager_elixir_id).toPromise()
            .then(member_raw => ***REMOVED***
                    let member = member_raw.json();
                    manager_member_id = member["id"];
                    manager_member_user_id = member["userId"];
                    // create new group

                    return this.groupservice.createGroup(shortNameDate, description).toPromise();
                ***REMOVED***
            ).then(group_raw => ***REMOVED***
            let group = group_raw.json();
            new_group_id = group["id"];

            //add the application user to the group
            return this.groupservice.addMember(new_group_id, manager_member_id, compute_center).toPromise();

        ***REMOVED***).then(null_result => ***REMOVED***
            return this.groupservice.addAdmin(new_group_id, manager_member_user_id, compute_center).toPromise();
        ***REMOVED***).then(null_result => ***REMOVED***
            return this.applicationstatusservice.setApplicationStatus(application_id, this.getIdByStatus("approved"), compute_center).toPromise();
        ***REMOVED***).then(null_result => ***REMOVED***
            //setting approved status for Perun Group
            let APPRVOVED = 2;
            this.groupservice.setPerunGroupStatus(new_group_id, APPRVOVED).toPromise();
            this.groupservice.setdeNBIDirectAcces(new_group_id, openstack_project).toPromise();
            if (compute_center != 'undefined') ***REMOVED***
                this.groupservice.assignGroupToResource(new_group_id.toString(), compute_center).subscribe();
            ***REMOVED***
            this.groupservice.setShortname(new_group_id.toString(), name).subscribe();
            this.groupservice.setName(new_group_id.toString(), longname).subscribe();
            this.groupservice.setNumberOfVms(new_group_id.toString(), numberofVms.toString()).subscribe();
            this.groupservice.setDescription(new_group_id.toString(), description).subscribe();
            this.groupservice.setLifetime(new_group_id.toString(), lifetime.toString()).subscribe();
            this.groupservice.setPerunId(new_group_id.toString(), application_id).subscribe();
            this.groupservice.setGroupVolumeLimit(new_group_id, volumelimit).subscribe();
            this.groupservice.setGroupVolumeCounter(new_group_id, volumecounter).subscribe();
            //update modal
            this.updateNotificaitonModal("Success", "The new project was created", true, "success");
            //update applications
            this.all_applications = [];
            this.user_applications = [];
            this.getUserApplications();
            this.getAllApplications();
        ***REMOVED***).catch(error => ***REMOVED***
            this.updateNotificaitonModal("Failed", "Project could not be created!", true, "danger");
        ***REMOVED***);

    ***REMOVED***

    public declineApplication(application_id) ***REMOVED***
        this.applicationstatusservice.setApplicationStatus(application_id, this.getIdByStatus("declined"), '').toPromise()
            .then(result => ***REMOVED***
                this.all_applications = [];
                this.user_applications = [];
                this.getUserApplications();
                this.getAllApplications();
                this.updateNotificaitonModal("Success", "The Application was declined", true, "success");
            ***REMOVED***)
            .catch(error => ***REMOVED***
                this.updateNotificaitonModal("Failed", "Application could be declined!", true, "danger");
            ***REMOVED***);
    ***REMOVED***

    public deleteApplication(application_id) ***REMOVED***
        this.applicataionsservice.deleteApplication(application_id).toPromise()
            .then(result => ***REMOVED***
                this.updateNotificaitonModal('Success', 'The application has been successfully removed', true, 'success');
            ***REMOVED***).then(result => ***REMOVED***
            this.user_applications = [];
            this.all_applications = [];
            this.getUserApplications();
            this.getAllApplications();
        ***REMOVED***)
            .catch(error => ***REMOVED***
                this.updateNotificaitonModal("Failed", "Application could not be removed!", true, "danger");
            ***REMOVED***);
    ***REMOVED***

    public activeApplicationsAvailable(): boolean ***REMOVED***
        for (let application of this.all_applications) ***REMOVED***
            if (application.Status == 1 || application.Status == 4) ***REMOVED***
                return true;
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***


    public setDeleteId(applicationId) ***REMOVED***
        this.deleteId = applicationId;
    ***REMOVED***


    public comingSoon() ***REMOVED***
        alert("This functinality will be implemented soon!")
    ***REMOVED***


***REMOVED***
