import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicio/firebase.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  email=""
  password=""
  constructor(private navCtrl: NavController, private firebase:FirebaseService,private router:Router) { }

  ngOnInit() {
  }
async registrar(){
  const usuario=await this.firebase.registrar(this.email,this.password);
  console.log(usuario);
  this.router.navigateByUrl('Registrar');
}
atras() {
  this.navCtrl.back();
}
}
