import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicio/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from 'src/app/models/usuario';
import { StorageService } from 'src/app/servicio/storage.service';
import { FirebaseService } from 'src/app/servicio/firebase.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.page.html',
  styleUrls: ['./add-vehicle.page.scss'],
})
export class AddVehiclePage implements OnInit {
  email: string = "";
  usuario: UserModel[] = []; // Cambiado a null para poder verificar si existe
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
    private firebase: FirebaseService,
  ) {
    this.activate.queryParams.subscribe(params => {
      this.email = params['email'];
      console.log(this.email);
    });
  }

  ngOnInit() {
    this.cargarUsuario();
  }

  async cargarUsuario(){
    let dataStorage = await this.storage.obtenerStorage();    
    const req = await this.apiservice.obtenerUsuario(
      {
        p_correo: this.email,
        token:dataStorage[0].token
      }
    );
    this.usuario = req.data;
  }
  
  async registrarVehiculo() {
    try {
      let dataStorage = await this.storage.obtenerStorage();
      if (this.archivoImagen) {
        const request = await this.apiservice.agregarVehiculo(
          {
            p_id_usuario: this.usuario[0].id_usuario,
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
