import { NgxLoggerLevel } from 'ngx-logger';

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  logLevel: NgxLoggerLevel.TRACE,
  serverLogLevel: NgxLoggerLevel.OFF,
  authorization: `/oauth/oauth/token`,
  login: `/login`,
	link_creat_login: `/core/login`,
	link_creat_valid_email: `/core/valid/email`,
  link_donation_creat: `/donation`,
	urlBase: `http://localhost:8798`,
  nomeProjetoTitulo: `Recompesa da sorte`,
  labels: {
    menu: {
      dashboard : "Dashboard",
      lista_doacao : "Lista Doações",
      cria : "Cria Doação",
      perfil : "perfil",
      sair : "sair",
    }
  }
};
