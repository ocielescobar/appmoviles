import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CreateRidePage } from './create-ride.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from 'src/app/servicio/firebase.service';
import { ApiService } from 'src/app/servicio/api.service';

describe('CreateRidePage', () => {
  let component: CreateRidePage;
  let fixture: ComponentFixture<CreateRidePage>;

  beforeEach(async () => {
    const firebaseServiceMock = jasmine.createSpyObj('FirebaseService', ['logout']);
    const apiServiceMock = jasmine.createSpyObj('ApiService', ['obtenerViaje']);

    await TestBed.configureTestingModule({
      declarations: [CreateRidePage],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule
      ],
      providers: [
        { provide: FirebaseService, useValue: firebaseServiceMock },
        { provide: ApiService, useValue: apiServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateRidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
