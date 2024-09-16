import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { faPencil, faPlus, faTrash, faUser } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import { InputSwitch } from 'primereact/inputswitch'
import { useForm } from "react-hook-form"

import { Dropdown } from 'primereact/dropdown'
import { getUsers, updateUser } from '@services/userServices'
import { ProfileProvider } from '@components/modules'
import { setHeader } from '@store/slices/globalSlice'
import ProfilePhoto from '@ui/profilePhoto/ProfilePhoto'
import TableSkeleton from '@ui/skeletons/tableSkeleton/TableSkeleton'

const Users = ({type}) => {
  const dispatch = useDispatch()
  const [resetFields, setResetFields] = useState(false)
  const [profile, setProfile] = useState(null)
  const [users, setUsers] = useState({data: []})
  const [page, setPage] = useState({page: 0, rows: 6})
  const user = useSelector((state) => state.users.userData)
  const [filters, setFilters] = useState({state: "1", role: "", keyword: ''})
  const [t] = useTranslation('translation', { keyPrefix: 'admin.usersList' })
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global'})
  const {
    reset,
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      unit: "",
      materials: "",
      unit_price: "",
    },
  })

  const changeState = async (id, state) => {
    await updateUser({state: state}, {id: id})
    setResetFields(true)
  }
  const updateFilters = (name, value) => setFilters(prev => ({...prev, [name]: value}))
  const callUsers = async () =>{
    let _filter = {}
    if(filters?.state != '')
      _filter['state'] = `u.state='${filters.state}'`
    if(filters?.role != '')
      _filter['user'] = `u.role='${filters.role}'`
    else
      _filter['user'] = type == 'admins' ? `u.role='admin'` : `u.role<>'admin'`
    if(filters?.keyword != '')
      _filter['keyword'] = `(u.name LIKE '%${filters.keyword}%')`
    const _users = await getUsers(_filter, 'min', user?.id, page)
    setUsers(_users)
  }
  console.log(users)
  const renderHeader = () => {
    return <div className="filters">
      {type == 'users' && 
        <Dropdown value={filters?.role} onChange={e => updateFilters('role', e.value)} optionLabel="name" optionValue="code" placeholder="Select a user role" options={[
          {name: t('all'), code: ""},
          {name: t('allUsers'), code: "user"},
          {name: t('allCompanies'), code: "company"},
          {name: t('allStores'), code: "vendor"},
          {name: t('allNgos'), code: "ngo"},
          {name: t('allShelters'), code: "shelter"},
          {name: t('allSocialOrg'), code: "social"},
        ]} />
      }
      <Dropdown value={filters?.state} onChange={e => updateFilters('state', e.value)} optionLabel="name" optionValue="code" placeholder="Select a state" options={[
        {name: tGlobal("all"), code: ""},
        {name: tGlobal("active"), code: "1"},
        {name: tGlobal("disable"), code: "2"},
      ]} />
      <InputText value={filters?.keyword} onChange={e => updateFilters('keyword', e.target.value)} placeholder={t('inputSearchPlaceHolder')} />
      <Button className="small dark-blue" type="button" onClick={callUsers}><FontAwesomeIcon icon={faPaperPlane} /></Button>
      <Button className="small red-state" type="button" onClick={() => {
        setResetFields(true)
        setFilters({state: "1", role: "", keyword: ''})
      }}><FontAwesomeIcon icon={faTrash} /></Button>
      {type == 'admins' && 
        <Link className="button small green-earth" to="/admin/new/"><FontAwesomeIcon icon={faPlus} /> {t('newAdminButton')}</Link>
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
    <img className="layout__background" src="/assets/full-width.svg" />
    <div className={'main__content fullwidth'}>
      <h1 className="text-defaultCase mb-1">{type == 'admins' ? t('adminMainTitle') : t('userMainTitle')}</h1>
      {typeof users?.total == 'undefined' && users?.data?.length == 0 && 
        <TableSkeleton />
      || 
        <ProfileProvider profile={profile} setProfile={setProfile}>
          <DataTable paginator stripedRows lazy
            emptyMessage={t('noUsersFoundText')}
            dataKey="id" 
            page={page.page} 
            rows={page.rows} 
            value={users?.data} 
            header={renderHeader} 
            totalRecords={users?.total} 
            onPage={({page, rows}) => setPage({page, rows})}>
            <Column header={t('tableTitleUser')} body={({name, picture}) => <><ProfilePhoto userPhoto={picture} /> {name}</>}></Column>
            {type == 'users' && 
              <Column header={t('tableTitleRole')} field="role"></Column>
            }
            <Column header={t('tableTitleEmail')} field="email"></Column>
            <Column header={t('tableTitleState')} body={({id, state}) => 
                  <InputSwitch/>
              // <Dropdown value={state} onChange={e => changeState(id, e.value)} optionLabel="name" optionValue="code" options={[
              //   {name: tGlobal("active"), code: "1"},
              //   {name: tGlobal("disable"), code: "2"}
              // ]} />
            }></Column>
            <Column className="actions" header={null} body={u => <>
              <Link className="button small" to={u?.id == user?.id ? '/settings/edit/' : `/${u?.role}/edit/${u?.username}/`}><FontAwesomeIcon icon={faPencil} /></Link>
              <Button className="small dark-blue" onClick={() => setProfile({id: u.id, update: new Date()})}><FontAwesomeIcon icon={faUser} /></Button>
              {type == 'users' &&
                <Link className="button small green-earth" to={`/chat/${u?.username}/`}><FontAwesomeIcon icon={faPaperPlane} /></Link>
              }
            </>}></Column>
          </DataTable>
        </ProfileProvider>
      }
    </div>
  </div>
}

export default Users