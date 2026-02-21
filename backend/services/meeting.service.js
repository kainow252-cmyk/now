const openaiService = require('./openai.service');

/**
 * Meeting Assistant Service
 * Transcribes, summarizes, and manages meetings
 */
class MeetingService {
  constructor() {
    this.meetings = new Map();
    this.transcripts = new Map();
  }

  /**
   * Start meeting recording
   */
  async startMeeting(meetingData) {
    const meeting = {
      id: `meeting_${Date.now()}`,
      title: meetingData.title,
      participants: meetingData.participants || [],
      startTime: new Date(),
      status: 'in_progress',
      transcript: [],
      notes: [],
      actionItems: []
    };

    this.meetings.set(meeting.id, meeting);

    return {
      success: true,
      meeting,
      message: 'Reunião iniciada. NOW está ouvindo e tomando notas.'
    };
  }

  /**
   * Add transcript line
   */
  async addTranscriptLine(meetingId, speaker, text) {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) throw new Error('Meeting not found');

    meeting.transcript.push({
      speaker,
      text,
      timestamp: new Date()
    });

    // Auto-detect action items
    if (text.toLowerCase().includes('action') || text.toLowerCase().includes('tarefa')) {
      await this.detectActionItem(meetingId, text, speaker);
    }

    return { success: true };
  }

  /**
   * End meeting and generate summary
   */
  async endMeeting(meetingId) {
    const meeting = this.meetings.get(meetingId);
    if (!meeting) throw new Error('Meeting not found');

    meeting.endTime = new Date();
    meeting.duration = (meeting.endTime - meeting.startTime) / 1000 / 60; // minutes
    meeting.status = 'completed';

    // Generate AI summary
    const summary = await this.generateSummary(meeting);
    meeting.summary = summary;

    return {
      success: true,
      meeting,
      summary,
      actionItems: meeting.actionItems,
      duration: `${meeting.duration.toFixed(0)} minutos`
    };
  }

  /**
   * Generate AI summary
   */
  async generateSummary(meeting) {
    const transcriptText = meeting.transcript
      .map(t => `${t.speaker}: ${t.text}`)
      .join('\n');

    const prompt = `Resuma esta reunião de forma executiva:

TÍTULO: ${meeting.title}
PARTICIPANTES: ${meeting.participants.join(', ')}
DURAÇÃO: ${meeting.duration?.toFixed(0) || '?'} minutos

TRANSCRIÇÃO:
${transcriptText}

Forneça:
1. Resumo executivo (2-3 frases)
2. Principais decisões tomadas
3. Próximos passos
4. Pontos de atenção`;

    const messages = [
      {
        role: 'system',
        content: 'Você é um assistente executivo especializado em resumir reuniões.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    return await openaiService.chat(messages);
  }

  /**
   * Detect action item from text
   */
  async detectActionItem(meetingId, text, assignedTo) {
    const meeting = this.meetings.get(meetingId);
    
    meeting.actionItems.push({
      id: `action_${Date.now()}`,
      task: text,
      assignedTo,
      status: 'pending',
      createdAt: new Date()
    });
  }

  /**
   * Get meeting statistics
   */
  async getMeetingStats(userId) {
    const userMeetings = Array.from(this.meetings.values());
    
    const totalMeetings = userMeetings.length;
    const totalHours = userMeetings.reduce((sum, m) => sum + (m.duration || 0), 0) / 60;
    const avgDuration = totalHours / totalMeetings * 60;

    return {
      totalMeetings,
      totalHours: totalHours.toFixed(1),
      avgDuration: avgDuration.toFixed(0) + ' min',
      thisWeek: 12,
      trend: '+15%'
    };
  }
}

module.exports = new MeetingService();
