import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import 'rxjs/Rx'

import {PerunSettings} from "../perun-connector/connector-settings.service";
import {VirtualmachineService} from "../api-connector/virtualmachine.service";
import {VirtualMachine} from "./virtualmachinemodels/virtualmachine";
import {FullLayoutComponent} from "../layouts/full-layout.component";
import {UserService} from "../api-connector/user.service";
import {ImageService} from "../api-connector/image.service";


@Component({
    selector: 'vm-overview',
    templateUrl: 'vmOverview.component.html',
    providers: [ImageService, UserService, VirtualmachineService, FullLayoutComponent, PerunSettings]
})


export class VmOverviewComponent implements OnInit {
    vms: VirtualMachine[];
    status_changed_vm: string;
    status_changed_vm_id: string;
    elixir_id: string;
    is_vo_admin: boolean;
    snapshot_vm: string;
    validSnapshotNameBool: boolean;
    snapshotDone: string='Waiting';
    snapshotName: string;
    tab = 'own';
    status_changed: number = 0;
    filterusername: string;
    filterip: string;
    filtername: string;
    filterstatus: string;
    filtercreated_at: string;
    filterelixir_id: string;
    filterstopped_at: string;
    filterproject: string;
    filterssh: string;



    constructor(private imageService: ImageService, private userservice: UserService, private virtualmachineservice: VirtualmachineService, private perunsettings: PerunSettings) {
   this.virtualmachineservice.getVolumesByUser().subscribe()

    }

    toggleTab(tabString: string) {
        this.tab = tabString;
    }

    isFilterSSH(ssh_command: string): boolean {
        if (!this.filterssh) {
            return true;
        }
        else if (ssh_command.indexOf(this.filterssh) === 0) {

            return true;

        }
        else {
            return false;
        }
    }

    isFilterProject(vmproject: string): boolean {
        if (!this.filterproject) {
            return true;
        }
        else if (vmproject.indexOf(this.filterproject) === 0) {

            return true;

        }
        else {
            return false;
        }
    }

    checkInactiveVms() {
        this.virtualmachineservice.checkStatusInactiveVms(this.elixir_id).subscribe(vms => {
            this.vms = vms;
            for (let vm of this.vms) {
                if (vm.created_at != '') {
                    vm.created_at = new Date(parseInt(vm.created_at) * 1000).toLocaleDateString();
                }
                if (vm.stopped_at != '' && vm.stopped_at != 'ACTIVE') {
                    vm.stopped_at = new Date(parseInt(vm.stopped_at) * 1000).toLocaleDateString();
                }
                else {
                    vm.stopped_at = ''
                }
            }

        })
    }

    validSnapshotName(e) {
        this.validSnapshotNameBool = this.snapshotName.length > 0 ? true : false;


    }
    resetSnapshotResult(){
        this,this.snapshotDone='Waiting';
    }

    checkStatus(openstackid: string) {
        this.virtualmachineservice.checkVmStatus(openstackid).subscribe(res => {


                this.virtualmachineservice.getVm(this.elixir_id).subscribe(vms => {
                        this.vms = vms;
                        for (let vm of this.vms) {
                            if (vm.created_at != '') {
                                vm.created_at = new Date(parseInt(vm.created_at) * 1000).toLocaleDateString();
                            }
                            if (vm.stopped_at != '' && vm.stopped_at != 'ACTIVE') {
                                vm.stopped_at = new Date(parseInt(vm.stopped_at) * 1000).toLocaleDateString();
                            }
                            else {
                                vm.stopped_at = ''
                            }
                        }

                    }
                );

            }
        )
    }

    isFilterStopped_at(vmstopped_at: string): boolean {
        if (!this.filterstopped_at) {
            return true;
        }
        else if (vmstopped_at.indexOf(this.filterstopped_at) === 0) {
            return true;
        }
        else {
            return false;
        }
    }


    isFilterElixir_id(vmelixir_id: string): boolean {
        if (!this.filterelixir_id) {
            return true;
        }
        else if (vmelixir_id.indexOf(this.filterelixir_id) === 0) {
            return true;
        }
        else {
            return false;
        }
    }

    isFilterCreated_at(vmcreated_at: string): boolean {
        if (!this.filtercreated_at) {
            return true;
        }
        else if (vmcreated_at.indexOf(this.filtercreated_at) === 0) {
            return true;
        }
        else {
            return false;
        }
    }

    isFilterName(vmname: string): boolean {
        if (!this.filtername) {
            return true;
        }
        else if (vmname.indexOf(this.filtername) === 0) {
            return true;
        }
        else {
            return false;
        }
    }

    isFilterIP(vmip: string): boolean {
        if (!this.filterip) {
            return true;
        }
        else if (vmip == null) {
            return false;
        }
        else if (vmip.indexOf(this.filterip) === 0) {

            return true;
        }
        else {
            return false;
        }
    }

    isFilterstatus(vmstatus: string): boolean {
        if (!this.filterstatus) {
            return true;
        }
        else if (vmstatus.indexOf(this.filterstatus) === 0) {
            return true;
        }
        else {
            return false;
        }
    }

    isFilterUsername(vmusername: string): boolean {
        if (!this.filterusername) {
            return true;
        }
        else if (vmusername.indexOf(this.filterusername) === 0) {

            return true;
        }
        else {
            return false;
        }
    }

    deleteVm(openstack_id: string): void {
        this.virtualmachineservice.deleteVM(openstack_id).subscribe(result => {

            this.status_changed = 0;


            if (this.tab === 'own') {
                this.getVms(this.elixir_id);
            }
            else if (this.tab === 'all') {
                this.getAllVms();

            }

            if (result.text() === 'true') {
                this.status_changed = 1;
            }
            else {
                this.status_changed = 2;
            }


        })
    }

    stopVm(openstack_id: string): void {
        this.virtualmachineservice.stopVM(openstack_id).subscribe(result => {

            this.status_changed = 0;


            if (this.tab === 'own') {
                this.getVms(this.elixir_id);
            }
            else if (this.tab === 'all') {
                this.getAllVms();

            }

            if (result.text() === 'true') {
                this.status_changed = 1;
            }
            else {
                this.status_changed = 2;
            }


        })
    }

    getVms(elixir_id: string): void {
        this.virtualmachineservice.getVm(elixir_id).subscribe(vms => {
                this.vms = vms;
                for (let vm of this.vms) {
                    if (vm.created_at != '') {
                        vm.created_at = new Date(parseInt(vm.created_at) * 1000).toLocaleDateString();
                    }

                    if (vm.stopped_at != '' && vm.stopped_at != 'ACTIVE') {
                        vm.stopped_at = new Date(parseInt(vm.stopped_at) * 1000).toLocaleDateString();
                    }
                    else {
                        vm.stopped_at = ''
                    }
                }
                this.checkInactiveVms();
            }
        );
    }

    resumeVM(openstack_id: string): void {

        this.virtualmachineservice.resumeVM(openstack_id).subscribe(result => {


            this.status_changed = 0;


            if (this.tab === 'own') {
                this.getVms(this.elixir_id);
            }
            else if (this.tab === 'all') {
                this.getAllVms();

            }

            if (result.text() === 'true') {
                this.status_changed = 1;
            }
            else {
                this.status_changed = 2;
            }

        })
    }


    getAllVms(): void {
        this.virtualmachineservice.getAllVM().subscribe(vms => {
                this.vms = vms;
                for (let vm of this.vms) {

                    if (vm.created_at != '') {
                        vm.created_at = new Date(parseInt(vm.created_at) * 1000).toLocaleDateString();
                    }
                    if (vm.stopped_at != '' && vm.stopped_at != 'ACTIVE') {
                        vm.stopped_at = new Date(parseInt(vm.stopped_at) * 1000).toLocaleDateString();
                    }
                    else {
                        vm.stopped_at = ''
                    }

                }

            }
        );
    }

    ngOnInit(): void {
        this.getElixirId();
        this.checkVOstatus(this.userservice)
    }

    checkVOstatus(userservice: UserService) {
        let user_id: number;
        let admin_vos: {};
        this.userservice
            .getLoggedUser().toPromise()
            .then(function (userdata) {
                //TODO catch errors
                user_id = userdata.json()["id"];
                return userservice.getVosWhereUserIsAdmin(user_id).toPromise();
            }).then(function (adminvos) {
            admin_vos = adminvos.json();
        }).then(result => {
            //check if user is a Vo admin so we can serv according buttons
            for (let vkey in admin_vos) {
                if (admin_vos[vkey]["id"] == this.perunsettings.getPerunVO().toString()) {
                    this.is_vo_admin = true;
                }
            }
        });
    }

    createSnapshot(snapshot_instance: string, snapshot_name: string) {
        this.imageService.createSnapshot(snapshot_instance, snapshot_name).subscribe(result => {
            if (result['Error']){
                this.snapshotDone=result['Error'].toString();
            }
            else if (result['Created'])
                this.snapshotDone='true';


        })
    }


    getElixirId() {
        this.userservice.getLoggedUser().toPromise()
            .then(result => {
                let res = result.json();

                let userid = res["id"];
                this.userservice.getLogins(userid).toPromise().then(result => {
                    let logins = result.json()
                    for (let login of logins) {
                        if (login['friendlyName'] === 'login-namespace:elixir-persistent') {

                            this.elixir_id = login['value'];

                            break

                        }


                    }
                }).then(result => {
                    this.getVms(this.elixir_id)

                });
            })

    }
}
