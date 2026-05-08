import { supabase } from "@/src/lib/supabase";

export interface Order {
  symbol: string;
  type: 'BUY' | 'SELL';
  side: 'MARKET' | 'LIMIT';
  quantity: number;
  price: number;
  userId: string;
}

export interface Position {
  id: number;
  symbol: string;
  quantity: number;
  average_price: number;
  unrealized_pnl: number;
}

export class TradingService {
  private static instance: TradingService;

  static getInstance() {
    if (!TradingService.instance) {
      TradingService.instance = new TradingService();
    }
    return TradingService.instance;
  }

  async getPositions(userId: string): Promise<Position[]> {
    const { data, error } = await supabase
      .from('positions')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error("Supabase Position Error:", error);
      return [];
    }
    return data as Position[];
  }

  async placeOrder(order: Order): Promise<{ success: boolean; orderId?: number }> {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: order.userId,
        symbol: order.symbol,
        type: order.type,
        side: order.side,
        quantity: order.quantity,
        price: order.price,
        status: 'OPEN'
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase Order Error:", error);
      return { success: false };
    }

    // Logic for updating positions would usually be in a DB trigger in Supabase
    // or we'd handle it here if we want simplified client-side logic
    return { success: true, orderId: data.id };
  }

  async getLogs(userId: string) {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase Logs Error:", error);
      return [];
    }
    return data;
  }
}

export const tradingService = TradingService.getInstance();
