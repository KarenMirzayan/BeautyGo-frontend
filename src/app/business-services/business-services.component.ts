import { Component } from '@angular/core';
import {DropdownComponent} from "../dropdown/dropdown.component";

@Component({
  selector: 'app-business-services',
  standalone: true,
    imports: [
        DropdownComponent
    ],
  templateUrl: './business-services.component.html',
  styleUrl: './business-services.component.css'
})
export class BusinessServicesComponent {

}
