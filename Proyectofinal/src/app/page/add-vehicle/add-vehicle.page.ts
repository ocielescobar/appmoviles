import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicio/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from 'src/app/models/usuario';
import { StorageService } from 'src/app/servicio/storage.service';
import { FirebaseService } from 'src/app/servicio/firebase.service';
import { dataGetUser } from 'src/app/servicio/api.service';
@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.page.html',
  styleUrls: ['./add-vehicle.page.scss'],
})
export class AddVehiclePage implements OnInit {
  
  email: string = "";
  usuario: UserModel[] = [];
  id_usuario: number = 0; // Asegúrate de asignar este valor correctamente
  patente: string = "";
  marca: string = "";
  modelo: string = "";
  anio: number = 0;
  color: string = "";
  tipo_combustible: string = "";
  token: string = '';
  archivoImagen: File | null = null;

  dataStorage: any[] = []; // O ajusta el tipo según lo que devuelva tu StorageService

  constructor(
    private apiservice: ApiService,
    private storage: StorageService,
    private activate: ActivatedRoute,
    private router: Router,
    private firebase: FirebaseService,
  ) {
    this.activate.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      console.log("Email obtenido:", this.email);
    });
  }

  ngOnInit() {
    this.cargarUsuario();
  }

  async cargarUsuario() {
    this.dataStorage = await this.storage.obtenerStorage();
    console.log("Datos de storage:", this.dataStorage); // Verificar el contenido del storage
  
    // Crea el objeto dataGetUser
    const userData: dataGetUser = {
      p_correo: this.email,
      token: this.dataStorage[0]?.token, // Usar el token del storage
    };
  
    // Llama al servicio para obtener el usuario
    const req = await this.apiservice.obtenerUsuario(userData);
  
    if (req && req.data) {
      this.usuario = req.data; // Asigna la respuesta a usuario
      console.log("Datos del usuario:", this.usuario); // Muestra los datos en la consola
  
      // Asegúrate de que esto coincida con la estructura de tus datos
      this.id_usuario = this.usuario[0]?.id_usuario; // Suponiendo que el ID está en el primer elemento
      console.log(`ID de usuario: ${this.id_usuario}`);
    } else {
      console.error("No se encontraron datos del usuario");
    }
  }

  async registrarVehiculo() {
    try {
      let dataStorage = await this.storage.obtenerStorage();
      if (this.archivoImagen) {
        const request = await this.apiservice.agregarVehiculo(
          {
            p_id_usuario: this.id_usuario,
            p_patente: this.patente,
            p_marca: this.marca,
            p_modelo:this.modelo,
            p_anio:this.anio,
            p_color:this.color,
            p_tipo_combustible:this.tipo_combustible,
            token: dataStorage[0].token,
          },
          this.archivoImagen
        );
      }
      this.router.navigateByUrl('home');
    } catch (error) {
      console.log(error);
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.archivoImagen = event.target.files[0];
    }
  }
}
