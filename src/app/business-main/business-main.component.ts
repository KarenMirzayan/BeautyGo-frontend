import { Component } from '@angular/core';
import {BusinessHeaderComponent} from "../business-header/business-header.component";
import {BusinessFooterComponent} from "../business-footer/business-footer.component";
import {ContactsComponent} from "../contacts/contacts.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-business-main',
  standalone: true,
  imports: [
    BusinessHeaderComponent,
    BusinessFooterComponent,
    ContactsComponent
  ],
  templateUrl: './business-main.component.html',
  styleUrl: './business-main.component.css'
})
export class BusinessMainComponent {
  constructor(private router: Router, private route: ActivatedRoute) {
  }

  registerBusiness() {
    this.router.navigate(['register'], { relativeTo: this.route})
  }
}
