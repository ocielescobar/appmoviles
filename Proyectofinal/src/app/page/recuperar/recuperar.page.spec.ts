import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarPage } from './recuperar.page';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { FirebaseService } from 'src/app/servicio/firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormsModule } from '@angular/forms';

describe('RecuperarPage', () => {
  let component: RecuperarPage;
  let fixture: ComponentFixture<RecuperarPage>;

  beforeEach(async () => {
    const angularFireAuthMock = {
      authState: {
        subscribe: jasmine.createSpy('subscribe'),
      },
    };

    await TestBed.configureTestingModule({
      declarations: [RecuperarPage],
      imports: [
        RouterTestingModule,
        IonicModule.forRoot(),
        FormsModule, // Importa FormsModule para ngModel
      ],
      providers: [
        FirebaseService,
        { provide: AngularFireAuth, useValue: angularFireAuthMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecuperarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
