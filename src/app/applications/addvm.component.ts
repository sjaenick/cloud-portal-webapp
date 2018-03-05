import ***REMOVED***Component, OnInit, TemplateRef***REMOVED*** from '@angular/core';
import ***REMOVED***Image***REMOVED*** from "../virtualmachinemodels/image";
import ***REMOVED***ModalDirective***REMOVED*** from 'ngx-bootstrap/modal/modal.component';
import ***REMOVED***Flavor***REMOVED*** from '../virtualmachinemodels/flavor';
import ***REMOVED***ImageService***REMOVED*** from '../api-connector/image.service';
import ***REMOVED***FlavorService***REMOVED*** from '../api-connector/flavor.service';
import ***REMOVED***ImageDetailComponent***REMOVED*** from "./imagedetail.component";
import ***REMOVED***FormsModule***REMOVED*** from '@angular/forms';
import 'rxjs/Rx'

import ***REMOVED***Metadata***REMOVED*** from '../virtualmachinemodels/metadata';
import ***REMOVED***VirtualmachineService***REMOVED*** from "../api-connector/virtualmachine.service";
import ***REMOVED***ApplicationsService***REMOVED*** from '../api-connector/applications.service'
import ***REMOVED***Userinfo***REMOVED*** from "../userinfo/userinfo.model";
import ***REMOVED***ApiSettings***REMOVED*** from "../api-connector/api-settings.service";
import ***REMOVED***MembersManager***REMOVED*** from "../perun-connector/members-manager.service";
import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***AuthzResolver***REMOVED*** from "../perun-connector/authz-resolver.service";

import ***REMOVED***ClientService***REMOVED*** from "../api-connector/vmClients.service";
import ***REMOVED***Vmclient***REMOVED*** from "../virtualmachinemodels/vmclient";
import ***REMOVED***GroupsManager***REMOVED*** from "../perun-connector/groups-manager.service";
import ***REMOVED***AttributesManager***REMOVED*** from "../perun-connector/attributes-manager";
import ***REMOVED***Application***REMOVED*** from "./application.model";
import ***REMOVED***keyService***REMOVED*** from "../api-connector/key.service";
import ***REMOVED***Project***REMOVED*** from "../projectmanagement/project.model";

@Component(***REMOVED***
  selector: 'new-vm',
  templateUrl: 'addvm.component.html',
  providers: [ImageService, keyService,FlavorService, VirtualmachineService, ApplicationsService, AttributesManager, Application, AuthzResolver, PerunSettings, MembersManager, ApiSettings, keyService, ClientService, GroupsManager]
***REMOVED***)
export class VirtualMachineComponent implements OnInit ***REMOVED***
  data: string = '';
  informationButton: string = "Show Details";
  informationButton2: string = "Show Details";
  images: Image[];
  metadatalist: Metadata [] = [];
  flavors: Flavor[];
  selectedImage: Image;
  selectedFlavor: Flavor;
  userinfo: Userinfo;
  vmclient: Vmclient;
  selectedProject: [string,number];
  client_avaiable: boolean;
  projects: string[] = new Array();


  constructor(private imageService: ImageService, private attributemanager: AttributesManager, private applicataionsservice: ApplicationsService, private  flavorService: FlavorService, private groupsmanager: GroupsManager, private virtualmachineservice: VirtualmachineService, private authzresolver: AuthzResolver, private memberssmanager: MembersManager, private  keyService: keyService, private clientservice: ClientService) ***REMOVED***
  ***REMOVED***


  getImages(): void ***REMOVED***
    this.imageService.getImages(this.vmclient.host, this.vmclient.port).subscribe(images => this.images = images);
  ***REMOVED***

  getFlavors(): void ***REMOVED***
    this.flavorService.getFlavors(this.vmclient.host, this.vmclient.port).subscribe(flavors => this.flavors = flavors);

  ***REMOVED***

  getClientData() ***REMOVED***
    this.clientservice.getClientsChecked().subscribe(response => ***REMOVED***
      this.getRRFirstClient();

    ***REMOVED***)
  ***REMOVED***

  getRRFirstClient(): void ***REMOVED***
    this.clientservice.getRRFirstClient().subscribe(client => ***REMOVED***
        this.vmclient = client;
        if (this.vmclient.status === "Connected") ***REMOVED***
          this.client_avaiable = true;
          this.getImages();
          this.getFlavors();
        ***REMOVED***
        else ***REMOVED***
          this.client_avaiable = false;
        ***REMOVED***


      ***REMOVED***
    )
    ;
  ***REMOVED***
    validatePublicKey() ***REMOVED***

    if (/ssh-rsa AAAA[0-9A-Za-z+/]+[=]***REMOVED***0,3***REMOVED***( [^@]+@[^@]+)?/.test(this.userinfo.PublicKey)) ***REMOVED***
      return true;
    ***REMOVED***
    else ***REMOVED***

      return false;
    ***REMOVED***

  ***REMOVED***

  getUserPublicKey() ***REMOVED***
    this.keyService.getKey(this.userinfo.ElxirId).subscribe(result => ***REMOVED***
      this.userinfo.PublicKey = result.toString();
    ***REMOVED***)
  ***REMOVED***
  toggleInformationButton(): void ***REMOVED***
    if (this.informationButton == "Show Details") ***REMOVED***
      this.informationButton = "Hide Details";
    ***REMOVED*** else ***REMOVED***
      this.informationButton = "Show Details";
    ***REMOVED***

  ***REMOVED***

  toggleInformationButton2(): void ***REMOVED***
    if (this.informationButton2 == "Show Details") ***REMOVED***
      this.informationButton2 = "Hide Details";
    ***REMOVED*** else ***REMOVED***
      this.informationButton2 = "Show Details";
    ***REMOVED***

  ***REMOVED***



  startVM(flavor: string, image: string, servername: string, project: string,projectid:string): void ***REMOVED***
    if (image && flavor && servername && project) ***REMOVED***


      this.virtualmachineservice.startVM(flavor, image, servername, this.vmclient.host, this.vmclient.port, project,projectid).subscribe(data => ***REMOVED***

        this.data = data.json();
      ***REMOVED***);

    ***REMOVED***
    else ***REMOVED***
      this.data = "INVALID"

    ***REMOVED***
  ***REMOVED***


  resetData(): void ***REMOVED***
    if (this.data == 'INVALID') ***REMOVED***
      return;
    ***REMOVED***
    this.data = '';
  ***REMOVED***

  resetData2(): void ***REMOVED***
    this.data = '';
  ***REMOVED***

  onSelectFlavor(flavor: Flavor): void ***REMOVED***
    this.selectedFlavor = flavor;
  ***REMOVED***

  onSelectImage(image: Image): void ***REMOVED***
    this.selectedImage = image
  ***REMOVED***

  checkMetadataKeys(key: string): boolean ***REMOVED***
    for (let metadata of this.metadatalist) ***REMOVED***
      if (metadata.key == key) ***REMOVED***
        return false;
      ***REMOVED***
    ***REMOVED***
    return true;
  ***REMOVED***


  addMetadataItem(key: string, value: string): void ***REMOVED***
    if (key && value && this.checkMetadataKeys(key)) ***REMOVED***
      this.metadatalist.push(new Metadata(key, value));
    ***REMOVED***

  ***REMOVED***

  deleteMetadataItem(metadata: Metadata): void ***REMOVED***
    this.metadatalist.splice(this.metadatalist.indexOf(metadata), 1);
  ***REMOVED***

  getUserApprovedProjects() ***REMOVED***
    this.groupsmanager.getMemberGroupsStatus().toPromise().then(membergroups => ***REMOVED***
      for (let project of membergroups.json()) ***REMOVED***
        this.projects.push(project);

      ***REMOVED***

    ***REMOVED***);
  ***REMOVED***

  ngOnInit(): void ***REMOVED***

    this.userinfo = new Userinfo();
    this.getClientData();
    this.getUserApprovedProjects();
    this.getUserPublicKey();


  ***REMOVED***
***REMOVED***
