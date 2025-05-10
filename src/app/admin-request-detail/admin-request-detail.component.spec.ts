import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRequestDetailComponent } from './admin-request-detail.component';

describe('AdminRequestDetailComponent', () => {
  let component: AdminRequestDetailComponent;
  let fixture: ComponentFixture<AdminRequestDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRequestDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
