import { Component } from '@angular/core';
import { AuthProvider } from '../../providers/auth/auth';
import { PostProvider } from '../../providers/post/post';
import { Events } from 'ionic-angular';

@Component({
  selector: 'sinogram',
  templateUrl: 'sinogram.html'
})
export class SinogramComponent {
  isNeutral: 'neutral';
  finalCount: any;

  constructor(
    public auth: AuthProvider, 
    public postService: PostProvider,
    public events: Events
    ) {
    this.finalCount = "50%";

    this.events.subscribe('page:refreshed', (res) => {
      this.loadSinogram();
    });

    this.loadSinogram();
  }

  loadSinogram() {
    if(this.auth.isLoggedIn) {
      let goodLikeCount = 0, badLikeCount = 0, totalLikes = 0;
      let goodLikes = this.postService.getGoodLikes();
      goodLikes.then(res => {
        goodLikeCount = res.docs.length; 
      })
      let badLikes = this.postService.getBadLikes();
      badLikes.then(res => {
        badLikeCount = res.docs.length;
      })
      Promise.all([goodLikes, badLikes]).then(res => {
        let totalInFrame = 0;
        totalLikes = goodLikeCount + badLikeCount;

        if (goodLikeCount > 0 || badLikeCount > 0) {
          if(goodLikeCount > badLikeCount) {
            totalInFrame = goodLikeCount - badLikeCount;
            if ( totalInFrame !== 0 ) {
              this.finalCount = (((totalInFrame * 100) / totalLikes) / 2);
              this.finalCount = (49 + this.finalCount) - ((((totalInFrame * 100) / totalLikes) / 2) / 5);
              this.finalCount = Math.round(this.finalCount)
              this.moveArrow(this.finalCount, true);
            } else {
              this.finalCount = 50;
            }
          } else {
            totalInFrame = badLikeCount - goodLikeCount;
            if ( totalInFrame !== 0 ) {
              this.finalCount = (((totalInFrame * 100) / totalLikes) / 2);
              this.finalCount = (51 - this.finalCount) + ((((totalInFrame * 100) / totalLikes) / 2) / 5);
              this.finalCount = Math.round(this.finalCount)
              this.moveArrow(this.finalCount, false);
            } else {
              this.finalCount = 50;
            }
          }
          this.finalCount = this.finalCount + "%";
        }
      })
    }
  }

  moveArrow(count, isGood) {
    let arrow = document.getElementById('dingleBerry');
    var pos = 50;
    var id = setInterval(frame, 20);

    function frame() {
      if(arrow) {
        if (pos == count) {
          clearInterval(id);
        } else {
            if(isGood) {
              pos++;
            } else {
              pos--;
            }
            arrow.style.left = pos + '%'; 
        }
      }
    }
  }
}
