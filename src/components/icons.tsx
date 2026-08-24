import type { SVGProps } from 'react';

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: 'search' | 'plus' | 'check' | 'edit' | 'trash' | 'calendar' | 'sparkle' | 'close' | 'chevron' | 'inbox' | 'sun' | 'moon' | 'dots' }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5" /></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
    sparkle: <><path d="m12 3-1.2 4.1a4 4 0 0 1-2.7 2.7L4 11l4.1 1.2a4 4 0 0 1 2.7 2.7L12 19l1.2-4.1a4 4 0 0 1 2.7-2.7L20 11l-4.1-1.2a4 4 0 0 1-2.7-2.7Z" /><path d="m19 3-.4 1.3L17 5l1.6.7L19 7l.4-1.3L21 5l-1.6-.7Z" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    chevron: <path d="m7 10 5 5 5-5" />,
    inbox: <><path d="M4 4h16v16H4z" /><path d="M4 14h4l2 2h4l2-2h4" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    moon: <path d="M20.5 14.7A8.5 8.5 0 0 1 9.3 3.5 8.5 8.5 0 1 0 20.5 14.7Z" />,
    dots: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
