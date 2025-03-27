import { Component } from '@angular/core';
import {DropdownComponent} from "../dropdown/dropdown.component";

@Component({
  selector: 'app-business-specialists',
  standalone: true,
  imports: [
    DropdownComponent
  ],
  templateUrl: './business-specialists.component.html',
  styleUrl: './business-specialists.component.css'
})
export class BusinessSpecialistsComponent {

}
