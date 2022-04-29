import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PostsService } from 'src/app/services/posts.service';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts = new Array<Post>();
  private postsSubscription: Subscription;
  isLoading = false;
  totalpostAmount = 10;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  private authListenerSubs: Subscription | any;
  isUserAuthenticated: boolean = false;
  userId: string | any;

  constructor(public postService: PostsService, private authService: AuthService) {
    this.postsSubscription = new Subscription();
  }
  ngOnDestroy(): void {
    this.postsSubscription.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.isLoading= true
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSubscription = this.postService.getPostUpdateListener()
    .subscribe((postData: {posts: Array<Post>, postsTotal: number }) => {
      this.posts = postData.posts;
      this.isLoading = false;
      this.totalpostAmount = postData.postsTotal;
    });
    this.isUserAuthenticated = this.authService.isLoggedIn();
    this.authListenerSubs = this.authService.getAuthStatuListener().subscribe(isAuthenticated => {
      this.isUserAuthenticated = isAuthenticated
      this.userId = this.authService.getUserId();
    });
  }

  deletePost(postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  changePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

}
