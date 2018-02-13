import {Injectable} from "@angular/core";
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from "@angular/router";
import {MembersManager} from "./perun-connector/members-manager.service";
import {AuthzResolver} from "./perun-connector/authz-resolver.service";
import {Observable} from "rxjs/Observable";


@Injectable()
export class MemberGuardService implements CanActivate {


  constructor(private router: Router, private  authzresolver: AuthzResolver, private memberssmanager: MembersManager) {
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return new Promise((resolve, reject) => {
      this.authzresolver.getLoggedUser().toPromise()
        .then(result => {
          let res = result.json();
          return this.memberssmanager.getMemberByUser(res['id']).toPromise();

        }).then(memberinfo => {
        return resolve(true);


      }).catch(rejection => {
        this.router.navigate(['/registration-info']);
        resolve(false);

      });
    });


  }
}



