import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logVisit } from '../services/db';

export default function VisitTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!pathname.startsWith('/admin')) logVisit(pathname);
  }, [pathname]);
  return null;
}
