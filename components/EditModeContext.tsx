
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface EditModeContextType {
  isEditing: boolean;
  toggleEditMode: () => void;
}

// Fix: Export EditModeContext
export const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export const EditModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditMode = () => {
    setIsEditing(prev => !prev);
  };

  return (
    <EditModeContext.Provider value={{ isEditing, toggleEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
};

export const useEditMode = (): EditModeContextType => {
  const context = useContext(EditModeContext);
  if (context === undefined) {
    throw new Error('useEditMode must be used within an EditModeProvider');
  }
  return context;
};