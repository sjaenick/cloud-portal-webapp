import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import 'rxjs/Rx'
import {Vmclient} from "../virtualmachinemodels/vmclient";
import {ClientService} from "../api-connector/vmClients.service";
import {PerunSettings} from "../perun-connector/connector-settings.service";
import {AuthzResolver} from "../perun-connector/authz-resolver.service";
import {UsersManager} from "../perun-connector/users-manager.service";
import {ApiSettings} from "../api-connector/api-settings.service";


@Component({
  selector: 'client-overview',
  templateUrl: 'vmClients.component.html',
  providers: [ClientService, AuthzResolver, UsersManager, PerunSettings,ApiSettings]
})

export class ClientOverviewComponent implements OnInit {
  clients: Vmclient[];
  is_vo_admin = false;

  constructor(private clientservice: ClientService,private perunsettings:PerunSettings,private usersmanager:UsersManager,private authzresolver:AuthzResolver
              ) {
  }

checkVOstatus(usersmanager:UsersManager) {
    let user_id: number;
    let admin_vos: {};
    this.authzresolver
      .getLoggedUser().toPromise()
      .then(function (userdata) {
        //TODO catch errors
        user_id = userdata.json()["id"];
        return usersmanager.getVosWhereUserIsAdmin(user_id).toPromise();
      }).then(function (adminvos) {
      admin_vos = adminvos.json();
    }).then(result => {
      //check if user is a Vo admin so we can serv according buttons
      for (let vkey in admin_vos) {
        if (admin_vos[vkey]["id"] == this.perunsettings.getPerunVO().toString()) {
          this.is_vo_admin = true;
        }
        break;
      }
    });
  }


  getClientsUnchecked(): void {
    this.clientservice.getClientsUnchecked().subscribe(clients => this.clients = clients);

  }

  getClientsChecked(): void {
    this.clientservice.getClientsChecked().subscribe(clients => this.clients = clients);

  }

  postClient(host: string, port: string): void {


    this.clientservice.postClient(host, port).subscribe(data => {
      console.log(data.text());
    });
  }

  deleteClient(host: string, port: string): void {
    this.clientservice.deleteClient(host, port).subscribe(data => {
      console.log(data.text());
    });
  }

  ngOnInit(): void {
    this.checkVOstatus(this.usersmanager);
    this.getClientsUnchecked();

  }


}
