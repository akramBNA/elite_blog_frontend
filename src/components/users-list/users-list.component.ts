import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UsersService } from '../../services/users.services';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { M } from "../../../node_modules/@angular/material/paginator.d-CexYxFq4";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
}

interface UserStats {
  total_users: number;
  admin_count: number;
  editor_count: number;
  writer_count: number;
  reader_count: number;
}

@Component({
  selector: 'app-users-list',
  imports: [CommonModule, LoadingSpinnerComponent, MatInputModule, MatIconModule, MatPaginatorModule, ReactiveFormsModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  stats: UserStats = {
    total_users: 0,
    admin_count: 0,
    editor_count: 0,
    writer_count: 0,
    reader_count: 0,
  };

  users: User[] = [];
  isLoading = false;
  isEmpty = false;

  limit = 20;
  page = 1;
  totalUsers = 0;

  keywordControl = new FormControl('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.loadStats();
    this.loadUsers();

    this.keywordControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
        this.page = 1;
        this.loadUsers();
      });
  }

  loadStats() {
    this.usersService.getUserStats().subscribe((data: any) =>{
      if(data.success){
        this.stats = data.data;
      }
    });
  }

  loadUsers() {
    this.isEmpty = false;
    this.isLoading = true;
    const keyword = this.keywordControl.value || '';
    console.log("his.keywordControl.value ====>  ", this.keywordControl.value, " -- type: ", typeof this.keywordControl.value);
    
    console.log(" params ===> ", keyword, " - lim: ", this.limit, " - page: ", this.page);
    
    this.usersService.getAllActiveUsers(this.limit, this.page, keyword).subscribe((data: any) => {
      console.log(" data ?? ", data);
      
      if(data.success){
        this.isLoading = false;
        this.users = data.data;
        this.totalUsers = data.meta.total;
        this.isEmpty = this.users.length === 0;
      } else {
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.limit = event.pageSize;
    this.page = event.pageIndex + 1;
    this.loadUsers();
  }

  clearSearch() {
    this.keywordControl.setValue('');
  }
}
