import { FollowerButtonModule } from 'src/app/components/follower/follower.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdvisePageRoutingModule } from '../advises/advise-routing.module';

import { PostBottomBarComponent } from './bottom-bar.component/bottom-bar.component';
import { PostComponent } from './post/post.component';
import { CommentComponent } from './comment/comment.component';
import { CommentsComponent } from './comments/comments.component';
import { SharedPostModule } from '../shared-post.module';
import { DonateButtonModule } from 'src/app/components/donate/donate-button.module';

@NgModule({
    imports: [
        CommonModule
      , IonicModule
      , TranslateModule.forChild()
      , FormsModule
      , ReactiveFormsModule
      , AdvisePageRoutingModule
      , SharedModule
      , SharedPostModule
      , DonateButtonModule
      , FollowerButtonModule
    ],
    exports: [
        CommonModule
      , IonicModule
      , FormsModule
      , ReactiveFormsModule
      , AdvisePageRoutingModule
      , SharedModule

      , PostBottomBarComponent
      , PostComponent
      , CommentComponent
      , CommentsComponent
    ],
    declarations: [
        PostBottomBarComponent
      , PostComponent
      , CommentComponent
      , CommentsComponent
    ],
  })
  export class PostComponentsModule { }