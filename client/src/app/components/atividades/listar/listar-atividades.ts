import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs';
import { ListagemAtividadesModel } from '../atividade.models';
import { AtividadeService } from '../atividade.service';

@Component({
  selector: 'app-listar-atividades',
  imports: [MatButtonModule, MatIconModule, MatCardModule, RouterLink, AsyncPipe],
  templateUrl: './listar-atividades.html',
})
export class ListarAtividades {
  protected readonly route = inject(ActivatedRoute);
  protected readonly atividadeService = inject(AtividadeService);

  protected readonly atividade$ = this.route.data.pipe(
    filter((data) => data['atividades']),
    map((data) => data['atividades'] as ListagemAtividadesModel[]),
  );
}
