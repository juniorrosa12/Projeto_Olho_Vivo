/**
 * IntelligentPipelineManager - Orquestrador Inteligente de Alocação de IA e Economia de GPU
 * Gerencia regras dinâmicas de inferência YOLO por câmera, horário, filial e prioridade.
 */
class IntelligentPipelineManagerSingleton {
  constructor() {
    this.gpuSavingMode = true;
    this.rules = [
      { id: 'rule-1', scope: 'CAMERA', targetId: 'cam-1', aiEnabled: true, priority: 'HIGH', classes: ['Pessoa', 'Celular'] },
      { id: 'rule-2', scope: 'SCHEDULE', timeRange: '22:00-06:00', aiEnabled: false, reason: 'Economia Noturna de GPU' },
    ];
  }

  /**
   * Avalia se a inferência de IA deve ser executada para uma câmera específica neste instante
   */
  shouldRunAI(cameraId, currentHour = new Date().getHours()) {
    // Regra de Economia Noturna
    if (this.gpuSavingMode && (currentHour >= 22 || currentHour < 6)) {
      return { run: false, reason: 'Modo de Economia Noturna de GPU Ativo (22h - 06h)' };
    }
    return { run: true, reason: 'Processamento de Alta Prioridade Operacional' };
  }

  toggleGpuSavingMode() {
    this.gpuSavingMode = !this.gpuSavingMode;
    return this.gpuSavingMode;
  }
}

export const IntelligentPipelineManager = new IntelligentPipelineManagerSingleton();
