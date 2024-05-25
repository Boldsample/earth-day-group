import { useParams } from 'react-router'
import EmojiPicker from 'emoji-picker-react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { faFaceSmile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'
import { getMessages, sendMessage } from '@services/chatServices'
import { setHeader, setHeaderTitle } from '@store/slices/globalSlice'

import './styles.sass'

const Chat = () => {
  let last = 0
  const input = useRef()
  const dispatch = useDispatch()
  const { contact } = useParams()
  const chatWrapper = useRef(null)
  const emojiWrapper = useRef(null)
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [calling, setCalling] = useState(false)
  const [messages, setMessages] = useState(null)
  const userId = useSelector((state) => state.users.userData.id)
  const notifications = useSelector((state) => state.users.notifications)

  const handleEmoji = e => {
    setOpen(false)
    setMessage(prev => prev + e.emoji)
    input.current.focus()
  }
  const handleClickOutside = e => {
    if(!emojiWrapper.current.contains(e.target))
      setOpen(false)
  }
  const send = e => {
    e.preventDefault()
    if(sendMessage({
      message,
      incoming: userId,
      outgoing: contact,
    }))
    setMessage("")
  }
  const callMessages = async () => {
    setCalling(true)
    const _last = messages?.length ? messages[messages.length - 1].date : 0
    console.log(_last)
    const _add = await getMessages({user: userId, contact: contact, last: _last})
    setMessages(prev => {
      const _prev = prev?.length ? [...prev] : []
      const _new = [..._prev, ..._add]
      return _new
    })
    setCalling(false)
  }

  useEffect(() => {
    if(!calling)
      callMessages()
  }, [notifications])
  useEffect(() => {
    chatWrapper.current.scrollTo({
      behavior: 'smooth',
      top: chatWrapper.current.scrollHeight,
    })
    dispatch(setHeader('settings'))
    dispatch(setHeaderTitle('User chat'))
    if(emojiWrapper.current)
      document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open, messages])
  console.log(messages)

  return <div className="layout" style={{background: 'white'}}>
    <div className="main__content centerwidth">
      <div ref={chatWrapper} className="chat__scroll">
        <div className="chat__messages">
          {messages?.map((message, key) => {
            const same = last == message.incoming ? 'same ' : ''
            last = message.incoming
            return <div key={key} className={'chat_card ' + same + (message.incoming == userId ? 'user' : 'contact')}>
              <MultiUseCard 
                type="chat"
                message={message} />
            </div>
          })}
        </div>
      </div>
      <form className="chat__input" onSubmit={send}>
        <input ref={input} value={message} type="text" placeholder="Type your message" onChange={e => setMessage(e.target.value)} />
        <div className="emoji">
          <FontAwesomeIcon icon={faFaceSmile} onClick={() => setOpen(!open)} />
          <div ref={emojiWrapper} className="emoji__wrapper"><EmojiPicker open={open} onEmojiClick={handleEmoji} /></div>
        </div>
        <button className={!message ? '' : 'dark-blue'} type="submit" disabled={!message}>Send</button>
      </form>
    </div>
  </div>
}

export default Chat