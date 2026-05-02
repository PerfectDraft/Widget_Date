import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Phone, Lock, ChevronRight, CalendarCheck, RefreshCw, HelpCircle, FileText, LogOut, Cloud, CloudOff, ExternalLink, X, Eye, EyeOff, User, Camera } from 'lucide-react';

interface ProfileViewProps {
  phone: string;
  userName: string;
  userAvatar: string;
  dateMiles: number;
  totalDates: number;
  isDriveSynced: boolean;
  isSyncing: boolean;
  onDriveLogin: () => void;
  onDriveLogout: () => void;
  onLogout: () => void;
  onBack: () => void;
  showToast: (msg: string) => void;
  onProfileUpdated?: (newName?: string, newAvatar?: string) => void;
}

export function ProfileView({
  phone, userName: initialUserName, userAvatar: initialAvatar, dateMiles, totalDates,
  isDriveSynced, isSyncing, onDriveLogin, onDriveLogout,
  onLogout, onBack, showToast, onProfileUpdated
}: ProfileViewProps) {
  const [dateReminders, setDateReminders] = useState(true);
  const [appUpdates, setAppUpdates] = useState(false);
  const [userName, setUserName] = useState(initialUserName);
  const [userAvatar, setUserAvatar] = useState(initialAvatar);

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState(initialUserName);
  const [editLoading, setEditLoading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const maskedPhone = phone
    ? phone.replace(/(\d{4})(\d+)(\d{3})/, '$1 *** $3')
    : '---';
  const memberSince = new Date().getFullYear();

  const handleAvatarPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return showToast('\u1ea2nh t\u1ed1i \u0111a 5MB');
    setAvatarFile(file);
    setPreviewAvatar(URL.createObjectURL(file));
  };

  const handleEditProfile = async () => {
    if (!editName.trim()) return showToast('T\u00ean kh\u00f4ng \u0111\u01b0\u1ee3c \u0111\u1ec3 tr\u1ed1ng');
    setEditLoading(true);
    try {
      let newAvatarUrl = userAvatar;

      if (avatarFile) {
        setUploadingAvatar(true);
        const uploadRes = await fetch('/api/upload-avatar', {
          method: 'POST',
          headers: { 'Content-Type': avatarFile.type, 'x-phone': phone },
          body: avatarFile,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error);
        newAvatarUrl = uploadData.url;
        setUploadingAvatar(false);
      }

      const res = await fetch('/api/auth?action=update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, userName: editName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUserName(data.userName);
      setUserAvatar(newAvatarUrl);
      setPreviewAvatar(null);
      setAvatarFile(null);
      setShowEditProfile(false);
      onProfileUpdated?.(data.userName, newAvatarUrl);
      showToast('\u0110\u00e3 c\u1eadp nh\u1eadt h\u1ed3 s\u01a1 th\u00e0nh c\u00f4ng! \ud83c\udf89');
    } catch (err: any) {
      showToast(err.message || 'C\u00f3 l\u1ed7i x\u1ea3y ra');
    } finally {
      setEditLoading(false);
      setUploadingAvatar(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword)
      return showToast('Vui l\u00f2ng \u0111i\u1ec1n \u0111\u1ea7y \u0111\u1ee7 th\u00f4ng tin');
    if (newPassword !== confirmPassword)
      return showToast('M\u1eadt kh\u1ea9u m\u1edbi kh\u00f4ng kh\u1edbp');
    if (newPassword.length < 6)
      return showToast('M\u1eadt kh\u1ea9u m\u1edbi ph\u1ea3i t\u1eeb 6 k\u00fd t\u1ef1');
    setPwLoading(true);
    try {
      const res = await fetch('/api/auth?action=change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, oldPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setShowChangePassword(false);
      setOldPassword(''); setNewPassword(''); setConfirmPassword('');
      showToast('\u0110\u1ed5i m\u1eadt kh\u1ea9u th\u00e0nh c\u00f4ng! \ud83d\udd12');
    } catch (err: any) {
      showToast(err.message || 'C\u00f3 l\u1ed7i x\u1ea3y ra');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-[#FFF8F4] overflow-y-auto"
    >
      <div className="max-w-md mx-auto px-6 py-6 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={onBack} className="p-2 rounded-2xl hover:bg-[#F5ECE5] transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#894C5C]" />
          </button>
          <h1 className="text-2xl font-semibold text-[#894C5C]" style={{ fontFamily: 'Epilogue, sans-serif' }}>Settings</h1>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-6 shadow-[0_4px_20px_rgba(137,76,92,0.06)] mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-[3px] border-[#F4A7B9] shadow-sm">
                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#1F1B17]" style={{ fontFamily: 'Epilogue, sans-serif' }}>{userName}</h2>
              <p className="text-sm text-[#524346]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Gold Member since {memberSince}</p>
            </div>
            <button
              onClick={() => { setEditName(userName); setPreviewAvatar(null); setAvatarFile(null); setShowEditProfile(true); }}
              className="px-4 py-2 rounded-full border-2 border-[#D9B784] text-[#745A2F] text-sm font-semibold hover:bg-[#FFDEAC]/20 transition-colors"
            >
              Edit
            </button>
          </div>
          <div className="flex gap-4 mt-5 pt-5 border-t border-[#EAE1DA]">
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold text-[#894C5C]" style={{ fontFamily: 'Epilogue' }}>{dateMiles}</p>
              <p className="text-xs text-[#524346] mt-1">Date Miles</p>
            </div>
            <div className="w-px bg-[#D6C1C5]" />
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold text-[#894C5C]" style={{ fontFamily: 'Epilogue' }}>{totalDates}</p>
              <p className="text-xs text-[#524346] mt-1">Bu\u1ed5i h\u1eb9n</p>
            </div>
          </div>
        </div>

        <SectionTitle>Account</SectionTitle>
        <div className="bg-white/70 backdrop-blur-xl rounded-[24px] shadow-[0_4px_20px_rgba(137,76,92,0.04)] mb-8 divide-y divide-[#EAE1DA]">
          <SettingsRow icon={<Phone className="w-5 h-5" />} label="Phone" value={maskedPhone} onClick={() => showToast('S\u1ed1 \u0111i\u1ec7n tho\u1ea1i kh\u00f4ng th\u1ec3 thay \u0111\u1ed5i')} />
          <SettingsRow icon={<Lock className="w-5 h-5" />} label="Change Password" onClick={() => { setOldPassword(''); setNewPassword(''); setConfirmPassword(''); setShowChangePassword(true); }} />
        </div>

        <SectionTitle>Data Sync</SectionTitle>
        <div className="bg-white/70 backdrop-blur-xl rounded-[24px] shadow-[0_4px_20px_rgba(137,76,92,0.04)] mb-8">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              {isDriveSynced ? <Cloud className="w-5 h-5 text-[#894C5C]" /> : <CloudOff className="w-5 h-5 text-[#847376]" />}
              <div>
                <p className="text-sm font-semibold text-[#1F1B17]">Google Drive Backup</p>
                <p className="text-xs text-[#847376]">{isDriveSynced ? (isSyncing ? '\u0110ang \u0111\u1ed3ng b\u1ed9...' : '\u0110\u00e3 \u0111\u1ed3ng b\u1ed9') : 'Ch\u01b0a k\u1ebft n\u1ed1i'}</p>
              </div>
            </div>
            <ToggleSwitch checked={isDriveSynced} onChange={() => isDriveSynced ? onDriveLogout() : onDriveLogin()} />
          </div>
        </div>

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

        <button
          onClick={onLogout}
          className="w-full py-4 rounded-full border-2 border-[#FFDAD6] text-[#BA1A1A] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#FFDAD6]/30 transition-colors mb-6"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
        <p className="text-center text-xs text-[#847376]">
          Version 2.4.1 \u2022 Made with love for {userName}
        </p>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditProfile && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-6"
            onClick={() => setShowEditProfile(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-[28px] w-full max-w-sm p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-[#1F1B17]" style={{ fontFamily: 'Epilogue' }}>Ch\u1ec9nh s\u1eeda h\u1ed3 s\u01a1</h3>
                <button onClick={() => setShowEditProfile(false)} className="text-[#847376] hover:text-[#524346]"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex flex-col items-center mb-5">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-[#F4A7B9] shadow-sm">
                    <img src={previewAvatar ?? userAvatar} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-[#894C5C] text-white rounded-full p-1.5 shadow-md hover:bg-[#733949] transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-[#847376] mt-2">Nh\u1ea5n camera \u0111\u1ec3 \u0111\u1ed5i \u1ea3nh \u00b7 T\u1ed1i \u0111a 5MB</p>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarPick} />
              </div>
              <div className="mb-4">
                <label className="text-xs font-semibold text-[#524346] mb-1.5 block">T\u00ean hi\u1ec3n th\u1ecb</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#847376]" />
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="Nh\u1eadp t\u00ean c\u1ee7a b\u1ea1n"
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-[#D6C1C5] bg-[#FFF8F4] text-sm text-[#1F1B17] outline-none focus:border-[#894C5C] transition-colors"
                  />
                </div>
              </div>
              <button
                onClick={handleEditProfile}
                disabled={editLoading}
                className="w-full py-3 rounded-xl bg-[#894C5C] text-white font-semibold text-sm hover:bg-[#733949] transition-colors disabled:opacity-60"
              >
                {uploadingAvatar ? '\u0110ang t\u1ea3i \u1ea3nh...' : editLoading ? '\u0110ang l\u01b0u...' : 'L\u01b0u thay \u0111\u1ed5i'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showChangePassword && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-6"
            onClick={() => setShowChangePassword(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-[28px] w-full max-w-sm p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-[#1F1B17]" style={{ fontFamily: 'Epilogue' }}>\u0110\u1ed5i m\u1eadt kh\u1ea9u</h3>
                <button onClick={() => setShowChangePassword(false)} className="text-[#847376] hover:text-[#524346]"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'M\u1eadt kh\u1ea9u hi\u1ec7n t\u1ea1i', val: oldPassword, set: setOldPassword, show: showOld, toggleShow: () => setShowOld(v => !v) },
                  { label: 'M\u1eadt kh\u1ea9u m\u1edbi', val: newPassword, set: setNewPassword, show: showNew, toggleShow: () => setShowNew(v => !v) },
                  { label: 'X\u00e1c nh\u1eadn m\u1eadt kh\u1ea9u m\u1edbi', val: confirmPassword, set: setConfirmPassword, show: showConfirm, toggleShow: () => setShowConfirm(v => !v) },
                ].map(({ label, val, set, show, toggleShow }) => (
                  <div key={label}>
                    <label className="text-xs font-semibold text-[#524346] mb-1.5 block">{label}</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#847376]" />
                      <input
                        type={show ? 'text' : 'password'}
                        value={val}
                        onChange={e => set(e.target.value)}
                        placeholder="\u2022\u2022\u2022\u2022\u2022\u2022"
                        className="w-full pl-9 pr-10 py-3 rounded-xl border border-[#D6C1C5] bg-[#FFF8F4] text-sm text-[#1F1B17] outline-none focus:border-[#894C5C] transition-colors"
                      />
                      <button type="button" onClick={toggleShow} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#847376]">
                        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-[#BA1A1A]">M\u1eadt kh\u1ea9u x\u00e1c nh\u1eadn kh\u00f4ng kh\u1edbp</p>
                )}
                <button
                  onClick={handleChangePassword}
                  disabled={pwLoading}
                  className="w-full py-3 rounded-xl bg-[#894C5C] text-white font-semibold text-sm hover:bg-[#733949] transition-colors disabled:opacity-60 mt-1"
                >
                  {pwLoading ? '\u0110ang x\u1eed l\u00fd...' : 'X\u00e1c nh\u1eadn \u0111\u1ed5i m\u1eadt kh\u1ea9u'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
