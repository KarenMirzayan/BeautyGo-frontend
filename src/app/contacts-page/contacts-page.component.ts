import { Component } from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {ContactsComponent} from "../contacts/contacts.component";
import {FooterComponent} from "../footer/footer.component";

@Component({
  selector: 'app-contacts-page',
  standalone: true,
  imports: [
    HeaderComponent,
    ContactsComponent,
    FooterComponent
  ],
  templateUrl: './contacts-page.component.html',
  styleUrl: './contacts-page.component.css'
})
export class ContactsPageComponent {

}
