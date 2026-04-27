import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, Phone, Lock, ChevronRight, Bell, CalendarCheck, RefreshCw, HelpCircle, FileText, LogOut, Cloud, CloudOff, ExternalLink } from 'lucide-react';

interface ProfileViewProps {
  phone: string;
  userName: string;
  userAvatar: string;
  dateMiles: number;
  totalDates: number;
  // Drive sync
  isDriveSynced: boolean;
  isSyncing: boolean;
  onDriveLogin: () => void;
  onDriveLogout: () => void;
  // Actions
  onLogout: () => void;
  onBack: () => void;
  showToast: (msg: string) => void;
}

export function ProfileView({
  phone, userName, userAvatar, dateMiles, totalDates,
  isDriveSynced, isSyncing, onDriveLogin, onDriveLogout,
  onLogout, onBack, showToast
}: ProfileViewProps) {
  const [dateReminders, setDateReminders] = useState(true);
  const [appUpdates, setAppUpdates] = useState(false);

  const maskedPhone = phone
    ? phone.replace(/(\d{4})(\d+)(\d{3})/, '$1 *** $3')
    : '---';

  const memberSince = new Date().getFullYear();

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-[#FFF8F4] overflow-y-auto"
    >
      <div className="max-w-md mx-auto px-6 py-6 pb-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={onBack}
            className="p-2 rounded-2xl hover:bg-[#F5ECE5] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#894C5C]" />
          </button>
          <h1 className="text-2xl font-semibold text-[#894C5C]" style={{ fontFamily: 'Epilogue, sans-serif' }}>
            Settings
          </h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-6 shadow-[0_4px_20px_rgba(137,76,92,0.06)] mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-[3px] border-[#F4A7B9] shadow-sm">
                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#1F1B17]" style={{ fontFamily: 'Epilogue, sans-serif' }}>
                {userName}
              </h2>
              <p className="text-sm text-[#524346]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Gold Member since {memberSince}
              </p>
            </div>
            <button
              onClick={() => showToast('Tính năng Edit Profile sẽ sớm ra mắt! 🌹')}
              className="px-4 py-2 rounded-full border-2 border-[#D9B784] text-[#745A2F] text-sm font-semibold hover:bg-[#FFDEAC]/20 transition-colors"
            >
              Edit Profile
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-5 pt-5 border-t border-[#EAE1DA]">
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold text-[#894C5C]" style={{ fontFamily: 'Epilogue' }}>{dateMiles}</p>
              <p className="text-xs text-[#524346] mt-1">Date Miles</p>
            </div>
            <div className="w-px bg-[#D6C1C5]" />
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold text-[#894C5C]" style={{ fontFamily: 'Epilogue' }}>{totalDates}</p>
              <p className="text-xs text-[#524346] mt-1">Buổi hẹn</p>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <SectionTitle>Account</SectionTitle>
        <div className="bg-white/70 backdrop-blur-xl rounded-[24px] shadow-[0_4px_20px_rgba(137,76,92,0.04)] mb-8 divide-y divide-[#EAE1DA]">
          <SettingsRow icon={<Phone className="w-5 h-5" />} label="Phone" value={maskedPhone} onClick={() => showToast('Số điện thoại không thể thay đổi')} />
          <SettingsRow icon={<Lock className="w-5 h-5" />} label="Change Password" onClick={() => showToast('Tính năng đổi mật khẩu sẽ sớm ra mắt!')} />
        </div>

        {/* Sync Section */}
        <SectionTitle>Data Sync</SectionTitle>
        <div className="bg-white/70 backdrop-blur-xl rounded-[24px] shadow-[0_4px_20px_rgba(137,76,92,0.04)] mb-8">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              {isDriveSynced
                ? <Cloud className="w-5 h-5 text-[#894C5C]" />
                : <CloudOff className="w-5 h-5 text-[#847376]" />}
              <div>
                <p className="text-sm font-semibold text-[#1F1B17]">Google Drive Backup</p>
                <p className="text-xs text-[#847376]">
                  {isDriveSynced
                    ? isSyncing ? 'Đang đồng bộ...' : 'Đã đồng bộ'
                    : 'Chưa kết nối'}
                </p>
              </div>
            </div>
            <ToggleSwitch
              checked={isDriveSynced}
              onChange={() => isDriveSynced ? onDriveLogout() : onDriveLogin()}
            />
          </div>
        </div>

        {/* Notifications */}
        <SectionTitle>Notifications</SectionTitle>
        <div className="bg-white/70 backdrop-blur-xl rounded-[24px] shadow-[0_4px_20px_rgba(137,76,92,0.04)] mb-8 divide-y divide-[#EAE1DA]">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <CalendarCheck className="w-5 h-5 text-[#894C5C]" />
              <p className="text-sm font-semibold text-[#1F1B17]">Date Reminders</p>
            </div>
            <ToggleSwitch checked={dateReminders} onChange={() => setDateReminders(!dateReminders)} />
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-[#847376]" />
              <p className="text-sm font-semibold text-[#1F1B17]">App Updates</p>
            </div>
            <ToggleSwitch checked={appUpdates} onChange={() => setAppUpdates(!appUpdates)} />
          </div>
        </div>

        {/* App Info */}
        <SectionTitle>App Info</SectionTitle>
        <div className="bg-white/70 backdrop-blur-xl rounded-[24px] shadow-[0_4px_20px_rgba(137,76,92,0.04)] mb-8 divide-y divide-[#EAE1DA]">
          <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#F5ECE5]/50 rounded-t-[24px] transition-colors">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-[#847376]" />
              <p className="text-sm font-semibold text-[#1F1B17]">Help Center</p>
            </div>
            <ExternalLink className="w-4 h-4 text-[#847376]" />
          </div>
          <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#F5ECE5]/50 rounded-b-[24px] transition-colors">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#847376]" />
              <p className="text-sm font-semibold text-[#1F1B17]">Terms of Service</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#847376]" />
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full py-4 rounded-full border-2 border-[#FFDAD6] text-[#BA1A1A] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#FFDAD6]/30 transition-colors mb-6"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-[#847376]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Version 2.4.1 • Made with love for {userName}
        </p>
      </div>
    </motion.div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#894C5C] mb-3 ml-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {children}
    </h3>
  );
}

function SettingsRow({ icon, label, value, onClick }: { icon: React.ReactNode; label: string; value?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#F5ECE5]/50 transition-colors first:rounded-t-[24px] last:rounded-b-[24px]"
    >
      <div className="flex items-center gap-3">
        <span className="text-[#847376]">{icon}</span>
        <p className="text-sm font-semibold text-[#1F1B17]">{label}</p>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-[#524346]">{value}</span>}
        <ChevronRight className="w-4 h-4 text-[#847376]" />
      </div>
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-12 h-7 rounded-full transition-colors ${checked ? 'bg-[#F4A7B9]' : 'bg-[#D6C1C5]'}`}
    >
      <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
    </button>
  );
}
