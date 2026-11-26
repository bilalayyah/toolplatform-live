import {useEffect, type ReactNode} from 'react';
import {useLocation} from 'react-router-dom';
import {Footer} from './Footer';
import {Header} from './Header';

export function Layout({children}: {children: ReactNode}) {
  const {pathname} = useLocation();

  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'auto'});
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#0B1120] text-slate-900 dark:text-slate-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[#0A8CFF] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
