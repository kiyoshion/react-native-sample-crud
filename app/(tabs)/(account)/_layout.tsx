import { router, Stack } from 'expo-router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Pressable, Text } from 'react-native';
import { auth } from '@/config';
import { useEffect, useState } from 'react';
import { UserProps } from '@/types/user';

export default function TabLayout() {
  const [user, setUser] = useState<UserProps>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL
        })
        console.log('user is logged in ', user)
      }
    })
    return unsubscribe;
  },[])

  const onLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('logout')
        router.replace('/(tabs)/(account)/login');
      })
      .catch((e) => {
        console.log(e);
      })
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#25292e',
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        headerRight: () => (
          <Pressable onPress={() => onLogout()} >
            <Text style={{ paddingHorizontal: 16, color: 'white'}}>
            logout
            </Text>
          </Pressable>
        )
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: 'Register',
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Stack>
  )
}