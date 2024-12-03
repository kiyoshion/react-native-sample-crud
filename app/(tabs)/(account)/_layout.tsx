import { router, Stack } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Pressable, Text } from 'react-native';
import { auth } from '@/config';

export default function TabLayout() {
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
      <>
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
      </>
    </Stack>
  );
}