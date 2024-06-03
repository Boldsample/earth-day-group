import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import EmojiPicker from 'emoji-picker-react'
import { useEffect, useRef, useState } from 'react'
import { InputNumber } from 'primereact/inputnumber'
import { useNavigate, useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFaceSmile, faSearch } from '@fortawesome/free-solid-svg-icons'

import { getUser } from '@services/userServices'
import OfferInfo from '@modules/offers/OfferInfo'
import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'
import { getOffer, updateOffer } from '@services/offersServices'
import { getMessages, sendMessage } from '@services/chatServices'
import { setHeader, setHeaderTitle } from '@store/slices/globalSlice'

import './styles.sass'

const Chat = () => {
  let last = 0
  const input = useRef()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const chatWrapper = useRef(null)
  const emojiWrapper = useRef(null)
  const { contact, offer } = useParams()
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [sent, setSent] = useState(false)
  const [message, setMessage] = useState("")
  const [calling, setCalling] = useState(false)
  const [messages, setMessages] = useState(null)
  const [proposal, setProposal] = useState(null)
  const [outgoing, setOutgoing] = useState(null)
  const [offerInfo, setOfferInfo] = useState(null)
  const userId = useSelector((state) => state.users.userData.id)
  const notifications = useSelector((state) => state.users.notifications)
  
  const callMessages = async () => {
    setCalling(true)
    setSent(false)
    const _last = messages?.length ? messages[messages.length - 1].date : 0
    const _add = await getMessages({user: userId, contact: outgoing?.id, last: _last})
    if(_add?.length)
      setMessages(prev => {
        const _prev = prev?.length ? [...prev] : []
        const _new = [..._prev, ..._add]
        return _new
      })
    setCalling(false)
  }
  const handleEmoji = e => {
    setOpen(false)
    setMessage(prev => prev + e.emoji)
    input.current.focus()
  }
  const handleClickOutside = e => {
    if(!emojiWrapper.current.contains(e.target))
      setOpen(false)
  }
  const send = async e => {
    e.preventDefault()
    if(await sendMessage({ message, incoming: userId, outgoing: outgoing?.id })){
      setSent(true)
      setMessage("")
    }
  }
  const hidePopup = () => setShow(false)
  const sendOffer = async e => {
    e.preventDefault()
    if(await sendMessage({ type: 'offer', offer, incoming: userId, outgoing: outgoing?.id, price: proposal })){
      navigate(`/chat/${contact}/`)
      setSent(true)
      setMessage("")
    }
  }
  const replyOffer = async (offer, proposal, reject = false) => {
    if(await updateOffer(offer, proposal, reject, {incoming: userId, outgoing: outgoing?.id})){
      setMessages(null)
      setSent(true)
    }
  }

  useEffect(() => {
    console.log('Sent: ', sent)
    if(offer && !offerInfo)
      getOffer(offer).then(data => setOfferInfo(data))
    if(!calling && outgoing){
      console.log('Test')
      callMessages()
    }
  }, [notifications, sent, outgoing])
  useEffect(() => {
    dispatch(setHeader('settings'))
    dispatch(setHeaderTitle(`Chat with ${contact}`))
    if(!outgoing)
      getUser(contact).then(data => setOutgoing(data))
    chatWrapper.current.scrollTo({
      behavior: 'smooth',
      top: chatWrapper.current.scrollHeight,
    })
  }, [messages])
  useEffect(() => {
    if(emojiWrapper.current)
      document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return <div className="layout" style={{background: 'white'}}>
    <div className="main__content centerwidth">
      <div ref={chatWrapper} className={'chat__scroll ' + (offer && 'offer' || '')}>
        <div className="chat__messages">
          {messages?.map((message, key) => {
            const same = last == message.incoming ? 'same ' : ''
            last = message.incoming
            return <div key={key} className={'chat_card ' + same + (message.incoming == userId ? 'user' : 'contact')}>
              <MultiUseCard 
                type="chat"
                message={{...message, same: message.incoming == userId, replyOffer: replyOffer}} />
            </div>
          })}
        </div>
      </div>
      {!offer && 
        <form className="chat__input" onSubmit={send}>
          <input ref={input} value={message} type="text" placeholder="Type your message" onChange={e => setMessage(e.target.value)} />
          <div className="emoji">
            <FontAwesomeIcon icon={faFaceSmile} onClick={() => setOpen(!open)} />
            <div ref={emojiWrapper} className="emoji__wrapper"><EmojiPicker open={open} onEmojiClick={handleEmoji} /></div>
          </div>
          <button className={!message ? '' : 'dark-blue'} type="submit" disabled={!message}>Send</button>
        </form> || 
        <form className="chat__input" onSubmit={sendOffer}>
          <OfferInfo type="min" show={show} offer={offerInfo} onHide={hidePopup}  />
          <div className="chat__offer">
            <h5>{offerInfo?.title}</h5>
            <Button label={offerInfo?.material} className={'small ' + offerInfo?.material} />
            <div className="date" style={{fontSize: '12px'}}>{offerInfo?.date}</div>
            <div className="chat__offer__info">
              <p><b>Published by:</b> {offerInfo?.name}</p>
              <p><b>Quantity:</b> {offerInfo?.quantity} {offerInfo?.unit}</p>
              <p><b>Asking price:</b> {parseInt(offerInfo?.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
              <Button type="button" className="small green-earth" onClick={() => setShow(true)}><FontAwesomeIcon icon={faSearch} /> See more</Button>
            </div>
          </div>
          <InputNumber
            name="price"
            locale="en-US"
            currency="USD"
            mode="currency"
            value={proposal}
            useGrouping={true}
            placeholder="Price proposal*"
            onValueChange={e => setProposal(e?.value)} />
          <Link className="button red-state" to={`/chat/${contact}/`}>Cancel</Link>
          <button className={!proposal ? '' : 'dark-blue'} type="submit" disabled={!proposal}>Send offer</button>
        </form>
      }
    </div>
  </div>
}

export default Chat