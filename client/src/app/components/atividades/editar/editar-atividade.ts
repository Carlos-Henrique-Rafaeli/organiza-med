import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { filter, map, Observer, shareReplay, switchMap, take, tap } from 'rxjs';
import { ListagemMedicosModel } from '../../medicos/medico.models';
import { ListagemPacientesModel } from '../../pacientes/paciente.models';
import { NotificacaoService } from '../../shared/notificacao/notificacao.service';
import {
  DetalhesAtividadeModel,
  EditarAtividadeModel,
  EditarAtividadeResponseModel,
} from '../atividade.models';
import { AtividadeService } from '../atividade.service';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-editar-atividade',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    AsyncPipe,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatNativeDateModule,
    MatSelectModule,
  ],
  templateUrl: './editar-atividade.html',
})
export class EditarAtividade {
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  protected readonly atividadeService = inject(AtividadeService);
  protected readonly notificacaoService = inject(NotificacaoService);

  protected atividadeForm: FormGroup = this.formBuilder.group({
    tipoAtividade: ['', [Validators.required]],
    inicio: ['', [Validators.required]],
    inicioHora: ['', [Validators.required]],
    termino: ['', [Validators.required]],
    terminoHora: ['', [Validators.required]],
    pacienteId: ['', [Validators.required]],
    medicos: [[], [Validators.required]],
  });

  get tipoAtividade() {
    return this.atividadeForm.get('tipoAtividade');
  }

  get inicio() {
    return this.atividadeForm.get('inicio');
  }

  get inicioHora() {
    return this.atividadeForm.get('inicioHora');
  }

  get termino() {
    return this.atividadeForm.get('termino');
  }

  get terminoHora() {
    return this.atividadeForm.get('terminoHora');
  }

  get pacienteId() {
    return this.atividadeForm.get('pacienteId');
  }

  get medicos() {
    return this.atividadeForm.get('medicos');
  }

  protected readonly paciente$ = this.route.data.pipe(
    filter((data) => data['pacientes']),
    map((data) => data['pacientes'] as ListagemPacientesModel[]),
  );

  protected readonly medicos$ = this.route.data.pipe(
    filter((data) => data['medicos']),
    map((data) => data['medicos'] as ListagemMedicosModel[]),
  );

  protected readonly atividade$ = this.route.data.pipe(
    filter((data) => data['atividade']),
    map((data) => data['atividade'] as DetalhesAtividadeModel),
    tap((atividade) => {
      console.log('Atividade: ', atividade);

      const inicio = new Date(atividade.inicio);
      const termino = new Date(atividade.termino);

      const inicioLocal = new Date(inicio.getTime() - inicio.getTimezoneOffset() * 60000);
      const terminoLocal = new Date(termino.getTime() - termino.getTimezoneOffset() * 60000);

      const medicoValue =
        atividade.tipoAtividade === 'Cirurgia'
          ? atividade.medicos.map((m) => m.id)
          : atividade.medicos[0].id;

      this.atividadeForm.patchValue({
        tipoAtividade: atividade.tipoAtividade,
        inicio: inicioLocal,
        inicioHora: inicioLocal,
        termino: terminoLocal,
        terminoHora: terminoLocal,
        pacienteId: atividade.paciente.id,
        medicos: medicoValue,
      });
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  protected readonly tipos = ['Consulta', 'Cirurgia'];

  public editar() {
    if (this.atividadeForm.invalid) return;

    const formValue = this.atividadeForm.value;

    const editarAtividadeModel: EditarAtividadeModel = formValue;
    console.log(formValue);

    editarAtividadeModel.inicio = this.combinarDateTime(formValue.inicio, formValue.inicioHora);
    editarAtividadeModel.termino = this.combinarDateTime(formValue.termino, formValue.terminoHora);

    if (!Array.isArray(editarAtividadeModel.medicos)) {
      editarAtividadeModel.medicos = [editarAtividadeModel.medicos];
    }

    const edicaoObserver: Observer<EditarAtividadeResponseModel> = {
      next: () =>
        this.notificacaoService.sucesso(
          `O registro "${editarAtividadeModel.tipoAtividade}" foi editado com sucesso!`,
        ),
      error: (err) => this.notificacaoService.erro(err.message),
      complete: () => this.router.navigate(['/atividades']),
    };

    this.atividade$
      .pipe(
        take(1),
        switchMap((atividade) => this.atividadeService.editar(atividade.id, editarAtividadeModel)),
      )
      .subscribe(edicaoObserver);
  }

  private combinarDateTime(date: Date, time: Date): Date {
    if (!date || !time) return date;

    const d = new Date(date);
    const t = new Date(time);

    d.setHours(t.getHours(), t.getMinutes(), t.getSeconds(), t.getMilliseconds());

    return d;
  }
}
