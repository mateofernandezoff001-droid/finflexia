import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">System Interruption</h1>
          <p className="text-slate-500 text-sm max-w-md mb-8 leading-relaxed">
            The neural transport layer encountered an localized anomaly. Our automated systems are already attempting a recalibration.
          </p>
          <div className="flex gap-4">
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-[#635bff] hover:bg-[#635bff]/90 text-white font-bold h-11 px-8 rounded-xl gap-2 shadow-lg shadow-[#635bff]/20"
            >
              <RefreshCw className="w-4 h-4" /> Restart Kernel
            </Button>
            <Button 
                variant="outline" 
                onClick={() => this.setState({ hasError: false })}
                className="h-11 px-8 rounded-xl border-slate-200"
            >
                Continue Anyway
            </Button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-12 p-6 rounded-2xl bg-slate-900 text-rose-400 text-left font-mono text-xs overflow-auto max-w-2xl border border-white/5 shadow-2xl">
              <div className="mb-2 uppercase opacity-50 font-bold border-b border-white/10 pb-2">Debug Trace</div>
              {this.state.error?.toString()}
              <div className="mt-4 opacity-30">Stack: {this.state.error?.stack}</div>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
