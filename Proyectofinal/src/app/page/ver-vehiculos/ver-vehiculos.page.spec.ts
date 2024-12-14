import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerVehiculosPage } from './ver-vehiculos.page';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule } from '@ionic/angular';
import { ApiService } from 'src/app/servicio/api.service';
import { StorageService } from 'src/app/servicio/storage.service';

describe('VerVehiculosPage', () => {
  let component: VerVehiculosPage;
  let fixture: ComponentFixture<VerVehiculosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerVehiculosPage],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        IonicModule.forRoot(),
      ],
      providers: [
        ApiService,
        StorageService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerVehiculosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
