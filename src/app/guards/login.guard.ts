import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private services: AuthService){}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean{
      if(!this.services.authOn()){
        return true;
      }
    return false;
  }
  
}
