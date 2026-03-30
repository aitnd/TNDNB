import React, { useState, useEffect } from 'react';
import { X, Shield, Bell, Smartphone, Fingerprint, Clock, Zap, CheckCircle2 } from 'lucide-react';
import { triggerHaptic } from '../utils/nativeUX';
import { useAppStore } from '../stores/useAppStore';
import { Preferences } from '@capacitor/preferences';
import { LocalNotifications } from '@capacitor/local-notifications';
import { NativeBiometric } from 'capacitor-native-biometric';

interface NativeSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NativeSettingsModal: React.FC<NativeSettingsModalProps> = ({ isOpen, onClose }) => {
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            loadSettings();
        }
    }, [isOpen]);

    const loadSettings = async () => {
        try {
            const bio = await Preferences.get({ key: 'biometric_enabled' });
            const notif = await Preferences.get({ key: 'notifications_enabled' });
            
            setBiometricEnabled(bio.value === 'true');
            setNotificationsEnabled(notif.value === 'true');
        } catch (e) {
            console.error('Lỗi load settings native:', e);
        } finally {
            setLoading(false);
        }
    };

    const toggleBiometric = async () => {
        triggerHaptic('medium');
        const newValue = !biometricEnabled;
        
        if (newValue) {
            // Kiểm tra xem máy có hỗ trợ không
            try {
                const result = await NativeBiometric.isAvailable();
                if (!result.isAvailable) {
                    alert('Thiết bị của bạn không hỗ trợ bảo mật sinh trắc học.');
                    return;
                }
            } catch (e) {
                alert('Không thể kiểm tra vân tay/khuôn mặt trên thiết bị này.');
                return;
            }
        }

        setBiometricEnabled(newValue);
        await Preferences.set({
            key: 'biometric_enabled',
            value: newValue.toString()
        });
    };

    const toggleNotifications = async () => {
        triggerHaptic('medium');
        const newValue = !notificationsEnabled;

        if (newValue) {
            const permission = await LocalNotifications.requestPermissions();
            if (permission.display !== 'granted') {
                alert('Vui lòng cấp quyền thông báo trong cài đặt điện thoại.');
                return;
            }

            // Lên lịch thông báo mẫu
            await LocalNotifications.schedule({
                notifications: [
                    {
                        title: "Đến giờ ôn bài rồi! 🚢",
                        body: "Dành 5 phút để ôn tập kiến thức đường thủy nhé anh.",
                        id: 1,
                        schedule: { at: new Date(Date.now() + 1000 * 60 * 60 * 24) }, // 24h sau
                        sound: undefined,
                        attachments: undefined,
                        actionTypeId: "",
                        extra: null
                    }
                ]
            });
        } else {
            await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
        }

        setNotificationsEnabled(newValue);
        await Preferences.set({
            key: 'notifications_enabled',
            value: newValue.toString()
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl border border-white/10 animate-scale-up">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-blue-500/10 to-violet-500/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-xl text-white">
                            <Smartphone size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Cài đặt thiết bị</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Biometric Toggle */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                                <Fingerprint size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-black uppercase tracking-widest text-emerald-500 mb-0.5">Bảo mật</p>
                                <p className="text-base font-bold text-slate-700 dark:text-slate-200">Khóa vân tay / FaceID</p>
                            </div>
                        </div>
                        <button 
                            onClick={toggleBiometric}
                            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${biometricEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${biometricEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    {/* Notifications Toggle */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl">
                                <Bell size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-black uppercase tracking-widest text-orange-500 mb-0.5">Nhắc học</p>
                                <p className="text-base font-bold text-slate-700 dark:text-slate-200">Thông báo hàng ngày</p>
                            </div>
                        </div>
                        <button 
                            onClick={toggleNotifications}
                            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${notificationsEnabled ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                        <div className="flex gap-3">
                            <Zap size={18} className="text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium leading-relaxed">
                                Các tính năng này giúp tăng trải nghiệm học tập và bảo mật thông tin cá nhân của bạn trên thiết bị Android.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                    <button 
                        onClick={onClose}
                        className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
                    >
                        Đã hiểu!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NativeSettingsModal;
