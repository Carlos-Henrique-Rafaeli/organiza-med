import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { ListagemAtividadesModel } from './atividade.models';
import { AtividadeService } from './atividade.service';
import { ListarAtividades } from './listar/listar-atividades';

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

export const atividadeRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ListarAtividades,
        resolve: { atividades: listagemAtividadesResolver },
      },
      // { path: 'cadastrar', component: CadastrarAtividade },
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
    providers: [AtividadeService],
  },
];
