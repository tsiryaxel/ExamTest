import { Component, computed, signal, effect, OnInit } from '@angular/core';
import { ExamsService, examsService } from './exams.service';
import { ExamFormComponent } from './exam-form.component';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faCheckCircle,
  faClipboardList,
  faTimesCircle,
  faClock,
  faQuestionCircle,
  faCalendarAlt,
  faLocationPin,
  faUser,
  faTrash
} from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, ExamFormComponent, FontAwesomeModule],
  templateUrl: './exams.component.html'
})

export class ExamsComponent implements OnInit {
  exams = examsService.exams;      // Signal<Exam[]>
  statuses = examsService.totals;  // Signal<{...}>



  open = examsService.open; // Signal<boolean>

  onCreated(_: any) {
    this.open.set(false);
  }



  constructor(private library: FaIconLibrary) {
    // Nécessaire en standalone
    library.addIcons(faCheckCircle, faClipboardList, faTimesCircle, faClock, faQuestionCircle, faCalendarAlt, faLocationPin, faUser, faTrash);
  }



  deleteExame(id?: number) {
    if (id && confirm('Confirmer la suppression ?')) {
      examsService.deleteExame(id);
    }
  }


  statusOptions: string[] = [];
  ngOnInit() {
    // Générer statusOptions depuis getBadgeConfigs()
    this.statusOptions = Object.keys(this.getBadgeConfigs());
    // Charger les examens au démarrage
    examsService.load();

  }

  // Fonction interne pour définir toutes les configurations de badges
  private getBadgeConfigs(): Record<string, any> {
    return {
      'Confirmé': {
        bg: 'bg-green-100 text-green-800',
        icon: 'check-circle',
        iconColor: 'text-green-500',
      },
      'À organiser': {
        bg: 'bg-orange-100 text-orange-800',
        icon: 'clipboard-list',
        iconColor: 'text-orange-500',
      },
      'Annulé': {
        bg: 'bg-red-100 text-red-800',
        icon: 'times-circle',
        iconColor: 'text-red-500',
      },
      'En recherche de place': {
        bg: 'bg-blue-100 text-blue-800',
        icon: 'clock',
        iconColor: 'text-blue-500',
      },
    };
  }

  // Fonction publique pour récupérer la configuration d’un statut donné
  badgeConfig(status: string) {
    const configs = this.getBadgeConfigs();
    return configs[status] || {
      bg: 'bg-gray-100 text-gray-800',
      icon: 'question-circle',
      iconColor: 'text-gray-500',
    };
  }

  statusEntries = computed(() => Object.entries(this.statuses()));


  selectedExam: any = null;
  modalOpen = false;

  openStatusModal(exam: any) {
    this.selectedExam = exam;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedExam = null;
  }

  async changeStatus(examId: number, newStatus: string) {
    try {
      await examsService.updateStatus(examId, newStatus);
      await examsService.load();
      this.closeModal();
    } catch (err) {
      console.error(err);
      alert('Impossible de mettre à jour le statut.');
    }
  }


}
