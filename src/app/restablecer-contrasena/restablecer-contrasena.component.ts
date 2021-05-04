import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-restablecer-contrasena',
  templateUrl: './restablecer-contrasena.component.html',
  styleUrls: ['./restablecer-contrasena.component.css']
})
export class RestablecerContrasenaComponent implements OnInit {

  formReset: FormGroup;
  token: string;
  urlTree: any;
  constructor(private route: Router, private auth: AuthService, private formb: FormBuilder) {
    this.urlTree = this.route.parseUrl(this.route.url);
    this.token = this.urlTree.queryParams['token'];
    // this.token = this.activatedRoute.snapshot.params['token'];
    this.formularioReset();
   }

  ngOnInit(): void {
    console.log(this.token);
  }

  get emailNoValid(){
    return this.formReset.get('email').invalid && this.formReset.get('email').touched;
  }

  get passNoValid(){
    return this.formReset.get('password').invalid && this.formReset.get('password').touched;
  }

  get confirmPassNoValid(){
    return this.formReset.get('password_confirmation').invalid && this.formReset.get('password_confirmation').touched;
  }

  formularioReset(){
    this.formReset = this.formb.group({
      token: [this.token],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required]
    });
  }

  resetPassword(){
    if(this.formReset.invalid){
      return Object.values(this.formReset.controls).forEach(control => {
        control.markAsTouched();
      });
    }
    if(this.formReset.get('password').value !== this.formReset.get('password_confirmation')){
      Swal.fire('Contraseña no son iguales', 'Debes colocar las contraseñas iguales', 'error');
    }
    Swal.fire('Realizando cambio de contraseña', '', 'info');
    Swal.showLoading();
    this.auth.enviarCorreo(this.formReset.value, '/password/reset').subscribe((resp:any) => {
      console.log(resp);
      Swal.fire(resp.message, '', 'success')
      this.route.navigateByUrl('/login');
    }, error => {
      Swal.fire('Token inválido.','','info');
      console.log(error);
    })
  }
}
