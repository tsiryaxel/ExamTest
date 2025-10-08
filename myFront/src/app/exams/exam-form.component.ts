import { Component, EventEmitter, Output, signal } from '@angular/core';
import { examsService, Exam, Student } from './exams.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './exam-form.component.html'
})
export class ExamFormComponent {
  open = examsService.open;

  @Output() created = new EventEmitter<any>();

  model: Exam = {
    studentId: 0,
    date: '',
    time: '',
    status: 'À organiser'
  };

  students: Student[] = [];

  fieldErrors = signal<Record<string, string[]>>({});

  async ngOnInit() {
    await examsService.getStudents();
    this.students = examsService.students();

    if (!this.students.find(s => s.id === this.model.studentId)) {
      this.model.studentId = 0;
    }
  }

  async submit() {
    this.fieldErrors.set({});

    const errors: Record<string, string[]> = {};
    if (!this.model.studentId) errors['student'] = ['Veuillez sélectionner un étudiant'];
    if (!this.model.date) errors['date'] = ['Veuillez saisir une date'];
    if (!this.model.time) errors['time'] = ['Veuillez saisir une heure'];

    if (Object.keys(errors).length > 0) {
      this.fieldErrors.set(errors);
      return;
    }

    try {
      await examsService.add(this.model);
      this.created.emit(true);
    } catch (data: any) {
      const backendErrors: Record<string, string[]> = {};

      if (data.violations) {
        data.violations.forEach((v: any) => {
          if (!backendErrors[v.propertyPath]) backendErrors[v.propertyPath] = [];
          backendErrors[v.propertyPath].push(v.message);
        });
      } else if (data.detail && data.detail.includes('/api/students/')) {
        backendErrors['student'] = ['L’étudiant sélectionné n’existe plus. Veuillez choisir un autre étudiant.'];
        this.model.studentId = 0;
      } else {
        backendErrors['global'] = [data.detail || 'Erreur inconnue'];
      }

      this.fieldErrors.set(backendErrors);
    }
  }

  clearFieldError(field: string) {
    const errors = { ...this.fieldErrors() };
    if (errors[field]) {
      delete errors[field];
      this.fieldErrors.set(errors);
    }
  }
}
