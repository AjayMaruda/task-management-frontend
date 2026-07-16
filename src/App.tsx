import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import router from './routes';
import { ToastManager } from './components/ToastManager';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ToastManager />
      <RouterProvider router={router} />
    </Provider>
  );
};

export default App;
