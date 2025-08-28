import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private messageService: MessageService) {}

  /**
   * Muestra un toast de éxito
   * @param summary Título breve del mensaje
   * @param detail Descripción detallada
   * @param life Duración en ms (default 3000)
   */
  success(summary: string, detail: string, life: number = 3000): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life
    });
  }

  info(summary: string, detail: string, life: number = 3000): void {
    this.messageService.add({
      severity: 'info',
      summary,
      detail,
      life
    });
  }

  warn(summary: string, detail: string, life: number = 3000): void {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail,
      life
    });
  }

  error(summary: string, detail: string, life: number = 3000): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life
    });
  }

  multiple(messages: { severity: string; summary: string; detail: string; life?: number }[]): void {
    this.messageService.addAll(messages);
  }

  clear(): void {
    this.messageService.clear();
  }
  
}
