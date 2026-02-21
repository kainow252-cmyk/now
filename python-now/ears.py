"""
NOW - Ears Module (Speech-to-Text)
Responsible for listening to user commands and converting speech to text
"""

import speech_recognition as sr
import os

class Ears:
    def __init__(self, use_whisper=False):
        """
        Initialize the Ears module
        
        Args:
            use_whisper (bool): Use OpenAI Whisper for better accuracy (requires API key)
        """
        self.recognizer = sr.Recognizer()
        self.mic = sr.Microphone()
        self.use_whisper = use_whisper
        
        # Adjust for ambient noise on initialization
        print("🎤 Calibrando microfone...")
        with self.mic as source:
            self.recognizer.adjust_for_ambient_noise(source, duration=1)
        print("✅ Microfone calibrado!")
        
    def listen(self):
        """
        Listen for user speech and convert to text
        
        Returns:
            str: Transcribed text or None if failed
        """
        try:
            with self.mic as source:
                print("🎤 NOW ouvindo...")
                audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=10)
                
            # Choose recognition method
            if self.use_whisper:
                text = self._listen_whisper(audio)
            else:
                text = self._listen_google(audio)
                
            if text:
                print(f"👤 Você disse: {text}")
            return text
            
        except sr.WaitTimeoutError:
            print("⏱️ Timeout: nenhum comando detectado")
            return None
        except Exception as e:
            print(f"❌ Erro ao ouvir: {e}")
            return None
            
    def _listen_google(self, audio):
        """
        Use Google Speech Recognition (free, requires internet)
        
        Args:
            audio: Audio data from microphone
            
        Returns:
            str: Transcribed text
        """
        try:
            text = self.recognizer.recognize_google(audio, language='pt-BR')
            return text
        except sr.UnknownValueError:
            print("❌ Não consegui entender o áudio")
            return None
        except sr.RequestError as e:
            print(f"❌ Erro no serviço Google: {e}")
            return None
            
    def _listen_whisper(self, audio):
        """
        Use OpenAI Whisper (better quality, requires API key and internet)
        
        Args:
            audio: Audio data from microphone
            
        Returns:
            str: Transcribed text
        """
        try:
            import openai
            
            # Save audio to temporary file
            with open("temp_audio.wav", "wb") as f:
                f.write(audio.get_wav_data())
                
            # Transcribe with Whisper
            with open("temp_audio.wav", "rb") as audio_file:
                transcript = openai.Audio.transcribe(
                    model="whisper-1",
                    file=audio_file,
                    language="pt"
                )
                
            # Clean up temp file
            os.remove("temp_audio.wav")
            
            return transcript['text']
            
        except Exception as e:
            print(f"❌ Erro Whisper: {e}")
            # Fallback to Google
            return self._listen_google(audio)
            
    def listen_continuously(self, callback):
        """
        Listen continuously and call callback for each transcription
        
        Args:
            callback: Function to call with transcribed text
        """
        print("🎤 Modo de escuta contínua ativado...")
        
        with self.mic as source:
            while True:
                try:
                    print("🎤 Ouvindo...")
                    audio = self.recognizer.listen(source, timeout=None, phrase_time_limit=10)
                    
                    if self.use_whisper:
                        text = self._listen_whisper(audio)
                    else:
                        text = self._listen_google(audio)
                        
                    if text:
                        print(f"👤 Você disse: {text}")
                        callback(text)
                        
                except KeyboardInterrupt:
                    print("\n⏹️ Escuta interrompida")
                    break
                except Exception as e:
                    print(f"❌ Erro: {e}")
                    continue

# Test the module
if __name__ == "__main__":
    print("=== Testando módulo Ears ===\n")
    
    # Create ears instance
    ears = Ears(use_whisper=False)  # Change to True to use Whisper
    
    # Test single listen
    print("\nDiga algo:")
    result = ears.listen()
    
    if result:
        print(f"\n✅ Sucesso! Você disse: '{result}'")
    else:
        print("\n❌ Não consegui ouvir nada")
