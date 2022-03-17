import { QuillModule } from 'ngx-quill';
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
import { LoadingBLComponent } from '../components/loading/loading.component';
import { UserItemComponent } from '../components/user/item/item.component';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { WYSIWYGComponent } from '../components/wysiwyg/wysiwyg.component';
import { FilePickerComponent } from '../components/file-picker/file-picker.component';
import { OptsMenuComponent } from '../components/opts-menu/opts-menu.component';
import { UserFilterComponent } from '../components/user/filter/filter.component';
import { NumFloatComponent } from '../components/num-float/num-float.component';
import { SectorsModule } from '../components/sectors/sectors.module';
import { LoadingModule } from '../components/loading/loading.module';

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
    UserItemComponent,
    UserFilterComponent,
    PaginationComponent,
    WYSIWYGComponent,
    FilePickerComponent,
    OptsMenuComponent,
    NumFloatComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipesModule,
    TranslateModule.forChild(),
    QuillModule.forRoot(),
    SectorsModule,
    LoadingModule,
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
    UserItemComponent,
    UserFilterComponent,
    PaginationComponent,
    WYSIWYGComponent,
    FilePickerComponent,
    OptsMenuComponent,
    NumFloatComponent,
    SectorsModule,
    LoadingModule,
  ],
  entryComponents: [],
})
export class SharedModule {}
