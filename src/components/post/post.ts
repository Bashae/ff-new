import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LandingPage } from '../../pages/landing/landing';
import { AuthProvider } from '../../providers/auth/auth';
import { PostProvider } from '../../providers/post/post';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'post',
  templateUrl: 'post.html'
})
export class PostComponent {
  @Input() public postItem: any = {};
  liked: any = false;
  favorited: boolean = false;
  text: string;
  likeCount: number = 500;
  favoriteCount: number = 45;
  noAuthAttempt: number = 0;
  type: string = '';

  cardBackground: string;
  cardColor: any;
  cardTextColor: any;

  constructor(
    public navCtrl: NavController,
    public auth: AuthProvider,
    public postService: PostProvider,
    private socialSharing: SocialSharing
  ) {

  }

  ngOnInit() {
    this.favoriteCount = this.postItem.favorites;
    this.likeCount = this.postItem.likes;
    this.text = this.postItem.content;
    this.cardBackground = this.postItem.background;
    this.cardColor = this.postItem.overlay_color;
    this.cardTextColor = this.postItem.text_color;

    if(this.auth.isLoggedIn) {
      let isLiked = this.postService.getUserLikes(this.postItem.id);
      isLiked.then(res => {
        if(res.empty) {
          this.liked = false;
        } else {
          this.liked = true;
          let tempType = '';
          res.forEach(function(doc) {
            tempType = doc.data().type;  
          });
          this.type = tempType;
        }
      });

      let isFavorited = this.postService.getUserFavorites(this.postItem.id);
      isFavorited.then(res => {
        if(res.empty) {
          this.favorited = false;
        } else {
          this.favorited = true;
        }
      })
    }
  }

  favoritePost(post) {
    if(this.auth.isLoggedIn) {
      if(this.favorited) {
        this.favorited = false;
        this.favoriteCount--;
        post.favorites = this.favoriteCount;
        this.postService.unfavoritePost(post);
      } else {
        this.favorited = true;
        this.favoriteCount++;
        post.favorites = this.favoriteCount;
        this.postService.favoritePost(post);
      }
    } else {
      if ( this.noAuthAttempt < 3 ) {
        this.noAuthAttempt++;
      } else {
        this.navCtrl.push(LandingPage);
      }
    }
  }

  likePost( post, typed ) {
    if ( this.auth.isLoggedIn ) {
      if ( this.liked ) {
        if ( this.type == 'good' ) {
          if (typed == 'good') {
            this.liked = false;
            this.postService.unlikePost(post, typed);
          } else {
            this.type = typed;
            this.postService.updateLike(post, typed);
          }
        } else if ( this.type === 'bad' ) {
          if (typed == 'bad') {
            this.liked = false;
            this.postService.unlikePost(post, typed);
          } else {
            this.type = typed;
            this.postService.updateLike(post, typed);
          }
        }
      } else {
        this.liked = true;
        this.type = typed;
        this.postService.likePost(post, typed);
      }
    } else {
      if ( this.noAuthAttempt < 2 ) {
        this.noAuthAttempt++;
      } else {
        this.navCtrl.push(LandingPage);
      }
    }
  }

  sharePost() {
    let theCanvas: any = document.getElementById('shareCanvas'),
      theContext: any,
      selectedPicture: any = "/assets/imgs/backgrounds/" + this.cardBackground + ".jpg",

    // Canvas
      canvasColor = "rgba(255, 255, 255, 1)",

    // Text
      textWrapHeight = 50,
      fontStyle = "bold 65px Arial",
      fontColor = this.cardTextColor, // For fillText
      borderWidth = 2,
      borderColor = this.cardColor; // For strokeText border
      
      let _that = this;
      let pictureWidth = 1000;
      let pictureHeight = (1000 / 2);
      let textY = pictureHeight - (pictureHeight / 2);
      let textWrapWidth = (pictureWidth);
      let textX = pictureWidth / 2;

    // Secondary Text
      let secondaryTextWrapHeight = 20,
        secondaryFontStyle = "bold 35px Arial",
        secondaryFontColor = this.cardTextColor,
        secondaryBorderWidth = 2,
        secondaryBorderColor = this.cardColor,
        secondaryTextY = pictureHeight - 40;

    // Other stuff
      if(theCanvas) {
        theCanvas.width = pictureWidth;
        theCanvas.height = pictureHeight;
        if(theCanvas.getContext){
            theContext = theCanvas.getContext('2d');
            return drawTheImage(_that);
        }
      }
    
      function drawTheImage(_that){
        // Clear Current Image
        theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
    
        // Fill background
        theContext.fillStyle = canvasColor;
        theContext.fillRect(0, 0, theCanvas.width, theCanvas.height);
    
        // Display the Image
        var img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = (event) => {
            theContext.drawImage(img, theCanvas.width/2 - img.width/2, theCanvas.height/2 - img.height/2);
            drawText(_that);
        };
        img.src = selectedPicture;
      }
    
      function drawText(_that){
        theContext.font = fontStyle;
        theContext.textAlign = "center";
        theContext.fillStyle = fontColor; // fill text
        theContext.lineWidth = borderWidth;
        theContext.strokeStyle = borderColor; // stroke border
        wrapText(_that);
      }
    
      function wrapText(_that) {
        let currentText = {"text": _that.text};
        var words = currentText.text.split(' ');
        var line = '';
        var currentTextY = textY;
        for(var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = theContext.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > textWrapWidth && n > 0) {
                theContext.fillText(line, textX, currentTextY); // fill text
                theContext.strokeText(line, textX, currentTextY); // stroke border
                line = words[n] + ' ';
                currentTextY += textWrapHeight;
            }
            else {
                line = testLine;
            }
        }
        
        theContext.fillText(line, textX, currentTextY); // fill text
        theContext.strokeText(line, textX, currentTextY); // stroke border
        drawSecondaryText(_that);
      }

      function drawSecondaryText(_that) {
        theContext.font = secondaryFontStyle;
        theContext.textAlign = "center";
        theContext.fillStyle = secondaryFontColor; // fill text
        theContext.lineWidth = secondaryBorderWidth;
        theContext.strokeStyle = secondaryBorderColor; // stroke border
        wrapSecondaryText(_that);
      }

      function wrapSecondaryText(_that) {
        let followText = {"text": "Created on the Align App!"}
        var words = followText.text.split(' ');
        var line = '';
        var currentTextY = secondaryTextY;
        for(var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = theContext.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > textWrapWidth && n > 0) {
                theContext.fillText(line, textX, currentTextY); // fill text
                theContext.strokeText(line, textX, currentTextY); // stroke border
                line = words[n] + ' ';
                currentTextY += textWrapHeight;
            }
            else {
                line = testLine;
            }
        }
        
        theContext.fillText(line, textX, currentTextY); // fill text
        theContext.strokeText(line, textX, currentTextY); // stroke border
        _that.socialSharing.share("Check out this secret!", "What's your secret?", [theCanvas.toDataURL('image/png')], "http://www.facebook.com");
      }
  }

  goToPage() {
    this.navCtrl.push(LandingPage);
  }

}
