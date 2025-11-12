import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { styles } from '../global';
import { AppDataContext } from '../DataContext';
import { drinks } from '../constants';

// Helper function to find all newly added items
const findNewlyAddedItems = (prevFood: any, currFood: any): any[] => {
  const categories = ['starters', 'mains', 'desserts', 'specials'];
  const newItems: any[] = [];
  
  for (const category of categories) {
    const prevItems = prevFood?.[category] || [];
    const currItems = currFood?.[category] || [];
    
    // If new items were added, get all items added since last state
    if (currItems.length > prevItems.length) {
      const addedCount = currItems.length - prevItems.length;
      newItems.push(...currItems.slice(-addedCount));
    }
  }
  
  return newItems;
};

export default function HomeScreen() {
  const { food, populateAll, clearAll, viewAll } = useContext(AppDataContext);

  // Combined array of all meals
  const [allItems, setAllItems] = useState<any[]>([]);
  // track whether the Populate button should be disabled
  const [populateDisabled, setPopulateDisabled] = useState<boolean>(false);
  // track the previous food state to detect newly added items
  const [prevFoodState, setPrevFoodState] = useState<any>(null);

  useEffect(() => {
    if (viewAll) {
      // Combine all food categories dynamically
      const combined: any[] = [
        ...(food.starters || []),
        ...(food.mains || []),
        ...(food.desserts || []),
        ...(food.specials || []),
        ...drinks.wines,
        ...drinks.spirits,
        ...drinks.cocktails,
        ...drinks.beverages,
      ];
      setAllItems(combined);
      setPrevFoodState(food);
    } else {
      // Check if new items were added (food changed but viewAll is still false)
      if (prevFoodState) {
        const newItems = findNewlyAddedItems(prevFoodState, food);
        setAllItems(newItems);
      }
      setPrevFoodState(food);
    }
  }, [food, viewAll]); // Updates whenever food changes

  // Disable populate button if the menu box (`allItems`) already contains items
  useEffect(() => {
    setPopulateDisabled(allItems.length > 0);
  }, [allItems]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.maintitle}>Christoffel’s{'\n'}Cuisines</Text>

      <View style={styles.menuBox}>
        <FlatList
          data={allItems}
          keyExtractor={(item) => item.name + Math.random()} // Avoid duplicate keys
          renderItem={({ item }) => (
            <View style={styles.mainitem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>- {item.name}</Text>
                <Text style={styles.itemDesc}>{item.desc}</Text>
              </View>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.populateButton, populateDisabled && { opacity: 0.5 }]}
          onPress={() => {
            if (!populateDisabled) {
              populateAll();
              setPopulateDisabled(true);
            }
          }}
          disabled={populateDisabled}
        >
          <Text style={styles.buttonText}>Populate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => {
            clearAll();
            setPopulateDisabled(false);
          }}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.counter}>Items: {allItems.length}</Text>
      {/* compute averages based on what's currently visible in the menu box (allItems) */}
      {
        (() => {
          const findInBox = (sourceArray: any[] | undefined) =>
            allItems.filter(ai => (sourceArray || []).some(s => s.name === ai.name));

          const startersInBox = findInBox(food.starters);
          const mainsInBox = findInBox(food.mains);
          const dessertsInBox = findInBox(food.desserts);
          const specialsInBox = findInBox(food.specials);

          const avg = (items: any[]) => {
            if (!items || items.length === 0) return '0.00';
            const sum = items.reduce((s, it) => s + (parseFloat((it.price || '').toString().replace('R', '')) || 0), 0);
            return (sum / items.length).toFixed(2);
          };

          const text =
            `Avg Starters: R${avg(startersInBox)}\n` +
            `Avg Mains: R${avg(mainsInBox)}\n` +
            `Avg Desserts: R${avg(dessertsInBox)}\n` +
            `Avg Specials: R${avg(specialsInBox)}`;

          return <Text style={styles.avgPriceText}>{text}</Text>;
        })()
      }
    </SafeAreaView>
  );
}
