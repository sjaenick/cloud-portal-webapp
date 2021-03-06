import {Component, OnInit} from '@angular/core';
import {FacilityService} from '../../api-connector/facility.service';
import {Resources} from '../../vo_manager/resources/resources';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as'
import {CoreFactor} from './core-factor';
import {RamFactor} from './ram-factor';
import {forkJoin} from 'rxjs';

/**
 * Facility resource component.
 */
@Component({
             selector: 'app-resources',
             templateUrl: './resources.component.html',
             styleUrls: ['./resources.component.scss'],
             providers: [FacilityService, ExportAsService]

           })
export class ResourcesComponent implements OnInit {

  title: string = 'Resource Overview';
  public managerFacilities: [string, number][];
  ramUpdateList: { [id: string]: boolean } = {};
  coresUpdateList: { [id: string]: boolean } = {};

  /**
   * Chosen facility.
   */
  public selectedFacility: [string, number];

  isLoaded: boolean = false;
  resources: Resources [];

  /**
   * Id of the table which will be converted to pdf or csv.
   */
  tableId: string = 'contentToConvert';
  today: number = Date.now();
  coreFactors: CoreFactor[] = [];
  ramFactors: RamFactor[] = [];
  exportAsConfigCSV: ExportAsConfig = {
    type: 'csv',
    // elementId: this.tableId
    elementIdOrContent: this.tableId
  };

  constructor(private facilityService: FacilityService, private exportAsService: ExportAsService) {
  }
  addCoreFactor(cores: string | number, factor: string | number, description: string): void {
    if (cores && factor) {
      const re: any = /\,/gi;
      factor = factor.toString().replace(re, '.');
      this.facilityService.addCoresFactor(this.selectedFacility['FacilityId'], cores, factor, description)
        .subscribe((res: CoreFactor[]): void => {
          this.coreFactors = res;
          this.coreFactors.forEach((coreFactor: CoreFactor): void => {
            this.coresUpdateList[coreFactor.id] = false;
          });
          this.getSelectedFacilityResources()
        })
    }
  }

  addRamFactor(ram: string | number, factor: string | number, description: string): void {
    if (ram && factor) {
      const re: any = /\,/gi;
      factor = factor.toString().replace(re, '.');
      // tslint:disable-next-line:max-line-length
      this.facilityService.addRamFactor(this.selectedFacility['FacilityId'], ram, factor, description).subscribe((res: RamFactor[]): void => {
        this.ramFactors = res;
        this.ramFactors.forEach((ramFactor: RamFactor): void => {
          this.ramUpdateList[ramFactor.id] = false;
        })
        this.getSelectedFacilityResources()
      })
    }
  }

  onChangeSelectedFacility(): void {
    this.getSelectedFacilityResources()
  }

  ngOnInit(): void {
    this.facilityService.getManagerFacilities().subscribe((result: [string, number][]): void => {
      this.managerFacilities = result;
      this.selectedFacility = this.managerFacilities[0];
      this.getSelectedFacilityResources();

    })
  }

  public deleteCoreFactor(id: string | number): void {
    this.facilityService.deleteCoreFactor(this.selectedFacility['FacilityId'], id).subscribe((res: CoreFactor[]): void => {
      this.coreFactors = res;
      this.getSelectedFacilityResources()
    })
  }

  public deleteRamFactor(id: string | number): void {
    this.facilityService.deleteRamFactor(this.selectedFacility['FacilityId'], id).subscribe((res: RamFactor[]): void => {
      this.ramFactors = res;
      this.getSelectedFacilityResources()

    })
  }

  public getSelectedFacilityResources(): void {
    this.facilityService.getFacilityResources(this.selectedFacility['FacilityId']).subscribe((res: Resources[]): void => {

                                                                                               this.resources = res;
                                                                                               this.isLoaded = true;
                                                                                             }
    )

  }

  public reloadRamFactor(rf: RamFactor): void {
    this.facilityService.getRamFactor(this.selectedFacility['FacilityId'], rf.id).subscribe((ramFactor: RamFactor): void => {
      this.ramFactors[this.ramFactors.indexOf(rf)] = ramFactor;
    })
  }

  public reloadCoreFactor(cf: CoreFactor): void {
    this.facilityService.getCoreFactor(this.selectedFacility['FacilityId'], cf.id).subscribe((coreFactor: CoreFactor): void => {
      this.coreFactors[this.coreFactors.indexOf(cf)] = coreFactor;
    })
  }

  public getRamCoreFactors(): void {
    forkJoin(
      this.facilityService.getCoreFactors(this.selectedFacility['FacilityId']),
      this.facilityService.getRamFactors(this.selectedFacility['FacilityId'])).subscribe((res: any): void => {
      this.coreFactors = res[0];
      this.coreFactors.forEach((coreFactor: CoreFactor): void => {
        this.coresUpdateList[coreFactor.id] = false;
      });

      this.ramFactors = res[1];
      this.ramFactors.forEach((ramFactor: RamFactor): void => {
        this.ramUpdateList[ramFactor.id] = false;
      })
    })

  }

  public updateRamFactor(rf: RamFactor): void {

    this.facilityService.updateRamFactor(this.selectedFacility['FacilityId'], rf).subscribe((ramFactor: RamFactor): void => {
      this.ramFactors[this.ramFactors.indexOf(rf)] = ramFactor;
      this.getSelectedFacilityResources()

    })

  }

  public updateCoreFactor(cf: CoreFactor): void {

    this.facilityService.updateCoreFactor(this.selectedFacility['FacilityId'], cf).subscribe((coreFactor: CoreFactor): void => {
      this.coreFactors[this.coreFactors.indexOf(cf)] = coreFactor;
      this.getSelectedFacilityResources()

    })

  }

  public changeRamToUpdate(ramFactor: RamFactor): void {
    this.ramUpdateList[ramFactor.id] = !this.ramUpdateList[ramFactor.id]
  }

  public changeCoreToUpdate(coreFactor: CoreFactor): void {
    this.coresUpdateList[coreFactor.id] = !this.coresUpdateList[coreFactor.id]

  }

  public tableToCSV(): void {
    this.exportAsService.save(this.exportAsConfigCSV, this.tableId);

  }

  public tableToPDF(): void {
    html2canvas(document.getElementById(this.tableId)).then((canvas: any): void => {
      // Few necessary setting options
      const imgWidth: number = 208;
      const pageHeight: number = 295;
      const imgHeight: number = canvas.height * imgWidth / canvas.width;
      const heightLeft: number = imgHeight;

      const contentDataURL: string = canvas.toDataURL('image/png');
      const pdf: jsPDF = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      const position: number = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save(`${this.selectedFacility['Facility']}.pdf`); // Generated PDF
    }).catch((): void => {
      console.log('failed to convert to pdf')
    });
  }

}
