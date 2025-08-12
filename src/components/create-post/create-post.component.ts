import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
  imports: [MatInputModule, ReactiveFormsModule],
})
export class CreatePostComponent implements OnInit {
  postForm!: FormGroup;
  authorId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(150)]],
      content: ['', [Validators.required]],
      tags: [''],
      image: [''],
    });
  }

  ngOnInit() {
    const user = localStorage.getItem('user');
    this.authorId = user ? JSON.parse(user)._id : null;
  }

  onSubmit() {
    if (this.postForm.invalid || !this.authorId) return;

    const formValue = this.postForm.value;

    const postData = {
      title: formValue.title.trim(),
      content: formValue.content.trim(),
      tags: formValue.tags
        ? formValue.tags
            .split(',')
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag.length > 0)
        : [],
      image: formValue.image.trim(),
      author: this.authorId,
    };

    console.log('Post to submit:', postData);

    // TODO: call your postsService.createPost(postData)
  }

  goBack(){
    this.router.navigate(['/main-page']);
  }
}
