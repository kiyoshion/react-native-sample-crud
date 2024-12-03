import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import { Text } from "react-native";

type UserProps = {
  uid: string;
}

export default function ProfileScreen() {
  const [user, setUser] = useState<UserProps>({ uid: "" });
  const auth = getAuth();
  onAuthStateChanged(auth, (user: any) => {
    setUser({ uid: user.uid })
  })

  return (
    <>
      <Text>{user.uid}</Text>
    </>
  );
}