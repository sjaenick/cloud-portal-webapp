import ***REMOVED***Component, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***Vmclient***REMOVED*** from './virtualmachinemodels/vmclient';
import ***REMOVED***ClientService***REMOVED*** from '../api-connector/vmClients.service';
import ***REMOVED***PerunSettings***REMOVED*** from '../perun-connector/connector-settings.service';
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service';
import ***REMOVED***GroupService***REMOVED*** from '../api-connector/group.service';
import ***REMOVED***UserService***REMOVED*** from '../api-connector/user.service';
import ***REMOVED***ComputecenterComponent***REMOVED*** from '../projectmanagement/computecenter.component';
import ***REMOVED***FacilityService***REMOVED*** from '../api-connector/facility.service';


@Component(***REMOVED***
    selector: 'client-overview',
    templateUrl: 'vmClients.component.html',
    providers: [FacilityService, UserService, GroupService, ClientService, PerunSettings, ApiSettings]
***REMOVED***)

export class ClientOverviewComponent implements OnInit ***REMOVED***
    /**
     * All clients.
     */
    clients: Vmclient[];
    /**
     * If user is vo.
     * @type ***REMOVED***boolean***REMOVED***
     */
    is_vo_admin = false;
    /**
     * Default status not added client.
     * @type ***REMOVED***string***REMOVED***
     */
    checkStatus = 'Not checked';
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
    isLoaded = false;

    constructor(private facilityService: FacilityService, private userservice: UserService, private groupservice: GroupService,
                private clientservice: ClientService, private perunsettings: PerunSettings) ***REMOVED***

    ***REMOVED***

    /**
     * Check if user is vo.
     * @param ***REMOVED***UserService***REMOVED*** userservice
     */
    checkVOstatus(userservice: UserService) ***REMOVED***
        let user_id: number;
        let admin_vos: ***REMOVED******REMOVED***;
        this.userservice
            .getLoggedUser().toPromise()
            .then(function (userdata) ***REMOVED***
                // TODO catch errors
                user_id = userdata['id'];
                return userservice.getVosWhereUserIsAdmin().toPromise();
            ***REMOVED***).then(function (adminvos) ***REMOVED***
            admin_vos = adminvos;
        ***REMOVED***).then(result => ***REMOVED***
            // check if user is a Vo admin so we can serv according buttons
            for (const vkey in admin_vos) ***REMOVED***
                if (admin_vos[vkey]['id'] === this.perunsettings.getPerunVO().toString()) ***REMOVED***
                    this.is_vo_admin = true;
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***


    /**
     * Get all clients status checked.
     */
    getClientsChecked(): void ***REMOVED***
        this.clientservice.getClientsChecked().subscribe(clients => ***REMOVED***
            this.clients = clients;
            this.isLoaded = true;
        ***REMOVED***);


    ***REMOVED***

    /**
     * Get all computecenters.
     */
    getComputeCenters() ***REMOVED***
        this.facilityService.getComputeCenters().subscribe(result => ***REMOVED***
            for (const cc of result) ***REMOVED***
                const compute_center = new ComputecenterComponent(cc['compute_center_facility_id'], cc['compute_center_name'],
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

                if (!data['status']) ***REMOVED***
                    this.checkStatus = 'No Connection';
                ***REMOVED*** else if (data['status']) ***REMOVED***
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
            this.clientservice.postClient(host, port, location).subscribe(data => ***REMOVED***

                this.getClientsChecked();
            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***

    /**
     * Delete a client.
     * @param ***REMOVED***number***REMOVED*** client_id
     */
    deleteClient(client_id: number): void ***REMOVED***
        this.clientservice.deleteClient(client_id).subscribe(data => ***REMOVED***

            this.getClientsChecked();
        ***REMOVED***);
    ***REMOVED***


    ngOnInit(): void ***REMOVED***
        this.checkVOstatus(this.userservice);
        this.getClientsChecked();
        this.getComputeCenters();

    ***REMOVED***

***REMOVED***
