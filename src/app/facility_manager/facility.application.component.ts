import {Component, OnInit} from '@angular/core';
import {FacilityService} from '../api-connector/facility.service';
import {UserService} from '../api-connector/user.service';
import {GroupService} from '../api-connector/group.service';
import {ApiSettings} from '../api-connector/api-settings.service';
import {Application} from '../applications/application.model';
import {ApplicationStatusService} from '../api-connector/application-status.service';
import {ApplicationsService} from '../api-connector/applications.service';
import {ApplicationBaseClass} from '../shared/shared_modules/baseClass/application-base-class';

/**
 * Application component
 */
@Component({
    selector: 'app-facility.application',
    templateUrl: 'facility.application.component.html',
    styleUrls: ['facility.application.component.scss'],
    providers: [FacilityService, UserService, GroupService, ApplicationStatusService,
        ApplicationsService, ApiSettings]

})
export class FacilityApplicationComponent extends ApplicationBaseClass implements OnInit {

    /**
     * All Applications waiting for confirmation for the selected facility.
     * @type {Array}
     */
    all_applications_wfc: Application[] = [];

    /**
     * Facilitties where the user is manager ['name',id].
     */
    public managerFacilities: [string, number][];
    /**
     * Chosen facility.
     */
    public selectedFacility: [string, number];

    /**
     * List of all application modifications.
     * @type {Array}
     */
    all_application_modifications: Application [] = [];

    applications_history: Application [] = [];

    constructor(userservice: UserService,
                applicationstatusservice: ApplicationStatusService,
                facilityService: FacilityService, applicationsservice: ApplicationsService) {
        super(userservice, applicationstatusservice, applicationsservice, facilityService);

        this.facilityService.getManagerFacilities().subscribe(result => {
            this.managerFacilities = result;
            this.selectedFacility = this.managerFacilities[0];
            this.facilityService.getFacilityResources(this.selectedFacility['FacilityId']).subscribe();
            this.getApplicationStatus();
            this.getAllApplicationsWFC(this.selectedFacility ['FacilityId']);
            this.getAllApplicationsModifications(this.selectedFacility ['FacilityId']);
            this.getAllApplicationsHistory(this.selectedFacility ['FacilityId']);

        })
    }

    /**
     * Approve an application extension.
     * @param {Application} app the application
     * @returns {void}
     */
    public approveExtension(app: Application): void {

        this.applicationsservice.approveRenewal(app.Id).subscribe(result => {
            if (result['Error']) {
                this.updateNotificationModal('Failed', 'Failed to approve the application modification.', true, 'danger');
            } else {
                this.updateNotificationModal('Success', 'Successfully approved the application modification.', true, 'success');
                this.all_application_modifications.splice(this.all_application_modifications.indexOf(app), 1);
                this.getAllApplicationsHistory(this.selectedFacility ['FacilityId']);

            }
        })
    }

    /**
     * Get all application modification requests.
     * @param {number} facility id of the facility
     */
    getAllApplicationsModifications(facility: number): void {
        this.isLoaded = false;
        // todo check if user is VO Admin
        this.facilityService.getFacilityModificationApplicationsWaitingForConfirmation(facility).subscribe(res => {
            if (Object.keys(res).length === 0) {
                this.isLoaded = true;
            }

            const newApps: Application [] = this.setNewApplications(res);
            this.all_application_modifications.push.apply(this.all_application_modifications, newApps);
            this.isLoaded = true;

        })
    }

    /**
     * Get all application ( with all stati) for a facility.
     * @param {number} facility id of the facility
     */
    getAllApplicationsHistory(facility: number): void {
        this.isLoaded = false;
        this.applications_history = [];

        // todo check if user is VO Admin
        this.facilityService.getFacilityApplicationsHistory(facility).subscribe(res => {
            if (Object.keys(res).length === 0) {
                this.isLoaded = true;
            }
            const newApps: Application [] = this.setNewApplications(res);
            this.applications_history.push.apply(this.applications_history, newApps);
            this.isLoaded = true;
        });
    }

    /**
     * Gets all applications for the facility.
     * @param {number} facility
     */
    getAllApplicationsWFC(facility: number): void {

        // todo check if user is VO Admin
        this.facilityService.getFacilityApplicationsWaitingForConfirmation(facility).subscribe(res => {
            if (Object.keys(res).length === 0) {
                this.isLoaded = true;
            }
            const newApps: Application [] = this.setNewApplications(res);
            this.all_applications_wfc.push.apply(this.all_applications_wfc, newApps);

        });
        this.isLoaded = true;
    }

    /**
     * Approves an  application.
     * @param {number} application_id
     */
    approveApplication(application_id: number): void {

        this.updateNotificationModal('Approving Application', 'Waiting..', true, 'info');
        this.facilityService.approveFacilityApplication(this.selectedFacility['FacilityId'], application_id).subscribe(
            () => {
                this.updateNotificationModal('Success', 'Successfully approved the application.', true, 'success');

                this.all_applications_wfc = [];
                this.getAllApplicationsHistory(this.selectedFacility ['FacilityId']);

                this.getAllApplicationsWFC(this.selectedFacility['FacilityId'])
            },
            () => {
                this.updateNotificationModal('Failed', 'Failed to approve the application.', true, 'danger');

            })
    }

    /**
     * Decline an extension request.
     * @param {number} application_id
     */
    public declineExtension(app: Application): void {
        const modificaton_requested: number = 4;
        this.applicationstatusservice.setApplicationStatus(app.Id, modificaton_requested).subscribe(() => {
            this.updateNotificationModal('Success', 'Successfully declined!', true, 'success');
            this.all_application_modifications.splice(this.all_application_modifications.indexOf(app), 1);
            this.getAllApplicationsHistory(this.selectedFacility ['FacilityId']);
        })

    }

    /**
     * Declines an Application.
     * @param {number} application_id
     */
    declineApplication(application_id: number): void {
        this.updateNotificationModal('Decline Application', 'Waiting..', true, 'info');

        this.facilityService.declineFacilityApplication(this.selectedFacility['FacilityId'], application_id).subscribe(
            () => {
                this.updateNotificationModal('Success', 'Successfully declined the application.', true, 'success');

                this.all_applications_wfc = [];
                this.getAllApplicationsWFC(this.selectedFacility['FacilityId'])
            },
            () => {
                this.updateNotificationModal('Failed', 'Failed to decline the application.', true, 'danger');

            })
    }

    /**
     * If the selected facility changes, reload the applicatins.
     * @param value
     */
    onChangeSelectedFacility(): void {
        this.all_applications_wfc = [];
        this.all_application_modifications = [];
        this.applications_history = [];
        this.getAllApplicationsWFC(this.selectedFacility['FacilityId']);
        this.getAllApplicationsHistory(this.selectedFacility['FacilityId']);
        this.getAllApplicationsModifications(this.selectedFacility['FacilityId']);
    }

    ngOnInit(): void {
    }

}