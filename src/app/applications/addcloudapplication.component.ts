import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***NgForm***REMOVED*** from '@angular/forms';
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service'
import ***REMOVED***ApplicationsService***REMOVED*** from '../api-connector/applications.service'
import ***REMOVED***FlavorService***REMOVED*** from '../api-connector/flavor.service';
import ***REMOVED***Flavor***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavor';
import ***REMOVED***FlavorType***REMOVED*** from '../virtualmachines/virtualmachinemodels/flavorType';
import ***REMOVED***environment***REMOVED*** from '../../environments/environment';
import ***REMOVED***ApplicationBaseClass***REMOVED*** from 'app/shared/shared_modules/baseClass/application-base-class';

/**
 * This components provides the functions to create a new Cloud Application.
 */
@Component(***REMOVED***
             selector: 'app-addcloudapplication',
             templateUrl: 'addcloudapplication.component.html',
             providers: [ApiSettings, ApplicationsService, FlavorService],
             styleUrls: ['addcloudapplication.component.css']
           ***REMOVED***)

export class AddcloudapplicationComponent extends ApplicationBaseClass implements OnInit ***REMOVED***

  /**
   * If it is in production or dev mode.
   * @type ***REMOVED***boolean***REMOVED***
   */
  public production: boolean = environment.production;

  /**
   * List of all collapse booleans.
   */
  public collapseList: boolean[];

  /**
   * Contains errors recieved when submitting an application.
   */
  public error: string[];
  /**
   * Default vms requested in form.
   * @type ***REMOVED***number***REMOVED***
   */
  public project_application_vms_requested: number = 5;
  /**
   * List of flavors.
   */
  public flavorList: Flavor[];
  /**
   * List of flavor types.
   */
  public typeList: FlavorType[];

  public acknowledgeModalTitle: string = 'Acknowledge';
  public acknowledgeModalType: string = 'info';

  /**
   * If project is openstack project (everytime true)
   * @type ***REMOVED***boolean***REMOVED*** if it is a openstack project
   */
  project_application_openstack_project: boolean = true;

  /**
   * Constructor.
   * Initialize special hardware and gets list of flavor and flavortypes.
   * @param ***REMOVED***ApplicationsService***REMOVED*** applicationsservice
   * @param ***REMOVED***FlavorService***REMOVED*** flavorservice
   */
  constructor(applicationsservice: ApplicationsService, private flavorservice: FlavorService) ***REMOVED***
    super(null, null, applicationsservice, null);

  ***REMOVED***

  ngOnInit(): void ***REMOVED***
    this.getListOfFlavors();
    this.getListOfTypes();
  ***REMOVED***

  /**
   * Gets a list of all available types of flavors from the flavorservice and uses them in the function setListOfTypes
   */
  getListOfTypes(): void ***REMOVED***
    this.flavorservice.getListOfTypesAvailable().subscribe((types: FlavorType[]) => this.setListOfTypes(types));
  ***REMOVED***

  /**
   * Uses the param types to safe the available FlavorTypes to the array typeList.
   * Also it fills the array collapseList with booleans of value 'false' so all flavor-categories are shown in the application form.
   * @param types array of all available FlavorTypes
   */
  setListOfTypes(types: FlavorType[]): void ***REMOVED***
    this.typeList = types;
    this.collapseList = new Array(types.length) as boolean[];
    for (const type of types) ***REMOVED***

      this.collapseList.push(false); // AS FIX
      if (type.long_name === 'Standart Flavor') ***REMOVED***
        this.collapseList[this.typeList.indexOf(type)] = true;
      ***REMOVED***
    ***REMOVED***

  ***REMOVED***

  /**
   * gets a list of all available Flavors from the flavorservice and puts them into the array flavorList
   */
  getListOfFlavors(): void ***REMOVED***
    this.flavorservice.getListOfFlavorsAvailable().subscribe((flavors: Flavor[]) => this.flavorList = flavors);
  ***REMOVED***

  /**
   * Submits a new cloud application.
   * Therefore checks if the different values are valid.
   * @param ***REMOVED***NgForm***REMOVED*** form
   */
  onSubmit(form: NgForm): void ***REMOVED***
    this.error = null;
    if (this.wronginput) ***REMOVED***

      this.updateNotificationModal(
        'Failed',
        'The application was not submitted, please check the required fields and try again.',
        true,
        'danger');
      this.notificationModalStay = true;
    ***REMOVED*** else ***REMOVED***
      const values: ***REMOVED*** [key: string]: string | number | boolean ***REMOVED*** = ***REMOVED******REMOVED***;
      values['project_application_openstack_project'] = this.project_application_openstack_project;
      values['project_application_pi_approved'] = this.project_application_pi_approved;
      for (const value in form.controls) ***REMOVED***
        if (form.controls[value].disabled) ***REMOVED***
          continue;
        ***REMOVED***
        if (form.controls[value].value) ***REMOVED***

          values[value] = form.controls[value].value;
        ***REMOVED***
      ***REMOVED***
      this.applicationsservice.addNewApplication(values).toPromise()
        .then(() => ***REMOVED***
          this.updateNotificationModal('Success', 'The application was submitted', true, 'success');
          this.notificationModalStay = false;
        ***REMOVED***).catch((error: string) => ***REMOVED***
        const error_json: string = error;
        this.error = [];
        for (const key of Object.keys(error_json)) ***REMOVED***
          this.error.push(key.split('_')[2])

        ***REMOVED***

        this.updateNotificationModal(
          'Failed',
          'The application was not submitted, please check the required fields and try again.',
          true,
          'danger');
        this.notificationModalStay = true;
      ***REMOVED***)
    ***REMOVED***
  ***REMOVED***

  sendTestApplication(): void ***REMOVED***
    const values: ***REMOVED*** [key: string]: string | number | boolean ***REMOVED*** = ***REMOVED******REMOVED***;

    values['project_application_comment'] = 'TestApplication';
    values['project_application_description'] = 'TestApplication';
    values['project_application_institute'] = 'TestApplication';
    values['project_application_lifetime'] = 3;
    values['project_application_name'] = 'TestApplication';
    values['project_application_openstack_project'] = true;
    for (const flavor of this.flavorList) ***REMOVED***
      const fname: string = `project_application_$***REMOVED***flavor.name***REMOVED***`;
      values[fname] = 1;
    ***REMOVED***
    values['project_application_report_allowed'] = true;
    values['project_application_shortname'] = 'TestApplication';
    values['project_application_volume_counter'] = 5;
    values['project_application_volume_limit'] = 20;
    values['project_application_workgroup'] = 'TestApplication';

    this.applicationsservice.addNewApplication(values).toPromise()
      .then(() => ***REMOVED***
        this.updateNotificationModal('Success', 'The application was submitted', true, 'success');
        this.notificationModalStay = false;
      ***REMOVED***).catch((error: string) => ***REMOVED***
      const error_json: string = error;
      this.error = [];
      for (const key of Object.keys(error_json)) ***REMOVED***
        this.error.push(key.split('_')[2])

      ***REMOVED***

      this.updateNotificationModal(
        'Failed',
        'The application was not submitted, please check the required fields and try again.',
        true,
        'danger');
      this.notificationModalStay = true;
    ***REMOVED***)

  ***REMOVED***

***REMOVED***
