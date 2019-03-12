import {AbstractBaseClasse} from './abstract-base-class';
import {ApplicationStatus} from '../../../applications/application_status.model';
import {Application} from '../../../applications/application.model';
import {Flavor} from '../../../virtualmachines/virtualmachinemodels/flavor';
import {ApplicationExtension} from '../../../applications/application_extension.model';
import {ApplicationsService} from '../../../api-connector/applications.service';
import {ComputecenterComponent} from '../../../projectmanagement/computecenter.component';
import {FlavorType} from '../../../virtualmachines/virtualmachinemodels/flavorType';
import {FlavorService} from '../../../api-connector/flavor.service';
import {FacilityService} from '../../../api-connector/facility.service';
import {Component} from '@angular/core';
import {ApplicationStatusService} from '../../../api-connector/application-status.service';
import {UserService} from '../../../api-connector/user.service';

/**
 * Application base component..
 */
@Component({
    providers: [FacilityService, ApplicationsService, FlavorService]
})
export class ApplicationBaseClass extends AbstractBaseClasse {

    /**
     * If all Applications are loaded, important for the loader.
     * @type {boolean}
     */
    isLoaded_AllApplication: boolean = false;


    /**
     * Selected Application.
     */
    selectedApplication: Application;


    /**
     * All available compute centers.
     * @type {Array}
     */
    computeCenters: ComputecenterComponent[] = [];

    /**
     * Stati of the differen Applications.
     * @type {Array}
     */
    application_status: ApplicationStatus[] = [];


    /**
     * User which requested the Application {id: Elixir Id of user : {name and email}}.
     * @type {{}}
     */
    application_user: { [id: string]: { [id: string]: string } } = {};

    /**
     * List of flavor types.
     */
    typeList: FlavorType[];
    /**
     * List of all collapse booleans.
     */
    collapseList: boolean[];

    /**
     * List of flavors.
     */
    flavorList: Flavor[];

    /**
     * If all userApplications are loaded, important for the loader.
     * @type {boolean}
     */
    isLoaded_userApplication: boolean = false;

    /**
     * Applications of the user viewing the Application overview.
     * @type {Array}
     */
    user_applications: Application[] = [];

    constructor(protected userservice: UserService, protected applicationstatusservice: ApplicationStatusService,
                protected applicationsservice: ApplicationsService,
                protected facilityService: FacilityService) {
        super();

    }

    /**
     * Get id by status name.
     * @param {string} name
     * @returns {number}
     */
    getIdByStatus(name: string): number {
        const s: number = -1;
        for (const status of this.application_status) {
            if (status.Name === name) {
                return status.Id;
            }
        }

        return s;
    }

    /**
     * Gets all available compute centers and saves them in the computeCenters attribute.
     */
    getComputeCenters(): void {
        this.facilityService.getComputeCenters().subscribe((result: [{ [key: string]: string }]) => {
            for (const cc of result) {
                const compute_center: ComputecenterComponent = new ComputecenterComponent(
                    cc['compute_center_facility_id'],
                    cc['compute_center_name'],
                    cc['compute_center_login'],
                    cc['compute_center_support_mail']);
                this.computeCenters.push(compute_center)
            }

        })
    }

    public setApplicationStatus(status: number, app: Application): void {
        this.applicationstatusservice.setApplicationStatus(app.Id.toString(), status.toString()).subscribe()
    }

    setNewApplication(aj): Application {

        const newApp: Application = new Application();
        newApp.Id = aj['project_application_id'];

        newApp.Name = aj['project_application_name'];
        newApp.Shortname = aj['project_application_shortname'];
        newApp.Description = aj['project_application_description'];
        newApp.Lifetime = aj['project_application_lifetime'];

        newApp.VMsRequested = aj['project_application_vms_requested'];
        newApp.RamPerVM = aj['project_application_ram_per_vm'];

        newApp.TotalRam = aj['project_application_total_ram'];
        newApp.TotalCores = aj['project_application_total_cores'];
        newApp.CoresPerVM = aj['project_application_cores_per_vm'];
        newApp.VolumeLimit = aj['project_application_volume_limit'];
        newApp.VolumeCounter = aj['project_application_volume_counter'];

        newApp.ObjectStorage = aj['project_application_object_storage'];
        newApp.OpenStackProject = aj['project_application_openstack_project'];

        newApp.Institute = aj['project_application_institute'];
        newApp.Workgroup = aj['project_application_workgroup'];
        newApp.DateApproved = aj['project_application_date_approved'];

        newApp.DateSubmitted = aj['project_application_date_submitted'];
        newApp.DateStatusChanged = aj['project_application_date_status_changed'];
        newApp.User = aj['project_application_user']['username'];
        newApp.UserAffiliations = aj['project_application_user']['profile']['affiliations'];
        newApp.UserEmail = aj['project_application_user']['email'];
        newApp.Status = aj['project_application_status'];
        newApp.Dissemination = aj['project_application_report_allowed'];
        newApp.Horizon2020 = aj['project_application_horizon2020'];

        if (newApp.Status === this.application_statuses.APPROVED) {
            newApp.DaysRunning = Math.ceil((Math.abs(Date.now() - new Date(newApp.DateStatusChanged).getTime())) / (1000 * 3600 * 24));

        }
        newApp.Comment = aj['project_application_comment'];
        newApp.PerunId = aj['project_application_perun_id'];
        for (const flavor of aj['flavors']) {
            newApp.addFlavorToCurrent(
                flavor.flavor_name, flavor.counter, flavor.tag, flavor.ram,
                flavor.rootdisk, flavor.vcpus, flavor.gpu, flavor.epheremal_disk)

        }
        if (aj['projectapplicationrenewal']) {
            const r: ApplicationExtension = new ApplicationExtension();
            let requestExtensionTotalCores: number = 0;
            let requestExtensionTotalRam: number = 0;

            for (const flavor of aj['projectapplicationrenewal']['flavors']) {
                r.addFlavorToRequested(
                    flavor.flavor_name, flavor.counter, flavor.tag, flavor.ram,
                    flavor.rootdisk, flavor.vcpus, flavor.gpu, flavor.epheremal_disk);
                requestExtensionTotalCores += flavor.vcpus * flavor.counter;
                requestExtensionTotalRam += flavor.ram * flavor.counter

            }

            r.TotalRAM = requestExtensionTotalRam;
            r.TotalCores = requestExtensionTotalCores;

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

            newApp.ApplicationExtension = r;
        }

        return newApp
    }

    setNewApplications(res): Application[] {
        const newApplications: Application[] = [];

        for (const key in res) {
            if (res.hasOwnProperty(key)) {

                const aj: object = res[key];
                const newApp: Application = new Application();
                newApp.Id = aj['project_application_id'];
                newApp.Name = aj['project_application_name'];
                newApp.Shortname = aj['project_application_shortname'];
                newApp.Description = aj['project_application_description'];
                newApp.Lifetime = aj['project_application_lifetime'];
                newApp.VMsRequested = aj['project_application_vms_requested'];
                newApp.RamPerVM = aj['project_application_ram_per_vm'];
                newApp.TotalRam = aj['project_application_total_ram'];
                newApp.TotalCores = aj['project_application_total_cores'];
                newApp.CoresPerVM = aj['project_application_cores_per_vm'];
                newApp.VolumeLimit = aj['project_application_volume_limit'];
                newApp.VolumeCounter = aj['project_application_volume_counter'];
                newApp.ObjectStorage = aj['project_application_object_storage'];
                newApp.OpenStackProject = aj['project_application_openstack_project'];
                newApp.Institute = aj['project_application_institute'];
                newApp.Workgroup = aj['project_application_workgroup'];
                newApp.DateApproved = aj['project_application_date_approved'];
                newApp.DateSubmitted = aj['project_application_date_submitted'];
                newApp.DateStatusChanged = aj['project_application_date_status_changed'];
                newApp.User = aj['project_application_user']['username'];
                newApp.UserAffiliations = aj['project_application_user']['profile']['affiliations'];
                newApp.UserEmail = aj['project_application_user']['email'];
                newApp.Status = aj['project_application_status'];
                newApp.Dissemination = aj['project_application_report_allowed'];
                newApp.Horizon2020 = aj['project_application_horizon2020'];

                for (const flavor of aj['flavors']) {
                    newApp.addFlavorToCurrent(
                        flavor.flavor_name, flavor.counter, flavor.tag, flavor.ram,
                        flavor.rootdisk, flavor.vcpus, flavor.gpu, flavor.epheremal_disk)

                }

                newApp.DaysRunning = Math.ceil((Math.abs(Date.now() - new Date(newApp.DateStatusChanged).getTime()))
                    / (1000 * 3600 * 24));
                newApp.Comment = aj['project_application_comment'];
                newApp.PerunId = aj['project_application_perun_id'];
                if (aj['projectapplicationrenewal']) {
                    const newExtension: ApplicationExtension = new ApplicationExtension();
                    let requestExtensionTotalCores: number = 0;
                    let requestExtensionTotalRam: number = 0;

                    newApp.Comment = aj['project_application_comment'];
                    newApp.PerunId = aj['project_application_perun_id'];
                    newApp.OpenStackProject = aj['project_application_openstack_project'];

                    for (const flavor of aj['projectapplicationrenewal']['flavors']) {
                        newExtension.addFlavorToRequested(
                            flavor.flavor_name,
                            flavor.counter,
                            flavor.tag,
                            flavor.ram,
                            flavor.rootdisk,
                            flavor.vcpus,
                            flavor.gpu,
                            flavor.epheremal_disk);
                        requestExtensionTotalCores += flavor.vcpus * flavor.counter;
                        requestExtensionTotalRam += flavor.ram * flavor.counter;

                        newExtension.TotalRAM = requestExtensionTotalRam;
                        newExtension.TotalCores = requestExtensionTotalCores;

                        newExtension.Id = aj['projectapplicationrenewal']['project_application'];
                        newExtension.Lifetime = aj['projectapplicationrenewal']['project_application_renewal_lifetime'];
                        newExtension.VolumeLimit = aj['projectapplicationrenewal']['project_application_renewal_volume_limit'];
                        newExtension.VolumeCounter = aj['projectapplicationrenewal']['project_application_renewal_volume_counter'];
                        newExtension.VMsRequested = aj['projectapplicationrenewal']['project_application_renewal_vms_requested'];
                        newExtension.Comment = aj['projectapplicationrenewal']['project_application_renewal_comment'];
                        newExtension.CoresPerVM = aj['projectapplicationrenewal']['project_application_renewal_cores_per_vm'];
                        newExtension.ObjectStorage = aj['projectapplicationrenewal']['project_application_renewal_object_storage'];
                        newExtension.RamPerVM = aj['projectapplicationrenewal']['project_application_renewal_ram_per_vm'];
                        newExtension.Comment = aj['projectapplicationrenewal']['project_application_renewal_comment'];

                        newApp.ApplicationExtension = newExtension;

                    }
                }
                newApplications.push(newApp)
            }
        }

        return newApplications
    }

    /**
     * Get details of member like name and email by elixir.
     * @param {string} elixir_id
     * @param {string} collapse_id
     */
    public getMemberDetailsByElixirIdIfCollapsed(elixir_id: string, collapse_id: string): void {
        if (!this.getCollapseStatus(collapse_id)) {
            if (!(elixir_id in this.application_user)) {
                this.userservice.getMemberDetailsByElixirId(elixir_id).subscribe((result: { [key: string]: string }) => {

                    const name: string = `${result['firstName']} ${result['lastName']}`;
                    const appuser: { [id: string]: string } = {};
                    appuser['name'] = name;
                    appuser['email'] = result['email'];
                    this.application_user[elixir_id] = appuser;
                })
            }
        }

    }

    /**
     * Get all possible application stati.
     */
    getApplicationStatus(): void {
        this.applicationstatusservice.getAllApplicationStatus().toPromise()
            .then((result: object) => {
                const res: object = result;
                for (const key in res) {
                    if (res[key]) {
                        const asj: object = res[key];
                        const aj: ApplicationStatus = new ApplicationStatus(asj['application_status_id'], asj['application_status_name']);
                        this.application_status.push(aj)
                    }
                }
            });
    }

    /**
     * Get status name  by status id.
     * @param {number} id
     * @returns {string}
     */
    public getStatusById(id: number): string {
        const dummy: string = 'Unknown';
        for (const status of this.application_status) {
            if (status.Id === id) {
                return status.Name;
            }
        }

        return dummy;
    }

    /**
     * Gets all affialiations from a user.
     * @param {number} user
     */
    getUserAffilaitions(user: number): void {
        this.userservice.getuserAffiliations(user).subscribe()
    }

    /**
     * Sets the selected application.
     * @param application
     */
    setSelectedApplication(application: Application): void {
        this.selectedApplication = application;

    }

    /**
     * Uses the param types to safe the available FlavorTypes to the array typeList.
     * Also it fills the array collapseList with booleans of value 'false' so all flavor-categories are shown in the application form.
     * @param types array of all available FlavorTypes
     */
    setListOfTypes(types: FlavorType[]): void {
        this.typeList = types;
        this.collapseList = new Array(types.length) as boolean[];
        for (const type of types) {

            this.collapseList.push(false); // AS FIX
            if (type.long_name === 'Standart Flavor') {
                this.collapseList[this.typeList.indexOf(type)] = true;
            }
        }

    }

}
