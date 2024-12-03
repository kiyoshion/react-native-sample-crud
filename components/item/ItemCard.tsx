import { ItemProps } from "@/types/item";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ItemCard({ item }: { item: ItemProps }) {
  const toStringDate = item.updatedAt.toDate().toLocaleString('ja-jp');

  return (
    <Pressable onPress={() => router.push(`/(tabs)/(item)/${item.id}`) } id={item.id} style={styles.container}>
      {item.body !== null || item.updatedAt !== null ? (
        <>
          <Text>{toStringDate}</Text>
          <Text>{item.title}</Text>
          <Text>{item.body}</Text>
        </>
      ) : (
        <>
          <Text>{item.title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 8,
  }
});