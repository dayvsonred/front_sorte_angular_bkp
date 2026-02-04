import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { environment } from '../../../../environments/environment';
import { DonationModalComponent } from '../payment/donation-modal.component';
import { DialogSimpleMessageComponent } from '../dialog-simple-message/dialog-simple-message.component';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {
  donation: any = null;
  mensagens: any[] = [];
  totalMensagensValor: any = 0;
  pixTotais: { valor_total: string; total_doadores: number } | null = null;
  total_doadores: any = 0;
  valor_total: any = 0;
  alcancado = 0;
  Logado = false;
  usuario = { name: "", email: "", date_create: "" }
  profileImageUrl = "";


  constructor(
    private router: Router,
    private titleService: Title,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    const queryParams = this.route.snapshot.queryParams;
    if (queryParams['firstTime'] === 'true') {
      this.showWelcomeDialog();
    }

    let logado = this.globalService.getCurrentUser();
    if (logado != null) {
      this.Logado = true;
    }

    const nomeLink = this.route.snapshot.paramMap.get('id');
    if (nomeLink) {
      this.fetchDonation(nomeLink);

    }
  }

  fetchDonation(nomeLink: string): void {
    this.globalService.getDonationByLink(nomeLink)
      .subscribe({
        next: (response) => {
          this.donation = response;
          console.log('Doação recebida:', this.donation);
          this.showMensagens();
          this.loadPixTotais();
          this.fetchUser(this.donation.id_user);
          this.getIMGPerfil(this.donation.id_user);
        },
        error: (error) => {
          console.error('Erro ao buscar doação:', error);
        }
      });
  }

  openDonationModal(): void {
    const dialogRef = this.dialog.open(DonationModalComponent, {
      width: '80%',
      maxWidth: '500px',
      data: { donationId: this.donation.id, nome_link: this.donation.nome_link }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aqui você pode atualizar a doação com os novos dados
        console.log('Doação confirmada:', result);
      }
    });
  }

  getImageUrl(imagePath: string): string {
    return imagePath;
    return 'https://www.abacuskids.com/wp-content/uploads/2016/12/Slider3.png';
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${environment.urlBase}/images/${imagePath}`;
  }

  /*calculateProgress(): number {
    if (!this.donation || !this.donation.valor || !this.donation.valor_arrecadado) {
      return 0;
    }
    return Math.min((this.donation.valor_arrecadado / this.donation.valor) * 100, 100);
  }*/

  calculateDaysAgo(date: string): number {
    const donationDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - donationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  resetPassword() {
    this.router.navigate(['/auth/reset-request']);
  }

  createUser() {
    this.router.navigate(['/auth/new-user']);
  }

  showMensagens() {

    this.donationOpen(this.donation.id);
    this.globalService.getDonationMensagens(this.donation.id).subscribe({
      next: (mensagens) => {
        this.mensagens = mensagens;
        console.log('Mensagens recebidas:', mensagens);

        // Soma dos valores (convertendo de string para número)
        /*this.totalMensagensValor = mensagens.reduce((total, m) => {
          const valorNumerico = parseFloat(m.valor);
          return total + (isNaN(valorNumerico) ? 0 : valorNumerico);
        }, 0);*/

        console.log('Mensagens recebidas:', mensagens);
        console.log('Total arrecadado nas mensagens:', this.totalMensagensValor);
      },
      error: (err) => {
        this.notificationService.openSnackBar(err);
      }
    });
  }

  loadPixTotais(): void {
    this.globalService.getPixTotais(this.donation.id).subscribe({
      next: (data) => {
        this.pixTotais = data;
        console.log('Totais:', data);
        this.totalMensagensValor = data.valor_total;
        this.valor_total = data.valor_total;
        this.total_doadores = data.total_doadores;
      },
      error: (err) => {
        this.notificationService.openSnackBar(err);
      }
    });
  }

  calculateProgress() {

    let pt1 = this.donation.valor / this.valor_total
    this.alcancado = 100 / pt1
    return this.alcancado;
  }



  donationOpen(id_doacao: string) {
    this.globalService.sendDonationVisualization({
      id_doacao: id_doacao,
      id_user: "",
      visuaization: true,
      donation_like: false,
      love: false,
      shared: false,
      acesse_donation: true,
      create_pix: false,
      create_cartao: false,
      create_paypal: false,
      create_google: false,
      create_pag1: false,
      create_pag2: false,
      create_pag3: true,
      idioma: 'pt-BR',
      tema: 'normal',
      form: 'desktop',
      google: 'false',
      google_maps: 'false',
      google_ads: 'false',
      meta_pixel: 'false',
      Cookies_Stripe: 'false',
      Cookies_PayPal: 'false',
      visitor_info1_live: 'false'
    }).subscribe({
      next: (res) => {
        console.log('Visualização enviada com sucesso');
      },
      error: (err) => {
        console.error('Erro:', err);
      }
    });

  }

  fetchUser(userId: string): void {
    this.globalService.getUserById(userId).subscribe({
      next: (response) => {
        this.usuario = response;
        console.log('Usuário recebido:', response);

        // Atualiza a data no formato "Usuário ativo desde mês/ano"
        this.usuario.date_create = this.formatDateCreate(response.date_create);
      },
      error: (error) => {
        console.error('Erro ao buscar usuário:', error);
      }
    });
  }

  formatDateCreate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    const formatted = date.toLocaleDateString('pt-BR', options);
    return `Usuário ativo desde ${formatted}`;
  }

  getIMGPerfil(id_user: string) {
    this.globalService.getUserProfileImage(id_user).subscribe({
      next: (url) => {
        this.profileImageUrl = url || 'assets/default-user.png';
      },
      error: (err) => {
        this.notificationService.openSnackBar(err);
      }
    });

  }

  showWelcomeDialog(): void {
    const tree = this.router.parseUrl(this.router.url);
    const baseUrl = window.location.origin + window.location.pathname;

    this.dialog.open(DialogSimpleMessageComponent, {
      width: '500px',
      data: {
        title: 'Bem-vindo!',
        message: `✔️ Este é seu link para compartilhar sua campanha: <a href="${baseUrl}" target="_blank" rel="noopener noreferrer">${baseUrl}</a>
      
✔️ Você pode acessar o site com o email e senha cadastrados.

✔️ O sistema tem um processo automático para transferir os valores doados. Um e-mail com instruções foi enviado para você.`
      }
    });
  }

}