import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { useDispatch, useSelector } from 'react-redux'
import { faSearch, faTrash, faPaw, faCakeCandles } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { useTranslation } from 'react-i18next'

import { getPets, updatePet } from '@services/petServices'
import { setHeader } from '@store/slices/globalSlice'
import TableSkeleton from '@ui/skeletons/tableSkeleton/TableSkeleton'
import ProfilePhoto from '@ui/profilePhoto/ProfilePhoto'
import { InputSwitch } from 'primereact/inputswitch'
import { Avatar } from 'primereact/avatar'
import ConfirmationModal from '@ui/modals/ConfirmationModal'

const Pets = () => {
  const dispatch = useDispatch()
  const [reset, setReset] = useState(false)
  const [pets, setPets] = useState({data: []})
  const [confirm, setConfirm] = useState(false)
  const [selected, setSelected] = useState(false)
  const [filters, setFilters] = useState({keyword: ''})
  const user = useSelector((state) => state.users.userData)
  const [page, setPage] = useState({first: 0, page: 0, rows: 6})
  const [t] = useTranslation('translation', { keyPrefix: 'admin.pets' })
  const [tPet] = useTranslation('translation', { keyPrefix: 'ngo.pets.pet' })

  const changeState = async action => {
    setConfirm(false)
    if(action){
      await updatePet({state: 2}, {id: selected})
      setReset(true)
    }
  }
  const updateFilters = (name, value) => setFilters(prev => ({...prev, [name]: value}))
  const callPets = async () =>{
    let _filter = {}
    if(filters?.keyword != '')
      _filter['keyword'] = encodeURIComponent(`(p.name LIKE '%${filters.keyword}%')`)
    const _pets = await getPets(_filter, page)
    setPets(_pets)
  }
  const renderHeader = () => {
    return <div className="filters">
      <InputText value={filters?.keyword} onChange={e => updateFilters('keyword', e.target.value)} placeholder={t('inputSearchPlaceHolder')} />
      <Button className="small dark-blue" type="button" onClick={callPets}><FontAwesomeIcon icon={faPaperPlane} /></Button>
      <Button className="small red-state" type="button" onClick={() => {
        setReset(true)
        setFilters({keyword: ''})
      }}><FontAwesomeIcon icon={faTrash} /></Button>
    </div>
  }

  useEffect(() => {
    callPets()
    setReset(false)
  }, [page, reset])
  useEffect(() => {
    dispatch(setHeader('user'))
  }, [user])

  return <div className="layout">
    <ConfirmationModal title={tPet('deletePetTitle')} visible={confirm} action={changeState} />
    <img className="layout__background" src="/assets/full-width.svg" />
    <div className={'main__content fullwidth'}>
      <h1 className="text-defaultCase mb-1">{t('mainTitle')} </h1>
      {typeof pets?.total == 'undefined' && pets?.data?.length == 0 && 
        <TableSkeleton />
      || <>
        <DataTable paginator stripedRows lazy
          emptyMessage={t('noPetsFoundText')}
          dataKey="id" 
          page={page.page} 
          rows={page.rows} 
          first={page.first} 
          value={pets?.data} 
          header={renderHeader} 
          totalRecords={pets?.total} 
          onPage={({first, page, rows}) => setPage({first, page, rows})}>
          <Column headerClassName='table-header-styles' header={t('tableTitleName')} bodyClassName='table-body-styles' field="name" body={({name, picture}) =>{
             return <div className="flex aligncenter">
             <Avatar icon={<FontAwesomeIcon  color='#fff' icon={faPaw}/>} style={{ backgroundColor: 'var(--dark-blue)', color: '#ffffff', width: '19%' }}  image={picture} shape="circle" />
             <p className='ml-1 mb-0'>{name}</p>
           </div>;
          }}></Column>
          <Column header={t('tableTitleSpecie')}  field="specie"></Column>
          <Column header={t('tableTitleAge')}  field="age" body={({age})=>{
            return <div>
              <FontAwesomeIcon  color='var(--dark-blue)' icon={faCakeCandles}/>
              <span className='ml-1'>{age}</span>
            </div>
          }}></Column>
          <Column header={t('tableTitlePublishedBy')}  body={({username, upicture}) => <><ProfilePhoto userPhoto={upicture} /> {username}</>}></Column>
          <Column header={t('tableTitleState')}  body={({id, state}) => 
            <InputSwitch checked={state == 1} onChange={async (e) => {
              if(state == 1){
                setSelected(id)
                setConfirm(true)
              }else{
                await updatePet({state: 1}, {id: id})
                setReset(true)
              }
            }}/>
          }></Column>
          <Column className="actions" header={null} body={({id, username}) => <>
            <Link className="button small dark-blue" to={`/pet/${id}`}><FontAwesomeIcon icon={faSearch} /></Link>
            <Link className="button small green-earth" to={`/chat/${username}/`}><FontAwesomeIcon icon={faPaperPlane} /></Link>
          </>}></Column>
        </DataTable>
        {pets?.total == 0 && 
          <div className="mt-2">
            <p>{t('noPetsFoundText')} </p>
          </div>
        }
      </>}
    </div>
  </div>
}

export default Pets