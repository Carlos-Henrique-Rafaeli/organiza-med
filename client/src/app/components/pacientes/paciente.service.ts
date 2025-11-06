import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { map, Observable, tap } from 'rxjs';
import {
  CadastrarPacienteModel,
  CadastrarPacienteResponseModel,
  ListagemPacientesModel,
  ListagemPacientesApiResponse,
} from './paciente.models';

@Injectable()
export class PacienteService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl + '/api/pacientes';

  public cadastrar(
    categoriaModel: CadastrarPacienteModel,
  ): Observable<CadastrarPacienteResponseModel> {
    return this.http.post<CadastrarPacienteResponseModel>(this.apiUrl, categoriaModel);
  }

  public selecionarTodas(): Observable<ListagemPacientesModel[]> {
    return this.http.get<ListagemPacientesApiResponse>(this.apiUrl).pipe(
      tap((res) => console.log('Resposta bruta da API:', res)),
      map((res) => res.dados.registros),
      tap((registros) => console.log('Registros mapeados:', registros)),
    );
  }
}
