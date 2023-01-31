import React, { useState } from 'react';

export default function useTabs<Type>(
  
  defaultTab: Type
) {
  const [currentTab, setCurrentTab] = useState<Type>(defaultTab);

  const newTab = (tab: Type) => setCurrentTab(tab);
  const resetTabs = (tab: Type) => setCurrentTab(defaultTab);

  return {
    currentTab,
    newTab,
    resetTabs,
  };
}
