import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params , ParamMap } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = {
    "email": null,
    "password": null,
    "remember_me": true
  }

  token:any;

  constructor(private route: Router, private auth: AuthService) { }

  ngOnInit(): void {
  }

  ingresar(){
    this.auth.login(this.user).subscribe(
      (res: any) => {

        console.log(res);
        localStorage.setItem('access_token', res.access_token);

        let dataString = JSON.stringify(res.userdata);
        let dataJson = JSON.parse(dataString);
        //console.log( dataJson );
        

        localStorage.setItem('rol', res.rol);
        localStorage.setItem('email', res.email);
        localStorage.setItem('userdata', JSON.stringify(dataJson));

        let rol = localStorage.getItem('rol');
        let name = localStorage.getItem('user');

        if( rol == 3){
          this.route.navigate(['/users/clientes',rol]);
        } else if( rol == 2){
          this.route.navigate(['/users/vendedores']);
        } else if( rol == 1 ){
          this.route.navigate(['/users/administradores']);
        } else {
          alert('Hubo un error');
        }

      },
      (err: any) => {

      });
  }

  }


