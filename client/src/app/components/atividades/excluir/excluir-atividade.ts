import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { filter, map, shareReplay, Observer, take, switchMap } from 'rxjs';
import { NotificacaoService } from '../../shared/notificacao/notificacao.service';
import { DetalhesAtividadeModel } from '../atividade.models';
import { AtividadeService } from '../atividade.service';

@Component({
  selector: 'app-excluir-atividade',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    AsyncPipe,
    FormsModule,
  ],
  templateUrl: './excluir-atividade.html',
})
export class ExcluirAtividade {
  protected readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  protected readonly atividadeService = inject(AtividadeService);
  protected readonly notificacaoService = inject(NotificacaoService);

  protected readonly atividade$ = this.route.data.pipe(
    filter((data) => data['atividade']),
    map((data) => data['atividade'] as DetalhesAtividadeModel),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  public excluir() {
    const exclusaoObserver: Observer<null> = {
      next: () => this.notificacaoService.sucesso(`O registro foi excluído com sucesso!`),
      error: (err) => this.notificacaoService.erro(err.message),
      complete: () => this.router.navigate(['/atividades']),
    };

    this.atividade$
      .pipe(
        take(1),
        switchMap((atividade) => this.atividadeService.excluir(atividade.id)),
      )
      .subscribe(exclusaoObserver);
  }
}
