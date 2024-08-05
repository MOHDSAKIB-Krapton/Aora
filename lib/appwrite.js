import { Alert } from "react-native";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.sakib.aora",
  projectId: "6669a3750033451e4990",
  databaseId: "6669bf570026b542b6d7",
  userCollectionId: "6669bf69000b390c5dc4",
  videoCollectionId: "666ad6940003ef16ca26",
  storageId: "6669a8b80017aa4ca8b4",
};

// Init your React Native SDK
const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

// Register User
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Creating new User
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) {
      throw Error();
    }

    const avatarURL = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        username,
        email,
        avatar: avatarURL,
        accountId: newAccount.$id,
      }
    );

    return newUser;
  } catch (error) {
    Alert.alert(error.message);
  }
};

// Sign In function
export const signIn = async (email, password) => {
  try {
    const newSession = await account.createEmailPasswordSession(
      email,
      password
    );
    return newSession;
  } catch (error) {
    Alert.alert("Error", error.message);
  }
};

// Sign Out function
export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    console.log(session);
    return session;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = async () => {
  try {
    // Finding the account
    const currentAccount = await account.get();

    if (!currentAccount) {
      throw Error;
    }

    // Finding the user from account
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) {
      throw Error;
    }

    // return only first user
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (err) {
    throw new Error(err);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      // Need to learn this
      [Query.orderDesc("$createdAt", Query.limit(7))]
    );

    return posts.documents;
  } catch (err) {
    throw new Error(err);
  }
};

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      // Need to learn this
      [Query.search("title", query)]
    );

    return posts.documents;
  } catch (err) {
    throw new Error(err);
  }
};

export const getUserPosts = async (UserId) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      // Need to learn this
      [Query.equal("creator", UserId), Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (err) {
    throw new Error(err);
  }
};

export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (e) {
    Alert.alert("Error", e);
  }
};

export const uploadFile = async (file, fileType) => {
  // If no file  exist, simply return
  if (!file) return;

  // just changed the name of mimetype to type so that appwrite can understand
  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = getFilePreview(uploadedFile.$id, fileType);
    return fileUrl;
  } catch (e) {
    Alert.alert("Error", e);
  }
};

export const getFilePreview = (fileId, fileType) => {
  let fileUrl;

  try {
    if (fileType === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else if (fileType === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else {
      throw new Error("Invalid file type");
    }

    // If we didnt get fileUrl
    if (!fileUrl) throw new Error();

    return fileUrl;
  } catch (e) {
    Alert.alert("Error", e);
  }
};

export const updateBookmark = async (UserId) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      // Need to learn this
      [
        Query.equal("users", UserId),
        // Query.equal("creator", UserId),
        Query.orderDesc("$createdAt"),
      ]
    );

    return posts.documents;
  } catch (err) {
    throw new Error(err);
  }
};
