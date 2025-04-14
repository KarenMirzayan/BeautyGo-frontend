import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessSpecialistChangeComponent } from './business-specialist-change.component';

describe('BusinessSpecialistChangeComponent', () => {
  let component: BusinessSpecialistChangeComponent;
  let fixture: ComponentFixture<BusinessSpecialistChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessSpecialistChangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessSpecialistChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
