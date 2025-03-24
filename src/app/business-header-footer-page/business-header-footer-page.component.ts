import { Component } from '@angular/core';
import {BusinessHeaderComponent} from "../business-header/business-header.component";
import {BusinessFooterComponent} from "../business-footer/business-footer.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-business-header-footer-page',
  standalone: true,
  imports: [
    BusinessHeaderComponent,
    BusinessFooterComponent,
    RouterOutlet
  ],
  templateUrl: './business-header-footer-page.component.html',
  styleUrl: './business-header-footer-page.component.css'
})
export class BusinessHeaderFooterPageComponent {

}
