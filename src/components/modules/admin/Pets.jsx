import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { useDispatch, useSelector } from 'react-redux'
import { faSearch, faTrash, faPaw, faCakeCandles, faFileDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'primereact/tooltip'

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
  const [tGlobal] = useTranslation('translation', { keyPrefix: 'global' })
  const [tPet] = useTranslation('translation', { keyPrefix: 'ngo.pets.pet' })
  const [tToolTip] = useTranslation('translation', { keyPrefix: 'tooltips' })
  
  const changeState = async action => {
    setConfirm(false)
    if(action){
      await updatePet({state: 2}, {id: selected})
      setReset(true)
    }
  }
  const updateFilters = (name, value, wait=false) => {
    setFilters(prev => ({...prev, [name]: value}))
    if(!wait){
      setPage({first: 0, page: 0, rows: 6})
      setReset(true)
    }
  }
  const callPets = async (ex = false) =>{
    let _filter = {}
    if(filters?.keyword != '')
      _filter['keyword'] = encodeURIComponent(`(p.name LIKE '%${filters.keyword}%')`)
    const _pets = await getPets(_filter, page, null, ex)
    if(!ex)
      setPets(_pets)
  }
  const renderHeader = () => {
    return <div className="filters">
      <InputText 
        style={{width: '14rem'}} 
        value={filters?.keyword} 
        placeholder={t('inputSearchPlaceHolder')} 
        onKeyDown={(e) => e.key === 'Enter' ? callPets() : null} 
        onChange={e => updateFilters('keyword', e.target.value, e.target.value != '')} />
      <Button className="small dark-blue" type="button" onClick={() => callPets()}>{tGlobal('search')}</Button>
      <Button className="small red-state" type="button" onClick={() => {
        setReset(true)
        setFilters({keyword: ''})
      }}>{tGlobal('reset')}</Button>
      <Tooltip target=".downloadPets" showDelay={700}/>
      <Button data-pr-position="top"  data-pr-tooltip={tToolTip('downloadReportBtn', {items: tToolTip('pets')} )} className="green-earth downloadPets" onClick={() => callPets(true)}><FontAwesomeIcon icon={faFileDownload} /></Button>
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
             <Avatar icon={<FontAwesomeIcon  color='#fff' icon={faPaw}/>} style={{ backgroundColor: 'var(--dark-blue)', color: '#ffffff' }}  image={picture} shape="circle" />
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
          <Column header={t('tableTitleState')}  body={({id, state}) => {
            return <>
              <Tooltip target=".stateInput" showDelay={700}/>
              <InputSwitch  className='stateInput' data-pr-position="left" data-pr-tooltip={state == 1 ? tToolTip("enableSateSwitchInputMessage") : tToolTip("disableSateSwitchInputMessage")} checked={state == 1} onChange={async (e) => {
                if(state == 1){
                  setSelected(id)
                  setConfirm(true)
                }else{
                  await updatePet({state: 1}, {id: id})
                  setReset(true)
                }
              }}/>
            </>
          }}></Column>
          <Column className="actions" header={null} body={({id, username}) => <>
            <Tooltip target=".viewPet" showDelay={700}/>
            <Link className="button small dark-blue viewPet" data-pr-position="top" data-pr-tooltip={tToolTip("viewItemBtn", {item: tToolTip('pet')})} to={`/pet/${id}`}><FontAwesomeIcon icon={faSearch} /></Link>
            <Tooltip target=".sendMsgBtn" showDelay={700}/>
            <Link data-pr-tooltip={tToolTip("sendMessage")} data-pr-position="top" className="button small green-earth sendMsgBtn" to={`/chat/${username}/`}><FontAwesomeIcon icon={faPaperPlane} /></Link>
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