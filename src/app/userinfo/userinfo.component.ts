import ***REMOVED***Component***REMOVED*** from '@angular/core';
import 'rxjs/add/operator/toPromise';
import ***REMOVED***Userinfo***REMOVED*** from './userinfo.model'
import ***REMOVED***AuthzResolver***REMOVED*** from '../perun-connector/authz-resolver.service'
import ***REMOVED***PerunSettings***REMOVED*** from "../perun-connector/connector-settings.service";
import ***REMOVED***MembersManager***REMOVED*** from '../perun-connector/members-manager.service'
import ***REMOVED***ApiSettings***REMOVED*** from '../api-connector/api-settings.service'

@Component(***REMOVED***
  templateUrl: 'userinfo.component.html',
  providers: [AuthzResolver, PerunSettings, MembersManager, ApiSettings]
***REMOVED***)
export class UserinfoComponent ***REMOVED***
  userinfo: Userinfo;
  elixid: string;

  constructor(private authzresolver: AuthzResolver, private memberssmanager: MembersManager) ***REMOVED***
    this.userinfo = new Userinfo();
    this.getUserinfo();
  ***REMOVED***

  getUserinfo() ***REMOVED***
    this.authzresolver.getLoggedUser().toPromise()
      .then(result => ***REMOVED***
        let res = result.json();

        this.userinfo.FirstName = res["firstName"];
        this.userinfo.LastName = res["lastName"];
        this.userinfo.Id = res["id"];

        return this.memberssmanager.getMemberByUser(res["id"]).toPromise();

      ***REMOVED***).then(memberinfo => ***REMOVED***
      this.userinfo.MemberId = memberinfo.json()["id"];

    ***REMOVED***)
    this.authzresolver.getPerunPrincipal().toPromise().then(result =>***REMOVED***
        this.userinfo.ElxirId = result.json()['actor'];
      ***REMOVED***);
  ***REMOVED***


***REMOVED***

