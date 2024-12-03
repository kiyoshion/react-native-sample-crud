import Button from "@/components/Button";
import { auth } from "@/config";
import { Link, router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Text, TextInput } from "react-native";

type FormProps = {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const [form, setForm] = useState<FormProps>({ email: "", password: "" });

  const onLogin = () => {
    signInWithEmailAndPassword(auth, form.email, form.password)
    .then((userCredential) => {
      console.log(userCredential.user.uid);
      router.replace('/(tabs)/(item)');
    })
    .catch((e) => {
      console.log(e);
    })
  }

  return (
    <>
      <Text>login</Text>
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
      <Button label="login" theme="primary" onPress={() => onLogin()} />
      <Link replace href="/(tabs)/(account)/register">register</Link>
    </>
  );
}