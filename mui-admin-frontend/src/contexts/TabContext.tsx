import { createContext, useContext, useState, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  component: ReactNode;
  closable?: boolean;
}

interface TabContextType {
  tabs: TabItem[];
  activeTab: string;
  addTab: (tab: TabItem) => void;
  removeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<TabItem[]>([
    { id: 'dashboard', label: '대시보드', component: null, closable: false },
  ]);
  const [activeTab, setActiveTabState] = useState('dashboard');

  const addTab = (newTab: TabItem) => {
    const exists = tabs.find((t) => t.id === newTab.id);
    if (!exists) {
      setTabs([...tabs, { ...newTab, closable: newTab.closable !== false }]);
    }
    setActiveTabState(newTab.id);
  };

  const removeTab = (id: string) => {
    const index = tabs.findIndex((t) => t.id === id);
    if (index === -1) return;

    const newTabs = tabs.filter((t) => t.id !== id);
    setTabs(newTabs);

    if (activeTab === id) {
      const newActiveTab = newTabs[Math.max(0, index - 1)]?.id || newTabs[0]?.id;
      setActiveTabState(newActiveTab);
    }
  };

  const setActiveTab = (id: string) => {
    if (tabs.find((t) => t.id === id)) {
      setActiveTabState(id);
    }
  };

  return (
    <TabContext.Provider value={{ tabs, activeTab, addTab, removeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTabs() {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabs must be used within TabProvider');
  }
  return context;
}
