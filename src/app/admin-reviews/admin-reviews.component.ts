import { Component } from '@angular/core';
import {DropdownComponent} from "../dropdown/dropdown.component";
import {StarsComponent} from "../stars/stars.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [
    DropdownComponent,
    StarsComponent,
    RouterLink
  ],
  templateUrl: './admin-reviews.component.html',
  styleUrl: './admin-reviews.component.css'
})
export class AdminReviewsComponent {
  public orderby = ["Сначала ожидающие", "Сначала выполненные"]
}
