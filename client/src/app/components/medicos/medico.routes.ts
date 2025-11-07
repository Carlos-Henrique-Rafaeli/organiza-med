import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { ListarMedicos } from './listar/listar-medicos';
import { ListagemMedicosModel } from './medico.models';
import { MedicoService } from './medico.service';
import { CadastrarMedico } from './cadastrar/cadastrar-medico';

const listagemMedicosResolver: ResolveFn<ListagemMedicosModel[]> = () => {
  const medicoService = inject(MedicoService);

  return medicoService.selecionarTodas();
};

const detalhesMedicoResolver = (route: ActivatedRouteSnapshot) => {
  const medicoService = inject(MedicoService);

  if (!route.paramMap.has('id')) throw new Error('O parâmetro id não foi fornecido.');

  const medicoId = route.paramMap.get('id')!;

  return medicoService.selecionarPorId(medicoId);
};

export const medicoRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ListarMedicos,
        resolve: { medicos: listagemMedicosResolver },
      },
      { path: 'cadastrar', component: CadastrarMedico },
      //{
      //path: 'editar/:id',
      //  component: EditarMedico,
      //  resolve: { medico: detalhesMedicoResolver },
      //},
      //{
      //  path: 'excluir/:id',
      //  component: ExcluirMedico,
      //  resolve: { medico: detalhesMedicoResolver },
      //},
    ],
    providers: [MedicoService],
  },
];
