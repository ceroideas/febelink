import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

export interface SearchProductCardType {
  id: number;
  image: string;
  title: string;
  unitPrice: number;
  unitTypeId: number;
  avgRating: number;
  votes: number;
  ownerUserId: number;
  ownerUsername: string;
  description: string;
  subcription: number;
  verified: number;
}

export interface PriceUnitType {
  id: number;
  name: string;
  shorthand: string;
  lang: string;
}

@Component({
  selector: 'search-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() data: SearchProductCardType;
  @Input() unitTypes: PriceUnitType[];

  @Input() skeleton: boolean = false;

  constructor(private router: Router, private chatService: ChatService) {}

  irA(p: string): void {
    this.router.navigate([p]);
  }

  async createChat(ownerUsername: string, ownerUserId: number) {
    alert(8)
    const {response, error} = await this.chatService.createChat(
      ownerUserId
    );

    if (response) {
      // Send first comment

      this.router.navigate([`chat/${response?.id}`], {
        state: {receiverId: ownerUserId, receiverUsername: ownerUsername},
      });
    }

    if (error) {
      this.router.navigate([`chat`]);
    }
  }

  removeBlankSpace(term: string): string {
    return term.replace(new RegExp(' ', 'g'), '-');
  }
}
