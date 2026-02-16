'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Tag,
    MessageSquare,
    BarChart3,
    Megaphone,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Logo } from '@/components/Icons';
import styles from './Sidebar.module.css';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const supabase = createClient();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
        { icon: Tag, label: 'Pricing', href: '/dashboard/pricing' },
        { icon: MessageSquare, label: 'Reputation', href: '/dashboard/reputation' },
        { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
        { icon: Megaphone, label: 'Promotions', href: '/dashboard/promotions' },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    return (
        <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
            <div className={styles.header}>
                <div className={styles.logo}>
                    <Logo className={styles.logoSvg} />
                    {!isCollapsed && <span>FyndFuel</span>}
                </div>
                <button
                    className={styles.collapseBtn}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            <nav className={styles.nav}>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                            title={isCollapsed ? item.label : ''}
                        >
                            <Icon size={20} />
                            {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.footer}>
                <Link
                    href="/dashboard/settings"
                    className={styles.navItem}
                    title={isCollapsed ? 'Settings' : ''}
                >
                    <Settings size={20} />
                    {!isCollapsed && <span>Settings</span>}
                </Link>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    <LogOut size={20} />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
