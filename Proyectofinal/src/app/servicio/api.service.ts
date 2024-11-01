import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'aplication/json',
      'Acces-Control-Allow-Origin': '*',
    }),
  };

  //url de ejemplo
  apiURL = 'https://uber-nodejs-server-git-d61f89-guillermovillacuratorres-projects.vercel.app/api/'
  
  constructor(private http: HttpClient) {}

  getPosts(): Observable<any> {
    return this.http.get(this.apiURL + '/posts/').pipe(retry(3));
  }

  getPost(id: any): Observable<any>{
    return this.http.get(this.apiURL + '/posts/' + id).pipe(retry(3));
  }

  createPost(post: any): Observable<any> {
    return this.http.post(this.apiURL + '/posts/', post, this.httpOptions).pipe(retry(3));
  }

  updatePost(id: any, post: any): Observable<any> {
    return this.http.put(this.apiURL + '/posts/' + id, post, this.httpOptions).pipe(retry(3));
  }

  deletePost(id: any): Observable<any> {
    return this.http.delete(this.apiURL + '/posts/' + id, this.httpOptions);
  }

  async agregarUsuario(data: bodyUser, imagefile: File) {
    try {
      const formData = new FormData();
      formData.append('p_nombre', data.p_nombre);
      formData.append('p_correo_electronico', data.p_correo_electronico);
      formData.append('p.telefono', data.p_telefono);
      if (data.token) {
        formData.append('token', data.token);
      }
      if (imagefile) {
        formData.append('image_usuario', imagefile, imagefile.name);
      }
      const response = await lastValueFrom(
        this.http.post<any>(environment.apiUrl + 'user/agregar', formData)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
  agregarVehiculo(data: any, image: File) {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    formData.append('image', image);
  
    return this.http.post('vehiculo/agregar', formData).toPromise();
  }  
}

interface bodyUser{
  p_nombre: string;
  p_correo_electronico: string;
  p_telefono: string;
  token?: string;
}