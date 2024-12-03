import { ItemProps } from "@/types/item";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/config";
import { useState, useEffect } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function ShowScreen() {
  const { id } = useLocalSearchParams();
  const [item, setItem] = useState<ItemProps | null>(null);

  useEffect(() => {
    const ref = doc(db, 'items', String(id));
    const unsubscribe = onSnapshot(ref, (itemDoc) => {
      const { title, body, updatedAt, author } = itemDoc.data() as ItemProps;
      setItem({
        id: itemDoc.id,
        title,
        body,
        updatedAt,
        author,
      });
    });

    return unsubscribe;
  }, []);

  const onDeleteItem = () => {
    if (auth.currentUser === null) { return }
    if (auth.currentUser.uid !== item?.author) { return }
    const ref = doc(db, 'items', String(id));
    Alert.alert('Delete item.', 'Okey?', [
      {
        text: 'Cancel'
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteDoc(ref)
            .catch((e) => {
              console.log(e);
            })
          router.replace('/(tabs)/(item)');
        }
      }
    ])
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: item?.title,
          headerRight: () => (
            item?.author === auth.currentUser?.uid ?
              (
                <>
                  <Pressable
                    onPress={() => router.push({ pathname: '/(tabs)/(item)/edit', params: { id }})}
                  >
                    <Text style={{ color: 'white', paddingHorizontal: 16 }}>edit</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => onDeleteItem()}
                  >
                    <Text style={{ color: 'white', paddingHorizontal: 16 }}>delete</Text>
                  </Pressable>
                </>
              ) : (
                <Pressable
                  onPress={() => router.push({ pathname: '/(tabs)/(item)/edit', params: { id }})}
                >
                  <Text style={{ color: 'white', paddingHorizontal: 16 }}>report</Text>
                </Pressable>
              )
          )
        }}
      />
      <Text style={styles.title}>{item?.title}</Text>
      <Text>{item?.body}</Text>
      <Text>{item?.updatedAt?.toDate().toLocaleDateString('ja-jp')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
  },
  title: {
    fontSize: 24
  }
});