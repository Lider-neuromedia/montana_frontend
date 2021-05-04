import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.component.html',
  styleUrls: ['./restablecer.component.css']
})
export class RestablecerComponent implements OnInit {

  formCorreo: FormGroup;
  constructor(private formb: FormBuilder, private services: AuthService, private user: UsersService) {
    this.FormLogin();
   }

  ngOnInit(): void {
  }

  get emailNoValid(){
    return this.formCorreo.get('email').invalid && this.formCorreo.get('email').touched;
  }

  FormLogin(){
    this.formCorreo = this.formb.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      mensaje: ['Contraseña: athletic2021, debe cambiarla apenas inicie sesión.', [Validators.required, Validators.minLength(5)]]
    });
  }

  restablecer(){    
    let existe = false;
    if(this.formCorreo.invalid){
      return Object.values(this.formCorreo.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    console.log("Validado");
    Swal.fire(
      'Espere por favor',
      'Validando el correo digitado',
      'info'
    );
    Swal.showLoading();
    this.services.enviarCorreo(this.formCorreo.value, '/password/email').subscribe((resp: any) => {
      existe = true;
      console.log(resp);
      Swal.fire("Formulario de contacto", resp.message, 'success');
      return;
      },error => {
        Swal.fire('El correo no se encuentra registrado','','error');
        console.log(error);
      })
    // for (let i = 1; i < 5; i++) {
    // this.user.getAllUsers(i).subscribe((resp:any[]) => {
    //     resp['data'].find(element => {
    //       console.log(element);
    //       if(element.email === this.formCorreo.get('email').value){
                
    //       }else{
    //         existe = false;
    //         console.log(resp);
    //         Swal.fire("Correo no existe", "No se encontro correo registrado", 'warning');
    //         return;
    //       }
    //     })
    //   })
    // }
    // setTimeout(() => {
    //   if(existe){
    //     Swal.fire("Formulario de contacto", "Mensaje enviado correctamente", 'success');
    //   }else{
    //     Swal.fire("Correo no existe", "No se encontro correo registrado", 'warning');
    //   }
    // }, 2000);
  }
}
