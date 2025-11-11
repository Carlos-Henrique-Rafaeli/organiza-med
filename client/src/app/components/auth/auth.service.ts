import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  defer,
  of,
  merge,
  skip,
  distinctUntilChanged,
  tap,
  shareReplay,
  Observable,
  map,
} from 'rxjs';
import { AccessTokenModel, RegistroModel, LoginModel } from './auth.models';
import { environment } from '../../../environments/environment';
import { obterOpcoesHeaderAutorizacao } from '../../util/obter-opcoes-header-autorizacao';

@Injectable()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/api/auth';
  private readonly chaveAccessToken: string = 'organizamed:access-token';

  public readonly accessTokenSubject$ = new BehaviorSubject<AccessTokenModel | undefined>(
    undefined,
  );

  public readonly accessTokenArmazenado$ = defer(() => {
    const accessToken = this.obterAccessToken();

    if (!accessToken) return of(undefined);

    const valido = new Date(accessToken.dataExpiracao) > new Date();

    if (!valido) return of(undefined);

    return of(accessToken);
  });

  public readonly accessToken$ = merge(
    this.accessTokenArmazenado$,
    this.accessTokenSubject$.pipe(skip(1)),
  ).pipe(
    distinctUntilChanged((a, b) => a === b),
    tap((accessToken) => {
      if (accessToken) this.salvarAccessToken(accessToken);
      else this.limparAccessToken();

      this.accessTokenSubject$.next(accessToken);
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  public registro(registroModel: RegistroModel): Observable<AccessTokenModel> {
    const urlCompleto = `${this.apiUrl}/registrar`;

    return this.http
      .post<{ sucesso: boolean; dados: AccessTokenModel }>(urlCompleto, registroModel)
      .pipe(
        map((res) => res.dados),
        tap((token) => this.accessTokenSubject$.next(token)),
      );
  }

  public login(loginModel: LoginModel): Observable<AccessTokenModel> {
    const urlCompleto = `${this.apiUrl}/autenticar`;

    return this.http
      .post<{ sucesso: boolean; dados: AccessTokenModel }>(urlCompleto, loginModel)
      .pipe(
        map((res) => res.dados),
        tap((token) => this.accessTokenSubject$.next(token)),
      );
  }

  public sair(): Observable<null> {
    const urlCompleto = `${this.apiUrl}/sair`;

    return this.http
      .post<null>(
        urlCompleto,
        {},
        obterOpcoesHeaderAutorizacao(this.accessTokenSubject$.getValue()),
      )
      .pipe(tap(() => this.accessTokenSubject$.next(undefined)));
  }

  private salvarAccessToken(token: AccessTokenModel): void {
    const jsonString = JSON.stringify(token);

    localStorage.setItem(this.chaveAccessToken, jsonString);
  }

  private limparAccessToken(): void {
    localStorage.removeItem(this.chaveAccessToken);
  }

  private obterAccessToken(): AccessTokenModel | undefined {
    const jsonString = localStorage.getItem(this.chaveAccessToken);

    if (!jsonString) return undefined;

    return JSON.parse(jsonString);
  }
}
