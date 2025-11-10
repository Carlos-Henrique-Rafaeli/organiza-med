import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { filter, map, tap, shareReplay, Observer, take, switchMap } from 'rxjs';
import { NotificacaoService } from '../../shared/notificacao/notificacao.service';
import { PacienteService } from '../paciente.service';
import {
  DetalhesPacienteModel,
  EditarPacienteModel,
  EditarPacienteResponseModel,
} from '../paciente.models';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-editar-paciente',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    AsyncPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './editar-paciente.html',
})
export class EditarPaciente {
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  protected readonly pacienteService = inject(PacienteService);
  protected readonly notificacaoService = inject(NotificacaoService);

  protected pacienteForm: FormGroup = this.formBuilder.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) 9\d{4}-\d{4}$/)]],
  });

  get nome() {
    return this.pacienteForm.get('nome');
  }

  get cpf() {
    return this.pacienteForm.get('cpf');
  }

  get email() {
    return this.pacienteForm.get('email');
  }

  get telefone() {
    return this.pacienteForm.get('telefone');
  }

  protected readonly paciente$ = this.route.data.pipe(
    filter((data) => data['paciente']),
    map((data) => data['paciente'] as DetalhesPacienteModel),
    tap((paciente) => this.pacienteForm.patchValue(paciente)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  public editar() {
    if (this.pacienteForm.invalid) return;

    const editarPacienteModel: EditarPacienteModel = this.pacienteForm.value;

    const edicaoObserver: Observer<EditarPacienteResponseModel> = {
      next: () =>
        this.notificacaoService.sucesso(
          `O registro "${editarPacienteModel.nome}" foi editado com sucesso!`,
        ),
      error: (err) => {
        const msg =
          err.error?.erros?.[0] || err.error?.message || err.message || 'Erro desconhecido.';

        this.notificacaoService.erro(msg);
      },
      complete: () => this.router.navigate(['/pacientes']),
    };

    this.paciente$
      .pipe(
        take(1),
        switchMap((paciente) => this.pacienteService.editar(paciente.id, editarPacienteModel)),
      )
      .subscribe(edicaoObserver);
  }
}
