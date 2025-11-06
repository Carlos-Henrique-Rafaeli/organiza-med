import { ResolveFn, Routes } from '@angular/router';
import { ListarPacientes } from './listar/listar-pacientes';
import { PacienteService } from './paciente.service';
import { inject } from '@angular/core';
import { ListagemPacientesModel } from './paciente.models';
import { CadastrarPaciente } from './cadastrar/cadastrar-paciente';

const listagemPacientesResolver: ResolveFn<ListagemPacientesModel[]> = () => {
  const pacienteService = inject(PacienteService);

  return pacienteService.selecionarTodas();
};

export const pacienteRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ListarPacientes,
        resolve: { pacientes: listagemPacientesResolver },
      },
      { path: 'cadastrar', component: CadastrarPaciente },
    ],
    providers: [PacienteService],
  },
];
