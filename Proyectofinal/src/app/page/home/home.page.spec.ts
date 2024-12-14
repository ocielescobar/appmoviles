import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HomePage } from './home.page';
import { ApiService } from 'src/app/servicio/api.service';
import { StorageService } from 'src/app/servicio/storage.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseService } from 'src/app/servicio/firebase.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(waitForAsync(() => {
    const angularFireAuthMock = {
      authState: {
        subscribe: jasmine.createSpy('subscribe'),
      },
    };

    const firebaseServiceMock = {
      someMethod: jasmine.createSpy('someMethod'), // Mock del método que uses en FirebaseService
    };

    TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Permite elementos personalizados como GoogleMap
      providers: [
        { provide: ApiService, useValue: {} },
        { provide: StorageService, useValue: {} },
        { provide: AngularFireAuth, useValue: angularFireAuthMock },
        { provide: FirebaseService, useValue: firebaseServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
