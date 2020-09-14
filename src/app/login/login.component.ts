import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params , ParamMap } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';

import Swal from 'sweetalert2';

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
  formLogin: FormGroup;
  roles = [];

  constructor(private route: Router, private auth: AuthService, private userService: UsersService, private formb: FormBuilder) {
    this.userService.getRoles().subscribe( (data:any) =>{
      this.roles = data;
    })
    this.FormLogin();
  }

  ngOnInit(): void {
  }

  get emailNoValid(){
    return this.formLogin.get('email').invalid && this.formLogin.get('email').touched;
  }

  get passNoValid(){
    return this.formLogin.get('password').invalid && this.formLogin.get('password').touched;
  }

  FormLogin(){
    this.formLogin = this.formb.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', Validators.required],
    });
  }

  ingresar(){
    if(this.formLogin.invalid){
      return Object.values(this.formLogin.controls).forEach(control => {
        control.markAsTouched();
      });
    }
    Swal.fire({
      icon: 'info',
      title: 'Un momento por favor',
      allowEscapeKey: false,
      allowOutsideClick: false,
      timer: 2000,
    });
    Swal.showLoading();

    this.auth.login(this.formLogin.value).subscribe(
      (res: any) => {
        Swal.close();
        localStorage.setItem('access_token', res.access_token);
        let dataString = JSON.stringify(res.userdata);
        let dataJson = JSON.parse(dataString);
        localStorage.setItem('rol', res.rol);
        localStorage.setItem('user_id', res.id);
        localStorage.setItem('email', res.email);
        localStorage.setItem('userdata', JSON.stringify(dataJson));

        let rol = localStorage.getItem('rol');
        let name = localStorage.getItem('user');

        if( rol == this.roles[2].id){
          this.route.navigateByUrl('/users/clientes');
        } else if( rol == this.roles[1].id){
          this.route.navigateByUrl('/users/clientes');
        } else if( rol == this.roles[0].id ){
          this.route.navigateByUrl('/users/administradores');
        } else {
          this.route.navigateByUrl('/login');
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


