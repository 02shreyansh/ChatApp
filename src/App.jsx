import {Box,Container,VStack,Button, Input, HStack} from '@chakra-ui/react'
import Message from './Components/Message'
import {onAuthStateChanged,getAuth,GoogleAuthProvider,signInWithPopup,signOut} from 'firebase/auth'
import {app} from './Firebase'
import {getFirestore,addDoc,collection, serverTimestamp,onSnapshot,query,orderBy} from 'firebase/firestore'
import { useEffect, useRef, useState } from 'react'
const auth=getAuth(app)
const loginHandler=()=>{
  const provider=new  GoogleAuthProvider();
  signInWithPopup(auth,provider)
}
const logoutHandler=()=>signOut(auth)

const db=getFirestore(app)

function App() {
  const q=query(collection(db,"Messages"),orderBy("createdAt","asc"))
  const [user,setUser]=useState(false)  
  const [message,setMessage]=useState("")
  const [messages,setMessages]=useState([])
  const divForScroll=useRef(null)
  const submitHandler=async (e)=>{
    e.preventDefault();
    try {
      setMessage("")
      await addDoc(collection(db,"Messages"),{
        text:message,
        uid:user.uid,
        uri:user.photoURL,
        createdAt:serverTimestamp()
      })
      
      divForScroll.current.scrollIntoView({behavior:"smooth"})
    } catch (error) {
      alert(error)
      
    }
  }
  useEffect(()=>{
    const unsubscribe=onAuthStateChanged(auth,(data)=>{
      setUser(data)
    });
    const unsubscribeForMessage=onSnapshot(q,(snap)=>{
      setMessages(snap.docs.map((doc)=>{
        const id=doc.id;
        return {id,...doc.data()}
      }));

    });
    return ()=>{
      unsubscribe();
      unsubscribeForMessage();
    }
  },[user])
  return (
    <Box bg={"red.50"}>
      {
        user?(
          <Container h={"100vh"} bg={"white"}>
            <VStack h={"full"} paddingY={"4"}>
              <Button onClick={logoutHandler} colorScheme={"red"} w={"full"}>LogOut</Button>
              <VStack h={"full"} w={"full"} overflowY={"auto"} css={{"&::-webkit-scrollbar":{
                display:"none"
              }}}>
                {
                  messages.map((m)=>(
                    <Message key={m.id} text={m.text} uri={m.uri}  user={m.uid===user.uid?"me":"other"} />
                  ))
                }
                <div ref={divForScroll}></div>
              </VStack>
             
              <form onSubmit={submitHandler} style={{width:"100%"}}>
                <HStack>
                  <Input placeholder='Enter a Meassage. . .' value={message} onChange={(e)=>setMessage(e.target.value)}/>
                  <Button colorScheme={"purple"} type='submit'>Send</Button>
                </HStack>
              </form>
            </VStack>
          </Container>
        ):<VStack h="100vh" bg={"white"} justifyContent={"center"}>
          <Button onClick={loginHandler} colorScheme='blue'>Sign In with Google</Button>
        </VStack>
      }

    </Box>
  )
}

export default App
