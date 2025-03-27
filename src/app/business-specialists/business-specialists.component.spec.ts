import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessSpecialistsComponent } from './business-specialists.component';

describe('BusinessSpecialistsComponent', () => {
  let component: BusinessSpecialistsComponent;
  let fixture: ComponentFixture<BusinessSpecialistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessSpecialistsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessSpecialistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
