import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarPage } from './registrar.page';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseService } from 'src/app/servicio/firebase.service';
import { ApiService } from 'src/app/servicio/api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('RegistrarPage', () => {
  let component: RegistrarPage;
  let fixture: ComponentFixture<RegistrarPage>;

  beforeEach(async () => {
    const angularFireAuthMock = {
      authState: {
        subscribe: jasmine.createSpy('subscribe'),
      },
    };

    await TestBed.configureTestingModule({
      declarations: [RegistrarPage],
      imports: [
        RouterTestingModule,
        IonicModule.forRoot(),
        HttpClientTestingModule,
        FormsModule, // Importa FormsModule para ngModel
      ],
      providers: [
        FirebaseService,
        ApiService,
        { provide: AngularFireAuth, useValue: angularFireAuthMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
