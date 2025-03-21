import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-business-footer',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './business-footer.component.html',
  styleUrl: './business-footer.component.css'
})
export class BusinessFooterComponent {

}
