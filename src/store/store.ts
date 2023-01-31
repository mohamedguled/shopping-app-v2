import { create } from 'zustand';
export type TabType = 'products' | 'categories';
type Store = {
  currentTab: TabType;
  newTab: (tab: TabType) => void;
  resetTab: () => void;
};

export const useStore = create<Store>((set) => ({
  currentTab: 'products',
  newTab(tab) {
    set(() => ({
      currentTab: tab,
    }));
  },
  resetTab() {
    set(() => ({
      currentTab: 'products',
    }));
  },
}));
