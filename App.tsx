
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
// Fix: Ensure Navbar is default exported from its module
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import TrainingsleerPage from './pages/TrainingsleerPage';
import TrainingsmethodePage from './pages/TrainingsmethodePage';
import LooptechniekPage from './pages/LooptechniekPage';
import TrainingGevenPage from './pages/TrainingGevenPage';
import { EditModeProvider } from './components/EditModeContext';

const App: React.FC = () => {
  return (
    <EditModeProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen bg-slate-100 text-slate-800">
          <Navbar />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-8 flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/trainingsleer" element={<TrainingsleerPage />} />
              <Route path="/trainingsmethode" element={<TrainingsmethodePage />} />
              <Route path="/looptechniek" element={<LooptechniekPage />} />
              <Route path="/training-geven" element={<TrainingGevenPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </EditModeProvider>
  );
};

export default App;
