import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessServiceCreateComponent } from './business-service-create.component';

describe('BusinessServiceCreateComponent', () => {
  let component: BusinessServiceCreateComponent;
  let fixture: ComponentFixture<BusinessServiceCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessServiceCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessServiceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
