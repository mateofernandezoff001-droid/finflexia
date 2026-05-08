import { supabase } from "./supabase";

class SocketService {
  private static instance: SocketService;
  private listeners: Map<string, Set<Function>> = new Map();
  private channel: any = null;

  private constructor() {
    this.init();
  }

  static getInstance() {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  private init() {
    // Migrate to Supabase Realtime (Channels) for Netlify compatibility
    this.channel = supabase.channel('market_updates');
    
    this.channel
      .on('broadcast', { event: 'market_update' }, (payload: any) => {
        this.emitListeners('market_update', payload.payload);
      })
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          console.log("[Supabase Realtime] Subscribed to market_updates");
          
          // Self-broadcasting mock data for demonstration if no server exists
          // In production, a Supabase Edge Function or similar would broadcast this
          setInterval(() => {
            const mockData = [
              { symbol: 'BTC', price: 65000 + Math.random() * 200 },
              { symbol: 'ETH', price: 3400 + Math.random() * 20 },
              { symbol: 'AAPL', price: 185 + Math.random() * 5 }
            ];
            this.emitListeners('market_update', mockData);
          }, 3000);
        }
      });
  }

  private emitListeners(event: string, data: any) {
    this.listeners.get(event)?.forEach(cb => cb(data));
  }

  subscribe(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  emit(event: string, data: any) {
    // Send broadcast through Supabase
    this.channel.send({
      type: 'broadcast',
      event: event,
      payload: data
    });
  }
}

export const socketService = SocketService.getInstance();
