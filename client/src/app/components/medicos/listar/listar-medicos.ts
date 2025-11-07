import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { ListagemMedicosModel } from '../medico.models';
import { MedicoService } from '../medico.service';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-listar-medicos',
  imports: [MatButtonModule, MatIconModule, MatCardModule, RouterLink, AsyncPipe],
  templateUrl: './listar-medicos.html',
})
export class ListarMedicos {
  protected readonly route = inject(ActivatedRoute);
  protected readonly medicoService = inject(MedicoService);

  protected readonly medico$ = this.route.data.pipe(
    filter((data) => data['medicos']),
    map((data) => data['medicos'] as ListagemMedicosModel[]),
  );
}
