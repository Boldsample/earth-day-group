import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import { useTranslation } from 'react-i18next'
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
import { useNotifications } from '@components/WebSocket'
import MultiUseCard from '@ui/cards/multiUseCard/MultiUseCard'
import { getOffer, updateOffer } from '@services/offersServices'
import { getMessages, sendMessage } from '@services/chatServices'
import { setHeader, setHeaderTitle } from '@store/slices/globalSlice'

import './styles.sass'
import { getReport, updateReport } from '@services/reportServices'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

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
  const [profile, setProfile] = useState(null)
  const [calling, setCalling] = useState(false)
  const [messages, setMessages] = useState(null)
  const [proposal, setProposal] = useState(null)
  const [outgoing, setOutgoing] = useState(null)
  const [offerInfo, setOfferInfo] = useState(null)
  const [reportInfo, setReportInfo] = useState(null)
  const { sendNotificationMessage } = useNotifications()
  const { contact, offer, report, pet, petName } = useParams()
  const userId = useSelector((state) => state.users.userData.id)
  const [hasMoreOldMessages, setHasMoreOldMessages] = useState(true)
  const [t] = useTranslation('translation', { keyPrefix: 'chat.chat' })
  const notifications = useSelector((state) => state.users.notifications)
  const [tMaterial] = useTranslation('translation', { keyPrefix: 'materials' })
  const [message, setMessage] = useState(pet ? t('adoptPet', {name: petName}) : '')
  
  const callMessages = async (type = 'forward', previousScrollHeight = null) => {
    if (calling) return;
    setCalling(true)
    setSent(false)
    let queryDate = 0
    if (type === 'forward')
      queryDate = messages?.length ? messages[messages.length - 1]?.date ?? 0 : 0
    else if (type === 'backward')
      queryDate = messages?.length ? messages[0]?.date ?? 0 : 0
    const _add = await getMessages({user: userId, contact: outgoing?.id, last: queryDate, direction: type}, sendNotificationMessage)
    if (_add?.length){
      setMessages(prev => {
        const _messages = type === 'backward' ? [..._add, ...(prev || [])] : [...(prev || []), ..._add]
        setTimeout(() => {
          if (type === 'backward' && previousScrollHeight !== null) {
            if (chatWrapper?.current)
              chatWrapper.current.scrollTop = chatWrapper.current.scrollHeight - previousScrollHeight
          } else
            scrollToBottom()
        }, 10);
        return _messages
      })
    } else {
      if (type === 'backward')
        setHasMoreOldMessages(false)
      else if (messages == null)
        setMessages([])
    }
    setCalling(false)
  }
  
  const handleEmoji = emoji => {
    setMessage(prev => prev + emoji.native)
    input.current?.focus()
  }
  const handleClickOutside = e => {
    if(!emojiWrapper.current.contains(e.target))
      setOpen(false)
  }
  const send = async e => {
    e.preventDefault()
    if(await sendMessage({ message, incoming: outgoing?.id, outgoing: userId }, sendNotificationMessage)){
      setSent(true)
      setMessage("")
    }
  }
  const hidePopup = () => setShow(false)
  const sendOffer = async e => {
    e.preventDefault()
    if(await sendMessage({ type: 'offer', offer, incoming: outgoing?.id, outgoing: userId, price: proposal }, sendNotificationMessage)){
      navigate(`/chat/${contact}/`)
      setSent(true)
      setMessage("")
    }
  }
  const replyOffer = async (offer, proposal, reject = false) => {
    if(await updateOffer(offer, proposal, reject, {incoming: outgoing?.id, outgoing: userId})){
      setMessages(null)
      setSent(true)
    }
  }
  const scrollToBottom = () => {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    if (chatWrapper.current)
      chatWrapper.current.scrollTo({ behavior: 'smooth', top: chatWrapper.current.scrollHeight })
  }

  useEffect(() => {
    dispatch(setHeaderTitle(''))
    dispatch(setHeader('settings'))
    if(!outgoing)
      getUser(contact).then(data => setOutgoing(data))
    scrollToBottom()
  }, [])
  useEffect(() => {
    const handleScroll = async () => {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      if (!chatWrapper?.current || calling || !messages?.length || !hasMoreOldMessages) return
      if (chatWrapper.current.scrollTop === 0)
        callMessages('backward', chatWrapper.current?.scrollHeight)
    }
    if (chatWrapper?.current)
      chatWrapper?.current.addEventListener('scroll', handleScroll);
    if (window.visualViewport)
      window.visualViewport.addEventListener('resize', scrollToBottom)
    else
      window.addEventListener('resize', scrollToBottom)
    return () => {
      if (chatWrapper?.current)
        chatWrapper?.current.removeEventListener('scroll', handleScroll);
      if (window.visualViewport)
        window.visualViewport.removeEventListener('resize', scrollToBottom)
      else
        window.removeEventListener('resize', scrollToBottom)
    }
  }, [messages, calling, hasMoreOldMessages])
  useEffect(() => {
    setMessages(null);
    setHasMoreOldMessages(true);
  }, [outgoing?.id]);
  useEffect(() => {
    if (!calling && outgoing) {
      const lastMessageDate = messages?.length ? messages[messages.length - 1]?.date : 0;
      const hasNewMessageNotification = notifications.some(notification =>
        notification?.type === 'message' &&
        notification?.outgoing === outgoing?.id &&
        notification?.date > String(lastMessageDate)
      )
      if (messages == null || sent || hasNewMessageNotification)
        callMessages();
    }
  }, [sent, outgoing, notifications]);
  useEffect(() => {
    if(report && !reportInfo)
      getReport(report).then(data => {
        setReportInfo(data)
      })
    if(offer && !offerInfo)
      getOffer(offer).then(data => setOfferInfo(data))
  }, [sent, outgoing])
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
            const same = message.incoming == last ? 'same ' : ''
            last = message.incoming
            return <div key={key} className={'chat_card ' + same + (message.outgoing == userId ? 'user' : 'contact')}>
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
          <input ref={input} value={message} type="text" placeholder={t('chatBoxPlaceHolderText')} onChange={e => setMessage(e.target.value)} />
          <div className="emoji">
            <FontAwesomeIcon icon={faFaceSmile} onClick={() => setOpen(!open)} />
            {open && 
              <div ref={emojiWrapper} className="emoji__wrapper"><Picker data={data} set="native" onEmojiSelect={handleEmoji} /></div>
            }
          </div>
          <button className={!message ? '' : 'dark-blue'} type="submit" disabled={!message}>{t('sendBtnText')}</button>
        </form> 
      || 
        <form className="chat__input" onSubmit={sendOffer}>
          <OfferInfo type="min" show={show} offer={offerInfo} onHide={hidePopup}  />
          <div className="chat__offer">
            <h5>{offerInfo?.title}</h5>
            <Button type="button" label={tMaterial(offerInfo?.material)} className={'small ' + offerInfo?.material} />
            <div className="date" style={{fontSize: '0.75rem'}}>{offerInfo?.date}</div>
            <div className="chat__offer__info">
              {/* <p>You are about to send an offer proposal to {offerInfo?.name}. The asking price for this offer is {parseInt(offerInfo?.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p> */}
              <p>{t('sendOfferText', {userName: offerInfo?.name})} {parseInt(offerInfo?.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
              <Button type="button" className="small green-earth" onClick={() => setShow(true)}><FontAwesomeIcon icon={faSearch} /> {t('seeOfferDetailsBtnText')}</Button>
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
          <button className={!proposal ? '' : 'dark-blue'} type="submit" disabled={!proposal}>{t('sendOfferBtnText')}</button>
          <Link className="button red-state" to={`/chat/${contact}/`}>{t('cancelBtnText')}</Link>
        </form>
      }
    </div>
  </div>
}

export default Chat