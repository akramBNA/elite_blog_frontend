import { Component, HostListener, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.services';
import { SwalService } from '../../shared/Swal/swal.service';
import { LoadingSpinnerComponent } from "../../shared/loading-spinner/loading-spinner.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";  // <-- Needed for ngModel

interface Post {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  image?: string;
  author: { _id: string; firstName: string; lastName: string } | null;
  comments: any[];
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  imports: [CommonModule, LoadingSpinnerComponent, FormsModule, MatIconModule]
})
export class FeedComponent implements OnInit {
  posts: Post[] = [];
  page: number = 1;
  limit: number = 20;
  totalPages: number = 1;
  isLoading: boolean = false;

  newComments: { [postId: string]: string } = {};

  constructor(private postsService: PostsService, private swalService: SwalService) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    if (this.isLoading || this.page > this.totalPages) {
      return;
    }
    this.isLoading = true;
    this.postsService.getAllPosts(this.page, this.limit).subscribe({
      next: (res) => {
        if (res.success) {
          this.posts = [...this.posts, ...res.data];
          this.totalPages = res.meta.totalPages;
          this.page++;
        } else {
          this.swalService.showError('Failed to load posts');
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.swalService.showError('Error loading posts');
      }
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight > fullHeight - 100) {
      this.loadPosts();
    }
  }

  onEditPost(post: Post) {
    this.swalService.showAlert(`Edit feature coming soon for post "${post.title}"`);
  }

  addComment(post: Post) {
    const content = this.newComments[post._id]?.trim();
    if (!content) return;

    const user = localStorage.getItem('user');
    if (!user) {
      this.swalService.showError('You must be logged in to comment');
      return;
    }

    const userId = JSON.parse(user)._id;

    // this.postsService.addCommentToPost(post._id, userId, content).subscribe({
    //   next: (res) => {
    //     if (res.success) {
    //       // Append comment to post.comments locally
    //       post.comments.push(res.data);
    //       // Clear input
    //       this.newComments[post._id] = '';
    //     } else {
    //       this.swalService.showError('Failed to add comment');
    //     }
    //   },
    //   error: () => {
    //     this.swalService.showError('Error adding comment');
    //   }
    // });
  }
}
