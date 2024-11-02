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
  id_usuario: number = 0;
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
      const localStorage = await this.storage.obtenerStorage();
      const idUsuario = localStorage?.id;
  
      if (idUsuario) {
        const data = {
          p_id_usuario: 27,
          p_patente: this.patente,
          p_marca: this.marca,
          p_modelo: this.modelo,
          p_anio: this.anio,
          p_color: this.color,
          p_tipo_combustible: this.tipo_combustible,
          token: localStorage.token
        };
  
        // Verifica si archivoImagen no es null antes de hacer la llamada
        if (this.archivoImagen) {
          const response = await this.apiservice.agregarVehiculo(data, this.archivoImagen);
          console.log("Respuesta del servidor:", response);
        } else {
          console.error("No se ha seleccionado ninguna imagen para el vehículo.");
        }
      } else {
        console.error("No se encontró el ID de usuario.");
      }
    } catch (error) {
      console.error("Error al registrar el vehículo: ", error);
    }
  }
  
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.archivoImagen = event.target.files[0];
    }
  }
}
interface ApiResponse {
  data?: UserModel[]; // Asegúrate de que esto coincida con la estructura real de tu respuesta
}