import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, Observable } from 'rxjs';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  email: Observable<string | null>;
  constructor(private afAuth: AngularFireAuth) { 
    this.email = this.afAuth.user.pipe(
      map(user => user?.email || 'No email available')
    );
  }
  ngOnInit() {
  }

}
