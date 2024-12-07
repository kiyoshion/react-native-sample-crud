import Button from "@/components/Button";
import { useEffect, useState } from "react";
import { Text, TextInput } from "react-native";
import { Link, router } from "expo-router";
import { auth, db } from "@/config";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

type FormProps = {
  email: string;
  password: string;
}

export default function RegisterScreen() {
  const [form, setForm] = useState<FormProps>({ email: "", password: "" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/(tabs)/(account)/profile');
      }
    })
    return unsubscribe;
  },[])

  const onRegister = () => {
    const generatedName = `${form.email.slice(0, 2).toUpperCase()}${Math.floor(Math.random() * 10000000)}`;
      createUserWithEmailAndPassword(auth, form.email, form.password)
      .then((userCredential) => {
        setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          displayName: generatedName,
          photoURL: "",
        })
        .then(() => {
          router.replace('/');
        })
        .catch((e) => {
          console.log(e);
        })
      })
      .catch(e => {
        console.log(e);
      })
  }

  return (
    <>
      <Text>Email</Text>
      <TextInput
        value={form.email}
        onChangeText={(text) => setForm({ email: text, password: form.password })}
      />
      <Text>Password</Text>
      <TextInput
        value={form.password}
        onChangeText={(text) => setForm({ email: form.email, password: text })}
      />
      <Button label="register" theme="primary" onPress={() => onRegister()} />
      <Link replace href="/(tabs)/(account)/login">login</Link>
    </>
  );
}