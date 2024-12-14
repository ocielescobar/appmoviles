import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerViajePage } from './ver-viaje.page';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule } from '@ionic/angular';
import { ApiService } from 'src/app/servicio/api.service';
import { StorageService } from 'src/app/servicio/storage.service';

describe('VerViajePage', () => {
  let component: VerViajePage;
  let fixture: ComponentFixture<VerViajePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerViajePage],
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
    fixture = TestBed.createComponent(VerViajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
