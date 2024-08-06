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
import { ProfileProvider } from '@components/modules'
import ProfilePhoto from '@ui/profilePhoto/ProfilePhoto'
import { callNotifications } from '@store/slices/usersSlice'
import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'
import { getOffer, updateOffer } from '@services/offersServices'
import { getMessages, sendMessage } from '@services/chatServices'
import { setHeader, setHeaderTitle } from '@store/slices/globalSlice'

import './styles.sass'
import { getReport, updateReport } from '@services/reportServices'

const Chat = () => {
  let last = 0
  const input = useRef()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const chatWrapper = useRef(null)
  const emojiWrapper = useRef(null)
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [sent, setSent] = useState(false)
  const [message, setMessage] = useState("")
  const [profile, setProfile] = useState(null)
  const [calling, setCalling] = useState(false)
  const [messages, setMessages] = useState(null)
  const [proposal, setProposal] = useState(null)
  const [outgoing, setOutgoing] = useState(null)
  const { contact, offer, report } = useParams()
  const [offerInfo, setOfferInfo] = useState(null)
  const [reportInfo, setReportInfo] = useState(null)
  const userId = useSelector((state) => state.users.userData.id)
  const notifications = useSelector((state) => state.users.notifications)
  
  const callMessages = async () => {
    setCalling(true)
    setSent(false)
    const _last = messages?.length ? messages[messages.length - 1].date : 0
    const _add = await getMessages({user: userId, contact: outgoing?.id, last: _last})
    dispatch(callNotifications({user: userId}))
    if(_add?.length)
      setMessages(prev => {
        const _prev = prev?.length ? [...prev] : []
        const _new = [..._prev, ..._add]
        return _new
      })
    else
      setMessages([])
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
    if(report && !reportInfo)
      getReport(report).then(data => {
        setReportInfo(data)
        if(data?.admin == 'Without answer' && userId)
          updateReport({admin: userId}, {id: report})
      })
    if(offer && !offerInfo)
      getOffer(offer).then(data => setOfferInfo(data))
    const newMessage = notifications?.some(n => n?.incoming == outgoing?.id && n.outgoing == userId)
    if(!calling && outgoing && (messages == null || newMessage || sent))
      callMessages()
  }, [notifications, sent, outgoing])
  useEffect(() => {
    dispatch(setHeaderTitle(''))
    dispatch(setHeader('settings'))
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
    <div className="navbar-item insection_header">
      <h4><a onClick={e => { e.preventDefault(); setProfile({id: outgoing?.id, update: new Date(), type: 'chat'}); }}>
        <ProfilePhoto userPhoto={outgoing?.picture} />
        {outgoing?.name}
      </a></h4>
    </div>
    <div className="main__content centerfullwidth">
      <div ref={chatWrapper} className={'chat__scroll ' + (offer && 'offer' || '')}>
        <div className="chat__messages">
          <ProfileProvider profile={profile} setProfile={setProfile}>
          {messages?.map((message, key) => {
            const same = last == message.incoming ? 'same ' : ''
            last = message.incoming
            return <div key={key} className={'chat_card ' + same + (message.incoming == userId ? 'user' : 'contact')}>
              <MultiUseCard 
                type="chat"
                action={setProfile}
                data={{...message, same: message.incoming == userId, replyOffer: replyOffer}} />
            </div>
          })}
          </ProfileProvider>
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
        </form> 
      || 
        <form className="chat__input" onSubmit={sendOffer}>
          <OfferInfo type="min" show={show} offer={offerInfo} onHide={hidePopup}  />
          <div className="chat__offer">
            <h5>{offerInfo?.title}</h5>
            <Button type="button" label={offerInfo?.material} className={'small ' + offerInfo?.material} />
            <div className="date" style={{fontSize: '0.75rem'}}>{offerInfo?.date}</div>
            <div className="chat__offer__info">
              <p>You are about to send an offer proposal to {offerInfo?.name}. The asking price for this offer is {parseInt(offerInfo?.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
              <Button type="button" className="small green-earth" onClick={() => setShow(true)}><FontAwesomeIcon icon={faSearch} /> See Offer Details</Button>
            </div>
          </div>
          <InputNumber
            name="price"
            locale="en-US"
            currency="USD"
            mode="currency"
            value={proposal}
            useGrouping={true}
            placeholder="Your offer proposal*"
            onChange={e => setProposal(e?.value)} />
          <button className={!proposal ? '' : 'dark-blue'} type="submit" disabled={!proposal}>Send offer</button>
          <Link className="button red-state" to={`/chat/${contact}/`}>Cancel</Link>
        </form>
      }
    </div>
  </div>
}

export default Chat