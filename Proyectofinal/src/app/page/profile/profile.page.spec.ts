import { TestBed } from '@angular/core/testing';
import { ProfilePage } from './profile.page';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';

describe('ProfilePage', () => {
  beforeEach(async () => {
    const angularFireAuthMock = {
      authState: of(null), // Mock del observable authState
      user: of({ email: 'test@example.com' }), // Mock para cualquier observable adicional
    };

    await TestBed.configureTestingModule({
      declarations: [ProfilePage],
      providers: [
        {
          provide: AngularFireAuth,
          useValue: angularFireAuthMock,
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProfilePage);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
