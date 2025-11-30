import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements AfterViewInit {
  servicesDetail = [
    {
      title: 'Order Fulfillment',
      description: 'Expert order fulfillment with guaranteed accuracy. We handle the complete process so you can focus on growing your business and serving your customers.',
      features: ['Pick & pack operations', 'Quality assurance checks', 'Custom labeling', 'Kitting services']
    },
    {
      title: 'Fast Shipping',
      description: 'Same-day and 2-day shipping options across the United States. Deliver an "Amazon Prime" experience that keeps your customers coming back.',
      features: ['Same-day shipping', '2-day delivery', 'Ground shipping', 'International options']
    },
    {
      title: 'Inventory Management',
      description: 'Real-time tracking and management with 99.9% accuracy guarantee. Never worry about stock discrepancies or inventory shrinkage again.',
      features: ['Real-time tracking', 'Automated reorders', 'Stock alerts', 'SKU management']
    },
    {
      title: 'Returns Processing',
      description: 'Streamlined returns processing that maintains customer satisfaction. Fast turnaround to get products back in stock and ready to ship.',
      features: ['Return inspection', 'Refund processing', 'Restocking', 'Quality control']
    },
    {
      title: 'Platform Integration',
      description: 'Connect seamlessly with Shopify, WooCommerce, Amazon, and all major e-commerce platforms. One system for all your sales channels.',
      features: ['Shopify integration', 'WooCommerce sync', 'Amazon connection', 'Custom API']
    },
    {
      title: 'B2B & D2C Solutions',
      description: 'Flexible solutions for both direct-to-consumer and business-to-business orders. One fulfillment partner for all your distribution needs.',
      features: ['B2B order handling', 'D2C fulfillment', 'Bulk shipping', 'Custom requirements']
    }
  ];

  constructor() {}

  ngAfterViewInit(): void {
    this.initServicesDetailsAnimation();
  }

  /**
   * Animate service cards on scroll
   */
  private initServicesDetailsAnimation(): void {
    const cards = document.querySelectorAll('.service-detail-card');
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            once: true
          },
          ease: 'power3.out'
        }
      );
    });
  }
}
