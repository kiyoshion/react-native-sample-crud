import { Link, Stack } from 'expo-router';

export default function TabLayout() {

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#25292e',
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
      }}
    >
        <>
          <Stack.Screen
            name="index"
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="create"
            options={{
              title: 'Create',
            }}
          />
          <Stack.Screen
            name="[id]"
            options={{
              title: 'Show',
            }}
          />
          <Stack.Screen
            name="edit"
            options={{
              title: 'Edit',
            }}
          />
        </>
    </Stack>
  );
}