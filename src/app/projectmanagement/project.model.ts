import {ProjectMemberApplication} from './project_member_application';
import {ComputecenterComponent} from './computecenter.component';

export class Project {
    get UserIsAdmin(): boolean {
        return this._UserIsAdmin;
    }

    set UserIsAdmin(value: boolean) {
        this._UserIsAdmin = value;
    }

    private _Id: number;
    private _Name: string;
    private _Description: string;
    private _DateCreated: string;
    private _DateEnd: string;
    private _DaysRunning: number;
    private _LifetimeDays: number;
    private _Lifetime: number;
    private _UserIsAdmin: boolean;
    private _UserIsPi: boolean;
    private _Status: number;
    private _ComputeCenter: ComputecenterComponent;
    private _PerunId: number;
    private _ProjectMemberApplications: ProjectMemberApplication[];
    private _RealName: string;
    private _OpenStackProject: boolean;
    private _LifetimeReached: number;


    constructor(Id: number, Name: string, Description: string, DateCreated: string, DaysRunning: number,
                UserIsAdmin: boolean, UserIsPi: boolean, ComputeCenter: ComputecenterComponent) {
        this._Id = Id;
        this._Name = Name;
        this._Description = Description;
        this._DateCreated = DateCreated;
        this._DaysRunning = DaysRunning;
        this._UserIsAdmin = UserIsAdmin;
        this._UserIsPi = UserIsPi;
        this._ComputeCenter = ComputeCenter;

    }

// todo exdend with additional information

    get LifetimeReached(): number {
        return this._LifetimeReached
    }

    set LifetimeReached(value: number) {
        this._LifetimeReached = value;
    }

    get RealName(): string {

        return this._RealName
    }


    set RealName(value: string) {
        this._RealName = value;
    }

    get Status(): number {
        return this._Status;
    }

    set Status(value: number) {
        this._Status = value;

    }

    get ProjectMemberApplications(): ProjectMemberApplication[] {
        return this._ProjectMemberApplications;
    }

    set ProjectMemberApplications(value: ProjectMemberApplication[]) {
        this._ProjectMemberApplications = value;
    }

    get LifetimeDays(): number {
        return this._LifetimeDays
    }

    set LifetimeDays(value: number) {
        this._LifetimeDays = value;
    }

    get OpenStackProject(): boolean {
        return this._OpenStackProject
    }

    set OpenStackProject(value: boolean) {
        this._OpenStackProject = value;
    }

    get Lifetime(): number {
        return this._Lifetime;
    }

    set Lifetime(value: number) {
        this._Lifetime = value;
    }

    get ComputeCenter(): ComputecenterComponent {
        return this._ComputeCenter
    }

    set ComputeCenter(value: ComputecenterComponent) {
        this._ComputeCenter = value;
    }

    get Id(): number {
        return this._Id;
    }

    set Id(value: number) {
        this._Id = value;
    }

    get Name(): string {
        return this._Name;
    }

    set Name(value: string) {
        this._Name = value;
    }

    get Description(): string {
        return this._Description;
    }

    set Description(value: string) {
        this._Description = value;
    }

    get DateCreated(): string {
        return this._DateCreated;
    }

    set DateCreated(value: string) {
        this._DateCreated = value;
    }

    get DateEnd(): string {
        return this._DateEnd;
    }

    set DateEnd(value: string) {
        this._DateEnd = value;
    }

    get DaysRunning(): number {
        return this._DaysRunning;
    }

    set DaysRunning(value: number) {
        this._DaysRunning = value;
    }


    get UserIsPi(): boolean {
        return this._UserIsPi;
    }

    set UserIsPi(value: boolean) {
        this._UserIsPi = value;
    }


}
