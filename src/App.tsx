import React from 'react';
import { PrimeReactProvider } from '@primereact/core';
import Aura from '@primeuix/themes/aura';
import { TaskProvider } from './context/TaskContext';
import { TasksPage } from './pages/TasksPage';

const App: React.FC = () => {
  return (
    <PrimeReactProvider theme={{ preset: Aura }}>
      <TaskProvider>
        <TasksPage />
      </TaskProvider>
    </PrimeReactProvider>
  );
};

export default App;
