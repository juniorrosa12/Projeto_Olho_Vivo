import { EventEngine } from './EventEngine';

/**
 * AlertEngine - Mecanismo de Regras de Alerta Multicanal
 * Dispara Telegram, WhatsApp, E-mail, Webhook e Sirene com base nos eventos do sistema.
 */
class AlertEngineSingleton {
  constructor() {
    this.rules = [
      {
        id: 'rule-cellphone',
        name: 'Uso de Celular no Caixa',
        triggerEvent: 'CELLPHONE_DETECTED',
        condition: (payload) => payload.confidence > 0.75,
        channels: ['DASHBOARD', 'TELEGRAM', 'WHATSAPP', 'WEBHOOK'],
        active: true,
      },
      {
        id: 'rule-dwell',
        name: 'Permanência Prolongada na Seção',
        triggerEvent: 'LONG_DWELL_TIME',
        condition: (payload) => payload.dwellMinutes >= 5,
        channels: ['DASHBOARD', 'EMAIL', 'SIRENE'],
        active: true,
      },
    ];

    // Escuta todos os eventos do barramento
    EventEngine.subscribe('*', (evt) => this.evaluateEvent(evt));
  }

  evaluateEvent(eventObj) {
    this.rules.forEach((rule) => {
      if (rule.active && rule.triggerEvent === eventObj.type && rule.condition(eventObj.payload)) {
        this.dispatchAlert(rule, eventObj);
      }
    });
  }

  dispatchAlert(rule, eventObj) {
    rule.channels.forEach((channel) => {
      // Disparo simulado por canal
      console.log(`[ALERT DISPATCH] Canal: ${channel} | Regra: ${rule.name} | Evento: ${eventObj.id}`);
    });
  }
}

export const AlertEngine = new AlertEngineSingleton();
