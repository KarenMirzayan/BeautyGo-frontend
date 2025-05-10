import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-employee-footer',
  standalone: true,
    imports: [
        RouterLink
    ],
  templateUrl: './employee-footer.component.html',
  styleUrl: './employee-footer.component.css'
})
export class EmployeeFooterComponent {

}
