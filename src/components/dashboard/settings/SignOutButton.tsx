'use client';

import { LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function SignOutButton() {
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    return (
        <button
            onClick={handleSignOut}
            className="btn-danger"
            style={{
                background: '#fee2e2',
                color: '#dc2626',
                border: '1px solid #fecaca',
                padding: '10px 20px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 600,
                cursor: 'pointer'
            }}
        >
            <LogOut size={18} /> Sign Out
        </button>
    );
}
