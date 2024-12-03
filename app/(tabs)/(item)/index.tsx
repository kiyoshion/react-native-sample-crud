import { View, Text, StyleSheet, FlatList } from "react-native";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/config";
import { useEffect, useState } from "react";
import { ItemProps } from "@/types/item";
import ItemCard from "@/components/item/ItemCard";
import { Link, Stack } from "expo-router";

export default function ItemScreen() {
  const [items, setItems] = useState<ItemProps[]>([]);

  useEffect(() => {
    const ref = collection(db, 'items');
    const q = query(ref, orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshoot) => {
      const tmpItems: ItemProps[] = [];
      snapshoot.forEach((doc) => {
        console.log('item: ', doc.id);
        const { title, body, updatedAt, author } = doc.data();
        tmpItems.push({
          id: doc.id,
          title,
          body,
          updatedAt,
          author,
        });
      });
      setItems(tmpItems);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Items',
          headerRight: () => (
            <Link style={{ color: 'white', paddingHorizontal: 16 }} href="/(tabs)/(item)/create">Add</Link>
          )
        }}
      />
      <Text>items</Text>
      <FlatList
        data={items}
        renderItem={({ item }) => <ItemCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  }
});