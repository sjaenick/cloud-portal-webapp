import {Component, OnInit} from '@angular/core';
import {ImageService} from '../../api-connector/image.service';
import {SnapshotModel} from './snapshot.model';
import {forkJoin} from 'rxjs';
import {IResponseTemplate} from "../../api-connector/response-template";

enum Snapshot_Delete_Statuses {
    WAITING = 0,
    SUCCESS = 1,
    ERROR = 2
}

@Component({
    selector: 'app-snapshot-overview',
    templateUrl: 'snapshotOverview.component.html',
    providers: [ImageService]
})

export class SnapshotOverviewComponent implements OnInit {
    /**
     * All snapshots.
     * @type {Array}
     */
    snapshots: SnapshotModel[] = [];
    /**
     * Selected snapshot.
     */
    selected_snapshot: SnapshotModel;
    /**
     * All possible statuses when deleting.
     * @type {Snapshot_Delete_Statuses}
     */
    delete_statuses = Snapshot_Delete_Statuses;
    /**
     * Actual delete status.
     * @type {Snapshot_Delete_Statuses}
     */
    delete_status: number = this.delete_statuses.WAITING;
    /**
     * If site was initialized.
     * @type {boolean}
     */
    isLoaded: boolean = false;

    private checkStatusTimeout: number = 5000;

    constructor(private imageService: ImageService) {

    }

    /**
     * Set selected Snapshot.
     * @param {SnapshotModel} snapshot
     */
    setSelectedSnapshot(snapshot: SnapshotModel): void {
        this.selected_snapshot = snapshot;
    }

    /**
     * Get snapshots by user.
     */
    getSnapshots(): void {
        this.imageService.getSnapshotsByUser().subscribe(result => {
            this.snapshots = result;
            this.isLoaded = true;
            this.checkSnapShotsStatus()
        })
    }

    checkSnapShotsStatus(): void {
        let all_active: boolean = true;

        setTimeout(
            () => {
                const observables = [];
                for (const s of this.snapshots) {

                    observables.push(this.imageService.getSnapshot(s.snapshot_openstackid));

                }
                forkJoin(observables).subscribe(res => {
                    for (const i of res) {
                        this.snapshots[res.indexOf(i)].snapshot_status = i['status'];
                        if (i['status'] !== 'active') {
                            all_active = false;
                        }

                    }
                    if (all_active) {
                        return;
                    } else {
                        this.checkSnapShotsStatus();
                    }
                })
            },
            this.checkStatusTimeout);

    }

    /**
     * Delete snapshot.
     * @param {string} snapshot_id
     */
    deleteSnapshot(snapshot_id: string): void {
        this.imageService.deleteSnapshot(snapshot_id).subscribe((result: IResponseTemplate) => {

            this.delete_status = 0;

            if (<boolean><Boolean>result.value) {
                this.delete_status = 1;
            } else if (result.value) {
                this.delete_status = 3;

            } else {
                this.delete_status = 2;
            }

            this.getSnapshots();
        })

    }

    ngOnInit(): void {
        this.getSnapshots()

    }

}