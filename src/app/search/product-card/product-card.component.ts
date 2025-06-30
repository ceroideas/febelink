import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import { ChatService } from '../../services/chat.service';

import { toSlug } from '../../../utils/utils';
import { environment } from '../../../environments/environment';
import { FavoriteService } from '../../services/favorite.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';

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
  verified: number;
  telefono: string;
  provincia: string;
  ciudad: string;
  favorite: boolean;
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
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  //@ts-ignore
  @Input() data: SearchProductCardType;
  @Input() unitTypes: PriceUnitType[] = [];

  @Input() skeleton: boolean = false;
  
  toSlug = toSlug;

  urlWsrv: string = environment.baseWebUrlWsrv;
  constructor(
    private router: Router, 
    private chatService: ChatService,
    private favoriteService: FavoriteService,
    public authService: AuthenticationService
  ) {}

  irA(p: string): void {
    this.router.navigate([p]);
  }

  async createChat(ownerUsername: string, ownerUserId: number) {
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

  toggleFavorite($event: any) {
    $event.preventDefault();
    
    if (this.authService.isAuthenticated()) {
      this.data.favorite = !this.data.favorite;
      this.favoriteService.toggleFavorite(this.data.id);
    } else {
      this.router.navigate([`login`]);
    }
  }

  tieneWhatsapp(telefono: string | null | undefined): boolean {
    if (!telefono) return false;

    return telefono.startsWith('+346') || telefono.startsWith('+347') ||
           telefono.startsWith('6') || telefono.startsWith('7');
  }
}
