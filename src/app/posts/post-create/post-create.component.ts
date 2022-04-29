import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PostsService } from 'src/app/services/posts.service';
import { mimeType } from 'src/app/validators/mime-type.validator';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  private mode = 'create';
  private postId: any;
  post: Post | any;
  isLoading = false;
  form: FormGroup | any;
  imagePreviewUrl: string | any;

  constructor(public postService: PostsService, public activetdRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.form = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      'content': new FormControl(null, { validators: [Validators.required] }),
      'image': new FormControl(null, { validators: [Validators.required], asyncValidators: mimeType })
    });
    this.activetdRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.post = this.postService.getPost(this.postId).subscribe((succ) => {
          this.post = {
            id: succ.post._id,
            title: succ.post.title,
            content: succ.post.content,
            imagePath: succ.post.imagePath,
            creator: succ.post.creator
          };
          this.form.setValue({ 'title': this.post.title, 'content': this.post.content , 'image': this.post.imagePath});
          this.isLoading = false;
        });
      } else {
        this.mode = 'create';
        this.postId = null;
        this.post = {};
        this.form.setValue({ 'title': '', 'content': '', 'image': null });
      }
    });
  }

  savePost() {
    if (this.form.valid) {
      this.isLoading = true;
      if (this.mode === 'create') {
        this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
      } else {
        this.postService.editPost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
      }
      this.form.reset();
    }
  }

  imagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files?.item(0);
    this.form.patchValue({ 'image': file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result;
    };
    reader.readAsDataURL(file as Blob);
    // console.log(file);
    // console.log(this.form);
  }

}
