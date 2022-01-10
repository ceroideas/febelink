import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ImgErrorFallbackDirective } from '../directives/img-error-fallback.directive';
import { HeaderButtonsComponent } from './components/header-buttons/header-buttons.component';
import { FooterComponent } from '../components/footer/footer.component';
import { LangBtnComponent } from 'src/app/components/langs/btn/btn.component';
import { LangPopComponent } from 'src/app/components/langs/popover/pop.component';
import { YouTubePopComponent } from '../components/youtube/popover/pop.component';
import { LinkPreviewComponent } from '../components/link-preview/link-preview.component';
import { VerificationComponent } from '../components/verification/verification.component';
import { PipesModule } from '../pipes/pipes.module';
import { KYCAliceComponent } from '../components/kyc-alice/kyc-alice.component';
import { ClickStopPropagation } from '../components/stop-propagation.component';
import { TwoFAComponent } from '../components/two-fa/two-fa.component';
import { InformComponent } from '../components/inform/inform.component';

@NgModule({
  declarations: [
    ImgErrorFallbackDirective,
    HeaderButtonsComponent,
    LangBtnComponent,
    LangPopComponent,
    FooterComponent,
    YouTubePopComponent,
    LinkPreviewComponent,
    VerificationComponent,
    KYCAliceComponent,
    ClickStopPropagation,
    TwoFAComponent,
    InformComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipesModule,
    TranslateModule.forChild(),
  ],
  exports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipesModule,
    ImgErrorFallbackDirective,
    HeaderButtonsComponent,
    LangBtnComponent,
    LangPopComponent,
    YouTubePopComponent,
    LinkPreviewComponent,
    VerificationComponent,
    KYCAliceComponent,
    ClickStopPropagation,
    TwoFAComponent,
    InformComponent,
  ],
  entryComponents: [],
})
export class SharedModule {}
