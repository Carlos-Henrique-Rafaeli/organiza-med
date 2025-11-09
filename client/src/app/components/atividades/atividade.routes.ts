import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { ListagemAtividadesModel } from './atividade.models';
import { AtividadeService } from './atividade.service';
import { ListarAtividades } from './listar/listar-atividades';
import { CadastrarAtividade } from './cadastrar/cadastrar-atividade';
import { PacienteService } from '../pacientes/paciente.service';
import { MedicoService } from '../medicos/medico.service';
import { ListagemPacientesModel } from '../pacientes/paciente.models';
import { ListagemMedicosModel } from '../medicos/medico.models';

const listagemAtividadesResolver: ResolveFn<ListagemAtividadesModel[]> = () => {
  const atividadeService = inject(AtividadeService);

  return atividadeService.selecionarTodas();
};

// const detalhesAtividadeResolver = (route: ActivatedRouteSnapshot) => {
//   const atividadeService = inject(AtividadeService);

//   if (!route.paramMap.has('id')) throw new Error('O parâmetro id não foi fornecido.');

//   const atividadeId = route.paramMap.get('id')!;

//   return atividadeService.selecionarPorId(atividadeId);
// };

const listagemPacientesResolver: ResolveFn<ListagemPacientesModel[]> = () => {
  const pacienteService = inject(PacienteService);

  return pacienteService.selecionarTodas();
};

const listagemMedicosResolver: ResolveFn<ListagemMedicosModel[]> = () => {
  const medicoService = inject(MedicoService);

  return medicoService.selecionarTodas();
};

export const atividadeRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ListarAtividades,
        resolve: { atividades: listagemAtividadesResolver },
      },
      {
        path: 'cadastrar',
        component: CadastrarAtividade,
        resolve: { pacientes: listagemPacientesResolver, medicos: listagemMedicosResolver },
      },
      // {
      //   path: 'editar/:id',
      //   component: EditarAtividade,
      //   resolve: { atividade: detalhesAtividadeResolver },
      // },
      // {
      //   path: 'excluir/:id',
      //   component: ExcluirAtividade,
      //   resolve: { atividade: detalhesAtividadeResolver },
      // },
    ],
    providers: [AtividadeService, PacienteService, MedicoService],
  },
];
