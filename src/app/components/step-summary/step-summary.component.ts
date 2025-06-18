import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { StepDataService } from '../../services/step-data.service';
import { StepperService } from '../../services/stepper.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-step-summary',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule],
  template: `
    <div class="summary-container">
      <mat-card *ngFor="let step of steps">
        <mat-card-header>
          <mat-card-title>{{ step.title }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <ng-container *ngIf="isTableData(stepData[step.id]); else simpleData">
            <table mat-table [dataSource]="stepData[step.id]">
              <ng-container *ngFor="let column of getColumns(stepData[step.id])" [matColumnDef]="column">
                <th mat-header-cell *matHeaderCellDef>{{ column }}</th>
                <td mat-cell *matCellDef="let element">{{ element[column] }}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="getColumns(stepData[step.id])"></tr>
              <tr mat-row *matRowDef="let row; columns: getColumns(stepData[step.id])"></tr>
            </table>
          </ng-container>
          <ng-template #simpleData>
            <div class="simple-data">
              <div *ngFor="let key of getKeys(stepData[step.id])" class="data-row">
                <span class="label">{{ key }}:</span>
                <span class="value">{{ stepData[step.id][key] }}</span>
              </div>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .summary-container {
      padding: 20px;
    }
    .simple-data {
      padding: 10px;
    }
    .data-row {
      display: flex;
      margin: 5px 0;
    }
    .label {
      font-weight: bold;
      margin-right: 10px;
      min-width: 150px;
    }
    .value {
      color: #666;
    }
  `]
})
export class StepSummaryComponent implements OnInit, OnDestroy {
  steps: any[] = [];
  stepData: any = {};
  private subscriptions: Subscription[] = [];

  constructor(
    private stepDataService: StepDataService,
    private stepperService: StepperService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.stepperService.getConfig().subscribe(config => {
        if (config) {
          this.steps = config.steps;
          this.cdr.detectChanges();
        }
      })
    );

    this.subscriptions.push(
      this.stepDataService.getAllData().subscribe(data => {
        console.log('Summary data updated:', data);
        this.stepData = data;
        this.cdr.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  isTableData(data: any): boolean {
    return Array.isArray(data);
  }

  getColumns(data: any[]): string[] {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
} 