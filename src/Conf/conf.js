const conf={
    apiKey:String(import.meta.env.VITE_API_KEY),
    authDomain:String(import.meta.env.VITE_AUTH_DOMAIN),
    projectId:String(import.meta.env.VITE_PROJECT_ID),
    storageBucket:String(import.meta.env.VITE_STORAGE_BUCKET),
    messagingSenderId:String(import.meta.env.VITE_SENDER_ID),
    appId:String(import.meta.env.VITE_APP_ID)
}
export default conf;