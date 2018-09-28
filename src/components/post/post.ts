import { Component, Input } from '@angular/core';
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
  ) {}

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

  sharePost(postText) {
    this.socialSharing.share(postText, "What's your secret?", "", "googleplayurl");
  }

  goToPage() {
    this.navCtrl.push(LandingPage);
  }

}
