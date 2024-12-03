import { ItemProps } from "@/types/item";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "@/config";

export default function EditScreen() {
  const [itemAuthor, setItemAuthor] = useState<string>();
  const [form, setForm] = useState<{ title: string, body: string }>({ title: "", body: "" });
  const id = String(useLocalSearchParams().id);

  const onEditItem = () => {
    if (auth.currentUser === null) { return }
    if (auth.currentUser.uid !== itemAuthor) { return }
    const ref = doc(db, 'items', id);
    setDoc(ref, {
      title: form?.title,
      body: form?.body,
      updatedAt: Timestamp.fromDate(new Date())
    })
      .then(() => {
        router.back();
      })
      .catch((e) => {
        console.log(e);
      })
  }

  useEffect(() => {
    if (auth.currentUser === null) { return }
    const ref = doc(db, 'items', id);
    getDoc(ref)
      .then((docRef) => {
        setForm({
          title: docRef?.data()?.title,
          body: docRef?.data()?.body,
        });
        setItemAuthor(docRef?.data()?.author);
      })
      .catch((e) => {
        console.log(e);
      })
  }, [])

  return (
    <>
      <View>
        <Text>Edit</Text>
        <Text>Title</Text>
        <TextInput
          value={form?.title}
          onChangeText={(text) => setForm({ title: text, body: form?.body })}
        />
        <Text>Body</Text>
        <TextInput
          value={form?.body}
          onChangeText={(text) => setForm({ title: form?.title, body: text })}
        />
        <Pressable onPress={() => onEditItem()}>
          <Text>Edit</Text>
        </Pressable>
      </View>
    </>
  );
}