import { signal, effect, computed, Signal } from '@angular/core';
import { environment } from '../../environments/environment';

export interface Exam {
  id?: number;
  studentId?: number;
  studentName?: string;
  location?: string;
  date: string;
  time: string;
  status: 'Confirmé' | 'À organiser' | 'Annulé' | 'En recherche de place';
}

export interface Student {
  id?: number;
  name: string;
}

export class ExamsService {

  open = signal(false);



  private _exams = signal<Exam[]>([]);
  exams = this._exams.asReadonly();

  totals = computed(() => {
    const t = { 'Confirmé': 0, 'À organiser': 0, 'Annulé': 0, 'En recherche de place': 0 };
    for (const e of this._exams()) {
      if (t[e.status] !== undefined) t[e.status] += 1;
    }
    return t;
  });

  constructor() {
    // initial load
    this.load();
  }

  async load() {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(environment.apiBase + '/exams', {
        headers: {
          ...(token ? { 'Authorization': 'Bearer ' + token } : {})
        }
      });
      const data = await res.json();
      // API returns data in data.member array
      this._exams.set((data.member || []).map((d: any) => ({
        id: d.id,
        student: d.student ?? 0,
        studentName: d.studentName || (d.student && d.student.name) || '—',
        location: d.location || '',
        date: d.formattedDate || d.date || '',
        time: d.formattedTime || d.time || '',
        status: d.status || 'À organiser'
      })));
    } catch (e) {
      console.error('Failed to load exams', e);
    }
  }

  /*
  async add(exam: Exam) {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(environment.apiBase + '/exams', {
      method: 'POST',
      headers: {'Content-Type':'application/json', ...(token?{'Authorization':'Bearer '+token}:{})},
      body: JSON.stringify(exam)
    });
    const saved = await res.json();
    this._exams.update(arr => [...arr, saved]);
  }
  */

  async add(exam: Exam) {
    const token = localStorage.getItem('auth_token');

    // Conversion en JSON-LD : student => IRI
    const payload = {
      student: `/api/students/${exam.studentId}`, // 👈 API Platform attend une IRI ici
      location: exam.location,
      date: exam.date, // format "YYYY-MM-DD"
      time: exam.time, // format "HH:mm:ss"
      status: exam.status
    };

    const res = await fetch(environment.apiBase + '/exams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const error = await res.text();
      //console.error('Erreur API lors de la création de l’examen:', error);
      throw new Error(`Erreur API (${res.status}): ${error}`);
    }

    const saved = await res.json();
    this._exams.update(arr => [...arr, { ...saved, date: saved.formattedDate || saved.date || '', time: saved.formattedTime || saved.time || '' }]);
    //this.load();
  }


  async refresh() {
    await this.load();
  }


  private _students = signal<Student[]>([]);
  students = this._students.asReadonly();

  async getStudents() {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(environment.apiBase + '/students', {
        headers: {
          ...(token ? { 'Authorization': 'Bearer ' + token } : {})
        }
      });
      const data = await res.json();
      this._students.set((data.member || []).map((d: any) => ({
        id: d.id,
        name: d.name
      })));
    } catch (e) {
      console.error('Failed to load students', e);
    }
  }


  async deleteExame(id: number) {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${environment.apiBase}/exams/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    });
    if (!res.ok) {
      const error = await res.text();
      console.error('Erreur API lors de la suppression de l’examen:', error);
      throw new Error(`Erreur API (${res.status}): ${error}`);
    }
    this._exams.update(arr => arr.filter(e => e.id !== id));
  }

   // --------------------------------------------------------
  // Nouvelle fonction pour mettre à jour uniquement le statut
  // --------------------------------------------------------
  async updateStatus(examId: number, newStatus: string) {
    const token = localStorage.getItem('auth_token');

    const payload = {
      status: newStatus
    };

    const res = await fetch(environment.apiBase + `/exams/${examId}`, {
      method: 'PATCH', // PATCH pour mise à jour partielle
      headers: {
        'Content-Type': 'application/merge-patch+json', // API Platform attend ce format pour PATCH
        'Accept': 'application/ld+json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('Erreur API lors de la mise à jour du statut:', error);
      throw new Error(`Erreur API (${res.status}): ${error}`);
    }

    const updatedExam = await res.json();
    return updatedExam;
  }

}

export const examsService = new ExamsService();
