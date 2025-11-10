import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { filter, map, Observer } from 'rxjs';
import { NotificacaoService } from '../../shared/notificacao/notificacao.service';
import { CadastrarAtividadeModel, CadastrarAtividadeResponseModel } from '../atividade.models';
import { AtividadeService } from '../atividade.service';
import { ListagemPacientesModel } from '../../pacientes/paciente.models';
import { ListagemMedicosModel } from '../../medicos/medico.models';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { AsyncPipe } from '@angular/common';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-cadastrar-atividade',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatNativeDateModule,
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    MatListModule,
    AsyncPipe,
  ],
  templateUrl: './cadastrar-atividade.html',
})
export class CadastrarAtividade {
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

  protected readonly tipos = ['Consulta', 'Cirurgia'];

  public cadastrar() {
    if (this.atividadeForm.invalid) return;

    const formValue = this.atividadeForm.value;

    const atividadeModel: CadastrarAtividadeModel = formValue;
    console.log(formValue);

    atividadeModel.inicio = this.combinarDateTime(formValue.inicio, formValue.inicioHora);
    atividadeModel.termino = this.combinarDateTime(formValue.termino, formValue.terminoHora);

    if (!Array.isArray(atividadeModel.medicos)) {
      atividadeModel.medicos = [atividadeModel.medicos];
    }

    const cadastroObserver: Observer<CadastrarAtividadeResponseModel> = {
      next: () =>
        this.notificacaoService.sucesso(
          `O registro "${atividadeModel.tipoAtividade}" foi cadastrado com sucesso!`,
        ),
      error: (err) => {
        const msg =
          err.error?.erros?.[0] || err.error?.message || err.message || 'Erro desconhecido.';

        this.notificacaoService.erro(msg);
      },
      complete: () => this.router.navigate(['/atividades']),
    };

    this.atividadeService.cadastrar(atividadeModel).subscribe(cadastroObserver);
  }

  private combinarDateTime(date: Date, time: Date): Date {
    if (!date || !time) return date;

    const d = new Date(date);
    const t = new Date(time);

    d.setHours(t.getHours(), t.getMinutes(), t.getSeconds(), t.getMilliseconds());

    return d;
  }
}
