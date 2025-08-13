import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PostsService } from '../../services/posts.services';
import { SwalService } from '../../shared/Swal/swal.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoadingSpinnerComponent } from "../../shared/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, LoadingSpinnerComponent]
})
export class EditPostComponent {
  postForm: FormGroup;
  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<EditPostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private postsService: PostsService,
    private swalService: SwalService
  ) {
    this.postForm = this.fb.group({
      title: [data.post.title, Validators.required],
      content: [data.post.content, Validators.required],
      tags: [data.post.tags.join(', ')],
      image: [data.post.image || '']
    });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    if (this.postForm.invalid) return;

    this.isLoading = true;

    const updatedPost = {
      ...this.postForm.value,
      tags: this.postForm.value.tags
        ? this.postForm.value.tags.split(',').map((t: string) => t.trim())
        : []
    };
    
    this.postsService.updatePost(this.data.post._id, updatedPost).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.swalService.showSuccess('Post updated successfully!');
          this.dialogRef.close(res.data);
        } else {
          this.swalService.showError('Failed to update post, try again!');
        }
      },
      error: () => {
        this.isLoading = false;
        this.swalService.showError('Error updating post');
      }
    });
  }
}
