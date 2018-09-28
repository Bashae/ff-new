import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, ViewChild } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AuthProvider } from '../providers/auth/auth';
import { LikeProvider } from '../providers/like/like';
import { PostProvider } from '../providers/post/post';
import { FavoriteProvider } from '../providers/favorite/favorite';
import { LandingPageModule } from '../pages/landing/landing.module';
import { LoginPageModule } from '../pages/login/login.module';
import { NewPostPageModule } from '../pages/new-post/new-post.module';
import { PostsPageModule } from '../pages/posts/posts.module';

// Native Tools
import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Events } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AdMobFree, AdMobFreeBanner, AdMobFreeInterstitial } from '@ionic-native/admob-free';
import { IonicImageLoader } from 'ionic-image-loader';

export const firebaseConfig = {
  apiKey: "AIzaSyCr10fnmKIvlRFBw0oxKXu-KC3rf1PMPbo",
  authDomain: "forbiddenfruit-92258.firebaseapp.com",
  databaseURL: "https://forbiddenfruit-92258.firebaseio.com",
  projectId: "forbiddenfruit-92258",
  storageBucket: "forbiddenfruit-92258.appspot.com",
  messagingSenderId: "8140559068"
}

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    IonicImageLoader.forRoot(),
    NewPostPageModule,
    PostsPageModule,
    LandingPageModule,
    LoginPageModule,
    PostsPageModule,
    NewPostPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SocialSharing,
    ViewChild,
    AngularFireAuth,
    AngularFirestore,
    Events,
    AuthProvider,
    LikeProvider,
    PostProvider,
    FavoriteProvider,
    AdMobFree,
    AdMobFreeBanner,
    AdMobFreeInterstitial
  ]
})
export class AppModule {}
