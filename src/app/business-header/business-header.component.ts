import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-business-header',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './business-header.component.html',
  styleUrl: './business-header.component.css'
})
export class BusinessHeaderComponent {

}
