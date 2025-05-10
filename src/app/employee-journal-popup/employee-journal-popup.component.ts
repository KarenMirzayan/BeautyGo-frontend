import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {NgxMaskDirective} from "ngx-mask";
import {DropdownComponent} from "../dropdown/dropdown.component";

@Component({
  selector: 'app-employee-journal-popup',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgxMaskDirective,
    ReactiveFormsModule,
    DropdownComponent
  ],
  templateUrl: './employee-journal-popup.component.html',
  styleUrl: './employee-journal-popup.component.css'
})
export class EmployeeJournalPopupComponent {
  public dates=[];
  public times=[];
  @Input() isVisible: boolean = false;
  @Output() closePopup = new EventEmitter<string>();

  onTopicSelected(event: string) {

  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = (event.target as HTMLElement).closest('.popup-content');
    if (!clickedInside && this.isVisible) {
      this.closePopup.emit("closed");
    }
  }
}
