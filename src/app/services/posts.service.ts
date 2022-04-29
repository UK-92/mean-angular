import { Injectable } from '@angular/core';
import { Post } from '../posts/post.model';
import { Observable, Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class PostsService {


  private posts = new Array<Post>();
  private postsUpdated = new Subject<{ posts: Array<Post>, postsTotal: number }>();
  constructor(private httpClient: HttpClient, private router: Router) { }

  getPosts(pageSize: number, currentPage: number) {
    const queryParameters = `?pageSize=${pageSize}&currentPage=${currentPage}`;
    this.httpClient.get<{ message: string, posts: Array<any>, totalPostCount: number }>('http://localhost:3000/api/posts' + queryParameters)
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }),
          totalPosts: postData.totalPostCount
        }
      }))
      .subscribe((tansformedPostsData) => {
        this.posts = tansformedPostsData.posts;
        this.postsUpdated.next({ posts: [... this.posts], postsTotal: tansformedPostsData.totalPosts });
      });
  }

  deletePost(postId: string) {
    return this.httpClient.delete('http://localhost:3000/api/posts/' + postId);
  }

  getPostUpdateListener(): Observable<{posts :Array<Post>, postsTotal: number}> {
    return this.postsUpdated.asObservable()
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.httpClient.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData).subscribe((succ) => {
      this.router.navigate(['/']);
    });
  }

  editPost(postId: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append("id", postId);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = { id: postId, title: title, content: content, imagePath: image, creator: '' }
    }
    this.httpClient.put<{ message: string, post: Post }>('http://localhost:3000/api/posts/' + postId, postData).subscribe((succ) => {
      this.router.navigate(['/']);
    });
  }

  getPost(postId: string) {
    return this.httpClient.get<{ message: string, post: { _id: string, title: string, content: string, imagePath: string, creator: string } }>('http://localhost:3000/api/posts/' + postId);
  }
}
