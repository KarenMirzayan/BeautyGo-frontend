import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderFooterPageComponent } from './header-footer-page.component';

describe('HeaderFooterPageComponent', () => {
  let component: HeaderFooterPageComponent;
  let fixture: ComponentFixture<HeaderFooterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderFooterPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderFooterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
