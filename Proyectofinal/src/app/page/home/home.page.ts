import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserModel } from 'src/app/models/usuario';
import { ApiService } from 'src/app/servicio/api.service';
import { FirebaseService } from 'src/app/servicio/firebase.service';
import { StorageService } from 'src/app/servicio/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  email: string="";
  usuario:UserModel[]=[];
  vehiculos:any[]=[];

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
      })
    }

  ngOnInit() {
    this.cargarUsuario();
    this.loadGoogleMaps().then(() => {
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
        'token':dataStorage[0].token
      }
    );
    this.usuario = req.data;
    console.log("DATA INICIO USUARIO ", this.usuario);
  }

  async logout() {
    await this.firebase.logout();
    this.router.navigateByUrl('/login');
  }

  async goToCreateRide() {let dataStorage = await this.storage.obtenerStorage();
    const vehiculos = await this.apiservice.obtenerVehiculo({
      p_id: this. usuario[0].id_usuario,
      token: dataStorage[0].token
    });
    if (vehiculos.data.length > 0) {
      const navigationExtras:NavigationExtras = {
        queryParams: {email: this.email}
      };
      this.router.navigate(['/create-ride'],navigationExtras);
    } else {
      this.popAlertNoVehiculos
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
    if (!this.usuario || this.usuario.length === 0) {
      console.error("Usuario no cargado o está vacío.");
      return;
    }
  
    let dataStorage = await this.storage.obtenerStorage();
    try {
      const vehiculos = await this.apiservice.obtenerVehiculo({
        p_id: this.usuario[0].id_usuario,
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
}
