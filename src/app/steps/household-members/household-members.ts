import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-household-members',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './household-members.html',
  styleUrls: ['./household-members.scss']
})
export class HouseholdMembersComponent {
  @Output() stepComplete = new EventEmitter<any>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      members: this.fb.array([])
    });
    // On commence avec une ligne vide
    this.addMember();
  }

  get members(): FormArray {
    return this.form.get('members') as FormArray;
  }

  addMember() {
    this.members.push(this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]]
    }));
  }

  removeMember(index: number) {
    this.members.removeAt(index);
  }

  onSubmit() {
    if (this.form.valid && this.members.length > 0) {
      this.stepComplete.emit({ members: this.form.value.members });
    } else {
      this.members.controls.forEach(control => control.markAllAsTouched());
    }
  }

  asFormGroup(control: any): FormGroup {
    return control as FormGroup;
  }
}
