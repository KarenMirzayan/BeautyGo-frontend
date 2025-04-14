import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessSpecialistPopupComponent } from './business-specialist-popup.component';

describe('BusinessSpecialistPopupComponent', () => {
  let component: BusinessSpecialistPopupComponent;
  let fixture: ComponentFixture<BusinessSpecialistPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessSpecialistPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessSpecialistPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
