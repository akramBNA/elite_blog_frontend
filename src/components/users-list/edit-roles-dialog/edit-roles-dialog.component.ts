import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { RolesService } from '../../../services/roles.services';
import { UsersService } from '../../../services/users.services';
import { SwalService } from '../../../shared/Swal/swal.service';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';

interface Role {
  _id: string;
  roleType: string;
}

interface DialogData {
  userId: string;
  firstName: string;
  lastName: string;
  currentRoleId: string;
  roles: Role[];
}

@Component({
  selector: 'app-edit-role-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, LoadingSpinnerComponent],
  templateUrl: './edit-roles-dialog.component.html'
})

export class EditRoleDialogComponent {
  isLoading: boolean = false;
  roleForm: FormGroup;

  roles: Role[] = [];
  firstName: string = '';
  lastName: string = '';

  constructor(
    private rolesService: RolesService,
    private usersService: UsersService,
    private swalService: SwalService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.roleForm = this.fb.group({
      role: [data.currentRoleId, Validators.required]
    });

    this.roles = data.roles;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
  }

  submit() {
    if (this.roleForm.valid) {
      this.dialogRef.close(this.roleForm.value.role);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
