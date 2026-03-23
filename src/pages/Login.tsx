import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const Login = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/chat" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!acceptedTerms) {
          toast.error(t("login_terms_error"));
          setIsLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success(t("login_otp_sent"));
        setOtpStep(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/chat");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) return;
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: "signup",
      });
      if (error) throw error;
      toast.success(t("login_verified"));
      navigate("/chat");
    } catch (error: any) {
      toast.error(error.message || "Invalid code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({ type: "signup", email });
      if (error) throw error;
      toast.success(t("login_code_resent"));
    } catch (error: any) {
      toast.error(error.message || "Error");
    } finally {
      setIsLoading(false);
    }
  };

  if (otpStep) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground" style={{ lineHeight: '1.1' }}>
              {t("login_verify_title")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("login_verify_desc")} <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <button
              onClick={handleVerifyOtp}
              disabled={isLoading || otpCode.length !== 6}
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-60"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              ) : (
                <>
                  {t("login_verify_btn")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <button onClick={handleResendCode} disabled={isLoading} className="text-primary hover:underline disabled:opacity-50">
                {t("login_resend")}
              </button>
              <span>•</span>
              <button onClick={() => { setOtpStep(false); setOtpCode(""); }} className="flex items-center gap-1 text-primary hover:underline">
                <ArrowLeft className="h-3 w-3" />
                {t("login_back")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground" style={{ lineHeight: '1.1' }}>
            {t("login_welcome")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignUp ? t("login_create_account") : t("login_sign_in")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("login_email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
              placeholder={t("login_email_placeholder")}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("login_password")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
              placeholder="••••••••"
            />
          </div>

          {isSignUp && (
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
              />
              <span className="text-xs text-muted-foreground leading-relaxed">
                {t("login_accept_terms")}{" "}
                <Link to="/terms" className="text-primary hover:underline" target="_blank">
                  {t("login_terms_link")}
                </Link>{" "}
                {t("login_and_the")}{" "}
                <Link to="/privacy" className="text-primary hover:underline" target="_blank">
                  {t("login_privacy_link")}
                </Link>
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={isLoading || (isSignUp && !acceptedTerms)}
            className="group mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-60"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
            ) : (
              <>
                {isSignUp ? t("login_submit_signup") : t("login_submit_signin")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {isSignUp ? t("login_has_account") : t("login_no_account")}{" "}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline">
            {isSignUp ? t("login_submit_signin") : t("login_submit_signup")}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
