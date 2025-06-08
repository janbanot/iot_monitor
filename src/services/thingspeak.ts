interface ThingSpeakEntry {
  created_at: string;
  entry_id: number;
  field1: string; // Temperature
  field2: string; // Humidity
  field3: string; // Pressure
  field4: string; // Light
  field5: string; // Temperature Alert
  field6: string; // Humidity Alert
  field7: string; // Pressure Alert
  field8: string; // Light Alert
}

interface ThingSpeakChannel {
  id: number;
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
  last_entry_id: number;
}

interface ThingSpeakResponse {
  channel: ThingSpeakChannel;
  feeds: ThingSpeakEntry[];
}

export class ThingSpeakService {
  private readonly baseUrl = 'https://api.thingspeak.com';
  private readonly channelId: string;
  private readonly readApiKey?: string;

  constructor(channelId: string, readApiKey?: string) {
    this.channelId = channelId;
    this.readApiKey = readApiKey;
  }

  private buildUrl(endpoint: string, params: Record<string, string> = {}): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (this.readApiKey) {
      params.api_key = this.readApiKey;
    }
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    return url.toString();
  }

  async getChannelInfo(): Promise<ThingSpeakChannel> {
    const url = this.buildUrl(`/channels/${this.channelId}.json`);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch channel info: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching ThingSpeak channel info:', error);
      throw error;
    }
  }

  async getLatestEntry(): Promise<ThingSpeakEntry | null> {
    const url = this.buildUrl(`/channels/${this.channelId}/feeds/last.json`);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch latest entry: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching latest ThingSpeak entry:', error);
      throw error;
    }
  }

  async getEntries(options: {
    results?: number;
    start?: string;
    end?: string;
  } = {}): Promise<ThingSpeakResponse> {
    const params: Record<string, string> = {};
    
    if (options.results) params.results = options.results.toString();
    if (options.start) params.start = options.start;
    if (options.end) params.end = options.end;
    
    const url = this.buildUrl(`/channels/${this.channelId}/feeds.json`, params);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch entries: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching ThingSpeak entries:', error);
      throw error;
    }
  }
}

export const createThingSpeakService = (): ThingSpeakService => {
  const channelId = '2983726';
  const readApiKey = '7LXAVLUC5BX3PAJP';
  
  return new ThingSpeakService(channelId, readApiKey);
};