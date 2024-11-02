import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicio/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from 'src/app/models/usuario';
import { StorageService } from 'src/app/servicio/storage.service';
import { FirebaseService } from 'src/app/servicio/firebase.service'; // Asegúrate de tener este servicio

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.page.html',
  styleUrls: ['./add-vehicle.page.scss'],
})
export class AddVehiclePage implements OnInit {
  email: string = "";
  usuario: UserModel[] = [];
  id_usuario: number = 27;
  patente: string = "";
  marca: string = "";
  modelo: string = "";
  anio: number = 0;
  color: string = "";
  tipo_combustible: string = "";
  token: string = '';
  archivoImagen: File | null = null;

  constructor(
    private apiservice: ApiService,
    private storage: StorageService,
    private activate: ActivatedRoute,
    private router: Router,
    private firebase: FirebaseService // Inyecta el servicio de autenticación
  ) { }

  ngOnInit() {
    this.cargarUsuario();
  }
  async cargarUsuario() {
    const localStorage = await this.storage.obtenerStorage();
    console.log("Email:", this.email); // Verifica el valor de this.email
    console.log("Token desde almacenamiento:", localStorage?.token); // Verifica el valor del token
  
    if (localStorage && localStorage.token) {
      try {
        const req = await this.apiservice.obtenerUsuario({
          p_correo: this.email, // Asegúrate de que this.email no esté vacío
          token: localStorage.token // Esto debe ser una cadena
        });
  
        // Verifica que req no sea undefined y tiene la propiedad data
        if (req && req.data) {
          console.log("Respuesta de la API para obtener usuario:", req);
          this.usuario = req.data; // Asigna directamente si existe
        } else {
          console.error("No se obtuvieron datos de usuario, req puede ser undefined o no contener data.");
          this.usuario = []; // Asigna un array vacío si no hay datos
        }
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
        this.usuario = []; // Manejo de errores
      }
    } else {
      console.error("No se encontraron datos de almacenamiento o el token es indefinido.");
    }
  }
  
  async registrarVehiculo() {
    try {
      const token = await this.firebase.getToken();
        if (!token) {
            throw new Error('Token no disponible');
        }

        // Crea un objeto con los datos del vehículo
        const vehiculoData = {
            p_id_usuario: 27, // Si el ID del usuario es fijo, usa '27', de lo contrario, usa this.idUsuario
            p_patente: this.patente,
            p_marca: this.marca,
            p_modelo: this.modelo,
            p_anio: this.anio,
            p_color: this.color,
            p_tipo_combustible: this.tipo_combustible,
            token: token // Añade el token
        };

        // Verifica si hay una imagen para cargar
        if (this.archivoImagen) { // Asegúrate de que this.archivoImagen contenga un archivo
            const response = await this.apiservice.agregarVehiculo(vehiculoData, this.archivoImagen); // Envía los datos y el archivo
            console.log('Vehículo registrado:', response);
        } else {
            // Manejo de error o lógica cuando no hay imagen
            console.error('No se ha proporcionado una imagen para cargar.');
            // Opcionalmente, podrías registrar el vehículo sin imagen aquí si es aceptable
            // const response = await this.apiservice.agregarVehiculo(vehiculoData, null);
        }
    } catch (error) {
        console.error('Error al registrar el vehículo:', error);
    }
}


  
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.archivoImagen = event.target.files[0];
    }
  }
}