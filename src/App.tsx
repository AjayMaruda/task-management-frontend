import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PrimeReactProvider } from '@primereact/core';
import Aura from '@primeuix/themes/aura';
import { store } from './store';
import router from './routes';
import { TaskProvider } from './context/TaskProvider';
import { ToastManager } from './components/ToastManager';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PrimeReactProvider theme={{ preset: Aura }}>
        <TaskProvider>
          <ToastManager />
          <RouterProvider router={router} />
        </TaskProvider>
      </PrimeReactProvider>
    </Provider>
  );
};

export default App;
