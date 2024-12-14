import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AddVehiclePage } from './add-vehicle.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/servicio/api.service';
import { FirebaseService } from 'src/app/servicio/firebase.service';

describe('AddVehiclePage', () => {
  let component: AddVehiclePage;
  let fixture: ComponentFixture<AddVehiclePage>;

  beforeEach(async () => {
    const apiServiceMock = jasmine.createSpyObj('ApiService', ['registrarVehiculo']);
    const firebaseServiceMock = jasmine.createSpyObj('FirebaseService', ['logout']);

    await TestBed.configureTestingModule({
      declarations: [AddVehiclePage],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: FirebaseService, useValue: firebaseServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddVehiclePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
