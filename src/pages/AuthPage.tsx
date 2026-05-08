import { useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Shield, ArrowRight, Wallet, BrainCircuit, Globe, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export function AuthPage() {
  const { login, register, signInWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  });

  const handleGoogleSignIn = async () => {
    try {
        setLoading(true);
        await signInWithGoogle();
    } catch (err) {
        setError("Google authentication failed");
    } finally {
        setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const res = await login({ email: formData.email, password: formData.password });
        if (res.error) setError(res.error);
      } else {
        const res = await register(formData);
        if (res.error) setError(res.error);
        else {
            setIsLogin(true);
            setError(null);
            alert("Registration successful! Please login.");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left Side: Illustration / Brand */}
      <div className="hidden lg:flex flex-col bg-[#0A2540] p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#635bff44_0%,transparent_50%)]" />
        <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-16">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                    <Shield className="w-6 h-6 text-[#635bff]" />
                </div>
                <span className="text-2xl font-display font-bold tracking-tight">FinFlex Pro</span>
            </div>

            <div className="mt-auto max-w-md">
                <h2 className="text-5xl font-display font-bold leading-tight mb-6">
                    Professional Financial Intelligence for Everyone.
                </h2>
                <p className="text-slate-400 text-lg mb-12">
                    A multi-platform terminal built for speed, security, and global market visibility.
                </p>

                <div className="space-y-6">
                    {[
                        { icon: Wallet, title: "Custom Wallets", desc: "Isolated accounts with multi-currency support." },
                        { icon: BrainCircuit, title: "AI Analysis", desc: "Deep metrics from Gemini Intelligence." },
                        { icon: Globe, title: "Global Markets", desc: "Real-time feeds from top exchanges." }
                    ].map(feat => (
                        <div key={feat.title} className="flex gap-4">
                            <div className="p-2 bg-white/5 rounded-lg h-fit">
                                <feat.icon className="w-5 h-5 text-slate-300" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-200">{feat.title}</h4>
                                <p className="text-sm text-slate-400">{feat.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="mt-auto pt-12 text-slate-500 text-xs font-mono">
                SECURE TERMINAL | v2.4.0 PROFESSIONAL EDITION
            </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50/50">
        <div className="w-full max-w-sm space-y-8">
            <div className="text-center lg:hidden flex flex-col items-center mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-[#635bff] flex items-center justify-center shadow-xl shadow-[#635bff]/20 mb-4">
                    <Shield className="w-7 h-7 text-white" />
                 </div>
                 <h1 className="text-2xl font-display font-bold text-slate-900">FinFlex Pro</h1>
            </div>

            <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white p-2">
                <CardHeader className="space-y-1 pb-8 pt-6 px-6">
                    <CardTitle className="text-2xl font-display font-bold text-slate-900">
                        {isLogin ? "Welcome back" : "Create an account"}
                    </CardTitle>
                    <CardDescription>
                        {isLogin ? "Enter your credentials to access your terminal" : "Start your professional journey today"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-2"
                                >
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input 
                                        id="name" 
                                        required 
                                        placeholder="John Doe" 
                                        className="h-11 rounded-lg border-slate-200 focus:ring-accent/20"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                required 
                                placeholder="name@company.com" 
                                className="h-11 rounded-lg border-slate-200 focus:ring-accent/20"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                {isLogin && (
                                    <button type="button" className="text-xs font-bold text-accent hover:underline">Forgot password?</button>
                                )}
                            </div>
                            <Input 
                                id="password" 
                                type="password" 
                                required 
                                placeholder="••••••••" 
                                className="h-11 rounded-lg border-slate-200 focus:ring-accent/20"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                                {error}
                            </div>
                        )}

                        <Button 
                            className="w-full h-11 rounded-lg bg-[#635bff] hover:bg-[#635bff]/90 text-white font-bold shadow-lg shadow-[#635bff]/20"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                <div className="flex items-center gap-2">
                                    {isLogin ? "Sign In" : "Get Started"} <ArrowRight className="w-4 h-4" />
                                </div>
                            )}
                        </Button>

                        {isLogin && (
                            <>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-slate-100" />
                                    </div>
                                    <div className="relative flex justify-center text-[10px] uppercase">
                                        <span className="bg-white px-2 text-slate-400 font-bold tracking-widest">Or continue with</span>
                                    </div>
                                </div>

                                <Button 
                                    type="button"
                                    variant="outline" 
                                    className="w-full h-11 rounded-lg border-slate-200 hover:bg-slate-50 font-bold gap-3"
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Google
                                </Button>
                            </>
                        )}
                    </form>
                </CardContent>
                <CardFooter className="pt-2 pb-6 px-6">
                    <p className="text-sm text-slate-500 w-full text-center">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                        <button 
                            type="button" 
                            onClick={() => { setIsLogin(!isLogin); setError(null); }}
                            className="font-bold text-slate-900 hover:underline"
                        >
                            {isLogin ? "Create one" : "Log in"}
                        </button>
                    </p>
                </CardFooter>
            </Card>

            <div className="flex flex-col items-center gap-6 mt-12">
                <div className="flex items-center gap-4 w-full">
                    <div className="h-px bg-slate-200 flex-1" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compliant Security</span>
                    <div className="h-px bg-slate-200 flex-1" />
                </div>
                <div className="flex gap-8 opacity-40 grayscale">
                    <div className="font-display font-black tracking-tighter text-slate-900 underline decoration-4 decoration-emerald-400">FINRA</div>
                    <div className="font-display font-black tracking-tighter text-slate-900 italic">SEC</div>
                    <div className="font-display font-black tracking-tighter text-slate-900 border-2 border-slate-900 px-1">FDIC</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
