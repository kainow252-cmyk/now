// Serviço de Autenticação por Voz - NOW AI
// Verifica se a voz corresponde ao perfil do dono

class VoiceAuthService {
  constructor() {
    this.profiles = new Map(); // userId -> voiceProfile
    this.authThreshold = 0.7; // 70% de similaridade mínima
  }

  /**
   * Registra um novo perfil de voz
   */
  registerProfile(userId, samples) {
    const profile = {
      userId,
      samples: samples.map(s => s.features),
      avgEnergy: this.calculateAverage(samples, 'energy'),
      avgPitch: this.calculateAverage(samples, 'pitch'),
      createdAt: Date.now(),
      totalSamples: samples.length
    };

    this.profiles.set(userId, profile);
    
    console.log(`✅ Perfil de voz registrado para ${userId}`);
    console.log(`   - Energia média: ${profile.avgEnergy.toFixed(4)}`);
    console.log(`   - Pitch médio: ${profile.avgPitch.toFixed(2)} Hz`);
    
    return {
      success: true,
      userId,
      profile: {
        avgEnergy: profile.avgEnergy,
        avgPitch: profile.avgPitch,
        samples: profile.totalSamples
      }
    };
  }

  /**
   * Autentica uma voz contra o perfil registrado
   */
  authenticate(userId, audioFeatures) {
    const profile = this.profiles.get(userId);
    
    if (!profile) {
      console.log(`⚠️  Perfil não encontrado para ${userId}`);
      return {
        success: false,
        authenticated: false,
        confidence: 0,
        reason: 'no-profile'
      };
    }

    // Calcula similaridade
    const similarity = this.calculateSimilarity(profile, audioFeatures);
    const authenticated = similarity >= this.authThreshold;

    console.log(`${authenticated ? '✅' : '❌'} Auth ${userId}: ${(similarity * 100).toFixed(1)}%`);

    return {
      success: true,
      authenticated,
      confidence: similarity,
      userId,
      threshold: this.authThreshold
    };
  }

  /**
   * Calcula similaridade entre perfil e nova amostra
   */
  calculateSimilarity(profile, features) {
    // Compara energia (volume)
    const energyDiff = Math.abs(profile.avgEnergy - features.energy);
    const energySimilarity = 1 - Math.min(energyDiff / profile.avgEnergy, 1);

    // Compara pitch (frequência)
    const pitchDiff = Math.abs(profile.avgPitch - features.pitch);
    const pitchSimilarity = 1 - Math.min(pitchDiff / profile.avgPitch, 1);

    // Média ponderada (pitch tem mais peso)
    const similarity = (energySimilarity * 0.3) + (pitchSimilarity * 0.7);

    return similarity;
  }

  /**
   * Calcula média de uma característica
   */
  calculateAverage(samples, feature) {
    const sum = samples.reduce((acc, s) => acc + s.features[feature], 0);
    return sum / samples.length;
  }

  /**
   * Lista perfis cadastrados
   */
  listProfiles() {
    const profiles = [];
    
    for (const [userId, profile] of this.profiles.entries()) {
      profiles.push({
        userId,
        createdAt: profile.createdAt,
        samples: profile.totalSamples,
        avgEnergy: profile.avgEnergy,
        avgPitch: profile.avgPitch
      });
    }

    return profiles;
  }

  /**
   * Remove um perfil
   */
  removeProfile(userId) {
    const existed = this.profiles.delete(userId);
    
    if (existed) {
      console.log(`🗑️  Perfil de voz removido: ${userId}`);
    }

    return {
      success: true,
      removed: existed
    };
  }

  /**
   * Verifica se usuário tem perfil
   */
  hasProfile(userId) {
    return this.profiles.has(userId);
  }

  /**
   * Estatísticas do serviço
   */
  getStats() {
    return {
      totalProfiles: this.profiles.size,
      authThreshold: this.authThreshold,
      profiles: this.listProfiles()
    };
  }
}

module.exports = new VoiceAuthService();
