import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PostsPage } from '../pages/posts/posts';

import { ModalController } from 'ionic-angular';
import { NewPostPage } from '../pages/new-post/new-post';
import { LandingPage } from '../pages/landing/landing';
import { AuthProvider } from '../providers/auth/auth';

import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

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
    public viewChild: ViewChild,
    private ga: GoogleAnalytics
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.auth.setAuth();
      this.ga.startTrackerWithId('UA-126683769-1')
        .then(() => {
            this.ga.trackView('App Loaded');
        }).catch(e => console.log('Error starting GoogleAnalytics', e));
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
      this.ga.trackEvent('Page:View', 'Go:To', 'Page:Posts', 1);
    }
    if(page === 'Landing') {
      if(this.auth.isLoggedIn) {
        this.logOut();
      } else {
        this.footer = false;
        this.nav.push(LandingPage);
      }
      this.currentPage = 'landing';
      this.ga.trackEvent('Page:View', 'Go:To', 'Page:Landing', 1);
    }
    if(page === 'Logout') {
      this.ga.trackEvent('Session:Close', 'Go:To', 'Page:Posts', 2);
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

