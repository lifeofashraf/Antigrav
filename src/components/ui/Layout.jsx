import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, showSidebar = true }) => {
    if (!showSidebar) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <main className="flex-1 ml-[260px] transition-all duration-300">
                {children}
            </main>
        </div>
    );
};

export default Layout;
