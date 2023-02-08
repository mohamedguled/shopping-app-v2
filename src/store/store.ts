import { create } from 'zustand';
import { PresetType } from '../db';
export type TabType = 'products' | 'order';
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

type SelectStore = {
  items: PresetType[] | null;
  currentItem: PresetType | null;
  setItems: (newItems: PresetType[]) => void;
  setCurrentItem: (newItem: PresetType) => void;
};

export const useSelectStore = create<SelectStore>((set) => ({
  items: null,
  currentItem: null,
  setItems(newItems) {
    set((state) => ({
      ...state,
      items: newItems,
    }));
  },
  setCurrentItem(newItem) {
    set((state) => ({
      ...state,
      currentItem: newItem,
    }));
  },
}));
