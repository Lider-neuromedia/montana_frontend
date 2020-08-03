import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params , ParamMap } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';

import Swal from 'sweetalert2'

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

  roles = [];

  constructor(private route: Router, private auth: AuthService, private userService: UsersService) {
    this.userService.getRoles().subscribe( (data:any) =>{
      this.roles = data;
    })
  }

  ngOnInit(): void {
  }

  ingresar(){

    Swal.fire({
      title: 'Espere por favor',
      allowEscapeKey: false,
      allowOutsideClick: false,
      timer: 2000,
      onOpen: () => {
        Swal.showLoading();
      }
    })
    
    this.auth.login(this.user).subscribe(
      
      (res: any) => {

        console.log(res);
        localStorage.setItem('access_token', res.access_token);

        let dataString = JSON.stringify(res.userdata);
        let dataJson = JSON.parse(dataString);
        //console.log( dataJson );
        

        localStorage.setItem('rol', res.rol);
        localStorage.setItem('user_id', res.id);
        localStorage.setItem('email', res.email);
        localStorage.setItem('userdata', JSON.stringify(dataJson));

        let rol = localStorage.getItem('rol');
        let name = localStorage.getItem('user');

        

        if( rol == this.roles[2].id){
          this.route.navigate(['/users/clientes',rol]);
        } else if( rol == this.roles[1].id){
          this.route.navigate(['/users/clientes']);
        } else if( rol == this.roles[0].id ){
          this.route.navigate(['/users/administradores']);
        } else {
          alert('Hubo un error');
        }

      },
      (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Lo sentimos',
          text: 'Algo salió mal, introduce tú correo y contraseña'
        })
      });
  }

  }


