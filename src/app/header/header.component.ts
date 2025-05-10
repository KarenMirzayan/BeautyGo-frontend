import {Component, HostListener, OnInit} from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  isDropdownOpen = false;
  isMobileMenuOpen = false;
  isHidden = false;
  private lastScrollTop = 0;
  isWideScreen: boolean = false;

  ngOnInit() {
    this.checkScreenWidth();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenWidth();
  }

  private checkScreenWidth() {
    this.isWideScreen = window.innerWidth < 768;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.scrollY || document.documentElement.scrollTop;

    if (currentScroll <= 66) {
      // Always show the header when near the top
      this.isHidden = false;
      this.lastScrollTop = currentScroll;
      return;
    }

    if (Math.abs(currentScroll - this.lastScrollTop) > 30) {
      if (currentScroll > this.lastScrollTop) {
        // Scrolling down
        this.isHidden = true;
        this.isDropdownOpen = false;
        this.isMobileMenuOpen = false; // Close mobile menu on scroll down
      } else {
        // Scrolling up
        this.isHidden = false;
      }
      this.lastScrollTop = currentScroll;
    }
  }
}
