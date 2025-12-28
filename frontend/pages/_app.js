import '../styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if on home page
    if (router.pathname === '/') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        const userData = JSON.parse(user);
        if (userData.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/user');
        }
      } else {
        router.push('/login');
      }
    }
  }, [router.pathname]);

  return <Component {...pageProps} />;
}