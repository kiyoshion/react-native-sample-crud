import { storage } from "@/config"
import { getDownloadURL, ref } from "firebase/storage"

export default function getResizePhotoUrl(photoURL: string | null, size: number ) {
  const getPhoto = async () => {
    const storageRef = ref(storage, photoURL?.replace('.jpg', `_${size}x${size}.jpg`))
    const result = await getDownloadURL(storageRef)
    return result
  }

  const res = getPhoto()
  console.log('res: ',res)
  return res
}