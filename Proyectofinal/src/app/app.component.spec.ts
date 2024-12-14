import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule, IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Permite elementos personalizados como ion-app, ion-menu, etc.
      providers: [
        {
          provide: AngularFireAuth,
          useValue: {
            authState: of(null), // Mock del observable authState
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
