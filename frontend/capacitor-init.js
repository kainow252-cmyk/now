/**
 * Inicialização do Capacitor
 * Detecta se está rodando em ambiente nativo e carrega plugins apropriados
 */

// Detectar plataforma
const isCapacitor = window.Capacitor !== undefined;
const platform = isCapacitor ? window.Capacitor.getPlatform() : 'web';
const isNative = isCapacitor && window.Capacitor.isNativePlatform();

console.log('🔧 Capacitor Init');
console.log('📱 Plataforma:', platform);
console.log('🏠 Ambiente:', isNative ? 'NATIVO (APK)' : 'WEB (Navegador)');

// Função para criar TTS compatível
function createCompatibleTTS() {
    if (isNative && window.CapacitorTextToSpeech) {
        console.log('✅ Usando TTS NATIVO (Capacitor)');
        return {
            isNative: true,
            speak: async function(text, options = {}) {
                console.log('🔊 TTS NATIVO - Falando:', text.substring(0, 50) + '...');
                
                try {
                    await window.CapacitorTextToSpeech.speak({
                        value: text,
                        language: options.lang || 'pt-BR',
                        rate: options.rate || 0.9,
                        pitch: options.pitch || 1.2,
                        volume: options.volume || 1.0,
                        category: 'ambient'
                    });

                    console.log('✅ TTS NATIVO - Concluído');
                    
                    if (options.onend) {
                        options.onend();
                    }
                } catch (error) {
                    console.error('❌ Erro TTS NATIVO:', error);
                    if (options.onerror) {
                        options.onerror(error);
                    }
                }
            },
            cancel: async function() {
                try {
                    await window.CapacitorTextToSpeech.stop();
                    console.log('⏹️ TTS NATIVO - Cancelado');
                } catch (error) {
                    console.error('❌ Erro ao cancelar TTS:', error);
                }
            },
            resume: function() {
                console.warn('⚠️ TTS.resume() não suportado nativamente');
            },
            speaking: false,
            pending: false,
            paused: false
        };
    } else {
        console.log('✅ Usando TTS WEB (speechSynthesis)');
        return window.speechSynthesis;
    }
}

// Função para criar Speech Recognition compatível
function createCompatibleRecognition() {
    if (isNative && window.CapacitorSpeechRecognition) {
        console.log('✅ Usando SPEECH RECOGNITION NATIVO (Capacitor)');
        
        return {
            isNative: true,
            continuous: false,
            interimResults: false,
            lang: 'pt-BR',
            onstart: null,
            onend: null,
            onresult: null,
            onerror: null,
            isListening: false,
            
            start: async function() {
                console.log('🎤 SPEECH RECOGNITION NATIVO - Iniciando...');
                
                try {
                    // Verificar permissões
                    const hasPermission = await window.CapacitorSpeechRecognition.checkPermissions();
                    
                    if (hasPermission.speechRecognition !== 'granted') {
                        const permission = await window.CapacitorSpeechRecognition.requestPermissions();
                        
                        if (permission.speechRecognition !== 'granted') {
                            throw new Error('Permissão de microfone negada');
                        }
                    }

                    // Iniciar
                    const result = await window.CapacitorSpeechRecognition.start({
                        language: this.lang,
                        maxResults: 1,
                        prompt: 'Pode falar...',
                        partialResults: this.interimResults,
                        popup: false
                    });

                    this.isListening = true;

                    if (this.onstart) {
                        this.onstart();
                    }

                    console.log('✅ SPEECH RECOGNITION NATIVO - Ativo');

                    // Processar resultado
                    if (result.matches && result.matches.length > 0) {
                        const transcript = result.matches[0];
                        
                        if (this.onresult) {
                            const event = {
                                results: [[{
                                    transcript: transcript,
                                    confidence: 0.9,
                                    isFinal: true
                                }]],
                                resultIndex: 0
                            };

                            this.onresult(event);
                        }
                    }

                    // Em modo contínuo, reiniciar
                    if (this.continuous && this.isListening) {
                        setTimeout(() => {
                            if (this.isListening) {
                                this.start();
                            }
                        }, 500);
                    }

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
            },
            
            stop: async function() {
                console.log('⏹️ SPEECH RECOGNITION NATIVO - Parando...');
                
                try {
                    await window.CapacitorSpeechRecognition.stop();
                    this.isListening = false;

                    if (this.onend) {
                        this.onend();
                    }

                    console.log('✅ SPEECH RECOGNITION NATIVO - Parado');
                } catch (error) {
                    console.error('❌ Erro ao parar reconhecimento:', error);
                }
            }
        };
    } else {
        console.log('✅ Usando SPEECH RECOGNITION WEB (webkitSpeechRecognition)');
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        return new SpeechRecognition();
    }
}

// Exportar para uso global
window.CapacitorHelper = {
    isNative,
    platform,
    isCapacitor,
    createCompatibleTTS,
    createCompatibleRecognition
};

console.log('✅ Capacitor Init - Pronto!');
