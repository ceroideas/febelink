import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../../../shared/shared.module';
// import { AdvisePageRoutingModule } from '../advises/advise-routing.module';

import { PostBottomBarComponent } from './bottom-bar/bottom-bar.component';
import { PostComponent } from './post/post.component';
import { CommentComponent } from './comment/comment.component';
// import { CommentsComponent } from './comments/comments.component';
// import { SharedPostModule } from '../shared-post.module';
import { DonateButtonModule } from './../../../components/donate/donate-button.module';
import { PostModel2Component } from './post-model2/post-model2.component';
import { FollowerButtonModule } from './../../../components/follower/follower.module';
import { CommentsComponent } from './comments/comments.component';

@NgModule({
    imports: [
        CommonModule
      , TranslateModule
      , FormsModule
      , ReactiveFormsModule
      // , AdvisePageRoutingModule
      , SharedModule
      // // , SharedPostModule
      , DonateButtonModule
      , FollowerButtonModule,



      
    ],
    exports: [
      //   CommonModule
      // , FormsModule
      // , ReactiveFormsModule
      // // , AdvisePageRoutingModule
      // // , SharedModule
      // // , SharedPostModule
      // , DonateButtonModule,
      //   FollowerButtonModule
      // , PostBottomBarComponent
      //   PostComponent
      //  PostModel2Component
      // , CommentComponent
      // // , CommentsComponent
    ],
    declarations: [
        PostBottomBarComponent
      , PostComponent
       , PostModel2Component
      , CommentComponent
      , CommentsComponent
    ],
  })
  export class PostComponentsModule { }