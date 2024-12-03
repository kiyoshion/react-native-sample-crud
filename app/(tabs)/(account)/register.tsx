import Button from "@/components/Button";
import { useState } from "react";
import { Text, TextInput } from "react-native";
import { Link, router } from "expo-router";
import { auth } from "@/config";
import { createUserWithEmailAndPassword } from "firebase/auth";

type FormProps = {
  email: string;
  password: string;
}

export default function RegisterScreen() {
  const [form, setForm] = useState<FormProps>({ email: "", password: "" });

  const onRegister = () => {
      createUserWithEmailAndPassword(auth, form.email, form.password)
      .then(() => {
        console.log('User created');
        router.push('/');
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