import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PostsPage } from '../pages/posts/posts';

import { ModalController } from 'ionic-angular';
import { NewPostPage } from '../pages/new-post/new-post';
import { LandingPage } from '../pages/landing/landing';
import { AuthProvider } from '../providers/auth/auth';

import { HomePage } from '../pages/home/home';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = PostsPage;
  footer: boolean = true;
  view: any;
  currentPage: string = 'posts';

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    private adMobFree: AdMobFree,
    public modalCtrl: ModalController,
    public auth: AuthProvider,
    public viewChild: ViewChild
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.auth.setAuth();
    });

    var bannerConfig: AdMobFreeBannerConfig = {
      id: 'ca-pub-XXXXXX',
      isTesting: true,
      autoShow: true
    }
    this.adMobFree.interstitial.config({id: 'ca-pub-XXXXXX',
    isTesting: true,
    autoShow: false});
    
    this.adMobFree.banner.prepare()
      .then(() => {
        this.adMobFree.banner.show();
      })
      .catch(e => console.log(e));
  }

  openNewPostModal() {
    if ( this.auth.isLoggedIn ) {
      const modal = this.modalCtrl.create(NewPostPage);
      modal.present();
    } else {
      this.goToPage('Landing');
    }
  }

  goToPage(page) {
    if(page === 'Posts') {
      if ( this.currentPage !== 'posts') {
        this.footer = true;
        this.nav.push(PostsPage);
        this.currentPage = 'posts';
      }
    }
    if(page === 'Landing') {
      if(this.auth.isLoggedIn) {
        this.logOut();
      } else {
        this.footer = false;
        this.nav.push(LandingPage);
      }
      this.currentPage = 'landing';
    }
    if(page === 'Logout') {
      this.adMobFree.interstitial.config({'id': 'ca-app-pub-8071301998700750/9758647470', autoShow: false});
      this.adMobFree.interstitial.prepare().then(() => {
        this.adMobFree.interstitial.show();
      }).catch(e => console.log(e));
      this.nav.push(PostsPage);
    }
  }

  logOut() {
    this.auth.logOut();
    this.goToPage('Logout');
  }
}

