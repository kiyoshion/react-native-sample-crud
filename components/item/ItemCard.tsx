import { db, storage } from "@/config";
import { ItemProps } from "@/types/item";
import { UserProps } from "@/types/user";
import { router } from "expo-router";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function ItemCard({ item }: { item: ItemProps }) {
  const [author, setAuthor] = useState();
  const [itemImage, setItemImage] = useState<string>("");
  const toStringDate = item.updatedAt.toDate().toLocaleString('ja-jp');
  console.log('item: ',item)

  const getImage = async (photourl: string) => {
    const storageRef = ref(storage, photourl.replace('.jpg', '_100x100.jpg'))
    const url = await getDownloadURL(storageRef)
    setItemImage(url)
  }

  useEffect(() => {
      console.log('itemAuhor ',item.author)
      const ref = item.author;
      if (item.image !== "") {
        getImage(item.image)
      }
      // @ts-ignore
      onSnapshot(ref, (userDoc: { data: () => any; }) => {
        const { uid, displayName, photoURL } = userDoc.data() as UserProps;
        console.log('userDoc ',userDoc.data())
        setAuthor({
          // @ts-ignore
          uid,
          displayName,
          photoURL
        })
      })
  }, [])

  return (
    <Pressable onPress={() => router.push(`/(tabs)/(item)/${item.id}`) } id={item.id} style={styles.container}>
      {item.body !== null || item.updatedAt !== null ? (
        <>
          {/* @ts-ignore */}
          {item.image !== "" && (<Image source={itemImage} style={{ width: 100, height: 100 }} />)}
          <Text style={styles.title}>{item.title}</Text>
          <Text>{item.body}</Text>
          <Text>{toStringDate}</Text>
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
  },
  title: {
    fontSize: 20
  }
});