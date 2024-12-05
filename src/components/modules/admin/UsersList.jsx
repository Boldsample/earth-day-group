import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { faPencil, faPlus, faTrash, faUser, faEnvelope, faPersonShelter, faRecycle, faShop, faHouse, faBuildingNgo, faFileDownload  } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import { InputSwitch } from 'primereact/inputswitch'
import { Tooltip } from 'primereact/tooltip'

import { Dropdown } from 'primereact/dropdown'
import { getUsers, updateUser } from '@services/userServices'
import { ProfileProvider } from '@components/modules'
import { setHeader } from '@store/slices/globalSlice'
import ProfilePhoto from '@ui/profilePhoto/ProfilePhoto'
import TableSkeleton from '@ui/skeletons/tableSkeleton/TableSkeleton'
import ConfirmationModal from '@ui/modals/ConfirmationModal'
import { API } from '@services/API'

const Users = ({type}) => {
  const dispatch = useDispatch()
  const [profile, setProfile] = useState(null)
  const [confirm, setConfirm] = useState(false)
  const [users, setUsers] = useState({data: []})
  const [selected, setSelected] = useState(false)
  const [resetFields, setResetFields] = useState(false)
  const user = useSelector((state) => state.users.userData)
  const [page, setPage] = useState({first: 0, page: 0, rows: 6})
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global'})
  const [t] = useTranslation('translation', { keyPrefix: 'admin.usersList' })
  const [tToolTip] = useTranslation('translation', { keyPrefix: 'tooltips' })
  const [filters, setFilters] = useState({state: '', role: '', keyword: ''})

  const changeState = async action => {
    setConfirm(false)
    if(action){
      await updateUser({state: 2}, {id: selected})
      setResetFields(true)
    }
  }
  const updateFilters = (name, value, wait=false) => {
    setFilters(prev => ({...prev, [name]: value}))
    if(!wait){
      setPage({first: 0, page: 0, rows: 6})
      setReset(true)
    }
  }
  const callUsers = async (ex = false) =>{
    let _filter = {}
	if(filters?.role != '')
	  _filter['user'] = `u.role='${filters.role}'`
	else
	  _filter['user'] = type == 'admins' ? `u.role='admin'` : `u.role<>'admin'`
    if(filters?.state != '')
      _filter['state'] = `u.state='${filters.state}'`
    if(filters?.keyword != '')
      _filter['keyword'] = encodeURIComponent(`(u.name LIKE '%${filters.keyword}%' OR u.email LIKE '%${filters.keyword}%')`)
    const _users = await getUsers(_filter, 'full', user?.id, page, ex)
    if(!ex)
      setUsers(_users)
  }

  const roleColumnBodyTemplate = (columnItem) => {
    switch (columnItem.role) {
        case 'user':
            return <div className="flex aligncenter"><FontAwesomeIcon  color='var(--dark-blue)'  icon={faUser}/>
            <p className='ml-1 mb-0'>{columnItem.role}</p>
            </div>;

        case 'shelter':
            return <div className="flex aligncenter"><FontAwesomeIcon  color='var(--dark-blue)' icon={faHouse}/>
            <p className='ml-1 mb-0'>{columnItem.role}</p>
            </div>;

        case 'company':
            return <div className="flex aligncenter"><FontAwesomeIcon  color='var(--dark-blue)' icon={faRecycle}/>
            <p className='ml-1 mb-0'>{columnItem.role}</p>
            </div>;
        
        case 'vendor':
          return <div className="flex aligncenter"><FontAwesomeIcon  color='var(--dark-blue)' icon={faShop}/>
          <p className='ml-1 mb-0'>{columnItem.role}</p>
          </div>;

        case 'ngo':
          return <div className="flex aligncenter"><FontAwesomeIcon  color='var(--dark-blue)' icon={faBuildingNgo}/>
          <p className='ml-1 mb-0'>{columnItem.role}</p>
          </div>;

        case 'social':
          return <div className="flex aligncenter"><FontAwesomeIcon  color='var(--dark-blue)' icon={faPersonShelter}/>
          <p className='ml-1 mb-0'>{columnItem.role}</p>
          </div>;

        default:
            return null;
    }
};

  const renderHeader = () => {
    return <div className="filters">
      {type == 'users' && 
        <Dropdown style={{width: '9rem'}} value={filters?.role} onChange={e => updateFilters('role', e.value)} optionLabel="name" optionValue="code" placeholder="Select a user role" options={[
          {name: t('all'), code: ""},
          {name: t('allUsers'), code: "user"},
          {name: t('allCompanies'), code: "company"},
          {name: t('allStores'), code: "vendor"},
          {name: t('allNgos'), code: "ngo"},
          {name: t('allShelters'), code: "shelter"},
          {name: t('allSocialOrg'), code: "social"},
        ]} />
      }
      <Dropdown style={{width: '9rem'}} value={filters?.state} onChange={e => updateFilters('state', e.value)} optionLabel="name" optionValue="code" placeholder="Select a state" options={[
        {name: tGlobal("all"), code: ""},
        {name: tGlobal("active"), code: "1"},
        {name: tGlobal("disable"), code: "2"},
      ]} />
      <InputText 
        style={{width: '14rem'}} 
        value={filters?.keyword} 
        placeholder={t('inputSearchPlaceHolder')} 
        onKeyDown={(e) => e.key === 'Enter' ? callUsers() : null} 
        onChange={e => updateFilters('keyword', e.target.value, e.target.value != '')} />
      <Button className="small dark-blue" type="button" onClick={() => callUsers()}>{tGlobal('search')}</Button>
      <Button className="small red-state" type="button" onClick={() => {
        setReset(true)
        setFilters({state: '', role: '', keyword: ''})
      }}>{tGlobal('reset')}</Button>
      <Tooltip target=".downloadUsers" showDelay={700}/>
      <Button className="green-earth downloadUsers" data-pr-position="top"  data-pr-tooltip={tToolTip('downloadReportBtn', {items: tToolTip('users')})} onClick={() => callUsers(true)}><FontAwesomeIcon icon={faFileDownload} /></Button>
      {type == 'admins' && 
        <Link className="button small light-green" to="/admin/new/"><FontAwesomeIcon icon={faPlus} /> {t('newAdminButton')}</Link>
      }
    </div>
  }

  useEffect(() => {
    callUsers()
    setResetFields(false)
  }, [page, resetFields])
  useEffect(() => {
    dispatch(setHeader('user'))
  }, [user])
  

  return <div className="layout">
    <ConfirmationModal title={t('deleteUserTitle')} visible={confirm} action={changeState} />
    <img className="layout__background" src="/assets/full-width.svg" />
    <div className={'main__content fullwidth'}>
      <h1 className="text-defaultCase mb-1">{type == 'admins' ? t('adminMainTitle') : t('userMainTitle')}</h1>
      {typeof users?.total == 'undefined' && users?.data?.length == 0 && 
        <TableSkeleton />
      || 
        <ProfileProvider profile={profile} setProfile={setProfile}>
          <DataTable paginator stripedRows lazy
            dataKey="id" 
            page={page.page} 
            rows={page.rows} 
			      first={page.first}
            value={users?.data} 
            header={renderHeader} 
            totalRecords={users?.total} 
            emptyMessage={t('noUsersFoundText')}
            onPage={({first, page, rows}) => setPage({first, page, rows})}>
            <Column headerClassName='table-header-styles' header={t('tableTitleUser')} bodyClassName='table-body-styles' body={({name, picture}) => <><ProfilePhoto userPhoto={picture} /> {name}</>}></Column>
            {type == 'users' && 
              <Column header={t('tableTitleRole')} field="role" body={roleColumnBodyTemplate}></Column>
            }
            <Column header={t('tableTitleEmail')} field="email" body={ type == 'admins' ? ({email})=> <div className="flex aligncenter"><FontAwesomeIcon  color='var(--dark-blue)'  icon={faEnvelope}/><p className='ml-1 mb-0'>{email}</p></div> :  undefined }></Column>
            <Column header={t('tableTitleState')} body={({id, state}) => {
              return <>
              <Tooltip target=".stateInput" showDelay={700}/>
              <InputSwitch data-pr-position="left" data-pr-tooltip={state == 1 ? tToolTip("enableSateSwitchInputMessage") : tToolTip("disableSateSwitchInputMessage")} className='stateInput' checked={state == 1} onChange={async (e) => {
                if(state == 1){
                  setSelected(id)
                  setConfirm(true)
                }else{
                  await updateUser({state: 1}, {id: id})
                  setResetFields(true)
                }
              }}/>
              </>
            }}></Column>
            <Column className="actions" header={null} body={u => <>
              <Tooltip target=".editBtn" showDelay={700}/>
              <Link data-pr-position="top" data-pr-tooltip={tToolTip("editUserBtn")} className="button small orange editBtn" to={u?.id == user?.id ? '/settings/edit/' : `/${u?.role}/edit/${u?.username}/`}><FontAwesomeIcon  icon={faPencil} /></Link>
              <Tooltip target=".viewBtn" showDelay={700}/>
              <Button data-pr-position="top" className="small dark-blue viewBtn" data-pr-tooltip={tToolTip("viewItemBtn", {item: tToolTip('user')})} onClick={() => setProfile({id: u.id, update: new Date()})}><FontAwesomeIcon icon={faUser} /></Button>
              {type == 'users' &&
                <>
                <Tooltip target=".sendMsgBtn" showDelay={700}/>
                <Link data-pr-tooltip={tToolTip("sendMessage")} data-pr-position="top" className="button small green-earth sendMsgBtn" to={`/chat/${u?.username}/`}><FontAwesomeIcon icon={faPaperPlane} /></Link>
                </>
              }
            </>}></Column>
          </DataTable>
        </ProfileProvider>
      }
    </div>
  </div>
}

export default Users