import {Component} from '@angular/core';

@Component({
             selector: 'app-vm-guidance',
             templateUrl: 'guidance2.component.html',
             providers: []
           })
export class Guidance2Component {
  beginnerHelpText: string = 'Click a button on the left to learn more about the topics.';
  intermediateHelpText: string = 'Click a button on the left to learn more about the topics.';

  vmHelpText: string = 'A virtual machine is basically a computer which runs on the distributed ' +
    'machines in a compute center like Bielefeld.';

  flavorHelpText: string = 'A flavor is the terminology for the bundled amount of CPU, RAM, GPU and ' +
    'diskspace your virtual machine will have.';

  imageHelpText: string = 'LOREM IPSUM TRABADUR. LOREM IPSUM TRABADUR. LOREM IPSUM TRABADUR. LOREM IPSUM TRABADUR. LOREM IPSUM TRABADUR. ' +
    'LOREM IPSUM TRABADUR. LOREM IPSUM TRABADUR. LOREM IPSUM TRABADUR. LOREM IPSUM TRABADUR. LOREM IPSUM TRABADUR. LOREM IPSUM TRABADUR. ' +
    'LOREM IPSUM TRABADUR. LOREM IPSUM TRABADUR. LOREM IPSUM TRABADUR. LOREM IPSUM TRABADUR. LOREM IPSUM TRABADUR. LOREM IPSUM TRABADUR. ' +
    'LOREM IPSUM TRABADUR. LOREM IPSUM TRABADUR. ';

  shareFilesText: string = 'Please read the following: https://cloud.denbi.de/wiki/';

  ansibleHelpText: string = 'Please read the following: https://cloud.denbi.de/wiki/';
}
