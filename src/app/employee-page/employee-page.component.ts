import { Component } from '@angular/core';
import {EmployeeHeaderComponent} from "../employee-header/employee-header.component";
import {RouterOutlet} from "@angular/router";
import {BusinessFooterComponent} from "../business-footer/business-footer.component";
import {EmployeeFooterComponent} from "../employee-footer/employee-footer.component";

@Component({
  selector: 'app-employee-page',
  standalone: true,
  imports: [
    EmployeeHeaderComponent,
    RouterOutlet,
    BusinessFooterComponent,
    EmployeeFooterComponent
  ],
  templateUrl: './employee-page.component.html',
  styleUrl: './employee-page.component.css'
})
export class EmployeePageComponent {

}
