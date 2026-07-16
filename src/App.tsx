import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PrimeReactProvider } from '@primereact/core';
import Aura from '@primeuix/themes/aura';
import { store } from './store';
import router from './routes';
import { ToastManager } from './components/ToastManager';

const App: React.FC = () => {
  useEffect(() => {
    const removeLicenseBanner = () => {
      const el = document.getElementById('p-license-host');
      if (el) el.remove();
    };
    removeLicenseBanner();
    const observer = new MutationObserver(removeLicenseBanner);
    observer.observe(document.body, { childList: true });
    return () => observer.disconnect();
  }, []);

  return (
    <Provider store={store}>
      <PrimeReactProvider theme={{ preset: Aura, options: { darkModeSelector: '.dark', cssLayer: false } }}>
        <ToastManager />
        <RouterProvider router={router} />
      </PrimeReactProvider>
    </Provider>
  );
};

export default App;
