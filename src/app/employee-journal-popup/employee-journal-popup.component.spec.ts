import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeJournalPopupComponent } from './employee-journal-popup.component';

describe('EmployeeJournalPopupComponent', () => {
  let component: EmployeeJournalPopupComponent;
  let fixture: ComponentFixture<EmployeeJournalPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeJournalPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeJournalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
