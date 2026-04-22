import { X } from 'lucide-react';

interface Props {
  loc: { name: string; lat: number; lng: number } | null;
  onClose: () => void;
  onRide: (app: 'grab' | 'be' | 'xanhsm', name: string, lat: number, lng: number) => void;
}

export function RideModal({ loc, onClose, onRide }: Props) {
  if (!loc) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">Gọi xe đến {loc.name}</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <div className="grid gap-3">
          <button onClick={() => onRide('grab', loc.name, loc.lat, loc.lng)} className="bg-green-50 hover:bg-green-100 text-green-700 py-3 rounded-xl font-bold transition-colors">🟢 Grab</button>
          <button onClick={() => onRide('be', loc.name, loc.lat, loc.lng)} className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 py-3 rounded-xl font-bold transition-colors">🟡 Be</button>
          <button onClick={() => onRide('xanhsm', loc.name, loc.lat, loc.lng)} className="bg-cyan-50 hover:bg-cyan-100 text-cyan-700 py-3 rounded-xl font-bold transition-colors">🚙 Xanh SM</button>
        </div>
      </div>
    </div>
  );
}
