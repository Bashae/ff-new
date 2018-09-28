import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Post } from "../../app/post";
import { AuthProvider } from '../auth/auth';
import { Events } from 'ionic-angular';

@Injectable()
export class PostProvider {
  postsCollection: AngularFirestoreCollection<any>;
  posts: Observable<any[]>;
  postDoc: AngularFirestoreDocument;

  likesCollection: AngularFirestoreCollection<any>;
  likes: Observable<any[]>;
  likeDoc;

  favoritesCollection: AngularFirestoreCollection<any>;
  favorites: Observable<any[]>;
  favoriteDoc;

  lastDoc: AngularFirestoreDocument;
  constructor(public afs: AngularFirestore, public auth: AuthProvider, public events: Events) {
    this.postsCollection = this.afs.collection('posts');
    this.likesCollection = this.afs.collection('likes');
    this.favoritesCollection = this.afs.collection('favorites');
  }

  getPost(post) {
    this.postDoc = this.afs.doc('posts/' + post);
  }

  getStartPosts() {
    this.posts = this.postsCollection.valueChanges();
    return this.postsCollection.ref
      .limit(5)
      .orderBy('timestamp')
      .get();
  }

  getNextPosts(lastItem) {
    this.posts = this.postsCollection.valueChanges();
    return this.postsCollection.ref
      .limit(5)
      .orderBy('timestamp')
      .startAfter(lastItem)
      .get();
  }

  createPost(post: Post) {
    const timestamp = new Date().getTime();
    let cardId = this.afs.createId();

    post.id = cardId;
    post.timestamp = timestamp * -1;
    post.u_id = this.auth.user.uid;

    this.postsCollection.add(post)
      .then(docRef => {
        post.id = docRef.id;
        let doc = this.afs.doc('posts/' + docRef.id);
        return doc.update(post).then(res => {
          this.events.publish('post:created');
        })
      });
  }

  likePost(post: Post, type: string) {
    let doc = this.afs.doc('posts/' + post.id);
    doc.update(post).then((res) => {
      this.createLike(post.id, post.u_id, type);
    })
  }

  unlikePost(post: Post, type: string) {
    let doc = this.afs.doc('posts/' + post.id);
    doc.update(post);

    this.destroyLike(post.id);
  }

  favoritePost(post: Post) {
    let doc = this.afs.doc('posts/' + post.id);
    doc.update(post).then(res => {
      this.createFavorite(post.id, post.u_id);
    })
  }

  unfavoritePost(post: Post) {
    let doc = this.afs.doc('posts/' + post.id);
    doc.update(post).then(res => {
      this.destroyFavorite(post.id);
    })
  }

  createFavorite(postId, postOwnerId) {
    let favorite = {'u_id': this.auth.user.uid, 'p_id': postId, 'p_own': postOwnerId};
    this.favoritesCollection.add(favorite)
      .then(docRef => {
        console.log('document created')
        console.log(docRef)
      })
      .catch(err => {
        console.log('document creation error')
        console.log(err)
      })
  }

  destroyFavorite(postId) {
    // Combine Destroys and Creates?
    // Into Categories and just pass type of category?
    // Or break into own Providers/Services?
    // LikeProvider, FavoriteProvider
    // TODO Clean
    let thing;
    this.afs.collection('favorites', ref => 
      thing = ref.where('u_id', '==', this.auth.user.uid)
        .where('p_id', '==', postId));

    thing.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.delete();
      });
    });
  }

  createLike(postId, postOwnerId, type) {
    console.log('create like');
    let like = {'u_id': this.auth.user.uid, 'p_id': postId, 'p_own': postOwnerId, 'type': type};
    this.likesCollection.add(like)
      .then(docRef => {
        console.log('document created')
        console.log(docRef)
      })
      .catch(err => {
        console.log('document creation error')
        console.log(err)
      })
  }

  updateLike(post: Post, type: string) {
    console.log('update like');
    let thing;
    this.afs.collection('likes', ref => 
      thing = ref.where('u_id', '==', this.auth.user.uid)
         .where('p_id', '==', post.id));

    thing.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.update("type", type);
      });
    });
  }

  destroyLike(postId) {
    // TODO Clean
    let thing;
    this.afs.collection('likes', ref => 
      thing = ref.where('u_id', '==', this.auth.user.uid)
         .where('p_id', '==', postId));

    thing.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.delete();
      });
    });
  }

  getGoodLikes() {
    return this.likesCollection.ref
      .where('p_own', '==', this.auth.user.uid)
      .where('type', '==', 'good')
      .get();
  }

  getBadLikes() {
    return this.likesCollection.ref
      .where('p_own', '==', this.auth.user.uid)
      .where('type', '==', 'bad')
      .get();
  }

  getUserFavorites(postId) {
    return this.favoritesCollection.ref
      .where('u_id', '==', this.auth.user.uid)
      .where('p_id', '==', postId)
      .get();
  }

  getUserLikes(postId) {
    return this.likesCollection.ref
      .where('u_id', '==', this.auth.user.uid)
      .where('p_id', '==', postId)
      .get();
  }

}
