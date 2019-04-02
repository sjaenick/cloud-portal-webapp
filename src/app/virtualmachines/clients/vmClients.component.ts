import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***Client***REMOVED*** from './vmclient';
import ***REMOVED***ClientService***REMOVED*** from '../../api-connector/vmClients.service';
import ***REMOVED***ApiSettings***REMOVED*** from '../../api-connector/api-settings.service';
import ***REMOVED***GroupService***REMOVED*** from '../../api-connector/group.service';
import ***REMOVED***UserService***REMOVED*** from '../../api-connector/user.service';
import ***REMOVED***ComputecenterComponent***REMOVED*** from '../../projectmanagement/computecenter.component';
import ***REMOVED***FacilityService***REMOVED*** from '../../api-connector/facility.service';
import ***REMOVED***VoService***REMOVED*** from '../../api-connector/vo.service';
import ***REMOVED***IResponseTemplate***REMOVED*** from "../../api-connector/response-template";

/**
 * Client component.
 */
@Component(***REMOVED***
    selector: 'app-client-overview',
    templateUrl: 'vmClients.component.html',
    providers: [FacilityService, VoService, UserService, GroupService, ClientService, ApiSettings]
***REMOVED***)

export class ClientOverviewComponent implements OnInit ***REMOVED***

    /**
     * All clients.
     */
    clients: Client[];
    /**
     * If user is vo.
     * @type ***REMOVED***boolean***REMOVED***
     */
    is_vo_admin: boolean = false;
    /**
     * Default status not added client.
     * @type ***REMOVED***string***REMOVED***
     */
    checkStatus: string = 'Not checked';
    /**
     * All computecenters.
     * @type ***REMOVED***Array***REMOVED***
     */
    computeCenters: ComputecenterComponent[] = [];
    /**
     * Selected computecenter.
     */
    selectedComputeCenter: ComputecenterComponent;
    /**
     * If site is initialized with data.
     * @type ***REMOVED***boolean***REMOVED***
     */
    isLoaded: boolean = false;

    constructor(private facilityService: FacilityService, private userservice: UserService,
                private clientservice: ClientService, private voservice: VoService) ***REMOVED***

    ***REMOVED***

    /**
     * Check vm status.
     * @param ***REMOVED***UserService***REMOVED*** userservice
     */
    checkVOstatus(): void ***REMOVED***
        this.voservice.isVo().subscribe((result: IResponseTemplate) => ***REMOVED***
            this.is_vo_admin = <boolean><Boolean>result.value;
        ***REMOVED***)

    ***REMOVED***

    /**
     * Get all clients status checked.
     */
    getClientsChecked(): void ***REMOVED***
        this.clientservice.getClientsChecked().subscribe((clients: Client[]) => ***REMOVED***
            this.clients = clients;
            this.isLoaded = true;
        ***REMOVED***);

    ***REMOVED***

    /**
     * Get all computecenters.
     */
    getComputeCenters(): void ***REMOVED***
        this.facilityService.getComputeCenters().subscribe(result => ***REMOVED***
            for (const cc of result) ***REMOVED***
                const compute_center: ComputecenterComponent = new ComputecenterComponent(
                    cc['compute_center_facility_id'], cc['compute_center_name'],
                    cc['compute_center_login'], cc['compute_center_support_mail'])
                this.computeCenters.push(compute_center)
            ***REMOVED***

        ***REMOVED***)
    ***REMOVED***

    /**
     * Check status of client.
     * @param ***REMOVED***string***REMOVED*** host of client
     * @param ***REMOVED***string***REMOVED*** port of client
     */
    checkClient(host: string, port: string): void ***REMOVED***
        if (host && port) ***REMOVED***
            this.clientservice.checkClient(host, port).subscribe(data => ***REMOVED***

                if (!data.value) ***REMOVED***
                    this.checkStatus = 'No Connection';
                ***REMOVED*** else if (data.value) ***REMOVED***
                    this.checkStatus = 'Connected';
                ***REMOVED*** else ***REMOVED***
                    this.checkStatus = 'check failed';

                ***REMOVED***

            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***

    /**
     * Add a new client.
     * @param ***REMOVED***string***REMOVED*** host
     * @param ***REMOVED***string***REMOVED*** port
     * @param ***REMOVED***string***REMOVED*** location
     */
    postClient(host: string, port: string, location: string): void ***REMOVED***

        if (host && port && location) ***REMOVED***
            this.clientservice.postClient(host, port, location).subscribe((newClient: Client) => ***REMOVED***
                this.clients.push(newClient);
            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***


    ngOnInit(): void ***REMOVED***
        this.checkVOstatus();
        this.getClientsChecked();
        this.getComputeCenters();

    ***REMOVED***

***REMOVED***
