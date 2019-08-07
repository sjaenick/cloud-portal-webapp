import {Component, OnInit, ViewChild} from '@angular/core';
import {Image} from './virtualmachinemodels/image';
import {Flavor} from './virtualmachinemodels/flavor';
import {ImageService} from '../api-connector/image.service';
import {FlavorService} from '../api-connector/flavor.service';
import {forkJoin, of} from 'rxjs';
import {VirtualmachineService} from '../api-connector/virtualmachine.service';
import {ApplicationsService} from '../api-connector/applications.service'
import {Userinfo} from '../userinfo/userinfo.model';
import {ApiSettings} from '../api-connector/api-settings.service';
import {ClientService} from '../api-connector/client.service';
import {Application} from '../applications/application.model';
import {KeyService} from '../api-connector/key.service';
import {GroupService} from '../api-connector/group.service';
import {environment} from '../../environments/environment';
import {IResponseTemplate} from '../api-connector/response-template';
import {Client} from './clients/client.model';
import {VirtualMachine} from './virtualmachinemodels/virtualmachine';
import {UserService} from '../api-connector/user.service';
import {VoService} from '../api-connector/vo.service';
import {BiocondaComponent} from './conda/bioconda.component';

/**
 * Start virtualmachine component.
 */
@Component({
             selector: 'app-new-vm',
             templateUrl: 'addvm.component.html',
             providers: [GroupService, ImageService, KeyService, FlavorService, VirtualmachineService, ApplicationsService,
               Application, ApiSettings, KeyService, ClientService, UserService, VoService]
           })
export class VirtualMachineComponent implements OnInit {

  TWENTY_FIVE_PERCENT: number = 25;
  FIFTY_PERCENT: number = 50;
  THIRTY_THIRD_PERCENT: number = 33;
  SIXTY_SIX_PERCENT: number = 66;
  SEVENTY_FIVE: number = 75;
  ACTIVE: string = 'ACTIVE';
  PLAYBOOK_FAILED: string = 'PLAYBOOK_FAILED';
  DELETED: string = 'DELETED';
  PORT_CLOSED: string = 'PORT_CLOSED';
  PREPARE_PLAYBOOK_BUILD: string = 'PREPARE_PLAYBOOK_BUILD';
  BUILD_PLAYBOOK: string = 'BUILD_PLAYBOOK';
  CREATING_STATUS: string = 'Creating...';
  BUILD_STATUS: string = 'Building..';
  CHECKING_PORT_STATUS: string = 'Checking port..';
  PREPARE_PLAYBOOK_STATUS: string = 'Prepare Playbook Build...';
  BUIDLING_PLAYBOOK_STATUS: string = 'Building Playbook...';
  ANIMATED_PROGRESS_BAR: string = 'progress-bar-animated';

  newVm: VirtualMachine = null;
  progress_bar_status: string = 'Creating..';
  progress_bar_animated: string = 'progress-bar-animated';
  progress_bar_width: number = 0;
  http_allowed: boolean = false;
  https_allowed: boolean = false;
  udp_allowed: boolean = false;
  is_vo: boolean = false;
  hasTools: boolean = false;
  gaveOkay: boolean = false;
  logs: { [selector: string]: string | number } = {};
  informationButton: string = 'Show Details';
  informationButton2: string = 'Show Details';
  client_checked: boolean = false;
  playbook_run: number = 0;
  timeout: number = 0;

  /**
   * All image of a project.
   */
  images: Image[];

  flavors_loaded: boolean = false;

  create_error: IResponseTemplate;

  /**
   * All flavors of a project.
   */
  flavors: Flavor[] = [];

  /**
   * Selected Image.
   */
  selectedImage: Image;

  /**
   * Selected Flavor.
   */
  selectedFlavor: Flavor;

  /**
   * Userinfo from the user.
   */
  userinfo: Userinfo;

  /**
   * Selected Project vms client.
   */
  selectedProjectClient: Client;

  /**
   * Selected Project diskspace max.
   */
  selectedProjectDiskspaceMax: number;

  /**
   * Selected Project diskspace used.
   */
  selectedProjectDiskspaceUsed: number;

  /**
   * Selected Project volumes max.
   */
  selectedProjectVolumesMax: number;

  /**
   * Selected Project volumes used.
   */
  selectedProjectVolumesUsed: number;

  selectedProjectCoresUsed: number;

  selectedProjectCoresMax: number;

  selectedProjectRamMax: number;

  selectedProjectRamUsed: number;

  /**
   * Selected Project vms max.
   */
  selectedProjectVmsMax: number;

  /**
   * Selected Project vms used.
   */
  selectedProjectVmsUsed: number;

  selectedProjectGPUsUsed: number;
  selectedProjectGPUsMax: number;

  /**
   * The selected project ['name',id].
   */
  selectedProject: [string, number];

  /**
   * If the client for a project is viable.
   */
  client_avaiable: boolean = false;

  /**
   * If the public key is valid.
   */
  validPublickey: boolean;

  /**
   * Default volume name.
   * @type {string}
   */
  volumeName: string = '';

  /**
   * If optional params are shown.
   * @type {boolean}
   */
  optional_params: boolean = false;

  bioconda_show: boolean = false;

  /**
   * Default diskspace.
   * @type {number}
   */
  diskspace: number = 0;

  /**
   * If the data for the site is initialized.
   * @type {boolean}
   */
  isLoaded: boolean = false;

  /**
   * All projects of the user.
   * @type {any[]}
   */
  projects: string[] = new Array();

  /**
   * If all project data is loaded.
   * @type {boolean}
   */
  projectDataLoaded: boolean = false;

  /**
   * id of the freemium project.
   * @type {number}
   */
  FREEMIUM_ID: number = environment.freemium_project_id;

  /**
   * Time for the check status loop.
   * @type {number}
   */
  private checkStatusTimeout: number = 5000;

  @ViewChild('bioconda') biocondaComponent: BiocondaComponent;

  constructor(private groupService: GroupService, private imageService: ImageService,
              private flavorService: FlavorService, private virtualmachineservice: VirtualmachineService,
              private keyservice: KeyService, private userservice: UserService,
              private voService: VoService) {
  }

  /**
   * Get images for the project.
   * @param {number} project_id
   */
  getImages(project_id: number): void {

    this.imageService.getImages(project_id).subscribe((images: Image[]) => {
      this.images = images;
      this.images.sort((x, y) => Number(x.is_snapshot) - Number(y.is_snapshot));
    });
  }

  /**
   * Get flavors for the project.
   * @param {number} project_id
   */
  getFlavors(project_id: number): void {
    this.flavorService.getFlavors(project_id).subscribe((flavors: Flavor[]) => {
      this.flavors = flavors;
      this.flavors_loaded = true;
    });

  }

  /**
   * Validate the public key of the user.
   */
  validatePublicKey(): boolean {

    return /ssh-rsa AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?/.test(this.userinfo.PublicKey)

  }

  /**
   * Get the public key of the user.
   */
  getUserPublicKey(): void {
    this.keyservice.getKey().subscribe((key: IResponseTemplate) => {
      this.userinfo.PublicKey = <string>key.value;
    })
  }

  /**
   * Toggle information button 1.
   */
  toggleInformationButton(): void {
    if (this.informationButton === 'Show Details') {
      this.informationButton = 'Hide Details';
    } else {
      this.informationButton = 'Show Details';
    }

  }

  /**
   * Toggle information button 2.
   */
  toggleInformationButton2(): void {
    if (this.informationButton2 === 'Show Details') {
      this.informationButton2 = 'Hide Details';
    } else {
      this.informationButton2 = 'Show Details';
    }

  }

  /**
   * Reset the progress bar.
   */
  resetProgressBar(): void {
    this.progress_bar_status = this.CREATING_STATUS;
    this.progress_bar_animated = this.ANIMATED_PROGRESS_BAR;
    this.progress_bar_width = 0;
  }

  /**
   * Check the status of the started vm in a loop.
   * @param {string} id
   */
  check_status_loop(id: string): void {

    setTimeout(
      () => {
        this.virtualmachineservice.checkVmStatus(id).subscribe((newVm: VirtualMachine) => {
          if (newVm.status === this.ACTIVE) {
            if (this.playbook_run === 1) {
              this.virtualmachineservice.getLogs(id).subscribe(logs => {
                this.logs = logs;
              });
            }
            this.resetProgressBar();
            this.newVm = newVm;
            this.loadProjectData();

          } else if (newVm.status === this.PLAYBOOK_FAILED || newVm.status === this.DELETED) {
            this.virtualmachineservice.getLogs(id).subscribe(logs => {
              this.newVm.status = this.DELETED;
              this.logs = logs;
              this.resetProgressBar();
              this.create_error = <IResponseTemplate><any>newVm;
              this.loadProjectData();
            });
          } else if (newVm.status) {
            if (newVm.status === this.PORT_CLOSED) {
              this.progress_bar_animated = '';
              this.progress_bar_status = this.CHECKING_PORT_STATUS;
              if (this.hasTools) {
                this.progress_bar_width = this.FIFTY_PERCENT;
              } else {
                this.progress_bar_width = this.SIXTY_SIX_PERCENT;
              }

            } else if (newVm.status === this.PREPARE_PLAYBOOK_BUILD) {
              this.progress_bar_animated = '';
              this.progress_bar_status = this.PREPARE_PLAYBOOK_STATUS;
              this.progress_bar_width = this.SIXTY_SIX_PERCENT;

            } else if (newVm.status === this.BUILD_PLAYBOOK) {
              this.progress_bar_animated = '';
              this.progress_bar_status = this.BUIDLING_PLAYBOOK_STATUS;
              this.progress_bar_width = this.SEVENTY_FIVE;
            }

            this.check_status_loop(id)
          } else {
            this.resetProgressBar();
            this.create_error = <IResponseTemplate><any>newVm;
            this.loadProjectData();
          }

        })
      },
      this.checkStatusTimeout);
  }

  /**
   * Start a virtual machine with specific params.
   * @param {string} flavor
   * @param {string} image
   * @param {string} servername
   * @param {string} project
   * @param {string} projectid
   */
  startVM(flavor: string, image: string, servername: string, project: string, projectid: string | number): void {
    this.create_error = null;
    if (image && flavor && servername && project && (this.diskspace <= 0 || this.diskspace > 0 && this.volumeName.length > 0)) {
      this.create_error = null;
      const re: RegExp = /\+/gi;

      const flavor_fixed: string = flavor.replace(re, '%2B');
      if (this.hasTools) {
        this.progress_bar_width = this.TWENTY_FIVE_PERCENT;
      } else {
        this.progress_bar_width = this.THIRTY_THIRD_PERCENT;
      }
      const play_information: string = this.getPlaybookInformation();
      if (play_information !== '{}') {
        this.playbook_run = 1;
      }
      this.virtualmachineservice.startVM(
        flavor_fixed, image, servername,
        project, projectid.toString(), this.http_allowed,
        this.https_allowed, this.udp_allowed, this.volumeName,
        this.diskspace.toString(), this.biocondaComponent.getChosenTools(), play_information)
        .subscribe((newVm: VirtualMachine) => {

          if (newVm.status === 'Build') {
            this.progress_bar_status = this.BUILD_STATUS;
            this.progress_bar_animated = '';
            this.progress_bar_animated = this.ANIMATED_PROGRESS_BAR;
            if (this.hasTools) {
              this.progress_bar_width = this.TWENTY_FIVE_PERCENT;
            } else {
              this.progress_bar_width = this.THIRTY_THIRD_PERCENT;
            }
            this.check_status_loop(newVm.openstackid);

          } else if (newVm.status) {
            this.progress_bar_status = this.CREATING_STATUS;
            this.newVm = newVm;
            this.check_status_loop(newVm.openstackid);
          } else {
            this.progress_bar_status = this.CREATING_STATUS;
            this.create_error = <IResponseTemplate><any>newVm;
          }

        });

    } else {
      this.progress_bar_status = this.CREATING_STATUS;

      this.newVm = null;

    }
  }

  getPlaybookInformation(): string {
    const playbook_info: {
      [name: string]: {
        [variable: string]: string
      }
    } = {};
    if (this.biocondaComponent.hasChosenTools()) {
      playbook_info['bioconda'] = {
        packages: this.biocondaComponent.getChosenTools()
      };
      this.timeout += this.biocondaComponent.getTimeout();
    }

    return JSON.stringify(playbook_info);
  }

  /**
   * Get the client from the selected project.
   * If connected geht vm,volumes etc.
   * @param {number} groupid
   */
  getSelectedProjectClient(): void {
    this.client_checked = false;
    this.projectDataLoaded = false;

    this.groupService.getClient(this.selectedProject[1].toString()).subscribe((client: Client) => {
      if (client.status && client.status === 'Connected') {
        this.client_avaiable = true;

        this.loadProjectData();
        this.client_checked = true;
      } else {
        this.client_avaiable = false;
        this.client_checked = true;

      }
      this.selectedProjectClient = client;

    })
  }

  /**
   * Reset the data attribute.
   */
  resetData(): void {
    if (this.newVm === null) {
      return;
    }
    this.newVm = null;
  }

  /**
   * Initializes the data.
   * Gets all groups of the user and his key.
   */
  initializeData(): void {
    forkJoin(this.groupService.getSimpleVmByUser(), this.userservice.getUserInfo()).subscribe(result => {
      this.userinfo = new Userinfo(result[1]);
      this.validatePublicKey();
      const membergroups = result[0];
      for (const project of membergroups) {
        this.projects.push(project);

      }
      this.isLoaded = true;
    })
  }

  loadProjectData(): void {
    this.projectDataLoaded = false;
    this.flavors = [];
    this.flavors_loaded = false;
    this.images = [];
    this.selectedImage = undefined;
    this.selectedFlavor = undefined;
    this.groupService.getGroupResources(this.selectedProject[1].toString()).subscribe(res => {
      this.selectedProjectVmsMax = res['number_vms'];
      this.selectedProjectVmsUsed = res['used_vms'];
      this.selectedProjectDiskspaceMax = res['max_volume_storage'];
      this.selectedProjectDiskspaceUsed = res['used_volume_storage'];
      this.selectedProjectVolumesMax = res['volume_counter'];
      this.selectedProjectVolumesUsed = res['used_volumes'];
      this.selectedProjectCoresMax = res['cores_total'];
      this.selectedProjectCoresUsed = res['cores_used'];
      this.selectedProjectRamMax = res['ram_total'];
      this.selectedProjectRamUsed = res['ram_used'];
      this.selectedProjectGPUsMax = res['gpus_max'];
      this.selectedProjectGPUsUsed = res['gpus_used'];
      this.projectDataLoaded = true;

    });

    this.getImages(this.selectedProject[1]);
    this.getFlavors(this.selectedProject[1]);

  }

  /**
   * Get vms diskpace and used from the selected project.
   */
  getSelectedProjectDiskspace(): void {
    forkJoin(
      this.groupService.getGroupMaxDiskspace(this.selectedProject[1].toString()),
      this.groupService.getGroupUsedDiskspace(this.selectedProject[1].toString())).subscribe((res: IResponseTemplate[]) => {
      this.selectedProjectDiskspaceMax = <number>res[0].value;
      this.selectedProjectDiskspaceUsed = <number>res[1].value;
    })
  }

  /**
   * Get volumes max and used from the selected project.
   */
  getSelectedProjectVolumes(): void {
    forkJoin(
      this.groupService.getVolumeCounter(this.selectedProject[1].toString()),
      this.groupService.getVolumesUsed(this.selectedProject[1].toString())).subscribe((res: IResponseTemplate[]) => {
      this.selectedProjectVolumesMax = <number>res[0].value;
      this.selectedProjectVolumesUsed = <number>res[1].value;

    })
  }

  /**
   * Get vms max and used from the selected project.
   */
  getSelectedProjectVms(): void {
    forkJoin(
      this.groupService.getGroupApprovedVms(this.selectedProject[1].toString()),
      this.groupService.getGroupUsedVms(this.selectedProject[1].toString())).subscribe((res: IResponseTemplate[]) => {
      this.selectedProjectVmsMax = <number>res[0].value;
      this.selectedProjectVmsUsed = <number>res[1].value

    })

  }

  ngOnInit(): void {
    this.initializeData();
    this.voService.isVo().subscribe((result: IResponseTemplate) => {
      this.is_vo = <boolean><Boolean>result.value;
    });

  }

  hasChosenTools(hasSomeTools: boolean): void {
    this.hasTools = hasSomeTools;
  }

  setGaveOkay(checked: boolean): void {
    this.gaveOkay = checked;
  }

  getTimeoutMinutes(): number {
    return Math.ceil(this.timeout / 60);
  }

}
