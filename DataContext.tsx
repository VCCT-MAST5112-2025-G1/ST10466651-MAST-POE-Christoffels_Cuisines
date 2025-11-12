import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { drinks as drinksConst, food as foodConst } from './constants';

// ---------------- TYPES ----------------

// Base item type for food & drinks
type Item = {
  name: string;
  desc: string;
  price: string;
};

// Food data shape
type FoodType = {
  starters: Item[];
  mains: Item[];
  desserts: Item[];
  specials: Item[];
};

// Drinks data shape
type DrinksType = {
  wines: Item[];
  cocktails: Item[];
  spirits: Item[];
  beverages: Item[];
};

// Context type definition
type AppDataContextType = {
  menuItems: any[];
  drinks: DrinksType;
  food: FoodType;
  foodCounts: Record<keyof FoodType, number>;
  drinkCounts: Record<keyof DrinksType, number>;
  viewAll: boolean;
  populateAll: () => void;
  clearAll: () => void;
  populateMenu: () => void;
  clearMenu: () => void;
  setMenuItems: React.Dispatch<React.SetStateAction<any[]>>;
  setDrinks: React.Dispatch<React.SetStateAction<DrinksType>>;
  setFood: React.Dispatch<React.SetStateAction<FoodType>>;
  setViewAll: React.Dispatch<React.SetStateAction<boolean>>;
};

// ---------------- CONTEXT INITIALIZATION ----------------

export const AppDataContext = createContext<AppDataContextType>({
  menuItems: [],
  drinks: { wines: [], cocktails: [], spirits: [], beverages: [] },
  food: { starters: [], mains: [], desserts: [], specials: [] },
  foodCounts: { starters: 0, mains: 0, desserts: 0, specials: 0 },
  drinkCounts: { wines: 0, cocktails: 0, spirits: 0, beverages: 0 },
  viewAll: false,
  populateAll: () => {},
  clearAll: () => {},
  populateMenu: () => {},
  clearMenu: () => {},
  setMenuItems: () => {},
  setDrinks: () => {},
  setFood: () => {},
  setViewAll: () => {},
});

// ---------------- PROVIDER ----------------

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [menuItemsState, setMenuItems] = useState<any[]>([]);
  const [drinksState, setDrinks] = useState<DrinksType>(drinksConst);
  const [foodState, setFood] = useState<FoodType>(foodConst);
  const [viewAll, setViewAll] = useState(false);

  const [foodCounts, setFoodCounts] = useState<Record<keyof FoodType, number>>({
    starters: 0,
    mains: 0,
    desserts: 0,
    specials: 0,
  });

  const [drinkCounts, setDrinkCounts] = useState<Record<keyof DrinksType, number>>({
    wines: 0,
    cocktails: 0,
    spirits: 0,
    beverages: 0,
  });

  // ---------------- COUNTERS ----------------

  useEffect(() => {
    const newFoodCounts = {
      starters: foodState.starters?.length || 0,
      mains: foodState.mains?.length || 0,
      desserts: foodState.desserts?.length || 0,
      specials: foodState.specials?.length || 0,
    };
    setFoodCounts(newFoodCounts);
  }, [foodState]);

  useEffect(() => {
    const newDrinkCounts = {
      wines: drinksState.wines?.length || 0,
      cocktails: drinksState.cocktails?.length || 0,
      spirits: drinksState.spirits?.length || 0,
      beverages: drinksState.beverages?.length || 0,
    };
    setDrinkCounts(newDrinkCounts);
  }, [drinksState]);

  // ---------------- ACTIONS ----------------

  const populateAll = () => {
    setDrinks(drinksConst);
    setFood(foodConst);
    setViewAll(true);
  };

  const clearAll = () => {
    setMenuItems([]);
    setFood({ starters: [], mains: [], desserts: [], specials: [] });
    setViewAll(false);
  };

  const populateMenu = () => {
    setFood(foodConst);
    setDrinks(drinksConst);
    setViewAll(true);
  };

  const clearMenu = () => {
    setMenuItems([]);
    setFood({ starters: [], mains: [], desserts: [], specials: [] });
    setDrinks({ wines: [], cocktails: [], spirits: [], beverages: [] });
    setViewAll(false);
  };

  // ---------------- RETURN ----------------

  return (
    <AppDataContext.Provider
      value={{
        menuItems: menuItemsState,
        drinks: drinksState,
        food: foodState,
        foodCounts,
        drinkCounts,
        viewAll,
        populateAll,
        clearAll,
        populateMenu,
        clearMenu,
        setMenuItems,
        setDrinks,
        setFood,
        setViewAll,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};
