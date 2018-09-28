import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { PostProvider } from '../../providers/post/post';
import { Post } from '../../app/post';
import { AngularFirestore } from '@angular/fire/firestore';

import { AdMobFree, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';

@IonicPage()
@Component({
  selector: 'page-new-post',
  templateUrl: 'new-post.html',
})
export class NewPostPage {
  cardBackground: string;
  cardText: string;
  cardColor: any;
  cardTextColor: any;
  
  postItem: any;

  backgroundToggle: boolean = false;
  colorToggle: boolean = false;
  textToggle: boolean = false;
  overlayToggle: boolean = false;
  newPost: any = 'text';

  colorsArr: any[];
  initialClick: number;

  isSubmitDisabled: boolean;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    public postService: PostProvider,
    public afs: AngularFirestore,
    public modalCtrl: ModalController,
    private admobFree: AdMobFree
  ) {
    // this.postItem = "hello world";
    this.cardBackground = "010";
    this.cardText       = "Let it out, it will be okay.";
    this.cardColor      = "rgba(0, 0, 0, 0.65)";
    this.cardTextColor  = "#ddd";
    this.initialClick   = 0;

    this.colorsArr = [[
      {'hex': '#330000', 'rgb': '51, 0, 0'},
      {'hex': '#331900', 'rgb': '51, 25, 0'},
      {'hex': '#333300', 'rgb': '51, 51, 0'},
      {'hex': '#193300', 'rgb': '25, 51, 0'},
      {'hex': '#003300', 'rgb': '0, 51, 0'},
      {'hex': '#003319', 'rgb': '0, 51, 25'},
      {'hex': '#003333', 'rgb': '0, 51, 51'},
      {'hex': '#001933', 'rgb': '0, 25, 51'},
      {'hex': '#000033', 'rgb': '0, 0, 51'},
      {'hex': '#190033', 'rgb': '25, 0, 51'},
      {'hex': '#330033', 'rgb': '51, 0, 51'},
      {'hex': '#330019', 'rgb': '51, 0, 25'},
      {'hex': '#000000', 'rgb': '0, 0, 0'}],
      [{'hex': '#660000', 'rgb': '102, 0, 0'},
      {'hex': '#663300', 'rgb': '102, 51, 0'},
      {'hex': '#666600', 'rgb': '102, 102, 0'},
      {'hex': '#336600', 'rgb': '51, 102, 0'},
      {'hex': '#006600', 'rgb': '0, 102, 0'},
      {'hex': '#006633', 'rgb': '0, 102, 51'},
      {'hex': '#006666', 'rgb': '0, 102, 102'},
      {'hex': '#003366', 'rgb': '0, 51, 102'},
      {'hex': '#000066', 'rgb': '0, 0, 102'},
      {'hex': '#330066', 'rgb': '51, 0, 102'},
      {'hex': '#660066', 'rgb': '102, 0, 102'},
      {'hex': '#660033', 'rgb': '102, 0, 51'},
      {'hex': '#202020', 'rgb': '32, 32, 32'}],
      [{'hex': '#990000', 'rgb': '153, 0, 0'},
      {'hex': '#994C00', 'rgb': '153, 76, 0'},
      {'hex': '#999900', 'rgb': '153, 153, 0'},
      {'hex': '#4C9900', 'rgb': '76, 153, 0'},
      {'hex': '#009900', 'rgb': '0, 153, 0'},
      {'hex': '#00994C', 'rgb': '0, 153, 76'},
      {'hex': '#009999', 'rgb': '0, 153, 153'},
      {'hex': '#004C99', 'rgb': '0, 76, 153'},
      {'hex': '#000099', 'rgb': '0, 0, 153'},
      {'hex': '#4C0099', 'rgb': '76, 0, 153'},
      {'hex': '#990099', 'rgb': '153, 0, 153'},
      {'hex': '#99004C', 'rgb': '153, 0, 76'},
      {'hex': '#404040', 'rgb': '64, 64, 64'}],
      [{'hex': '#CC0000', 'rgb': '204, 0, 0'},
      {'hex': '#CC6600', 'rgb': '204, 102, 0'},
      {'hex': '#CCCC00', 'rgb': '204, 204, 0'},
      {'hex': '#66CC00', 'rgb': '102, 204, 0'},
      {'hex': '#00CC00', 'rgb': '0, 204, 0'},
      {'hex': '#00CC66', 'rgb': '0, 204, 102'},
      {'hex': '#00CCCC', 'rgb': '0, 204, 204'},
      {'hex': '#0066CC', 'rgb': '0, 102, 204'},
      {'hex': '#0000CC', 'rgb': '0, 0, 204'},
      {'hex': '#6600CC', 'rgb': '102, 0, 204'},
      {'hex': '#CC00CC', 'rgb': '204, 0, 204'},
      {'hex': '#CC0066', 'rgb': '204, 0 , 102'},
      {'hex': '#606060', 'rgb': '96, 96, 96'}],
      [{'hex': '#FF0000', 'rgb': '255, 0, 0'},
      {'hex': '#FF8000', 'rgb': '255, 128, 0'},
      {'hex': '#FFFF00', 'rgb': '255, 255, 0'},
      {'hex': '#80FF00', 'rgb': '128, 255, 0'},
      {'hex': '#00FF00', 'rgb': '0, 255, 0'},
      {'hex': '#00FF80', 'rgb': '0, 255, 128'},
      {'hex': '#00FFFF', 'rgb': '0, 255, 255'},
      {'hex': '#0080FF', 'rgb': '0, 128, 255'},
      {'hex': '#0000FF', 'rgb': '0, 0, 255'},
      {'hex': '#7F00FF', 'rgb': '127, 0, 255'},
      {'hex': '#FF00FF', 'rgb': '255, 0, 255'},
      {'hex': '#FF007F', 'rgb': '255, 0, 127'},
      {'hex': '#808080', 'rgb': '128, 128, 128'}],
      [{'hex': '#FF3333', 'rgb': '255, 51, 51'},
      {'hex': '#FF9933', 'rgb': '255, 153, 51'},
      {'hex': '#FFFF33', 'rgb': '255, 255, 51'},
      {'hex': '#99FF33', 'rgb': '153, 255, 51'},
      {'hex': '#33FF33', 'rgb': '51, 255, 51'},
      {'hex': '#33FF99', 'rgb': '51, 255, 153'},
      {'hex': '#33FFFF', 'rgb': '51, 255, 255'},
      {'hex': '#3399FF', 'rgb': '51, 153, 255'},
      {'hex': '#3333FF', 'rgb': '51, 51, 255'},
      {'hex': '#9933FF', 'rgb': '153, 51, 255'},
      {'hex': '#FF33FF', 'rgb': '255, 51, 255'},
      {'hex': '#FF3399', 'rgb': '255, 51, 153'},
      {'hex': '#A0A0A0', 'rgb': '160, 160, 160'}],
      [{'hex': '#FF6666', 'rgb': '255, 102, 102'},
      {'hex': '#FFB266', 'rgb': '255, 178, 102'},
      {'hex': '#FFFF66', 'rgb': '255, 255, 102'},
      {'hex': '#B2FF66', 'rgb': '178, 255, 102'},
      {'hex': '#66FF66', 'rgb': '102, 255, 102'},
      {'hex': '#66FFB2', 'rgb': '102, 255, 178'},
      {'hex': '#66FFFF', 'rgb': '102, 255, 255'},
      {'hex': '#66B2FF', 'rgb': '102, 178, 255'},
      {'hex': '#6666FF', 'rgb': '102, 102, 255'},
      {'hex': '#B266FF', 'rgb': '178, 102, 255'},
      {'hex': '#FF66FF', 'rgb': '255, 102, 255'},
      {'hex': '#FF66B2', 'rgb': '255, 102, 178'},
      {'hex': '#C0C0C0', 'rgb': '192, 192, 192'}],
      [{'hex': '#FF9999', 'rgb': '255, 153, 153'},
      {'hex': '#FFCC99', 'rgb': '255, 204, 153'},
      {'hex': '#FFFF99', 'rgb': '255, 255, 153'},
      {'hex': '#CCFF99', 'rgb': '204, 255, 153'},
      {'hex': '#99FF99', 'rgb': '153, 255, 153'},
      {'hex': '#99FFCC', 'rgb': '153, 255, 204'},
      {'hex': '#99FFFF', 'rgb': '153, 255, 255'},
      {'hex': '#99CCFF', 'rgb': '153, 204, 255'},
      {'hex': '#9999FF', 'rgb': '153, 153, 255'},
      {'hex': '#CC99FF', 'rgb': '204, 153, 255'},
      {'hex': '#FF99FF', 'rgb': '255, 153, 255'},
      {'hex': '#FF99CC', 'rgb': '255, 153, 204'},
      {'hex': '#E0E0E0', 'rgb': '224, 224, 224'}],
      [{'hex': '#FFCCCC', 'rgb': '255, 204, 204'},
      {'hex': '#FFE5CC', 'rgb': '255, 229, 204'},
      {'hex': '#FFFFCC', 'rgb': '255, 255, 204'},
      {'hex': '#E5FFCC', 'rgb': '229, 255, 204'},
      {'hex': '#CCFFCC', 'rgb': '204, 255, 204'},
      {'hex': '#CCFFE5', 'rgb': '204, 255, 229'},
      {'hex': '#CCFFFF', 'rgb': '204, 255, 255'},
      {'hex': '#CCE5FF', 'rgb': '204, 229, 255'},
      {'hex': '#CCCCFF', 'rgb': '204, 204, 255'},
      {'hex': '#E5CCFF', 'rgb': '229, 204, 255'},
      {'hex': '#FFCCFF', 'rgb': '255, 204, 255'},
      {'hex': '#FFCCE5', 'rgb': '255, 204, 229'},
      {'hex': '#FFFFFF', 'rgb': '255, 255, 255'}]
    ];
    this.prepareAdMob();
  }

  ionViewDidLoad() {
    this.isSubmitDisabled = true;
  }

  testInitialClick() {
    if(this.initialClick === 0) {
      this.cardText = " ";
      this.initialClick++;
    }
  }

  prepareAdMob() {
    const config: AdMobFreeInterstitialConfig = {
      id: 'ca-app-pub-8071301998700750/1646592856'
    }
    
    this.admobFree.interstitial.config(config);
    this.admobFree.interstitial.prepare().then(() => {
      this.isSubmitDisabled = false;
    }).catch(() => {
      setTimeout(() => {
        this.isSubmitDisabled = false;
      }, 10000)
    })
  }

  launchAdMob() {
    this.admobFree.interstitial.show();
  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }

  submitPost() {
    if(this.cardText) {
      let sin = <Post> {
        background: this.cardBackground,
        content: this.cardText,
        favorites: 0,
        likes: 0,
        overlay_color: this.cardColor,
        text_color: this.cardTextColor,
        u_id: "1"
      }
      
      sin.content = this.cardText;
      this.postService.createPost(sin);
      this.dismissModal();
      this.launchAdMob();
    }
  }

  changeTextBackgroundColor(rgb) {
    this.cardColor = "rgba(" + rgb + ", .65)";
  }

  changeTextColor(rgb) {
    this.cardTextColor = "rgb(" + rgb + ")";
  }

  changeBackgroundImage(url) {
    this.cardBackground = url;
  }

}
