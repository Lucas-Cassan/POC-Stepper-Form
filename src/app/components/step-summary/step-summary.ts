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
  templateUrl: './step-summary.html',
  styleUrls: ['./step-summary.scss']
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