import { motion, AnimatePresence } from 'motion/react';
import type { Combo } from '../../types';

interface ComboActionModalProps {
  show: boolean;
  combo: Combo | null;
  onClose: () => void;
  onCustomize: (combo: Combo) => void;
  onPayNow: (combo: Combo) => void;
}

export function ComboActionModal({ show, combo, onClose, onCustomize, onPayNow }: ComboActionModalProps) {
  if (!combo) return null;

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm glass-card bg-surface/95 rounded-[32px] p-6 shadow-2xl z-50 border-2 border-primary/20"
          >
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
              </div>
              
              <h3 className="text-headline-sm font-bold text-on-surface">
                Bạn có muốn thêm địa điểm?
              </h3>
              
              <p className="text-body-md text-on-surface-variant">
                Combo AI đã gợi ý sẵn các địa điểm. Bạn có muốn tự chọn thêm không?
              </p>
              
              <div className="pt-4 space-y-3">
                <button
                  onClick={() => onCustomize(combo)}
                  className="w-full py-4 rounded-full bg-primary text-on-primary font-bold text-body-lg shadow-md hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  Có, tùy chỉnh
                </button>
                <button
                  onClick={() => onPayNow(combo)}
                  className="w-full py-4 rounded-full bg-surface-container-high text-on-surface-variant font-bold text-body-lg hover:bg-surface-container-highest transition-colors cursor-pointer"
                >
                  Không, thanh toán ngay
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
