import { Component, OnInit } from '@angular/core';
import { Users } from '../models/Users';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-ver-usuarios',
  templateUrl: './ver-usuarios.component.html',
  styleUrls: ['./ver-usuarios.component.css']
})
export class VerUsuariosComponent implements OnInit {
  users: Users[] = [];
  searchTerm: string = '';
  displayedColumns: string[] = ['nombre', 'sexo', 'apellidos', 'estatura', 'acciones'];

  constructor(private usersService: UsersService, private router: Router,private dialog: MatDialog) {}
  deleteUser(user: Users) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usersService.eliminarUsers(user.id!.toString()).subscribe(response => {
          console.log('Usuario eliminado con éxito', response);
          this.users = this.users.filter(u => u.id !== user.id);
        }, error => {
          console.error('Error al eliminar el usuario', error);
        });
      }
    });
  }
  ngOnInit() {
    this.usersService.verUsarios().subscribe(response => {
      this.users = response.data; 
    });
  }


 
  editUser(user: Users) {
    this.router.navigate(['/editar-usuario', user.id]);
  }

 
  addUser() {
    this.router.navigate(['/agregar-usuario']);
  }
}