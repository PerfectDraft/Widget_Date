import { useState, useActionState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Lock, Eye, EyeOff, ArrowRight, Heart } from 'lucide-react';
import { login, register } from '../../services/api';
import { cn } from '../../lib/utils';

interface AuthViewProps {
  onAuthSuccess: (phone: string, userData: any) => void;
}

export function AuthView({ onAuthSuccess }: AuthViewProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    const formPhone = formData.get('phone') as string;
    const formPassword = formData.get('password') as string;

    try {
      if (mode === 'login') {
        const res = await login(formPhone, formPassword);
        if (res.success) {
          onAuthSuccess(formPhone, res.user);
          return { error: null, success: true, phone: formPhone, password: formPassword };
        } else {
          return { error: res.error || 'Đăng nhập thất bại', success: false, phone: formPhone, password: formPassword };
        }
      } else {
        const res = await register(formPhone, formPassword);
        if (res.success) {
          setMode('login');
          return { error: null, success: true, phone: formPhone, password: formPassword };
        } else {
          return { error: res.error || 'Đăng ký thất bại', success: false, phone: formPhone, password: formPassword };
        }
      }
    } catch (err: any) {
      return { error: err.message || 'Lỗi kết nối server', success: false, phone: formPhone, password: formPassword };
    }
  }, { error: null, success: false, phone: '', password: '' });

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#FFE4E1] rounded-full blur-[100px] opacity-60" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] bg-[#FADADD] rounded-full blur-[80px] opacity-50" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 border border-[#F5E6E0]">
            <Heart className="text-[#D4A373] w-8 h-8 fill-[#D4A373]" />
          </div>
          <h1 className="text-4xl font-serif text-[#4A4441] mb-2">Widget Date</h1>
          <p className="text-[#8B8682]">
            {mode === 'login' ? 'Chào mừng bạn quay trở lại ✨' : 'Bắt đầu hành trình lãng mạn của bạn'}
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-8 border border-white/50 shadow-[0_20px_50px_rgba(212,163,115,0.1)]">
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#6B6662] ml-1">Số điện thoại</label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  placeholder="098..."
                  defaultValue={state.phone}
                  className="w-full h-14 bg-white rounded-2xl px-12 border border-[#F5E6E0] focus:ring-2 focus:ring-[#D4A373] focus:border-transparent outline-none transition-all placeholder:text-[#C4C0BE] text-[#4A4441]"
                  required
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4A373]" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#6B6662] ml-1">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  defaultValue={state.password}
                  className="w-full h-14 bg-white rounded-2xl px-12 border border-[#F5E6E0] focus:ring-2 focus:ring-[#D4A373] focus:border-transparent outline-none transition-all placeholder:text-[#C4C0BE] text-[#4A4441]"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4A373]" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-[#FFF9F5] rounded-lg transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5 text-[#8B8682]" /> : <Eye className="w-5 h-5 text-[#8B8682]" />}
                </button>
              </div>
            </div>

            {state.error && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-sm ml-1 py-1"
              >
                {state.error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className={cn(
                "w-full h-14 bg-[#D4A373] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#D4A373]/20 hover:bg-[#C29262] transition-all",
                isPending && "opacity-70 cursor-not-allowed"
              )}
            >
              {isPending ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 w-full">
              <div className="h-[1px] bg-[#F5E6E0] flex-1" />
              <span className="text-xs text-[#C4C0BE] font-medium uppercase tracking-wider">Hoặc</span>
              <div className="h-[1px] bg-[#F5E6E0] flex-1" />
            </div>

            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-[#D4A373] font-bold text-sm hover:underline decoration-2 underline-offset-4"
            >
              {mode === 'login' ? 'Bạn chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-[#C4C0BE] leading-relaxed">
          Bằng cách tiếp tục, bạn đồng ý với Điều khoản & Chính sách của chúng tôi. <br/>
          "Mỗi buổi hẹn hò đều bắt đầu bằng một cú chạm."
        </p>
      </motion.div>
    </div>
  );
}
