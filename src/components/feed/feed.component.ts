import { Component, HostListener, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.services';
import { SwalService } from '../../shared/Swal/swal.service';
import { LoadingSpinnerComponent } from "../../shared/loading-spinner/loading-spinner.component";
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule ,LoadingSpinnerComponent]
})
export class FeedComponent implements OnInit {
  posts: Post[] = [];
  page: number = 1;
  limit: number = 20;
  totalPages: number = 1;
  isLoading: boolean = false;

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
}
