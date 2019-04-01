import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***Image***REMOVED*** from './virtualmachinemodels/image';
import ***REMOVED***Flavor***REMOVED*** from './virtualmachinemodels/flavor';
import ***REMOVED***ImageService***REMOVED*** from '../api-connector/image.service';
import ***REMOVED***FlavorService***REMOVED*** from '../api-connector/flavor.service';
import ***REMOVED***forkJoin***REMOVED*** from 'rxjs';
import ***REMOVED***VirtualmachineService***REMOVED*** from '../api-connector/virtualmachine.service';
import ***REMOVED***ApplicationsService***REMOVED*** from '../api-connector/applications.service'
import ***REMOVED***Userinfo***REMOVED*** from '../userinfo/userinfo.model';
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service';

import ***REMOVED***ClientService***REMOVED*** from '../api-connector/vmClients.service';
import ***REMOVED***Client***REMOVED*** from './clients/vmclient';
import ***REMOVED***Application***REMOVED*** from '../applications/application.model';
import ***REMOVED***KeyService***REMOVED*** from '../api-connector/key.service';
import ***REMOVED***GroupService***REMOVED*** from '../api-connector/group.service';
import ***REMOVED***environment***REMOVED*** from '../../environments/environment';

/**
 * Start virtualmachine component.
 */
@Component(***REMOVED***
    selector: 'app-new-vm',
    templateUrl: 'addvm.component.html',
    providers: [GroupService, ImageService, KeyService, FlavorService, VirtualmachineService, ApplicationsService,
        Application, ApiSettings, KeyService, ClientService]
***REMOVED***)
export class VirtualMachineComponent implements OnInit ***REMOVED***

    data: string = '';
    creating_vm_status: string = 'Creating..';
    creating_vm_prograss_bar: string = 'progress-bar-animated';
    checking_vm_status: string = '';
    checking_vm_status_width: number = 0;
    checking_vm_status_progress_bar: string = 'progress-bar-animated';
    checking_vm_ssh_port: string = '';
    checking_vm_ssh_port_width: number = 0;

    informationButton: string = 'Show Details';
    informationButton2: string = 'Show Details';
    client_checked: boolean = false;

    /**
     * All image of a project.
     */
    images: Image[];

    /**
     * All flavors of a project.
     */
    flavors: Flavor[];

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

    /**
     * Selected Project vms max.
     */
    selectedProjectVmsMax: number;

    /**
     * Selected Project vms used.
     */
    selectedProjectVmsUsed: number;

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
     * @type ***REMOVED***string***REMOVED***
     */
    volumeName: string = '';

    /**
     * If optional params are shown.
     * @type ***REMOVED***boolean***REMOVED***
     */
    optional_params: boolean = false;

    /**
     * Default diskspace.
     * @type ***REMOVED***number***REMOVED***
     */
    diskspace: number = 0;

    /**
     * If the data for the site is initialized.
     * @type ***REMOVED***boolean***REMOVED***
     */
    isLoaded: boolean = false;

    /**
     * All projects of the user.
     * @type ***REMOVED***any[]***REMOVED***
     */
    projects: string[] = new Array();

    /**
     * application_status_id of the freemium project.
     * @type ***REMOVED***number***REMOVED***
     */
    FREEMIUM_ID: number = environment.freemium_project_id;

    /**
     * Time for the check status loop.
     * @type ***REMOVED***number***REMOVED***
     */
    private checkStatusTimeout: number = 5000;

    constructor(private groupService: GroupService, private imageService: ImageService,
                private flavorService: FlavorService, private virtualmachineservice: VirtualmachineService,
                private keyservice: KeyService) ***REMOVED***
    ***REMOVED***

    /**
     * Get images for the project.
     * @param ***REMOVED***number***REMOVED*** project_id
     */
    getImages(project_id: number): void ***REMOVED***

        this.imageService.getImages(project_id).subscribe(images => this.images = images);
    ***REMOVED***

    /**
     * Get flavors for the project.
     * @param ***REMOVED***number***REMOVED*** project_id
     */
    getFlavors(project_id: number): void ***REMOVED***
        this.flavorService.getFlavors(project_id).subscribe(flavors => this.flavors = flavors);

    ***REMOVED***

    /**
     * Validate the public key of the user.
     */
    validatePublicKey(): boolean ***REMOVED***

        return /ssh-rsa AAAA[0-9A-Za-z+/]+[=]***REMOVED***0,3***REMOVED***( [^@]+@[^@]+)?/.test(this.userinfo.PublicKey)

    ***REMOVED***

    /**
     * Get the public key of the user.
     */
    getUserPublicKey(): void ***REMOVED***
        this.keyservice.getKey().subscribe(result => ***REMOVED***
            this.userinfo.PublicKey = result['public_key'];
        ***REMOVED***)
    ***REMOVED***

    /**
     * Toggle information button 1.
     */
    toggleInformationButton(): void ***REMOVED***
        if (this.informationButton === 'Show Details') ***REMOVED***
            this.informationButton = 'Hide Details';
        ***REMOVED*** else ***REMOVED***
            this.informationButton = 'Show Details';
        ***REMOVED***

    ***REMOVED***

    /**
     * Toggle information button 2.
     */
    toggleInformationButton2(): void ***REMOVED***
        if (this.informationButton2 === 'Show Details') ***REMOVED***
            this.informationButton2 = 'Hide Details';
        ***REMOVED*** else ***REMOVED***
            this.informationButton2 = 'Show Details';
        ***REMOVED***

    ***REMOVED***

    /**
     * Reset the progress bar.
     */
    resetProgressBar(): void ***REMOVED***
        this.creating_vm_status = 'Creating..';
        this.creating_vm_prograss_bar = 'progress-bar-animated';
        this.checking_vm_status = '';
        this.checking_vm_status_width = 0;
        this.checking_vm_status_progress_bar = 'progress-bar-animated';
        this.checking_vm_ssh_port = '';
        this.checking_vm_ssh_port_width = 0;
    ***REMOVED***

    /**
     * Check the status of the started vm in a loop.
     * @param ***REMOVED***string***REMOVED*** id
     */
    check_status_loop(id: string): void ***REMOVED***

        setTimeout(
            () => ***REMOVED***
                this.virtualmachineservice.checkVmStatus(id).subscribe(res => ***REMOVED***
                    if (res['Started'] || res['Error']) ***REMOVED***
                        this.resetProgressBar();
                        this.data = res;
                        this.getSelectedProjectDiskspace();
                        this.getSelectedProjectVms();
                        this.getSelectedProjectVolumes();

                    ***REMOVED*** else ***REMOVED***
                        if (res['Waiting'] === 'PORT_CLOSED') ***REMOVED***
                            this.checking_vm_status = 'Active';
                            this.checking_vm_status_progress_bar = '';
                            this.creating_vm_prograss_bar = '';
                            this.checking_vm_ssh_port = 'Checking port..';
                            this.checking_vm_ssh_port_width = 34;

                        ***REMOVED***
                        this.check_status_loop(id)
                    ***REMOVED***

                ***REMOVED***)
            ***REMOVED***,
            this.checkStatusTimeout);
    ***REMOVED***

    /**
     * Start a virtual machine with specific params.
     * @param ***REMOVED***string***REMOVED*** flavor
     * @param ***REMOVED***string***REMOVED*** image
     * @param ***REMOVED***string***REMOVED*** servername
     * @param ***REMOVED***string***REMOVED*** project
     * @param ***REMOVED***string***REMOVED*** projectid
     */
    startVM(flavor: string, image: string, servername: string, project: string, projectid: string): void ***REMOVED***
        if (image && flavor && servername && project && (this.diskspace <= 0 || this.diskspace > 0 && this.volumeName.length > 0)) ***REMOVED***
            const re: RegExp = /\+/gi;

            const flavor_fixed: string = flavor.replace(re, '%2B');

            this.virtualmachineservice.startVM(
                flavor_fixed, image, servername, project, projectid,
                this.volumeName, this.diskspace.toString()).subscribe(data => ***REMOVED***

                if (data['Created']) ***REMOVED***
                    this.creating_vm_status = 'Created';
                    this.creating_vm_prograss_bar = '';
                    this.checking_vm_status = 'Checking status..';
                    this.checking_vm_status_progress_bar = 'progress-bar-animated';
                    this.checking_vm_status_width = 33;

                    this.check_status_loop(data['Created']);
                ***REMOVED*** else ***REMOVED***
                    this.creating_vm_status = 'Creating';

                    this.data = data
                ***REMOVED***

            ***REMOVED***);

        ***REMOVED*** else ***REMOVED***
            this.creating_vm_status = 'Creating';

            this.data = 'INVALID'

        ***REMOVED***
    ***REMOVED***

    /**
     * Get the client from the selected project.
     * If connected geht vm,volumes etc.
     * @param ***REMOVED***number***REMOVED*** groupid
     */
    getSelectedProjectClient(groupid: number): void ***REMOVED***
        this.client_checked = false;
        this.groupService.getClient(this.selectedProject[1].toString()).subscribe(res => ***REMOVED***
            this.selectedProjectClient = res;
            if (res['status'] === 'Connected') ***REMOVED***
                this.client_avaiable = true;

                this.getSelectedProjectDiskspace();
                this.getSelectedProjectVms();
                this.getSelectedProjectVolumes();
                this.getImages(this.selectedProject[1]);
                this.getFlavors(this.selectedProject[1]);
                this.client_checked = true;
            ***REMOVED*** else ***REMOVED***
                this.client_avaiable = false;
                this.client_checked = true;

            ***REMOVED***
            this.selectedProjectClient = res;

        ***REMOVED***)
    ***REMOVED***

    /**
     * Reset the data attribute.
     */
    resetData(): void ***REMOVED***
        if (this.data === 'INVALID') ***REMOVED***
            return;
        ***REMOVED***
        this.data = '';
    ***REMOVED***

    /**
     * Initializes the data.
     * Gets all groups of the user and his key.
     */
    initializeData(): void ***REMOVED***
        forkJoin(this.groupService.getMemberGroupsStatus(), this.keyservice.getKey()).subscribe(result => ***REMOVED***
            this.userinfo.PublicKey = result[1]['public_key'];
            this.validatePublicKey();
            const membergroups = result[0];
            for (const project of membergroups) ***REMOVED***
                this.projects.push(project);

            ***REMOVED***
            this.isLoaded = true;
        ***REMOVED***)
    ***REMOVED***

    /**
     * Get vms diskpace and used from the selected project.
     */
    getSelectedProjectDiskspace(): void ***REMOVED***
        this.groupService.getGroupMaxDiskspace(this.selectedProject[1].toString()).subscribe(result => ***REMOVED***
            if (result['Diskspace']) ***REMOVED***

                this.selectedProjectDiskspaceMax = result['Diskspace'];

            ***REMOVED*** else if (result['Diskspace'] === null || result['Diskspace'] === 0) ***REMOVED***
                this.selectedProjectDiskspaceMax = 0;
            ***REMOVED***

        ***REMOVED***);
        this.groupService.getGroupUsedDiskspace(this.selectedProject[1].toString()).subscribe(result => ***REMOVED***
            if (result['Diskspace']) ***REMOVED***

                this.selectedProjectDiskspaceUsed = result['Diskspace'];
            ***REMOVED*** else if (result['Diskspace'] === 0 || result['Diskspace'] == null) ***REMOVED***
                this.selectedProjectDiskspaceUsed = 0;
            ***REMOVED***

        ***REMOVED***)

    ***REMOVED***

    /**
     * Get volumes max and used from the selected project.
     */
    getSelectedProjectVolumes(): void ***REMOVED***
        this.groupService.getVolumeCounter(this.selectedProject[1].toString()).subscribe(result => ***REMOVED***
            if (result['VolumeCounter']) ***REMOVED***
                this.selectedProjectVolumesMax = result['VolumeCounter'];
            ***REMOVED*** else if (result['VolumeCounter'] === null || result['VolumeCounter'] === 0) ***REMOVED***
                this.selectedProjectVolumesMax = 0;
            ***REMOVED***
        ***REMOVED***);
        this.groupService.getVolumesUsed(this.selectedProject[1].toString()).subscribe(result => ***REMOVED***
            if (result['UsedVolumes']) ***REMOVED***
                this.selectedProjectVolumesUsed = result['UsedVolumes'];
            ***REMOVED*** else if (result['UsedVolumes'] === null || result['UsedVolumes'] === 0) ***REMOVED***

                this.selectedProjectVolumesUsed = 0;
            ***REMOVED***

        ***REMOVED***)
    ***REMOVED***

    /**
     * Get vms max and used from the selected project.
     */
    getSelectedProjectVms(): void ***REMOVED***
        this.groupService.getGroupApprovedVms(this.selectedProject[1].toString()).subscribe(result => ***REMOVED***
            if (result['NumberVms']) ***REMOVED***

                this.selectedProjectVmsMax = result['NumberVms'];

            ***REMOVED*** else if (result['NumberVms'] === null || result['NumberVms'] === 0) ***REMOVED***
                this.selectedProjectVmsMax = 0;
            ***REMOVED***

        ***REMOVED***);
        this.groupService.getGroupUsedVms(this.selectedProject[1].toString()).subscribe(result => ***REMOVED***
            if (result['NumberVms']) ***REMOVED***

                this.selectedProjectVmsUsed = result['NumberVms'];
            ***REMOVED*** else if (result['NumberVms'] === 0 || result['NumberVms'] == null) ***REMOVED***
                this.selectedProjectVmsUsed = 0;
            ***REMOVED***

        ***REMOVED***)

    ***REMOVED***

    ngOnInit(): void ***REMOVED***

        this.userinfo = new Userinfo();
        this.initializeData();

    ***REMOVED***
***REMOVED***
