import { Component } from '@angular/core';
import {AdminHeaderComponent} from "../admin-header/admin-header.component";
import {RouterOutlet} from "@angular/router";
import {AdminFooterComponent} from "../admin-footer/admin-footer.component";

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    AdminHeaderComponent,
    RouterOutlet,
    AdminFooterComponent
  ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent {

}
