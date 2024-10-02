import { Injectable } from '@angular/core';
import { msUsersURL } from '../urls/url';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {UserLoginDTO} from '../class/loginDTO'
import { RegisterUserDTO } from '../class/RegisterUserDTO';
import { Users } from '../models/Users';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) { }

  login(login: UserLoginDTO): Observable<any>{
    return this.http.post(`${msUsersURL}/login`, login);
  }
  registroUsuario(usuarios:RegisterUserDTO):Observable<any>{
    return this.http.post(`${msUsersURL}`,usuarios);
  }
  verUsarios(): Observable<{ data: Users[] }> {
    return this.http.get<{ data: Users[] }>(msUsersURL);
  }
  actualizarUsers(id: string, Users: RegisterUserDTO): Observable<any> {
    return this.http.put(`${msUsersURL}/${id}`, Users);
  }

  eliminarUsers(id: string): Observable<any> {
    return this.http.delete(`${msUsersURL}/${id}`);
  }
  
  getUserById(id: string): Observable<Users> {
    return this.http.get<Users>(`${msUsersURL}/${id}`);
  }
}
