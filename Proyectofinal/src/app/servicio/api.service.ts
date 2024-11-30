import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserModel } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  httpOptions = {
    headers: new HttpHeaders({
      'Acces-Control-Allow-Origin': '*',
    }),
  };

  apiURL = 'https://uber-nodejs-server-git-d61f89-guillermovillacuratorres-projects.vercel.app/api/';
  
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

  async agregarUsuario(data: bodyUser, imageFile: File) {
    try {
      const formData = new FormData();
      formData.append('p_nombre', data.p_nombre);
      formData.append('p_correo_electronico', data.p_correo_electronico);
      formData.append('p_telefono', data.p_telefono);
      if(data.token) {
        formData.append('token',data.token);
      }
      if(imageFile){
        formData.append('image_usuario', imageFile, imageFile.name);
      }
      const response = await lastValueFrom(
        this.http.post<any>(environment.apiUrl + 'user/agregar', formData)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
  async obtenerUsuario(data: dataGetUser) {
    try {
      // Verificar que el token esté presente
      if (!data.token) {
        throw new Error("El token es obligatorio para obtener el usuario.");
      }
  
      const params = {
        p_correo: data.p_correo,
        token: data.token
      };
  
      const response = await lastValueFrom(
        this.http.get<any>(`${this.apiURL}user/obtener`, { params })
      );
  
      console.log("Respuesta de obtenerUsuario:", response);
      return response;
    } catch (error) {
      console.error("Error al obtener el ID del usuario:", error);
      if (error instanceof HttpErrorResponse) {
        console.error("Detalles del error:", error.message);
      }
      throw error;
    }
  }

  async obtenerVehiculo(data: obtenerVehiculo) {
    try{
      const params={
        p_id: data.p_id,
        token: data.token
      };
      const response = await lastValueFrom(
      this.http.get<any>(environment.apiUrl+ 'vehiculo/obtener', {params}));
      return response;
    }catch(error){
      throw error;
    }
  }

  async agregarVehiculo(data: bodyVehiculo, imageFile: File) {
    try {
      const formData = new FormData();
      formData.append('p_id_usuario', data.p_id_usuario.toString());
      formData.append('p_patente', data.p_patente);
      formData.append('p_marca', data.p_marca);
      formData.append('p_modelo', data.p_modelo);
      formData.append('p_anio', data.p_anio.toString());
      formData.append('p_color', data.p_color);
      formData.append('p_tipo_combustible', data.p_tipo_combustible);
      if (data.token) {
        formData.append('token', data.token);
      }
      if (imageFile) {
        formData.append('image', imageFile, imageFile.name);
      }
      const response = await lastValueFrom(
        this.http.post<any>(environment.apiUrl + 'vehiculo/agregar', formData)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
  async getUserId(token: string): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.http.get<any>(`${this.apiURL}user/obtener`, {
          headers: new HttpHeaders({
            'Authorization': `Bearer ${token}`,
          }),
        })
      );
      return response;
    } catch (error) {
      console.error("Error al obtener el ID del usuario:", error);
      if (error instanceof HttpErrorResponse) {
        console.error("Detalles del error:", error.message);
      }
      throw error;
    }
  }

  async agregarViaje(data: crearViaje) {
    try {
             
        const response = await lastValueFrom(
          this.http.post<any>(environment.apiUrl + 'viaje/agregar', data)
      );
        return response;
    } catch (error) {
        throw error;
    }
}

  
}

interface bodyUser{
  p_nombre: string;
  p_correo_electronico: string;
  p_telefono: string;
  token?: string;
}
export interface dataGetUser{
  p_correo: string;
  token: string;
}
interface obtenerVehiculo{
  p_id: number;
  token: string;
}

interface bodyVehiculo {
  p_id_usuario: number;
  p_patente: string;
  p_marca: string;
  p_modelo: string;
  p_anio: number;
  p_color: string;
  p_tipo_combustible: string;
  token?: string;
}

interface crearViaje{
    p_id_usuario: number;
    p_ubicacion_origen: string; 
    p_ubicacion_destino: string;
    p_costo: number;
    p_id_vehiculo: number;
    token: string;
}