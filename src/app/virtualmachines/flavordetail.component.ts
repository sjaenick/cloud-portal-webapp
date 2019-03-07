import {Component, Input, OnInit} from '@angular/core';
import {Flavor} from './virtualmachinemodels/flavor'

@Component({
    selector: 'app-flavor-detail',
    templateUrl: 'flavordetail.component.html'


})
export class FlavorDetailComponent implements OnInit {
    @Input() flavor: Flavor;
    @Input() collapse2: boolean;


    ngOnInit() {
    }
}
