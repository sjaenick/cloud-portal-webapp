import {ApplicationLifetimeExtension} from '../application_extension.model';
import {ComputecenterComponent} from '../../projectmanagement/computecenter.component';
import {ApplicationDissemination} from '../application-dissemination';
import {EdamOntologyTerm} from '../edam-ontology-term';
import {Flavor} from '../../virtualmachines/virtualmachinemodels/flavor';
import {Application_States} from '../../shared/shared_modules/baseClass/abstract-base-class';
import {ApplicationModification} from '../application_modification.model';
import {ApplicationCreditRequest} from '../application_credit_request';

/**
 * User Class.
 */
export class User {
  private _username: string;
  private _user_affiliations: string [] = [];
  private _elixir_id: string;
  private _email: string;

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get user_affiliations(): string[] {
    return this._user_affiliations;
  }

  set user_affiliations(value: string[]) {
    this._user_affiliations = value;
  }

  get elixir_id(): string {
    return this._elixir_id;
  }

  set elixir_id(value: string) {
    this._elixir_id = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }
}

/**
 * Application class.
 */
export class Application {

  project_application_id: number | string;
  project_application_report_allowed: boolean = false;
  project_application_name: string;
  project_application_shortname: string;
  project_application_institute: string;
  project_application_workgroup: string;
  project_application_lifetime: number;
  project_application_vms_requested: number;
  project_application_volume_limit: number;
  project_application_volume_counter: number;
  project_application_object_storage: number;
  project_application_description: string;
  project_application_comment: string;
  project_application_date_submitted: string;
  project_application_date_status_changed: string;
  project_application_user: User;
  project_application_pi: User = new User();
  project_application_status: number[] = [];
  ComputeCenter: ComputecenterComponent;
  project_application_openstack_project: boolean;
  DaysRunning: number;
  project_lifetime_request: ApplicationLifetimeExtension = null;
  project_modification_request: ApplicationModification;
  project_credit_request: ApplicationCreditRequest = null;
  project_application_perun_id: number | string;
  project_application_total_cores: number;
  project_application_total_ram: number;
  project_application_initial_credits: number;
  project_application_date_approved: string;
  project_application_openstack_basic_introduction: boolean;
  project_application_horizon2020: string;
  project_application_bmbf_project: string;
  project_application_edam_terms: EdamOntologyTerm[] = [];
  project_application_sensitive_data: boolean;
  project_application_elixir_project: string;
  dissemination: ApplicationDissemination;
  project_application_pi_approved: boolean;
  project_application_cloud_service: boolean;
  project_application_cloud_service_develop: boolean;
  project_application_cloud_service_user_number: number;
  flavors: Flavor[] = [];
  project_application_workshop: boolean;

  constructor(aj: Application | null) {
    this.dissemination = new ApplicationDissemination(null);

    if (aj) {
      this.project_application_id = aj.project_application_id;
      this.project_application_name = aj.project_application_name;
      this.project_application_shortname = aj.project_application_shortname;
      this.project_application_institute = aj.project_application_institute;
      this.project_application_workgroup = aj.project_application_workgroup;
      this.project_application_lifetime = aj.project_application_lifetime;
      this.project_application_vms_requested = aj.project_application_vms_requested;
      this.project_application_volume_limit = aj.project_application_volume_limit;
      this.project_application_volume_counter = aj.project_application_volume_counter;
      this.project_application_object_storage = aj.project_application_object_storage;
      this.project_application_description = aj.project_application_description;
      this.project_application_comment = aj.project_application_comment;
      this.project_application_date_submitted = aj.project_application_date_submitted;
      this.project_application_date_status_changed = aj.project_application_date_status_changed;
      this.project_application_user = aj.project_application_user;
      this.project_application_pi = aj.project_application_pi;
      this.project_application_status = aj.project_application_status;
      this.ComputeCenter = aj.ComputeCenter;
      this.project_application_openstack_project = aj.project_application_openstack_project;
      this.DaysRunning = aj.DaysRunning;
      if (aj.project_lifetime_request) {
        this.project_lifetime_request = new ApplicationLifetimeExtension(aj.project_lifetime_request);
      }
      if (aj.project_modification_request) {
        this.project_modification_request = new ApplicationModification(aj.project_modification_request);
      }
      this.project_application_perun_id = aj.project_application_perun_id;
      this.project_application_total_cores = aj.project_application_total_cores;
      this.project_application_total_ram = aj.project_application_total_ram;
      this.project_application_initial_credits = aj.project_application_initial_credits;
      this.project_application_date_approved = aj.project_application_date_approved;
      this.project_application_openstack_basic_introduction = aj.project_application_openstack_basic_introduction;
      this.project_application_horizon2020 = aj.project_application_horizon2020;
      this.project_application_bmbf_project = aj.project_application_bmbf_project;
      this.project_application_edam_terms = aj.project_application_edam_terms;
      this.project_application_sensitive_data = aj.project_application_sensitive_data;
      this.project_application_elixir_project = aj.project_application_elixir_project;
      this.project_application_pi_approved = aj.project_application_pi_approved;
      this.project_application_cloud_service = aj.project_application_cloud_service;
      this.project_application_cloud_service_develop = aj.project_application_cloud_service_develop;
      this.project_application_cloud_service_user_number = aj.project_application_cloud_service_user_number;
      this.flavors = aj.flavors;
      this.project_application_workshop = aj.project_application_workshop;
      if (aj.dissemination) {
        this.dissemination = new ApplicationDissemination(aj.dissemination);
        this.project_application_report_allowed = this.dissemination.someAllowed();
      }
      this.setDaysRunning()
    }
  }

  public hasSubmittedStatus(): boolean {
    return this.project_application_status?.includes(Application_States.SUBMITTED)
  }

  public hasApprovedStatus(): boolean {
    return this.project_application_status?.includes(Application_States.APPROVED)
  }

  public hasTerminatedStatus(): boolean {
    return this.project_application_status?.includes(Application_States.TERMINATED)
  }

  public hasConfirmationDeniedStatus(): boolean {
    return this.project_application_status?.includes(Application_States.CONFIRMATION_DENIED)
  }

  public hasCreditsDeclinedStatus(): boolean {
    return this.project_application_status?.includes(Application_States.CREDITS_EXTENSION_DENIED)
  }

  public hasCreditsRequestedStatus(): boolean {
    return this.project_application_status?.includes(Application_States.CREDITS_EXTENSION_REQUESTED)
  }

  public hasDeclinedStatus(): boolean {
    return this.project_application_status?.includes(Application_States.DECLINED)
  }

  public hasExtensionDeclinedStatus(): boolean {
    return this.project_application_status?.includes(Application_States.LIFETIME_EXTENSION_DENIED)
  }

  public hasExtensionRequestedStatus(): boolean {
    return this.project_application_status?.includes(Application_States.LIFETIME_EXTENSION_REQUESTED)
  }

  public hasModificationDeclinedStatus(): boolean {
    return this.project_application_status?.includes(Application_States.MODIFICATION_DECLINED)
  }

  public hasSuspendedStatus(): boolean {
    return this.project_application_status?.includes(Application_States.SUSPENDED)
  }

  public hasWaitForConfirmationStatus(): boolean {
    return this.project_application_status?.includes(Application_States.WAIT_FOR_CONFIRMATION)
  }

  public hasModificationRequestedStatus(): boolean {
    return this.project_application_status?.includes(Application_States.MODIFICATION_REQUESTED)
  }

  public hasWaitForExtensionConfirmationStatus(): boolean {
    return this.project_application_status?.includes(Application_States.WAIT_FOR_CONFIRMATION_EXTENSION)
  }

  public hasWaitForModificationConfirmationStatus(): boolean {
    return this.project_application_status?.includes(Application_States.WAIT_FOR_CONFIRMATION_MODIFICATION)
  }

  public hasWaitForCreditConfirmationStatus(): boolean {
    return this.project_application_status?.includes(Application_States.WAIT_FOR_CONFIRMATION_CREDITS)
  }

  private setDaysRunning(): void {
    if (this.project_application_status != null) {
      if (this.project_application_status.includes(Application_States.APPROVED)) {
        // tslint:disable-next-line:max-line-length
        this.DaysRunning = Math.ceil((Math.abs(Date.now() - new Date(this.project_application_date_approved).getTime())) / (1000 * 3600 * 24));
      }
    }
  }

  public addEdamTerm(term: EdamOntologyTerm): void {
    if (this.project_application_edam_terms.indexOf(term) === -1) {
      this.project_application_edam_terms.push(term);
    }
  }

  public removeEdamTerm(term: EdamOntologyTerm): void {
    const idx: number = this.project_application_edam_terms.indexOf(term)
    if (idx !== -1) {
      this.project_application_edam_terms.splice(idx, 1);
    }
  }

  public getFlavorCounter(flavor: Flavor): number {
    const flavs: Flavor[] = this.flavors.filter((fl: Flavor): boolean => {
      return fl.name === flavor.name
    });
    if (flavs.length > 0) {
      return flavs[0].counter
    }

    return 0
  }

  public setFlavorInFlavors(flavor: Flavor, counter: number): void {
    const idx: number = this.flavors.findIndex((fl: Flavor): boolean => {
      return fl.name === flavor.name
    });
    if (idx !== -1) {
      if (counter > 0) {
        this.flavors[idx].counter = counter;
      } else {
        this.flavors.splice(idx, 1)
      }
    } else {
      if (counter > 0) {

        flavor.counter = counter;

        this.flavors.push(flavor)
      }
    }
  }

  get TotalModificationCredits(): number {
    if (this.project_modification_request != null) {
      return Number(this.project_application_initial_credits) +
        Number(this.project_modification_request.extra_credits)
    } else {
      return this.project_application_initial_credits
    }
  }

}
