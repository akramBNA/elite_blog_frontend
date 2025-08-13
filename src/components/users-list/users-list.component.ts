import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UsersService } from '../../services/users.services';
import { debounceTime, distinctUntilChanged, flatMap } from 'rxjs/operators';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { EditRoleDialogComponent } from './edit-roles-dialog/edit-roles-dialog.component';
import { RolesService } from '../../services/roles.services';
import { SwalService } from '../../shared/Swal/swal.service';

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
  roles_data:any [] =[];

  limit = 20;
  page = 1;
  totalUsers = 0;

  keywordControl = new FormControl('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private swalService: SwalService,
    private dialog: MatDialog
  ) {}

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
    
    this.usersService.getAllActiveUsers(this.limit, this.page, keyword).subscribe((data: any) => {      
      if(data.success){
        this.isLoading = false;
        this.users = data.data;
        this.totalUsers = data.meta.total;
        this.isEmpty = this.users.length === 0;
      } else {
        this.isLoading = false;
        // this.users = [];
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

  editRole(userId: string) {
    this.isLoading = true;
    const user = this.users.find(u => u._id === userId);
    if (!user) return;

    this.rolesService.getAllRoles().subscribe((data: any) => {
      if(data.success){
        this.isLoading = false;
      } else{
        this.isLoading = false;
        this.swalService.showError('Failed to get roles, try again!').then(()=>{
          return;
        });
      }
  
      const dialogRef = this.dialog.open(EditRoleDialogComponent, {
        width: '400px',
        data: {
          userId: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          currentRoleId: user.role,
          roles: data.data
        }
      });

      dialogRef.afterClosed().subscribe(result => {      
        this.isLoading = true;  
        if (result) {
          this.rolesService.updateRole(user._id, result).subscribe((res: any) => {
            if (res.success) {
              this.isLoading = false;
              this.swalService.showSuccess('User role successfully updated!').then(() => {
                this.loadUsers();
              });
            } else {
              this.isLoading = false;
              this.swalService.showError('Failed to update user role, please try again.');
            }
          });
        } else {
          this.isLoading = false;
        }
      });
    });
  }

}
