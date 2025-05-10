import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeJournalComponent } from './employee-journal.component';

describe('EmployeeJournalComponent', () => {
  let component: EmployeeJournalComponent;
  let fixture: ComponentFixture<EmployeeJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeJournalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
