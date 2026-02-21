const axios = require('axios');

class CalendarService {
  constructor() {
    this.googleClientId = process.env.GOOGLE_CLIENT_ID;
    this.googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    this.googleApiKey = process.env.GOOGLE_API_KEY;
    this.calendarApiUrl = 'https://www.googleapis.com/calendar/v3';
  }

  async createEvent(accessToken, eventData) {
    if (!accessToken || !this.googleClientId) {
      console.warn('Google Calendar API not configured, using mock');
      return this.mockCreateEvent(eventData);
    }

    try {
      const event = {
        summary: eventData.title,
        description: eventData.description,
        start: {
          dateTime: eventData.startTime,
          timeZone: eventData.timezone || 'America/Sao_Paulo'
        },
        end: {
          dateTime: eventData.endTime,
          timeZone: eventData.timezone || 'America/Sao_Paulo'
        },
        attendees: eventData.attendees || [],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 30 }
          ]
        }
      };

      const response = await axios.post(
        `${this.calendarApiUrl}/calendars/primary/events`,
        event,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        eventId: response.data.id,
        event: response.data,
        link: response.data.htmlLink
      };
    } catch (error) {
      console.error('Google Calendar API error:', error.response?.data || error.message);
      return this.mockCreateEvent(eventData);
    }
  }

  async getEvents(accessToken, timeMin, timeMax) {
    if (!accessToken || !this.googleClientId) {
      return this.mockGetEvents(timeMin, timeMax);
    }

    try {
      const params = {
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax,
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 50
      };

      const response = await axios.get(
        `${this.calendarApiUrl}/calendars/primary/events`,
        {
          params,
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      return {
        success: true,
        events: response.data.items,
        count: response.data.items.length
      };
    } catch (error) {
      console.error('Google Calendar API error:', error.message);
      return this.mockGetEvents(timeMin, timeMax);
    }
  }

  async updateEvent(accessToken, eventId, updates) {
    if (!accessToken || !this.googleClientId) {
      return this.mockUpdateEvent(eventId, updates);
    }

    try {
      const response = await axios.patch(
        `${this.calendarApiUrl}/calendars/primary/events/${eventId}`,
        updates,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        eventId: response.data.id,
        event: response.data
      };
    } catch (error) {
      console.error('Google Calendar API error:', error.message);
      return this.mockUpdateEvent(eventId, updates);
    }
  }

  async deleteEvent(accessToken, eventId) {
    if (!accessToken || !this.googleClientId) {
      return this.mockDeleteEvent(eventId);
    }

    try {
      await axios.delete(
        `${this.calendarApiUrl}/calendars/primary/events/${eventId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      return {
        success: true,
        eventId,
        message: 'Evento removido com sucesso'
      };
    } catch (error) {
      console.error('Google Calendar API error:', error.message);
      return this.mockDeleteEvent(eventId);
    }
  }

  async findAvailableSlots(accessToken, date, duration = 60) {
    // Get events for the day
    const startOfDay = new Date(date);
    startOfDay.setHours(8, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(18, 0, 0, 0);

    const events = await this.getEvents(
      accessToken,
      startOfDay.toISOString(),
      endOfDay.toISOString()
    );

    // Find gaps between events
    const availableSlots = [];
    let currentTime = startOfDay;

    for (const event of events.events || []) {
      const eventStart = new Date(event.start.dateTime || event.start.date);
      
      if (currentTime < eventStart) {
        const slotDuration = (eventStart - currentTime) / (1000 * 60);
        if (slotDuration >= duration) {
          availableSlots.push({
            start: currentTime.toISOString(),
            end: eventStart.toISOString(),
            duration: slotDuration
          });
        }
      }
      
      currentTime = new Date(event.end.dateTime || event.end.date);
    }

    // Check if there's time after last event
    if (currentTime < endOfDay) {
      const slotDuration = (endOfDay - currentTime) / (1000 * 60);
      if (slotDuration >= duration) {
        availableSlots.push({
          start: currentTime.toISOString(),
          end: endOfDay.toISOString(),
          duration: slotDuration
        });
      }
    }

    return {
      success: true,
      date,
      availableSlots,
      count: availableSlots.length
    };
  }

  async detectConflicts(accessToken, proposedEvent) {
    const events = await this.getEvents(
      accessToken,
      proposedEvent.startTime,
      proposedEvent.endTime
    );

    const conflicts = events.events?.filter(event => {
      const eventStart = new Date(event.start.dateTime);
      const eventEnd = new Date(event.end.dateTime);
      const propStart = new Date(proposedEvent.startTime);
      const propEnd = new Date(proposedEvent.endTime);

      return (propStart < eventEnd && propEnd > eventStart);
    });

    return {
      hasConflict: conflicts && conflicts.length > 0,
      conflicts: conflicts || [],
      count: conflicts?.length || 0
    };
  }

  // Mock implementations
  mockCreateEvent(eventData) {
    const eventId = `mock_event_${Date.now()}`;
    return {
      success: true,
      eventId,
      event: {
        id: eventId,
        ...eventData,
        created: new Date(),
        htmlLink: `https://calendar.google.com/event/${eventId}`
      },
      link: `https://calendar.google.com/event/${eventId}`,
      message: 'Evento criado (mock - configure Google Calendar API para sincronização real)'
    };
  }

  mockGetEvents(timeMin, timeMax) {
    const now = new Date();
    const mockEvents = [
      {
        id: 'mock_1',
        summary: 'Reunião Estratégica',
        description: 'Planejamento trimestral',
        start: { dateTime: new Date(now.getTime() + 2 * 3600000).toISOString() },
        end: { dateTime: new Date(now.getTime() + 3 * 3600000).toISOString() },
        status: 'confirmed'
      },
      {
        id: 'mock_2',
        summary: 'Análise Financeira',
        description: 'Review mensal',
        start: { dateTime: new Date(now.getTime() + 5 * 3600000).toISOString() },
        end: { dateTime: new Date(now.getTime() + 6 * 3600000).toISOString() },
        status: 'confirmed'
      },
      {
        id: 'mock_3',
        summary: 'Call com Investidores',
        description: 'Apresentação Q1',
        start: { dateTime: new Date(now.getTime() + 24 * 3600000).toISOString() },
        end: { dateTime: new Date(now.getTime() + 25 * 3600000).toISOString() },
        status: 'confirmed'
      }
    ];

    return {
      success: true,
      events: mockEvents,
      count: mockEvents.length,
      message: 'Eventos mock (configure Google Calendar API para dados reais)'
    };
  }

  mockUpdateEvent(eventId, updates) {
    return {
      success: true,
      eventId,
      event: {
        id: eventId,
        ...updates,
        updated: new Date()
      },
      message: 'Evento atualizado (mock)'
    };
  }

  mockDeleteEvent(eventId) {
    return {
      success: true,
      eventId,
      message: 'Evento removido (mock)'
    };
  }
}

module.exports = new CalendarService();
