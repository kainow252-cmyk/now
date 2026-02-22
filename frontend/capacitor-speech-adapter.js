/**
 * Capacitor Speech Adapter
 * Substitui Web Speech API por plugins nativos do Capacitor
 * 
 * TTS: @capacitor-community/text-to-speech
 * Speech Recognition: @capacitor-community/speech-recognition
 */

import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { Capacitor } from '@capacitor/core';

// ==========================================
// DETECÇÃO DE PLATAFORMA
// ==========================================

export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform(); // 'ios', 'android', 'web'

console.log('🔧 Capacitor Speech Adapter carregado');
console.log('📱 Plataforma:', platform);
console.log('🏠 Ambiente:', isNative ? 'NATIVO (APK)' : 'WEB');

// ==========================================
// TTS NATIVO (Text-To-Speech)
// ==========================================

export class NativeTTS {
    constructor() {
        this.speaking = false;
        this.paused = false;
        this.pending = false;
    }

    // Falar texto usando TTS nativo
    async speak(text, options = {}) {
        console.log('🔊 TTS NATIVO - Falando:', text.substring(0, 50) + '...');
        
        try {
            this.speaking = true;
            this.pending = false;

            await TextToSpeech.speak({
                text: text,
                lang: options.lang || 'pt-BR',
                rate: options.rate || 0.9,
                pitch: options.pitch || 1.2,
                volume: options.volume || 1.0,
                category: 'ambient' // Para Android
            });

            console.log('✅ TTS NATIVO - Fala concluída');
            this.speaking = false;

            // Chamar callback onend se existir
            if (options.onend) {
                options.onend();
            }

        } catch (error) {
            console.error('❌ Erro TTS NATIVO:', error);
            this.speaking = false;
            
            // Chamar callback onerror se existir
            if (options.onerror) {
                options.onerror(error);
            }
        }
    }

    // Cancelar fala atual
    async cancel() {
        try {
            await TextToSpeech.stop();
            this.speaking = false;
            this.paused = false;
            console.log('⏹️ TTS NATIVO - Cancelado');
        } catch (error) {
            console.error('❌ Erro ao cancelar TTS:', error);
        }
    }

    // Pausar (não suportado nativamente, mas mantido para compatibilidade)
    pause() {
        console.warn('⚠️ TTS.pause() não é suportado nativamente no Android');
        this.paused = true;
    }

    // Retomar (não suportado nativamente)
    resume() {
        console.warn('⚠️ TTS.resume() não é suportado nativamente no Android');
        this.paused = false;
    }

    // Obter vozes disponíveis
    async getVoices() {
        try {
            const result = await TextToSpeech.getSupportedVoices();
            console.log('🎙️ Vozes nativas disponíveis:', result.voices.length);
            return result.voices;
        } catch (error) {
            console.error('❌ Erro ao obter vozes:', error);
            return [];
        }
    }
}

// ==========================================
// SPEECH RECOGNITION NATIVO
// ==========================================

export class NativeSpeechRecognition {
    constructor() {
        this.continuous = false;
        this.interimResults = false;
        this.lang = 'pt-BR';
        this.onstart = null;
        this.onend = null;
        this.onresult = null;
        this.onerror = null;
        this.isListening = false;
    }

    // Iniciar reconhecimento
    async start() {
        console.log('🎤 SPEECH RECOGNITION NATIVO - Iniciando...');

        try {
            // Verificar e solicitar permissões
            const hasPermission = await SpeechRecognition.checkPermissions();
            
            if (hasPermission.speechRecognition !== 'granted') {
                console.log('📋 Solicitando permissão de microfone...');
                const permission = await SpeechRecognition.requestPermissions();
                
                if (permission.speechRecognition !== 'granted') {
                    throw new Error('Permissão de microfone negada');
                }
            }

            // Iniciar reconhecimento
            await SpeechRecognition.start({
                language: this.lang,
                maxResults: 1,
                prompt: 'Pode falar...',
                partialResults: this.interimResults,
                popup: false // Não mostrar popup nativo do Android
            });

            this.isListening = true;

            if (this.onstart) {
                this.onstart();
            }

            console.log('✅ SPEECH RECOGNITION NATIVO - Ativo');

            // Listener para resultados
            await SpeechRecognition.addListener('partialResults', (data) => {
                if (this.onresult && data.matches && data.matches.length > 0) {
                    const transcript = data.matches[0];
                    
                    // Simular evento de resultado do Web Speech API
                    const event = {
                        results: [[{
                            transcript: transcript,
                            confidence: 0.9
                        }]],
                        resultIndex: 0
                    };

                    this.onresult(event);
                }
            });

        } catch (error) {
            console.error('❌ Erro SPEECH RECOGNITION NATIVO:', error);
            this.isListening = false;

            if (this.onerror) {
                this.onerror({
                    error: error.message || 'unknown',
                    message: error.message
                });
            }
        }
    }

    // Parar reconhecimento
    async stop() {
        console.log('⏹️ SPEECH RECOGNITION NATIVO - Parando...');

        try {
            await SpeechRecognition.stop();
            this.isListening = false;

            if (this.onend) {
                this.onend();
            }

            console.log('✅ SPEECH RECOGNITION NATIVO - Parado');

        } catch (error) {
            console.error('❌ Erro ao parar reconhecimento:', error);
        }
    }

    // Verificar se há suporte
    static async isAvailable() {
        try {
            const result = await SpeechRecognition.available();
            return result.available;
        } catch (error) {
            return false;
        }
    }
}

// ==========================================
// FACTORY: Retorna API nativa ou Web
// ==========================================

export function getSpeechSynthesis() {
    if (isNative) {
        console.log('✅ Usando TTS NATIVO (Capacitor)');
        return new NativeTTS();
    } else {
        console.log('✅ Usando TTS WEB (speechSynthesis)');
        return window.speechSynthesis;
    }
}

export function getSpeechRecognition() {
    if (isNative) {
        console.log('✅ Usando SPEECH RECOGNITION NATIVO (Capacitor)');
        return new NativeSpeechRecognition();
    } else {
        console.log('✅ Usando SPEECH RECOGNITION WEB (webkitSpeechRecognition)');
        return new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    }
}

// ==========================================
// HELPER: Falar texto (compatível com ambos)
// ==========================================

export async function speak(text, options = {}) {
    const synthesis = getSpeechSynthesis();

    if (isNative) {
        // Usar TTS nativo
        await synthesis.speak(text, options);
    } else {
        // Usar Web Speech API
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = options.lang || 'pt-BR';
        utterance.rate = options.rate || 0.9;
        utterance.pitch = options.pitch || 1.2;
        utterance.volume = options.volume || 1.0;

        if (options.onend) utterance.onend = options.onend;
        if (options.onerror) utterance.onerror = options.onerror;

        synthesis.speak(utterance);
    }
}

// ==========================================
// EXPORT DEFAULT
// ==========================================

export default {
    isNative,
    platform,
    getSpeechSynthesis,
    getSpeechRecognition,
    speak,
    NativeTTS,
    NativeSpeechRecognition
};
