import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = ({ type = 'success', message, onClose, duration = 5000 }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation
    };

    const icons = {
        success: <CheckCircle className="h-5 w-5 text-emerald-400" />,
        error: <AlertCircle className="h-5 w-5 text-rose-400" />,
        info: <Info className="h-5 w-5 text-indigo-400" />,
        warning: <AlertTriangle className="h-5 w-5 text-amber-400" />,
    };

    const styles = {
        success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-50',
        error: 'border-rose-500/20 bg-rose-500/10 text-rose-50',
        info: 'border-indigo-500/20 bg-indigo-500/10 text-indigo-50',
        warning: 'border-amber-500/20 bg-amber-500/10 text-amber-50',
    };

    if (!message) return null;

    return (
        <div
            className={`fixed bottom-8 right-8 z-[100] flex items-center gap-4 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                } ${styles[type] || styles.success}`}
        >
            <div className="flex shrink-0">
                {icons[type] || icons.success}
            </div>
            <p className="text-sm font-bold tracking-tight">{message}</p>
            <button
                onClick={handleClose}
                className="ml-4 rounded-lg p-1 hover:bg-white/10 transition-colors"
            >
                <X className="h-4 w-4 opacity-50 hover:opacity-100" />
            </button>
        </div>
    );
};

export default Toast;
