import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-stars',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stars.component.html',
  styleUrl: './stars.component.css'
})
export class StarsComponent {
  @Input() rating: number = 0;

  get stars(): string[] {
    const filled = Array(this.rating).fill('★');
    const empty = Array(5 - this.rating).fill('\u00A0\u00A0\u00A0');
    return [...filled, ...empty];
  }
}
