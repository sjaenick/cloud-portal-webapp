export class ApplicationExtension ***REMOVED***

    private _Id: number;
    private _Lifetime: number;
    private _VMsRequested: number;
    private _CoresPerVM: number;
    private _RamPerVM: number;
    private _VolumeLimit: number;
    private _VolumeCounter: number;
    private _ObjectStorage: number;
    private _SpecialHardware: string[];
    private _Comment: string;
    private _DateSubmitted: string;
    private _OpenStackProject: boolean;

    constructor() ***REMOVED***
    ***REMOVED***


    get Lifetime(): number ***REMOVED***
        return this._Lifetime;
    ***REMOVED***

    set Lifetime(value: number) ***REMOVED***
        this._Lifetime = value;
    ***REMOVED***




    get OpenStackProject(): boolean ***REMOVED***
        return this._OpenStackProject
    ***REMOVED***

    set OpenStackProject(value: boolean) ***REMOVED***
        this._OpenStackProject = value;
    ***REMOVED***


    get Id(): number ***REMOVED***
        return this._Id;
    ***REMOVED***

    set Id(value: number) ***REMOVED***
        this._Id = value;
    ***REMOVED***


    set Comment(value: string) ***REMOVED***
        this._Comment = value;
    ***REMOVED***

    get Comment(): string ***REMOVED***
        return this._Comment;
    ***REMOVED***



    get VMsRequested(): number ***REMOVED***
        return this._VMsRequested;
    ***REMOVED***

    set VMsRequested(value: number) ***REMOVED***
        this._VMsRequested = value;
    ***REMOVED***

    get CoresPerVM(): number ***REMOVED***
        return this._CoresPerVM;
    ***REMOVED***

    set CoresPerVM(value: number) ***REMOVED***
        this._CoresPerVM = value;
    ***REMOVED***

    get RamPerVM(): number ***REMOVED***
        return this._RamPerVM;
    ***REMOVED***

    set RamPerVM(value: number) ***REMOVED***
        this._RamPerVM = value;
    ***REMOVED***

    get VolumeLimit(): number ***REMOVED***
        return this._VolumeLimit;
    ***REMOVED***

    set VolumeLimit(value: number) ***REMOVED***
        this._VolumeLimit = value;
    ***REMOVED***


    get VolumeCounter(): number ***REMOVED***
        return this._VolumeCounter;
    ***REMOVED***

    set VolumeCounter(value: number) ***REMOVED***
        this._VolumeCounter = value;
    ***REMOVED***

    get ObjectStorage(): number ***REMOVED***
        return this._ObjectStorage;
    ***REMOVED***

    set ObjectStorage(value: number) ***REMOVED***
        this._ObjectStorage = value;
    ***REMOVED***

    get SpecialHardware(): string[] ***REMOVED***
        return this._SpecialHardware;
    ***REMOVED***

    set SpecialHardware(value: string[]) ***REMOVED***
        this._SpecialHardware = value;
    ***REMOVED***


    get DateSubmitted(): string ***REMOVED***
        return this._DateSubmitted;
    ***REMOVED***

    set DateSubmitted(value: string) ***REMOVED***
        this._DateSubmitted = value;
    ***REMOVED***


***REMOVED***
