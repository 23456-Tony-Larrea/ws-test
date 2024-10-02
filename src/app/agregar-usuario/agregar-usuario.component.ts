import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../services/users.service';
import { RegisterUserDTO } from '../class/RegisterUserDTO';

@Component({
  selector: 'app-agregar-usuario',
  templateUrl: './agregar-usuario.component.html',
  styleUrls: ['./agregar-usuario.component.css']
})
export class AgregarUsuarioComponent implements OnInit {
  id: string | null = null;
  nombre: string = '';
  apellidos: string = '';
  estatura: number = 0;
  sexo: string = '';
  password: string = '';
  confirmPassword: string = '';
  isEditMode: boolean = false;

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEditMode = true;
      this.usersService.getUserById(this.id).subscribe(user => {
        this.nombre = user.nombre;
        this.apellidos = user.apellidos;
        this.estatura = user.estatura;
        this.sexo = user.sexo;
      });
    }
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top'
      });
      return;
    }
  
    const userData: RegisterUserDTO = {
      nombre: this.nombre,
      apellidos: this.apellidos,
      estatura: this.estatura,
      sexo: this.sexo,
      contraseña: this.password
    };
  
    if (this.isEditMode && this.id) {
      const userWithId = { ...userData, id: this.id }; 
      this.usersService.actualizarUsers(this.id, userWithId).subscribe(response => {
        this.snackBar.open('Usuario actualizado con éxito', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
        this.router.navigate(['/ver-usuarios']);
      }, error => {
        this.snackBar.open('Error en la actualización', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top'
        });
      });
    } else {
      this.usersService.registroUsuario(userData).subscribe(response => {
        this.snackBar.open('Usuario creado con éxito', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top'
        });
        this.router.navigate(['/ver-usuarios']);
      }, error => {
        this.snackBar.open('Error en el registro', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top'
        });
      });
    }
  }
}