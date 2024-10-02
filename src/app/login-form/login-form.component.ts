import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../services/users.service';
import { UserLoginDTO } from '../class/loginDTO';
import { RegisterUserDTO } from '../class/RegisterUserDTO';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  isLogin: boolean = true;
  imageUrl = '../../assets/user.png';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  nombre: string = '';
  apellidos: string = '';
  estatura: number = 0;
  sexo: string = '';

  constructor(
    private usersService: UsersService, 
    private router: Router, 
    private dialog: MatDialog
  ) {}

  toggleForm() {
    this.isLogin = !this.isLogin;
  }

  showAlert(title: string, message: string) {
    this.dialog.open(AlertDialogComponent, {
      data: { title, message }
    });
  }

  onSubmit() {
    console.log('Form submitted');
    if (this.isLogin) {
      const loginData: UserLoginDTO = {
        Nombre: this.email,
        Contraseña: this.password
      };
      this.usersService.login(loginData).subscribe(response => {
        console.log('Login successful', response);
        this.showAlert('Éxito', 'Inicio de sesión exitoso');
        this.router.navigate(['/ver-usuarios']);
      }, error => {
        console.error('Login failed', error);
        this.showAlert('Error', 'Error en el inicio de sesión');
      });
    } else {
      if (this.password !== this.confirmPassword) {
        this.showAlert('Error', 'Las contraseñas no coinciden');
        return;
      }

      const registerData: RegisterUserDTO = {
        nombre: this.nombre,
        apellidos: this.apellidos,
        estatura: this.estatura,
        sexo: this.sexo,
        contraseña: this.password
      };
      this.usersService.registroUsuario(registerData).subscribe(response => {
        console.log('Registration successful', response);
        this.showAlert('Éxito', 'Registro exitoso');
        this.router.navigate(['/ver-usuarios']);
      }, error => {
        console.error('Registration failed', error);
        this.showAlert('Error', 'Error en el registro');
      });
    }
  }
}