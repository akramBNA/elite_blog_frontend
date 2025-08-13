import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { PostsService } from '../../services/posts.services';
import { SwalService } from '../../shared/Swal/swal.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
  ],
})
export class CreatePostComponent implements OnInit {
  isLoading: boolean = false;
  submitted: boolean = false;
  postForm!: FormGroup;
  authorId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private postService: PostsService,
    private swalService: SwalService
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
    this.submitted = true;
    this.isLoading = true;
    if (this.postForm.invalid || !this.authorId) {
      this.isLoading = false;
      this.swalService.showError('Failed to add post, check your inputs!');
    }

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

    this.postService.createPost(postData).subscribe({
      next: (data: any) => {
        this.isLoading = false;
        if (data.success) {
          this.swalService.showSuccess('Your post has been added successfully!').then(() => {
              this.router.navigate(['/main-page/feed']);
            });
        } else {
          this.swalService.showError('Something went wrong, try again later!');
        }
      },
      error: () => {
        this.isLoading = false;
        this.swalService.showError('Error updating post');
      },
    });
  }

  goBack() {
    this.router.navigate(['/main-page/feed']);
  }
}
