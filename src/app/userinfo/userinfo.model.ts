export class Userinfo ***REMOVED***

  private _Id: number;
  private _FirstName: string;
  private _LastName: string;
  private _MemberId: number;
  private _ElixirId: string;
  private _PublicKey: string;
  private _UserLogin: string;
  private _Email: string;
  private _PendingEmails: string[];

  constructor() ***REMOVED***
    this.LastName = ' ';
    this.FirstName = ' ';
    this.Id = -1;
  ***REMOVED***

  get PendingEmails(): string[] ***REMOVED***
    return this._PendingEmails;
  ***REMOVED***

  set PendingEmails(value: string[]) ***REMOVED***
    this._PendingEmails = value;
  ***REMOVED***

  get Email(): string ***REMOVED***
    return this._Email;
  ***REMOVED***

  set Email(value: string) ***REMOVED***
    this._Email = value;
  ***REMOVED***
  get Id(): number ***REMOVED***
    return this._Id;
  ***REMOVED***

  set Id(value: number) ***REMOVED***
    this._Id = value;
  ***REMOVED***

  get FirstName(): string ***REMOVED***
    return this._FirstName;
  ***REMOVED***

  set FirstName(value: string) ***REMOVED***
    this._FirstName = value;
  ***REMOVED***

  get LastName(): string ***REMOVED***
    return this._LastName;
  ***REMOVED***

  set LastName(value: string) ***REMOVED***
    this._LastName = value;
  ***REMOVED***

  get MemberId(): number ***REMOVED***
    return this._MemberId;
  ***REMOVED***

  set MemberId(value: number) ***REMOVED***
    this._MemberId = value;
  ***REMOVED***

  set ElxirId(value: string) ***REMOVED***
    this._ElixirId = value;
  ***REMOVED***

  get ElxirId() ***REMOVED***
    return this._ElixirId
  ***REMOVED***

  set PublicKey(value: string) ***REMOVED***
    this._PublicKey = value;
  ***REMOVED***

  get PublicKey() ***REMOVED***
    return this._PublicKey
  ***REMOVED***

  set UserLogin(value: string) ***REMOVED***

    this._UserLogin = value;
  ***REMOVED***

  get UserLogin() ***REMOVED***
    return this._UserLogin
  ***REMOVED***

***REMOVED***
