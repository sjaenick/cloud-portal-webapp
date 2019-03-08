import ***REMOVED***Component***REMOVED*** from '@angular/core';
import ***REMOVED***NgForm***REMOVED*** from '@angular/forms';
import ***REMOVED***SpecialHardware***REMOVED*** from './special_hardware.model'
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service'
import ***REMOVED***ApplicationsService***REMOVED*** from '../api-connector/applications.service'
import ***REMOVED***AbstractBaseClasse***REMOVED*** from '../shared_modules/baseClass/abstract-base-class';
import ***REMOVED***Flavor***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavor';
import ***REMOVED***FlavorService***REMOVED*** from '../api-connector/flavor.service';
import ***REMOVED***environment***REMOVED*** from '../../environments/environment';
import ***REMOVED***FlavorType***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavorType';

@Component(***REMOVED***
    templateUrl: 'addsinglevm.component.html',
    providers: [FlavorService, SpecialHardwareService, ApiSettings, ApplicationsService]
***REMOVED***)

export class AddsinglevmComponent extends AbstractBaseClasse ***REMOVED***


    /**
     * List of flavor types.
     */
    public typeList: FlavorType[];
    /**
     * List of all collapse booleans.
     */
    public collapseList: boolean[];

    /**
     * Check if the shortname provided is valid.
     * @type ***REMOVED***boolean***REMOVED***
     */
    public wronginput = false;


    /**
     * List of flavors.
     */
    public flavorList: Flavor[];


    public production = environment.production;


    public error: string[];
    public project_application_vms_requested = 3;
    public project_application_report_allowed = false;


    public acknowledgeModalMessage: string = 'The development and support of the cloud is possible above all through the funding of ' +
        'the cloud infrastructure by the Federal Ministry of Education and Research (BMBF)!\n' +
        'We would highly appreciate the following citation in your next publication(s): ' +
        '‘This work was supported by the BMBF-funded de.NBI Cloud within the German Network for Bioinformatics Infrastructure (de.NBI) ' +
        '(031A537B, 031A533A, 031A538A, 031A533B, 031A535A, 031A537C, 031A534A, 031A532B).';
    public acknowledgeModalTitle = 'Acknowledge';
    public acknowledgeModalType = 'info';

    /**
     * Available special hardware.
     * @type ***REMOVED***any[]***REMOVED***
     */
    special_hardware: SpecialHardware[] = new Array();

    constructor(private specialhardwareservice: SpecialHardwareService,
                private  applicationsservice: ApplicationsService, private flavorService: FlavorService) ***REMOVED***
        super();
        this.getSpecialHardware();
        this.getListOfFlavors();
        this.getListOfTypes();


    ***REMOVED***





    /**
     * Submit simple vm application.
     * @param ***REMOVED***NgForm***REMOVED*** f
     */
    onSubmit(f: NgForm) ***REMOVED***
        this.error = null;
        if (this.wronginput) ***REMOVED***
            this.updateNotificationModal('Failed', 'The application was not submitted, please check the required fields and try again.',
                true, 'danger');
            this.notificationModalStay = true;
        ***REMOVED*** else ***REMOVED***
            const values = ***REMOVED******REMOVED***;
            values['project_application_special_hardware'] = this.special_hardware.filter(hardware => hardware.Checked)
                .map(hardware => hardware.Id);
            for (const v in f.controls) ***REMOVED***
                if (f.controls[v].value) ***REMOVED***
                    values[v] = f.controls[v].value;
                ***REMOVED***
            ***REMOVED***

            this.applicationsservice.addNewApplication(values).toPromise()
                .then(result => ***REMOVED***
                    this.updateNotificationModal('Success', 'The application was submitted', true, 'success');
                    this.notificationModalStay = false;
                ***REMOVED***).catch(error => ***REMOVED***
                const error_json = error;
                this.error = [];
                for (const key of Object.keys(error_json)) ***REMOVED***
                    this.error.push(key.split('_',)[2])

                ***REMOVED***


                this.updateNotificationModal('Failed', 'The application was not submitted, please check the required fields and try again.',
                    true, 'danger');
                this.notificationModalStay = true;
            ***REMOVED***)
        ***REMOVED***
    ***REMOVED***

    /**
     * gets a list of all available Flavors from the flavorservice and puts them into the array flavorList
     */
    getListOfFlavors() ***REMOVED***
        this.flavorService.getListOfFlavorsAvailable().subscribe(flavors => ***REMOVED***
            this.flavorList = flavors;
        ***REMOVED***);
    ***REMOVED***

    getListOfTypes() ***REMOVED***
        this.flavorService.getListOfTypesAvailable().subscribe(types => this.setListOfTypes(types));
    ***REMOVED***


    /**
     * Uses the param types to safe the available FlavorTypes to the array typeList.
     * Also it fills the array collapseList with booleans of value 'false' so all flavor-categories are shown in the application form.
     * @param types array of all available FlavorTypes
     */
    setListOfTypes(types: FlavorType[]) ***REMOVED***
        this.typeList = types;
        this.collapseList = new Array(types.length) as Array<boolean>;
        for (let i = 0; i < types.length; i++) ***REMOVED***
            this.collapseList.push(false); // AS FIX
        ***REMOVED***
        for (const t of this.typeList) ***REMOVED***
            if (t.long_name === 'Standart Flavor') ***REMOVED***
                this.collapseList[this.typeList.indexOf(t)] = true;
            ***REMOVED***
            break;
        ***REMOVED***

    ***REMOVED***


    /**
     * Check if shortname is valid.
     * @param ***REMOVED***string***REMOVED*** shortname
     */
    public checkShortname(shortname: string) ***REMOVED***
        if (!/^[a-zA-Z0-9\s]*$/.test(shortname)) ***REMOVED***
            this.wronginput = true;
        ***REMOVED*** else ***REMOVED***
            this.wronginput = false;
        ***REMOVED***
    ***REMOVED***

    sendTestApplication() ***REMOVED***
        const values: ***REMOVED*** [key: string]: any ***REMOVED*** = ***REMOVED******REMOVED***;

        values['project_application_comment'] = 'TestApplication';
        values['project_application_description'] = 'TestApplication';
        values['project_application_institute'] = 'TestApplication';
        values['project_application_lifetime'] = 3;
        values['project_application_name'] = 'TestApplication';
        values['project_application_openstack_project'] = false;
        for (const f of this.flavorList) ***REMOVED***
            const fname = 'project_application_' + f.name;
            values[fname] = 1;
        ***REMOVED***
        values['project_application_report_allowed'] = true;
        values['project_application_shortname'] = 'TestApplication';
        values['project_application_volume_counter'] = 5;
        values['project_application_volume_limit'] = 20;
        values['project_application_workgroup'] = 'TestApplication';

        this.applicationsservice.addNewApplication(values).toPromise()
            .then(result => ***REMOVED***
                this.updateNotificationModal('Success', 'The application was submitted', true, 'success');
                this.notificationModalStay = false;
            ***REMOVED***).catch(error => ***REMOVED***
            const error_json = error
            this.error = []
            for (const key of Object.keys(error_json)) ***REMOVED***
                this.error.push(key.split('_',)[2])

            ***REMOVED***


            this.updateNotificationModal('Failed', 'The application was not submitted, please check the required fields and try again.',
                true, 'danger');
            this.notificationModalStay = true;
        ***REMOVED***)


    ***REMOVED***
***REMOVED***


