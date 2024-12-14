/// <reference types="@types/google.maps" />
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserModel } from 'src/app/models/usuario';
import { ApiService } from 'src/app/servicio/api.service';
import { FirebaseService } from 'src/app/servicio/firebase.service';
import { StorageService } from 'src/app/servicio/storage.service';
import { bodyActualizarViaje } from 'src/app/servicio/api.service';
import { lastValueFrom } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  viajes: any[] = [];
  email: string="";
  usuario: UserModel[] = [];
  vehiculos:any[]=[];
  p_id_estado: number = 0;
  p_id: number = 0;
  private usuarioSubject = new BehaviorSubject<UserModel[] | null>(null);
  usuario$ = this.usuarioSubject.asObservable(); // Observables para otros componentes/métodos

  @ViewChild('searchBox', { static: true }) searchBox!: ElementRef;
  center: google.maps.LatLngLiteral = { lat: -33.5024, lng: -70.6130 }; // Coordenadas por defecto
  zoom = 8; // Nivel de zoom por defecto
  autocomplete!: google.maps.places.Autocomplete;
  map!: google.maps.Map;
  marker!: google.maps.Marker;

  constructor(
    private firebase: FirebaseService,
    private router: Router,
    private storage: StorageService,
    private apiservice: ApiService,
    private activate:ActivatedRoute,
    private alertcontroller:AlertController,
    ) {
      this.activate.queryParams.subscribe(params => {
        this.email = params['email'];
        console.log(this.email)
      });
      this.usuarioSubject.subscribe((usuario) => {
        this.usuario = usuario || [];
      });
    }
    origen: string = '';
    destino: string = '';
    costo: number | null = null;
    idVehiculo: number | null = null;
    
ionViewWillEnter() {
  this.cargarUsuario();
}
  async ngOnInit() {
    await this.loadGoogleMaps().then(() => {
      setTimeout(() => {
        this.initMap(); // Inicializa el mapa después de un breve retraso
        this.initAutocomplete(); // Inicializa la autocompletación
        this.setupSearchBoxListener();
      }, 100); // Pequeño retraso para asegurar que el DOM esté listo
      
    });
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
    console.log("DATA INICIO USUARIO ", this.usuario);
  }

  
  async logout() {
    await this.firebase.logout();
    this.router.navigateByUrl('/login');
  }

  async goToCreateRide() {
    try {
      // Recargar usuario
      await this.cargarUsuario();
  
      // Verifica si el usuario está cargado
      if (!this.usuario || this.usuario.length === 0) {
        console.error("Usuario no cargado o está vacío.");
        alert('Usuario no cargado. Intenta reiniciar la sesión.');
        return;
      }
  
      // Obtener vehículos para el usuario
      let dataStorage = await this.storage.obtenerStorage();
      const vehiculos = await this.apiservice.obtenerVehiculo({
        p_id: this.usuario[0]?.id_usuario,
        token: dataStorage[0]?.token,
      });
  
      if (vehiculos.data.length > 0) {
        const navigationExtras: NavigationExtras = {
          queryParams: { email: this.email },
        };
        this.router.navigate(['/create-ride'], navigationExtras);
      } else {
        this.popAlertNoVehiculos();
      }
    } catch (error) {
      console.error("Error al cargar los vehículos o usuario:", error);
      alert("Hubo un problema al crear un viaje. Inténtalo de nuevo.");
    }
  }

  async goToRideList() {
    let dataStorage = await this.storage.obtenerStorage();
    const vehiculos = await this.apiservice.obtenerVehiculo({
      p_id: this. usuario[0].id_usuario,
      token: dataStorage[0].token
    });
    if (vehiculos.data.length > 0) {
      const navigationExtras: NavigationExtras = {
        queryParams: {email: this.email}
      };
      this.router.navigateByUrl('/ride-list');
    } else {
      this.popAlertNoVehiculos
    }    
  }

  loadGoogleMaps(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).google && (window as any).google.maps) {
        resolve();
      } else {
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBs3njaGnyZ1ftTsu_ezdLixZzzMW2-rsA&libraries=places';
        script.async = true; // Carga asincrónica
        script.defer = true; // Defer para asegurar que se ejecute después de que el documento haya sido parseado
        script.onload = () => resolve();
        script.onerror = () => reject('Google Maps API failed to load');
        document.head.appendChild(script);
      }
    });
  }
  initAutocomplete() {
    if (window['google'] && window['google'].maps && window['google'].maps.places) {
      this.autocomplete = new window['google'].maps.places.Autocomplete(this.searchBox.nativeElement, {
        types: ['address'], // Permitir solo direcciones
        componentRestrictions: { country: 'cl' } // Limitar a Chile
      });
  
      this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          // Si se encuentra la ubicación, centrar el mapa y colocar un marcador
          this.map.setCenter(place.geometry.location);
          this.map.setZoom(15);
      
          if (this.marker) {
            this.marker.setMap(null); // Elimina el marcador anterior
          }
          this.marker = new google.maps.Marker({
            position: place.geometry.location,
            map: this.map,
            title: place.name,
          });
        } else if (place.name) {
          // Si no se encuentra la ubicación pero hay un nombre, intenta geocodificar
          this.geocodeAddress(place.name);
        } else {
          alert('No se pudo encontrar la ubicación seleccionada. Intente con otra dirección.');
        }
      });
    }
  }
  initMap() {
    const mapDiv = document.getElementById('map-container') as HTMLElement;
    if (!mapDiv) {
      console.error('El elemento del mapa no se encontró en el DOM.');
      return; // Salir si el div no está disponible
    }
    
    const mapOptions: google.maps.MapOptions = {
      center: this.center,
      zoom: this.zoom,
    };
  
    this.map = new google.maps.Map(mapDiv, mapOptions);
  }
  
  geocodeAddress(address: string) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address, componentRestrictions: { country: 'cl' } }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
        this.map.setCenter(results[0].geometry.location);
        this.map.setZoom(15);
  
        if (this.marker) {
          this.marker.setMap(null); // Elimina el marcador anterior
        }
        this.marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: this.map,
          title: address,
        });
      } else {
        console.error('No se pudo encontrar la ubicación seleccionada.', status);
        alert('No se pudo encontrar la ubicación seleccionada. Asegúrate de que la dirección sea válida.');
      }
    });
  }
  
  setupSearchBoxListener() {
    const input = this.searchBox.nativeElement;
    input.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Evitar el comportamiento predeterminado
        const place = this.autocomplete.getPlace();
      }
    });
  }
  addMarker(location: google.maps.LatLng | google.maps.LatLngLiteral) {
    const marker = new google.maps.marker.AdvancedMarkerElement({
      position: location,
      map: this.map,
      title: 'Ubicación Seleccionada', // Puedes personalizar el título
      // Puedes agregar otras propiedades como iconos, etc.
    });
  }
  

  onInput() {
    if (this.autocomplete) {
      this.autocomplete.setBounds(new google.maps.LatLngBounds(this.center));
    }
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.zoom = 15; // Cambia el zoom al mostrar la ubicación
        this.map.setCenter(this.center); // Centra el mapa en la ubicación actual
        if (this.marker) {
          this.marker.setMap(null); // Elimina el marcador anterior
        }
        this.marker = new google.maps.Marker({
          position: this.center,
          map: this.map,
          title: 'Ubicación Actual',
        });
      }, (error) => {
        console.error('Error getting location:', error);
        alert('No se pudo obtener la ubicación. Asegúrate de que los servicios de ubicación estén habilitados.');
      });
    } else {
      alert('La geolocalización no es soportada por este navegador.');
    }
  }
  

  async goToAddVehicle() {
    const navigationExtras:NavigationExtras = {
      queryParams: {email: this.email}
    };
    this.router.navigate(['/add-vehicle'], { queryParams: { email: this.email } });
  }

  async Obtenervehiculos() {
    try {
      // Recargar usuario para asegurar que esté actualizado
      await this.cargarUsuario();
      if (!this.usuario || this.usuario.length === 0) {
        console.error("Usuario no cargado o está vacío.");
        return;
      }
  
      let dataStorage = await this.storage.obtenerStorage();
      const vehiculos = await this.apiservice.obtenerVehiculo({
        p_id: this.usuario[0]?.id_usuario,
        token: dataStorage[0]?.token,
      });
  
      console.log("Vehículos obtenidos:", vehiculos);
  
      if (vehiculos.data.length > 0) {
        const navigationExtras: NavigationExtras = {
          queryParams: { email: this.email },
        };
        this.router.navigate(['/ver-vehiculos'], navigationExtras);
      } else {
        this.popAlertNoVehiculos();
      }
    } catch (error) {
      console.error("Error al obtener vehículos:", error);
    }
  }
  
  
  async popAlertNoVehiculos(){
    const alert = await this.alertcontroller.create({
      header:'Error',
      message:"Sin vehiculos registrados",
      buttons:['Ok']
    })
    await alert.present();
  }

  async popAlertNoViajes(){
    const alert = await this.alertcontroller.create({
      header:'Error',
      message:"Sin viajes registrados",
      buttons:['Ok']
    })
    await alert.present();
  }

  async cargarViajes() {
    try {
      // Recargar usuario para asegurar que esté actualizado
      await this.cargarUsuario();
  
      // Verifica si el usuario está cargado
      if (!this.usuario || this.usuario.length === 0) {
        console.error("Usuario no cargado o está vacío.");
        alert('Usuario no cargado. Intenta reiniciar la sesión.');
        return;
      }
  
      // Obtener datos de almacenamiento y cargar viajes
      const dataStorage = await this.storage.obtenerStorage();
      const viajesResponse = await this.apiservice.obtenerViaje({
        p_id_usuario: this.usuario[0]?.id_usuario,
        token: dataStorage[0]?.token,
      });
  
      console.log('Viajes obtenidos del servidor:', viajesResponse.data);
  
      // Filtrar viajes activos
      const viajesActivos = viajesResponse.data.filter((viaje: any) => viaje.id_estado === 1);
      console.log('Viajes filtrados (estado 1):', viajesActivos);
  
      if (viajesActivos.length > 0) {
        const navigationExtras: NavigationExtras = {
          queryParams: { email: this.email },
          state: { viajes: viajesActivos },
        };
        this.router.navigate(['/ver-viaje'], navigationExtras);
      } else {
        this.popAlertNoViajes();
      }
    } catch (error) {
      console.error('Error al cargar los viajes:', error);
      alert('Hubo un error al cargar tus viajes. Por favor, inténtalo de nuevo.');
    }
  }
  
  async ActualizarViajes() {
    try {
      const dataStorage = await this.storage.obtenerStorage();
      const token = dataStorage[0]?.token;
  
      if (!this.usuario || this.usuario.length === 0) {
        console.error('Usuario no cargado. Redirigiendo al login.');
        this.router.navigateByUrl('/login');
        return;
      }
  
      const viajesResponse = await this.apiservice.obtenerViaje({
        p_id_usuario: this.usuario[0]?.id_usuario,
        token,
      });
  
      if (!viajesResponse || !viajesResponse.data) {
        throw new Error('No se pudo obtener la lista de viajes.');
      }
  
      this.viajes = viajesResponse.data || [];
  
      console.log('Datos de viajes antes de filtrar:', this.viajes);
  
      const viaje = this.viajes.find((v: any) => v.id_estado === 1); // Estado 1 para viaje activo
      console.log('Viaje filtrado con estado 1:', viaje);
  
      if (!viaje) {
        alert('No hay viajes con estado 1 disponibles para actualizar.');
        return;
      }
  
      const body: bodyActualizarViaje = {
        p_id_estado: 3, // Cambiar el estado a 3 (finalizado)
        p_id: viaje.id_viaje.toString(), // ID del viaje
        token,
      };
  
      console.log('Cuerpo de la solicitud de actualización:', body);
  
      this.apiservice.ActualizarViaje(body.p_id_estado, +body.p_id, body).subscribe(
        (response: any) => {
          console.log('Estado actualizado con éxito:', response);
          alert('El estado del viaje se actualizó correctamente a 3.');
          this.cargarViajes(); // Recargar viajes después de la actualización
        },
        (error: any) => {
          console.error('Error al actualizar el estado del viaje:', error);
          alert('Hubo un error al actualizar el estado del viaje.');
        }
      );
    } catch (error) {
      console.error('Error en ActualizarViajes:', error);
      alert('No se pudo actualizar el estado del viaje.');
    }
  }
  
}
