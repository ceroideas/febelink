import { NgModule } from '@angular/core';
 import { QuillModule } from 'ngx-quill';
 import { CommonModule } from '@angular/common';
 import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../pipes/pipes.module';
import { ImgErrorFallbackDirective } from '../directives/img-error-fallback.directive';
import { FooterComponent } from '../components/footer/footer.component';
import { LangBtnComponent } from '../components/langs/btn/btn.component';
import { LangPopComponent } from '../components/langs/popover/pop.component';
import { YouTubePopComponent } from '../components/youtube/popover/pop.component';
import { LinkPreviewComponent } from '../components/link-preview/link-preview.component';
import { VerificationComponent } from '../components/verification/verification.component';
// import { KYCAliceComponent } from '../components/kyc-alice/kyc-alice.component';
import { ClickStopPropagation } from '../components/stop-propagation.component';
import { TwoFAComponent } from '../components/two-fa/two-fa.component';
import { InformComponent } from '../components/inform/inform.component';
import { LoadingBLComponent } from '../components/loading/loading.component';
import { UserItemComponent } from '../components/user/item/item.component';
import { UserFilterComponent } from '../components/user/filter/filter.component';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { WYSIWYGComponent } from '../components/wysiwyg/wysiwyg.component';
import { FilePickerComponent } from '../components/file-picker/file-picker.component';
import { OptsMenuComponent } from '../components/opts-menu/opts-menu.component';
import { NumFloatComponent } from '../components/num-float/num-float.component';
 import { SectorsComponent } from '../components/sectors/sectors.component';
 import { LoadingModule } from '../components/loading/loading.module';
import { NgxLinkPreviewModule } from 'ngx-link-preview';
import { CartComponent } from '../components/cart/cart.component';
import { RatingComponent } from '../components/rating/rating.component';
import { HeaderComponent } from '../components/header/header.component';
import {  RouterOutlet } from '@angular/router';
import { ClickOutsideDirective } from '../directives/click-outside.directive';
import {
  IonHeader,
  IonToolbar,
  IonToggle,
  IonTitle,
  IonContent,
  IonBadge,
  IonLabel,
  IonAvatar,
  IonItem,
  IonImg,
  IonList,
  IonLoading,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSkeletonText,
  IonAlert,
  IonButton,
  IonButtons,
  IonApp,
  IonRow,
  IonCol,
  IonGrid,
  IonMenu,
  IonMenuButton,
 
  IonItemDivider,
  IonFooter,
  IonIcon,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCard,
  IonSpinner,
  IonSearchbar,
  IonBackButton,
  IonTabs,
  IonFab,
  IonFabButton,
  IonSelect,
  IonSelectOption,
  IonBreadcrumbs,
  IonBreadcrumb,
  IonThumbnail,
  IonInput,
  IonCheckbox,
  IonRadio,
  IonRefresher,
  IonRefresherContent,
  IonRadioGroup,
  IonTextarea,
  IonSegmentButton,
  IonSegment
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { LegalPointComponent } from '../pages/legal-disclaimer/legal-point/legal-point.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InteriorOfertaPage } from '../pages/interior-oferta/interior-oferta.page';
import { PublicarOpinionPage } from '../pages/publicar-opinion/publicar-opinion.page';
import { HeaderButtonsComponent } from './components/header-buttons/header-buttons.component';
import { Tab1Component } from '../tab11/tab1.component';

import { UseConditionsPage } from '../pages/use-conditions/use-conditions.page';
import { SwiperModule } from 'swiper/angular';
import { LoBuscamosPorTiPage } from '../pages/lo-buscamos-por-ti/lo-buscamos-por-ti.page';
import { SearchComponent } from '../search/search.component';
import { SearchCardComponent } from '../search/search-card/search-card.component';
import { ProductCardComponent } from '../search/product-card/product-card.component';
import { DropdownComponent } from '../components/dropdown/dropdown.component';
import { LinksDropdownComponent } from '../components/links-dropdown/links-dropdown.component';
import { FavoritesComponent } from '../pages/favorites/favorites.component';

import { LucideAngularModule, Search, Factory, MapPin, ArrowDownToDot, ChevronDown, ArrowDownUp, Square, SquareCheckBig, X, ArrowRight, Dot, Sparkles, Infinity, Goal, Circle, Star, Eye } from 'lucide-angular';
import { PerfilOraculoPage } from '../pages/perfil-oraculo/perfil-oraculo.page';

import { OfferCard2Component } from '../components/offer-card2/offer-card2.component';
import { RatingSummaryComponent } from '../components/rating-summary/rating-summary.component';
import { ViewsSummaryComponent } from '../components/views-summary/views-summary.component';
import { RatingModalComponent } from '../components/rating-modal/rating-modal.component';
import { RatingCardComponent } from '../components/rating-card/rating-card.component';
import { LandingComponent } from '../pages/landing/landing.component';
import { EmploymentComponent } from '../pages/employment/employment.component';

@NgModule({
  declarations: [
    ImgErrorFallbackDirective,
    ClickOutsideDirective,
    LangBtnComponent,
    LangPopComponent,
    HeaderButtonsComponent,
    YouTubePopComponent,
    LinkPreviewComponent,
    VerificationComponent,
    // KYCAliceComponent,
    ClickStopPropagation,
    TwoFAComponent,
    InformComponent,
    // LoadingBLComponent,
    UserItemComponent,
    UserFilterComponent,
    PaginationComponent,
    WYSIWYGComponent,
    FilePickerComponent,
    OptsMenuComponent,
    NumFloatComponent,
    SectorsComponent,
    CartComponent,
    RatingComponent,
    LegalPointComponent,
    InteriorOfertaPage,
    PublicarOpinionPage,
    FooterComponent,
    Tab1Component,
    SearchComponent,
    UseConditionsPage,
    HeaderComponent,
    LoBuscamosPorTiPage,
    SearchCardComponent, ProductCardComponent,
    DropdownComponent,
    LinksDropdownComponent,
    PerfilOraculoPage,
    OfferCard2Component,
    RatingSummaryComponent,
    ViewsSummaryComponent,
    RatingModalComponent,
    RatingCardComponent,
    LandingComponent,
    EmploymentComponent,
    FavoritesComponent
  ],
  imports: [
    CommonModule,
    LucideAngularModule.pick({Search, Factory, MapPin, ArrowDownToDot, ChevronDown, ArrowDownUp, Square, SquareCheckBig, X, ArrowRight, Dot, Sparkles, Infinity, Goal, Circle, Star, Eye}),
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    TranslateModule.forChild(),
    QuillModule.forRoot(),
    IonHeader,
    IonApp,
    IonButton,
    IonRow,
    IonCol,
    IonImg,
    IonGrid,
    IonToolbar,
    IonTitle,
    IonContent,
    IonLabel,
    IonBadge,
    IonAvatar,
    IonItem,
    IonMenu,   
    IonToggle, 
    IonItemDivider,
    IonSegmentButton,
    IonList,IonCheckbox,IonRadio,
    IonLoading,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSkeletonText,
    IonAlert,
    IonFooter,
    RouterLink,
    IonContent,
    IonIcon,
    IonButtons  ,
    IonMenuButton,
    IonCard,
    IonCardContent,
    IonCardHeader ,
    IonCardTitle,
    IonSpinner,
    IonSearchbar,
    IonTabs,
    IonBackButton,
    IonFab,
    IonFabButton,
    IonSelect,
    IonSelectOption,
    IonBreadcrumbs,
    IonSegment,
    IonBreadcrumb,
    IonThumbnail,
    IonInput,
    IonTextarea,
    IonAlert,
    IonRefresher,
    IonRefresherContent,
    IonRadioGroup,
    LoadingModule,
    NgxLinkPreviewModule,
    NgxSkeletonLoaderModule,
    SwiperModule,
    CommonModule, RouterOutlet, 

    // RouterModule,
  ],
  exports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    QuillModule,
    ImgErrorFallbackDirective,
    ClickOutsideDirective,
    LangBtnComponent,
    LangPopComponent,
    FooterComponent, 
    YouTubePopComponent,
    LinkPreviewComponent,
    VerificationComponent,
    // KYCAliceComponent,
    ClickStopPropagation,
    TwoFAComponent,
    InformComponent,
    // LoadingBLComponent,
    UserItemComponent,
    UserFilterComponent,
    PaginationComponent,
    WYSIWYGComponent,
    FilePickerComponent,
    OptsMenuComponent,
    NumFloatComponent,
    SectorsComponent,
    LoadingModule,
    NgxLinkPreviewModule,
    NgxSkeletonLoaderModule,
    CartComponent,
    RatingComponent,
    LegalPointComponent,
    Tab1Component,
    SearchComponent,
    SearchCardComponent, ProductCardComponent,
    UseConditionsPage,
    LoBuscamosPorTiPage,
    HeaderComponent,
    // RouterModule,
    SwiperModule,
    IonHeader,
    IonApp,
    IonButton,
    IonRow,
    IonCol,
    IonImg,
    IonGrid,
    IonToolbar,
    IonTitle,
    IonContent,
    IonLabel,
    IonBadge,
    IonAvatar,
    IonItem,
    IonMenu,    
    IonItemDivider,
    IonList,
    IonLoading,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSkeletonText,
    IonTextarea,
    IonAlert,
    IonFooter,
    RouterLink,
    RouterOutlet,
    IonContent,
    IonCheckbox,IonRadio,
    IonIcon,
    IonButtons  ,
    IonMenuButton,
    IonCard,IonToggle,
    IonCardContent,
    IonCardHeader ,
    IonCardTitle,
    IonSpinner,
    IonSearchbar,
    IonTabs,
    IonBackButton,
    IonFab,
    IonFabButton,
    IonSelect,
    IonSelectOption,
    IonBreadcrumbs,
    IonBreadcrumb,
    IonSegmentButton,
    IonSegment,

    IonThumbnail,
    IonInput,
    IonAlert,
    IonRefresher,
    IonRefresherContent,
    IonRadioGroup,

    InteriorOfertaPage,
    PublicarOpinionPage,
    HeaderButtonsComponent,

    DropdownComponent,
    LinksDropdownComponent,
    // FooterComponent,
    // HeaderComponent,

    OfferCard2Component,
    RatingSummaryComponent,
    ViewsSummaryComponent,
    RatingModalComponent,
    RatingCardComponent,
    LandingComponent,
    EmploymentComponent,
    FavoritesComponent
  ],
})
export class SharedModule {}
