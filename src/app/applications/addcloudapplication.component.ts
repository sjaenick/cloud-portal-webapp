import {Component} from '@angular/core';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {NgForm} from '@angular/forms';
import {SpecialHardwareService} from '../api-connector/special-hardware.service'
import {SpecialHardware} from './special_hardware.model'
import {ApiSettings} from '../api-connector/api-settings.service'
import {ApplicationsService} from '../api-connector/applications.service'
import {Observable} from 'rxjs';
import {FlavorService} from '../api-connector/flavor.service';
import {Flavor} from '../virtualmachines/virtualmachinemodels/flavor';
import {FlavorType} from '../virtualmachines/virtualmachinemodels/flavorType';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
    templateUrl: 'addcloudapplication.component.html',
    providers: [SpecialHardwareService, ApiSettings, ApplicationsService, FlavorService],
    styleUrls: ['addcloudapplication.component.css']
})

export class AddcloudapplicationComponent {

    public wronginput: boolean = false;
    public isCollapsed: boolean = true;


    //notification Modal variables
    public notificationModalTitle: string = 'Notification';
    public notificationModalMessage: string = 'Please wait...';
    public notificationModalType: string = 'info';
    public notificationModalIsClosable: boolean = false;
    public notificationModalStay: boolean = true;
    public error: string[];
    public project_application_vms_requested = 5;
    public flavorList: Flavor[];
    public typeList: FlavorType[];
    public collapseList: boolean[];
    public totalNumberOfCores=0;
    public totalRAM=0;
    public valuesToConfirm: string[];
    public constantStrings: Object;
    public projectName: string;



    public acknowledgeModalMessage: string = 'The development and support of the cloud is possible above all through the funding of the cloud infrastructure by the Federal Ministry of Education and Research (BMBF)!\n' +
        'We would highly appreciate the following citation in your next publication(s): ‘This work was supported by the BMBF-funded de.NBI Cloud within the German Network for Bioinformatics Infrastructure (de.NBI) (031A537B, 031A533A, 031A538A, 031A533B, 031A535A, 031A537C, 031A534A, 031A532B).';
    public acknowledgeModalTitle: string = 'Acknowledge';
    public acknowledgeModalType: string = 'info';


    showjustvm: boolean;
    project_application_openstack_project: boolean = true;


    csrf: Object = Cookie.get('csrftoken');
    special_hardware: SpecialHardware[] = new Array();

    constructor(private specialhardwareservice: SpecialHardwareService,
                private  applicationsservice: ApplicationsService, private flavorservice: FlavorService) {
        this.getSpecialHardware();
        this.getListOfFlavors();
        this.getListOfTypes();


    }

  /**
   * This function concatenates a given key combined with a given value to a string
   * which is used on the confirmation-modal.
   * @param key the key to access a string in the array constantStrings
   * @param val the value that is concatenated with the string from the array and an optional addition (depending on the key)
   * @returns the concatenated string for the confirmation-modal
   */
  matchString(key: string, val: string ): string{
      if (key in this.constantStrings)
      {
        switch (key) {
          case 'project_application_lifetime': {
            return (this.constantStrings[key] + val + ' months');
            }
          case ('project_application_volume_limit'): {
            return (this.constantStrings[key] + val + ' GB');
          }
          case 'project_application_object_storage': {
            return (this.constantStrings[key] + val + ' GB');
          }
          default: {
            return (this.constantStrings[key] + val);
          }
        }
      }
    }

  /**
   * Fills the array constantStrings with values dependent of keys which are used to indicate inputs from the application-form
   */
  generateConstants() {
        this.constantStrings = new Array();
        this.constantStrings['project_application_lifetime'] = 'Lifetime of your project: ';
        this.constantStrings['project_application_volume_counter'] = 'Number of volumes for additional storage: ';
        this.constantStrings['project_application_object_storage'] = 'Additional object storage: ';
        this.constantStrings['project_application_volume_limit'] = 'Additional storage space for your VMs: ';
        this.constantStrings['project_application_institute'] = 'Your institute: ';
        this.constantStrings['project_application_workgroup'] = 'Your Workgroup: ';
        for (let key in this.flavorList) {
          if (key in this.flavorList) {
            this.constantStrings['project_application_' + this.flavorList[key].name] =
              'Number of VMs of type ' + this.flavorList[key].name + ': ';
          }
        }
    }

    keyIsVM(key: string): Flavor{
      for (let fkey in this.flavorList) {
        if (fkey in this.flavorList) {
          if (this.flavorList[fkey].name === key.substring(20)) {
            return this.flavorList[fkey];
          }
        }
      }
      return null;

    }

  /**
   * Uses the data from the application form to fill the confirmation-modal with information.
   * @param f the application form with corresponding data
   */
  filterEnteredData(f: NgForm) {
      this.generateConstants();
      this.totalNumberOfCores = 0;
      this.totalRAM = 0;
      this.valuesToConfirm = new Array();
      for (let key in f.controls) {
        if (f.controls[key].value) {
          if (key === 'project_application_name') {
              this.projectName = f.controls[key].value;
              if (this.projectName.length > 50) {
                this.projectName = this.projectName.substring(0, 50) + '...';
              }
            }
          if (key in this.constantStrings) {
              this.valuesToConfirm.push(this.matchString(key.toString(), f.controls[key].value.toString()));
            var flavor: Flavor = this.keyIsVM(key.toString());
            if (flavor != null) {
              this.totalNumberOfCores = this.totalNumberOfCores + (flavor.vcpus * f.controls[key].value);
              this.totalRAM = this.totalRAM + (flavor.ram * f.controls[key].value)
            }
          }
        }
      }

    }

  /**
   * gets a list of all available Flavors from the flavorservice and puts them into the array flavorList
   */
  getListOfFlavors() {
        this.flavorservice.getListOfFlavorsAvailable().subscribe(flavors => this.flavorList = flavors);
    }

    /**
    * gets a list of all available types of flavors from the flavorservice and uses them in the function setListOfTypes
    */
    getListOfTypes() {
        this.flavorservice.getListOfTypesAvailable().subscribe(types => this.setListOfTypes(types));
    }


  /**
   * Uses the param types to safe the available FlavorTypes to the array typeList.
   * Also it fills the array collapseList with booleans of value 'false' so all flavor-categories are shown in the application form.
   * @param types array of all available FlavorTypes
   */
  setListOfTypes(types: FlavorType[]) {
      this.typeList = types;
      this.collapseList = new Array(types.length) as Array<boolean>;
      for (let i = 0; i < types.length; i++) {
        this.collapseList.push(false); //AS FIX
      }

    }


    getSpecialHardware() {
        this.specialhardwareservice.getAllSpecialHardware().toPromise()
            .then(result => {
                let res = result;
                for (let key in res) {
                    let shj = res[key];
                    let sh = new SpecialHardware(shj['special_hardware_id'], shj['special_hardware_key'], shj['special_hardware_name']);
                    this.special_hardware.push(sh)
                }
            });
    }

    check_not_zero(values: {}) {
        if ('project_application_openstack_project' in values) {


            if ('project_application_volume_limit' in values && values['project_application_volume_limit'] > 0) {
                return true;
            }

            return false;
        }
        else {

            return true;
        }
    }

    onSubmit(f: NgForm) {
        this.error = null;
        if (this.wronginput == true) {

            this.updateNotificaitonModal('Failed', 'The application was not submitted, please check the required fields and try again.', true, 'danger');
            this.notificationModalStay = true;
        }
        else {
            let values:{[key:string]:any} = {};
            values['project_application_special_hardware'] = this.special_hardware.filter(hardware => hardware.Checked).map(hardware => hardware.Id)
            values['project_application_openstack_project'] = this.project_application_openstack_project;
            for (let v in f.controls) {
                if (f.controls[v].value) {

                    values[v] = f.controls[v].value;
                }
            }
            if (this.check_not_zero(values) == false) {
                this.updateNotificaitonModal('Failed', 'The application was not submitted, please check the required fields and try again.', true, 'danger');
                this.notificationModalStay = true;
                return;
            }


            this.applicationsservice.addNewApplication(values).toPromise()
                .then(result => {
                    this.updateNotificaitonModal('Success', 'The application was submitted', true, 'success');
                    this.notificationModalStay = false;
                }).catch(error => {
                var error_json = error
                this.error = []
                for (let key of Object.keys(error_json)) {
                    this.error.push(key.split('_',)[2])

                }


                this.updateNotificaitonModal('Failed', 'The application was not submitted, please check the required fields and try again.', true, 'danger');
                this.notificationModalStay = true;
            })
        }
    }


    public updateNotificaitonModal(title: string, message: string, closable: true, type: string) {
        this.notificationModalTitle = title;
        this.notificationModalMessage = message;
        this.notificationModalIsClosable = closable;
        this.notificationModalType = type;
    }

    public resetNotificationModal() {

        this.notificationModalTitle = 'Notification';
        this.notificationModalMessage = 'Please wait...';
        this.notificationModalType = 'info';
        this.notificationModalIsClosable = false;
        this.notificationModalStay = true;
    }

    public checkShortname(shortname: string) {
        if (/^[a-zA-Z0-9\s]*$/.test(shortname) == false) {
            this.wronginput = true;
        }
        else {
            this.wronginput = false;
        }
    }
}


