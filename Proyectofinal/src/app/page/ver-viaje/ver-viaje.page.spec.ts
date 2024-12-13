import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerViajePage } from './ver-viaje.page';

describe('VerViajePage', () => {
  let component: VerViajePage;
  let fixture: ComponentFixture<VerViajePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerViajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
