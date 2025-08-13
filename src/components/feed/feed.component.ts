import { Component, HostListener, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.services';
import { SwalService } from '../../shared/Swal/swal.service';
import { LoadingSpinnerComponent } from "../../shared/loading-spinner/loading-spinner.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { CommentssService } from '../../services/comments.services';
import { EditPostComponent } from '../edit-post/edit-post.component';
import { MatDialog } from '@angular/material/dialog';
import {CheckRolesService} from '../../services/checkRoles.services';

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
  showScrollTop = false;

  newComments: { [postId: string]: string } = {};
  newReplies: { [commentId: string]: string } = {};


  constructor(
    private postsService: PostsService, 
    private swalService: SwalService,
    private commentsService: CommentssService,
    public checkRoleService: CheckRolesService,
    private dialog: MatDialog

  ) {}

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

    this.showScrollTop = scrollTop > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onEditPost(post: Post) {
    const dialogRef = this.dialog.open(EditPostComponent, {
      width: '500px',
      data: { post }
    });

    dialogRef.afterClosed().subscribe((updatedPost: any) => {
      if (updatedPost) {
        const index = this.posts.findIndex(p => p._id === updatedPost._id);
        if (index !== -1) {
          this.posts[index] = { ...this.posts[index], ...updatedPost };
        }
      }
    });
  }

  deletePost(id: any) {
    this.swalService.showConfirmation('Are you sure you want to delete this post?').then(() => {
      this.isLoading = true;
      this.postsService.deletePost(id).subscribe({
        next: (data: any) => {
          this.isLoading = false;
          if (data.success) {
            this.posts = this.posts.filter(post => post._id !== id);

            this.swalService.showSuccess('This post was deleted successfully!');
          } else {
            this.swalService.showError('Failed to delete this post, try again!');
          }
        },
        error: () => {
          this.isLoading = false;
          this.swalService.showError('Error deleting post');
        }
      });
    });
  }

  addComment(post: Post) {
    this.isLoading = true;
    const content = this.newComments[post._id]?.trim();
    if (!content) return;

    const user = localStorage.getItem('user');
    if (!user) {
      this.isLoading = false;
      this.swalService.showError('You must be logged in to comment');
      return;
    }

    const userId = JSON.parse(user)._id;
    const comments_data = {
      postId: post._id , 
      userId: userId, 
      content: content
    };

    this.commentsService.createComment(comments_data).subscribe({
      next: (res) => {
        if (res.success) {
          this.isLoading = false;
          post.comments.push(res.data);
          this.newComments[post._id] = '';
        } else {
          this.isLoading = false;
          this.swalService.showError('Failed to add comment');
        }
      },
      error: () => {
        this.isLoading = false;
        this.swalService.showError('Error adding comment');
      }
    });
  }

  addReply(post: Post, comment: any) {
    this.isLoading = true;
    const content = this.newReplies[comment._id]?.trim();
    if (!content) return;

    const user = localStorage.getItem('user');
    if (!user) {
      this.isLoading = false;
      this.swalService.showError('You must be logged in to reply');
      return;
    }

    const userId = JSON.parse(user)._id;
    const reply_data = {
      commentId: comment._id,
      userId: userId,
      content: content
    };

    this.commentsService.addReply(reply_data).subscribe({
      next: (res) => {
        if (res.success) {
          this.isLoading = false;
          comment.replies = res.data.replies || [];
          this.newReplies[comment._id] = '';
        } else {
          this.isLoading = false;
          this.swalService.showError('Failed to add reply');
        }
      },
      error: () => {
        this.isLoading = false;
        this.swalService.showError('Error adding reply');
      }
    });
  }

}
