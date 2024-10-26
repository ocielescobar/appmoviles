import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicio/firebase.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {
  
  constructor(private navCtrl: NavController, private firebase:FirebaseService,private router:Router) { }
  email=""

  ngOnInit() {
  }
async recuperar(){
  let usuario=await this.firebase.recuperar(this.email);
  console.log(usuario);
  this.router.navigateByUrl('login');
}
atras() {
  this.navCtrl.back();
}
}
