import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  production: true,
  logLevel: NgxLoggerLevel.OFF,
  serverLogLevel: NgxLoggerLevel.ERROR,
  authorization: `/oauth/oauth/token`,
  login: `/login`,
  link_creat_login: `/core/login`,
  link_creat_valid_email: `/core/valid/email`,
  link_donation_creat: `/donation`,
  urlBase: `https://rm0t2sapef.execute-api.us-east-1.amazonaws.com`,
  nomeProjetoTitulo: `Recompesa da sorte`
};
