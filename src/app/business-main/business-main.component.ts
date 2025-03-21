import { Component } from '@angular/core';
import {BusinessHeaderComponent} from "../business-header/business-header.component";
import {BusinessFooterComponent} from "../business-footer/business-footer.component";

@Component({
  selector: 'app-business-main',
  standalone: true,
  imports: [
    BusinessHeaderComponent,
    BusinessFooterComponent
  ],
  templateUrl: './business-main.component.html',
  styleUrl: './business-main.component.css'
})
export class BusinessMainComponent {

}
