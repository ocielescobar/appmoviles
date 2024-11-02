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
  private apiURL = 'https://uber-nodejs-server-git-d61f89-guillermovillacuratorres-projects.vercel.app/api/'
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Acces-Control-Allow-Origin': '*',
    }),
  };

  
  
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
  async agregarVehiculo(data: { p_id_usuario: number; p_patente: string; p_marca: string; p_modelo: string; p_anio: number; p_color: string; p_tipo_combustible: string; token: string }, archivo: File) {
    try {
      // Verificación de campos obligatorios
      if (!data.p_id_usuario || !data.p_patente || !data.p_marca || !data.p_modelo || !data.p_anio || !data.p_color || !data.p_tipo_combustible || !data.token) {
        throw new Error("Todos los campos son obligatorios."); 
      }
      
      const formData = new FormData();
      formData.append('p_id_usuario', data.p_id_usuario.toString());
      formData.append('p_patente', data.p_patente);
      formData.append('p_marca', data.p_marca);
      formData.append('p_modelo', data.p_modelo);
      formData.append('p_anio', data.p_anio.toString());
      formData.append('p_color', data.p_color);
      formData.append('p_tipo_combustible', data.p_tipo_combustible);
      formData.append('token', data.token); 
      if (archivo) {
        formData.append('image', archivo, archivo.name); 
      }
  
      const response = await lastValueFrom(this.http.post<any>(this.apiURL + 'vehiculo/agregar', formData));
      return response;
    } catch (error) {
      throw error; 
    }
  }
  async obtenerUsuario(data: { p_correo: string; token: string }): Promise<ApiResponse | undefined> {
    try {
      const params = {
        p_correo: data.p_correo,
        token: data.token
      };
      const response: ApiResponse = await lastValueFrom(this.http.get<ApiResponse>(environment.apiUrl + 'user/obtener', { params }));
      return response;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      return undefined; // Devuelve undefined en caso de error
    }
  }

  async obtenerVehiculo(){
    try {
      const params = {
        p_id: 27,
        token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImU2YWMzNTcyNzY3ZGUyNjE0ZmM1MTA4NjMzMDg3YTQ5MjMzMDNkM2IiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc21wcm95ZWN0b2R1b2MiLCJhdWQiOiJzbXByb3llY3RvZHVvYyIsImF1dGhfdGltZSI6MTczMDUwNTAwNSwidXNlcl9pZCI6IkpYa2pZcGE0a2liVDBTcDdCMU1HVUt0YzRseTEiLCJzdWIiOiJKWGtqWXBhNGtpYlQwU3A3QjFNR1VLdGM0bHkxIiwiaWF0IjoxNzMwNTA1MDA1LCJleHAiOjE3MzA1MDg2MDUsImVtYWlsIjoib2NpLmVzY29iYXJAZHVvY3VjLmNsIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbIm9jaS5lc2NvYmFyQGR1b2N1Yy5jbCJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.bqeuEuHAajqevGixtPLLsjxHToRPHbvaZCD5NrSzRyqvDUGHxpml7N_eX_BetFEooZogIhtkbdoUvOVduiySDPfJY3iHBDjgoS4-k3ygorJKQuT9uEVtJ-BRk5Pi3ccTgp0JrK_MljmmT6OMoLDaBjqtOCbvt1MHMDVfIVq3uzUfnYcz5-8YeDEI1_6-3fh95mr5KxJu68Z3CXCtUYwJf-Cq99PVlwESIhDnH8ohNQQvydEQXq-T4OZqSJI0RTQuVSKjpwMFWCy92uVLegpA6AQkjm1mk5KfL0k35c7Y-HD6ZNcv2e9vo7W91k625s16i2opA4nfGBjs4uwEuachuQ'
      }
      const response = await lastValueFrom(this.http.get<any>(environment.apiUrl + 'vehiculo/obtener',{params}));
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
interface dataGetUser{
  p_correo:string;
  token:string;
}

interface bodyVehiculo {
  p_id_usuario: number;
  p_patente: string;
  p_marca: string;
  p_modelo: string;
  p_anio: number;
  p_color: string;
  p_tipo_combustible: string;
  token: string;
}
interface ApiResponse {
  data?: UserModel[]; // Asegúrate de que esto coincida con la estructura real de tu respuesta
}