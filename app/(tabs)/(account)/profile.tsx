import { auth, db, storage } from "@/config";
import { UserProps } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes, uploadString } from "firebase/storage";

export default function ProfileScreen() {
  const [user, setUser] = useState<UserProps>();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [userPhoto, setUserPhoto] = useState<any>()
  const [storageRef, setStorageRef] = useState<any>()

  // @ts-ignore
  const getUserPhoto = async (photourl) => {
    const storageRef = ref(storage, photourl.replace('.jpg', '_100x100.jpg'))
    const url = await getDownloadURL(storageRef)
    console.log('userPhoto: ', url)
    setUserPhoto(url)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/(tabs)/(account)/login');
      } else {
        console.log('uid ',user.uid)
        const reff = doc(db, 'users', user.uid);
        onSnapshot(reff, (userDoc) => {
          const { uid, displayName, photoURL } = userDoc.data() as UserProps;
          console.log('userDoc ',userDoc.data())
          if (uid) {
            setUser({
              uid,
              displayName,
              photoURL,
            });
          getUserPhoto(photoURL)
          }
        });
      }
    })
    return unsubscribe;
  }, []);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('You did not select any image');
    }
  }

  const onStorePhoto = () => {
    const randomNum = Math.floor(Math.random() * 1000000)
    const photoRef = ref(storage, `images/users/${user?.uid}/${randomNum}.jpg`)
    let fullpath = "";
    uploadString(photoRef, selectedImage, 'data_url')
      .then((snapshot) => {
        console.log('done ', String(snapshot.metadata.fullPath).replace('.jpg', '_100x100.jpg'))
        fullpath = String(snapshot.metadata.fullPath);
      }).then(() => {
        // @ts-ignore
        const userRef = doc(db, 'users', user?.uid);
        updateDoc(userRef, {
          photoURL: fullpath
        })
        setSelectedImage("")
      }).then(() => {
        const resultPhoto = ref(storage, fullpath);
        getDownloadURL(resultPhoto)
          .then((url) => {
            setUserPhoto(url)
          })
      })
  }

  const ImageIcon = () => {
    if (selectedImage !== "") {
      return (
        <View style={styles.avatarEditContainer}>
          <Image source={selectedImage} style={styles.avatar} />
          <Pressable onPress={() => onStorePhoto()}>
            <Ionicons name="checkmark" size={24} color="black" />
          </Pressable>
        </View>
      )
    } else if (user?.photoURL !== "") {
      // @ts-ignore
      return (<Image source={userPhoto} style={styles.avatar}/>)
    } else {
      return (<Image source={user?.photoURL} style={styles.avatar} />)
    }
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => pickImageAsync()}>
        {user?.photoURL === "" && selectedImage === undefined ? (
          <Ionicons name='person' color='gray' size={80} style={styles.avatar} />
        ) : (
          <ImageIcon />
        )}
      </Pressable>
      <Text>{user?.displayName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 100,
    marginVertical: 16,
  },
  avatarEditContainer: {
  }
})