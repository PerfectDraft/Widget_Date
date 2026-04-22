import { AnimatePresence, motion } from 'motion/react';
import { X, CheckCircle2, CreditCard } from 'lucide-react';
import type { Combo, UserReward } from '../../types';

interface Props {
  show: boolean;
  combo: Combo | null;
  paymentSuccess: boolean;
  userReward: UserReward;
  onClose: () => void;
  onPay: () => void;
  formatVND: (n: number) => string;
}

export function PaymentModal({ show, combo, paymentSuccess, userReward, onClose, onPay, formatVND }: Props) {
  if (!show || !combo) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        {paymentSuccess ? (
          <div className="text-center py-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}><CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" /></motion.div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Thanh Toán Thành Công!</h3>
            <p className="text-slate-500">Nhận +100 Miles 🎉</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Thanh Toán • {combo.theme}</h3>
            <div className="space-y-3 mb-6">
              {combo.activities.map((a, i) => (
                <div key={i} className="flex justify-between text-sm"><span className="text-slate-600">{a.name}</span><span className="font-medium">{a.cost === 0 ? 'Miễn phí' : formatVND(a.cost)}</span></div>
              ))}
              <div className="border-t pt-3 flex justify-between font-bold text-lg"><span>Tổng</span><span>{formatVND(combo.totalCost)}</span></div>
            </div>
            <button onClick={onPay} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors">
              <CreditCard className="w-5 h-5" /> Thanh Toán • Nhận 100 Miles
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
