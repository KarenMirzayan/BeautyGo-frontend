import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessHeaderFooterPageComponent } from './business-header-footer-page.component';

describe('BusinessHeaderFooterPageComponent', () => {
  let component: BusinessHeaderFooterPageComponent;
  let fixture: ComponentFixture<BusinessHeaderFooterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessHeaderFooterPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessHeaderFooterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
