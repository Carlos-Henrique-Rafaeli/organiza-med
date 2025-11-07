import { ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';
import { ListarPacientes } from './listar/listar-pacientes';
import { PacienteService } from './paciente.service';
import { inject } from '@angular/core';
import { ListagemPacientesModel } from './paciente.models';
import { CadastrarPaciente } from './cadastrar/cadastrar-paciente';
import { EditarPaciente } from './editar/editar-paciente';

const listagemPacientesResolver: ResolveFn<ListagemPacientesModel[]> = () => {
  const pacienteService = inject(PacienteService);

  return pacienteService.selecionarTodas();
};

const detalhesPacienteResolver = (route: ActivatedRouteSnapshot) => {
  const pacienteService = inject(PacienteService);

  if (!route.paramMap.has('id')) throw new Error('O parâmetro id não foi fornecido.');

  const pacienteId = route.paramMap.get('id')!;

  return pacienteService.selecionarPorId(pacienteId);
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
      {
        path: 'editar/:id',
        component: EditarPaciente,
        resolve: { paciente: detalhesPacienteResolver },
      },
    ],
    providers: [PacienteService],
  },
];
