import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RideListPage } from './ride-list.page';

describe('RideListPage', () => {
  let component: RideListPage;
  let fixture: ComponentFixture<RideListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RideListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
