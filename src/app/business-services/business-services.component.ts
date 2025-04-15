import {Component, OnInit} from '@angular/core';
import {DropdownComponent} from "../dropdown/dropdown.component";
import {BusinessSpecialistPopupComponent} from "../business-specialist-popup/business-specialist-popup.component";
import {BusinessServiceCreateComponent} from "../business-service-create/business-service-create.component";
import {Business, Service, User} from "../models";
import {BusinessService} from "../business.service";
import {ServicesService} from "../services.service";
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-business-services',
  standalone: true,
  imports: [
    DropdownComponent,
    BusinessSpecialistPopupComponent,
    BusinessServiceCreateComponent,
    CommonModule
  ],
  templateUrl: './business-services.component.html',
  styleUrl: './business-services.component.css'
})
export class BusinessServicesComponent implements OnInit{
  showPopupCreate: boolean = false;
  services: Service[] = [];
  filteredServices: Service[] = [];
  topics: string[] = [];
  business: Business | null = null;
  errorMessage: string | null = null;
  searchTerm: string = '';
  selectedTopic: string = '';
  user: User | null;

  constructor(private businessService: BusinessService, private servicesService: ServicesService, private router: Router) {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.user = JSON.parse(userData) as User;
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        this.user = null;
      }
    } else {
      this.user = null;
      console.log('No user found in localStorage');
      this.router.navigate(['business', 'login']);
    }

    this.businessService.getBusinessByOwner(this.user?.id || 0).subscribe({
      next: (response) => {
        console.log('Business loaded:', response);
        this.business = response;
        this.loadServices();
      },
      error: (error) => {
        console.error('Error loading business:', error);
        this.router.navigate(['business', 'register']);
      }
    });
  }

  ngOnInit(): void {}

  loadServices(): void {
    this.servicesService.getServices(this.business?.id || 0).subscribe({
      next: (data) => {
        console.log('Services loaded:', data);
        this.services = data;
        this.filteredServices = data;
        this.updateTopics();
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.errorMessage = 'Failed to load services.';
      }
    });
  }

  updateTopics(): void {
    const uniqueTopics = Array.from(new Set(this.services.map(s => s.topic)));
    this.topics = ['Все категории', ...uniqueTopics];
  }

  openPopupCreate(): void {
    this.showPopupCreate = true;
  }

  closePopupCreate(message: string): void {
    this.showPopupCreate = false;
    if (message === 'error') {
      this.errorMessage = 'Failed to create service. Please try again.';
      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
    } else if (message === 'success') {
      this.loadServices(); // Refresh services
    }
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) {
      return `${remainingMinutes} минут`;
    }
    return `${hours} час${remainingMinutes > 0 ? ` ${remainingMinutes} минут` : ''}`;
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    let tempServices = this.services;
    if (this.searchTerm) {
      tempServices = tempServices.filter(s => s.name.toLowerCase().includes(this.searchTerm));
    }
    if (this.selectedTopic && this.selectedTopic !== 'Все категории') {
      tempServices = tempServices.filter(s => s.topic === this.selectedTopic);
    }
    this.filteredServices = tempServices;
  }

  onTopicSelected(topic: string): void {
    this.selectedTopic = topic;
    this.applyFilters();
  }
}
