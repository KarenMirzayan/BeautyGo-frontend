import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalonServicesComponent } from './salon-services.component';

describe('SalonServicesComponent', () => {
  let component: SalonServicesComponent;
  let fixture: ComponentFixture<SalonServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalonServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalonServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
