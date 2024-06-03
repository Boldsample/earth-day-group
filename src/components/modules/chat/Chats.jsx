import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { getUsersList } from '@store/slices/usersSlice'
import { setHeader, updateAddLink } from '@store/slices/globalSlice'

const Chats = () => {
  const dispatch = useDispatch()
  const users = useSelector(state => state.users.usersList)
  const user = useSelector(state => state.users.userData)

  useEffect(() => {
    setHeader('user')
    dispatch(getUsersList())
  }, [])
	useEffect(() => {
    if(user.role == 'user')
      dispatch(updateAddLink('/offers/new/'))
  }, [user])
  
  return <div className="layout">
    <img className="layout__background" src="/assets/user/image-1.svg" />
    <div className="main__content halfspace halfwidth">
      <h1 className='text-defaultCase'>Usuarios</h1>
      {users?.length && users?.map(user => <Link className="button fullwidth mb-1" key={user.id} to={`/chat/${user.id}/`}>{user.name}</Link>)}
    </div>
  </div>
}

export default Chats