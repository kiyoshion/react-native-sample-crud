import { Pressable, Text, TextInput } from "react-native";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "@/config";
import { useState } from "react";
import { router } from "expo-router";

type ItemProps = {
  title: string;
  body: string;
}

export default function CreateScreen() {
  const [item, setItem] = useState<ItemProps>({ title: "", body: "" });

  const onCreateItem = () => {
    if (auth.currentUser === null) { return }
    addDoc(collection(db, 'items'), {
      title: item.title,
      body: item.body,
      author: auth.currentUser.uid,
      updatedAt: Timestamp.fromDate(new Date()),
    })
      .then((docRef) => {
        console.log(docRef.id);
        router.replace('/(tabs)/(item)');
      })
      .catch((e) => {
        console.log(e);
      })
  }

  return (
    <>
      <Text>Create Item</Text>
      <Text>Title</Text>
      <TextInput
        value={item.title}
        onChangeText={(text) => setItem({ title: text, body: item.body })}
      />
      <Text>Body</Text>
      <TextInput
        value={item.body}
        onChangeText={(text) => setItem({ title: item.title, body: text })}
      />
      <Pressable onPress={() => onCreateItem()}>
        <Text>add</Text>
      </Pressable>
    </>
  );
}