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
  private _ComputeCenter:[string,number];
  private _ComputeCenterDetails:[string,string][];


  constructor(Id: number, Name: string, Description: string, DateCreated: string, DaysRunning: number, UserIsAdmin: boolean, UserIsPi: boolean,ComputeCenter: [string,number]) {
    this._Id = Id;
    this._Name = Name;
    this._Description = Description;
    this._DateCreated = DateCreated;
    this._DaysRunning = DaysRunning;
    this._UserIsAdmin = UserIsAdmin;
    this._UserIsPi = UserIsPi;
    this._ComputeCenter= ComputeCenter;

  }

//todo exdend with additional information

  get LifetimeDays():number{
    return this._LifetimeDays
  }
   set LifetimeDays(value:number){
    this._LifetimeDays=value;
  }
  get Lifetime():number{
    return this._Lifetime;
  }
  set Lifetime(value:number){
    this._Lifetime=value;
  }
  get ComputeCenterDetails(){
    return this._ComputeCenterDetails;
  }
  set ComputecenterDetails(value:[string,string][]){
    this._ComputeCenterDetails=value;
  }
  get ComputeCenter(): [string,number] {
    return this._ComputeCenter
  }

  set ComputeCenter(value: [string,number]) {
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
