import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'About Us', path: '/about-us' },
    { label: 'Contact', path: '/get-a-quote' }
  ];

  services = [
    'Order Fulfillment',
    'Fast Shipping',
    'Inventory Management',
    'Returns Processing',
    'Platform Integration'
  ];

  company = [
    'About Us',
    'Blog',
    'Careers',
    'Press',
    'Partner Program'
  ];

  contact = [
    { icon: '📧', text: 'support@oneway-fulfillment.com', label: 'Email' },
    { icon: '📞', text: '+1 (800) 555-0123', label: 'Phone' },
    { icon: '📍', text: '123 Warehouse Dr, Industrial Park, CA 90210', label: 'Address' }
  ];
}
