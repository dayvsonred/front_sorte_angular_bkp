import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donation-modal',
  templateUrl: './donation-modal.component.html',
  styleUrls: ['./donation-modal.component.css']
})
export class DonationModalComponent {
  donationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DonationModalComponent>,
    private notificationService: NotificationService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { donationId: string, nome_link: string }
  ) {
    this.donationForm = this.fb.group({
      /*amount: ['', [Validators.required, this.minAmountValidator(1)]],*/
      amount: ['', [Validators.required, this.currencyValidator, Validators.maxLength(20)]],
      donorName: [''],
      message: [''],
      cpf: ['', [Validators.required]],
      anonymouse: [false],
    });
  }

  // Validador personalizado para o valor mínimo
  minAmountValidator(min: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null; // Deixa a validação required tratar isso
      }
      const cleanValue = control.value
        .replace('R$', '')
        .replace('.', '')
        .replace(',', '.')
        .trim();
      const numericValue = parseFloat(cleanValue);
      return numericValue >= min ? null : { min: { requiredMin: min, actual: numericValue } };
    };
  }

  submitDonation(): void {
    console.log(this.donationForm)
    if (!this.donationForm.valid) {
      return;
    }

    // Limpar o valor mascarado (remover R$, pontos e vírgulas)
    const rawAmount = this.donationForm.get('amount')?.value
      /*.replace('R$', '')
      .replace('.', '')
      .replace(',', '.')*/
      .trim();

    // Converte o valor monetário antes de enviar
    const rawAmountSend = this.formatCurrencyForBackend(rawAmount);

    // Aqui você pode integrar com seu serviço de backend para processar a doação
    const donationData = {
      donationId: this.data.donationId,
      nome_link: this.data.nome_link,
      amount: parseFloat(rawAmountSend), // Converte para número
      donorName: this.donationForm.get('donorName')?.value,
      message: this.donationForm.get('message')?.value,
      cpf: this.donationForm.get('cpf')?.value,
      anonymouse: this.donationForm.get('anonymouse')?.value,
      date: new Date().toISOString(),
    };

    // Simulação de envio para o backend
    console.log('Dados da doação:', donationData);
    this.notificationService.openSnackBar('Doação realizada com sucesso!');
    this.dialogRef.close(donationData);

    // Fecha o modal e navega para a rota do QR Code com os dados como query params
    this.dialogRef.close();
    this.router.navigate([`/s2/${this.data.nome_link}/qr`], {
      state: { donationData }
    });


  }




  formatCurrencyInput(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove qualquer caractere que não seja número

    if (!value) {
      value = '0';
    }

    // Divide o valor em reais e centavos
    const integerPart = value.slice(0, -2) || '0';
    const decimalPart = value.slice(-2).padStart(2, '0');

    // Adiciona os pontos como separadores de milhar
    let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    if (formattedInteger.length >= 3 && formattedInteger.charAt(0) == "0") {
      formattedInteger = formattedInteger.substring(1);
    }

    const formattedValue = `${formattedInteger},${decimalPart}`;
    input.value = formattedValue;
    this.donationForm.patchValue({ [controlName]: formattedValue });
  }

  currencyValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    // Verifica o formato básico
    if (!/^\d{1,3}(?:\.\d{3})*,\d{2}$/.test(value)) {
      return { invalidFormat: true };
    }

    // Converte para número para validações adicionais
    const numericValue = parseFloat(value.replace(/\./g, '').replace(',', '.'));

    if (numericValue <= 0) {
      return { minValue: true };
    }

    return null;
  }

  // Adicione esta nova função para formatar o valor para o back-end
  private formatCurrencyForBackend(value: string): string {
    if (!value) return '0.00';

    // Remove todos os pontos (separadores de milhar)
    let numericValue = value.replace(/\./g, '');
    // Substitui a vírgula (separador decimal) por ponto
    numericValue = numericValue.replace(',', '.');

    // Garante que tem duas casas decimais
    if (!numericValue.includes('.')) {
      numericValue += '.00';
    }

    return numericValue;
  }



}