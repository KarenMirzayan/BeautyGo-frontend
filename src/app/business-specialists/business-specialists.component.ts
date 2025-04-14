import { Component } from '@angular/core';
import {DropdownComponent} from "../dropdown/dropdown.component";
import {BusinessSpecialistPopupComponent} from "../business-specialist-popup/business-specialist-popup.component";
import {BusinessSpecialistChangeComponent} from "../business-specialist-change/business-specialist-change.component";

@Component({
  selector: 'app-business-specialists',
  standalone: true,
  imports: [
    DropdownComponent,
    BusinessSpecialistPopupComponent,
    BusinessSpecialistChangeComponent
  ],
  templateUrl: './business-specialists.component.html',
  styleUrl: './business-specialists.component.css'
})
export class BusinessSpecialistsComponent {
  showPopupCreate: boolean = false;
  showPopupUpdate: boolean = false;

  openPopupCreate(): void {
    this.showPopupCreate = true;
  }

  closePopupCreate(): void {
    this.showPopupCreate = false;
  }

  openPopupUpdate(): void {
    this.showPopupUpdate = true;
  }

  closePopupUpdate(): void {
    this.showPopupUpdate = false;
  }
}
