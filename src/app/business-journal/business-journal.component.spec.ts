import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessJournalComponent } from './business-journal.component';

describe('BusinessJournalComponent', () => {
  let component: BusinessJournalComponent;
  let fixture: ComponentFixture<BusinessJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessJournalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
