import { Component } from '@angular/core';
import { AuthProvider } from '../../providers/auth/auth';
import { PostProvider } from '../../providers/post/post';

@Component({
  selector: 'sinogram',
  templateUrl: 'sinogram.html'
})
export class SinogramComponent {
  isNeutral: 'neutral';
  finalCount: any;

  constructor(
    public auth: AuthProvider, 
    public postService: PostProvider
    ) {
    this.finalCount = "50%";

    if(this.auth.isLoggedIn) {
      let goodLikeCount, badLikeCount, totalLikes;
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

        if(goodLikeCount > badLikeCount) {
          totalInFrame = goodLikeCount - badLikeCount;
          this.finalCount = (((totalInFrame * 100) / totalLikes) / 2);
          this.finalCount = (50 + this.finalCount);
          this.finalCount = Math.round(this.finalCount)
          this.moveArrow(this.finalCount, true);
        } else {
          totalInFrame = badLikeCount - goodLikeCount;
          this.finalCount = (((totalInFrame * 100) / totalLikes) / 2);
          this.finalCount = (50 - this.finalCount);
          this.finalCount = Math.round(this.finalCount)
          this.moveArrow(this.finalCount, false);
        }
        this.finalCount = this.finalCount + "%";
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
