import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { useDispatch, useSelector } from 'react-redux'
import { faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { useTranslation } from 'react-i18next'

import { getPets, updatePet } from '@services/petServices'
import { setHeader } from '@store/slices/globalSlice'
import TableSkeleton from '@ui/skeletons/tableSkeleton/TableSkeleton'
import ProfilePhoto from '@ui/profilePhoto/ProfilePhoto'
import { Dropdown } from 'primereact/dropdown'

const Pets = () => {
  const dispatch = useDispatch()
  const [reset, setReset] = useState(false)
  const [pets, setPets] = useState({data: []})
  const [page, setPage] = useState({page: 0, rows: 6})
  const user = useSelector((state) => state.users.userData)
  const [filters, setFilters] = useState({keyword: ''})
  const [t] = useTranslation('translation', { keyPrefix: 'admin.pets' })
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global.genericInputs'})
  const stateDropDownText = t('stateDropdown', { returnObjects: true });

  const changeState = async (id, state) => {
    await updatePet({state: state}, {id: id})
    setReset(true)
  }
  const updateFilters = (name, value) => setFilters(prev => ({...prev, [name]: value}))
  const callPets = async () =>{
    let _filter = {}
    if(filters?.keyword != '')
      _filter['keyword'] = `(p.name LIKE '%${filters.keyword}%')`
    const _pets = await getPets(_filter, page)
    setPets(_pets)
  }
  const renderHeader = () => {
    return <div className="filters">
      <InputText value={filters?.keyword} onChange={e => updateFilters('keyword', e.target.value)} placeholder={tGlobal('inputSearchPlaceHolder')} />
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
    <img className="layout__background" src="/assets/full-width.svg" />
    <div className={'main__content fullwidth'}>
      <h1 className="text-defaultCase mb-1">{t('mainTitle')} </h1>
      {typeof pets?.total == 'undefined' && pets?.data?.length == 0 && 
        <TableSkeleton />
      || <>
        <DataTable paginator stripedRows lazy
          dataKey="id" 
          page={page.page} 
          rows={page.rows} 
          value={pets?.data} 
          header={renderHeader} 
          totalRecords={pets?.total} 
          onPage={({page, rows}) => setPage({page, rows})}>
          <Column header={t('tableTitlePublishedBy')}  body={({username, picture}) => <><ProfilePhoto userPhoto={picture} /> {username}</>}></Column>
          <Column header={t('tableTitleName')} field="name"></Column>
          <Column header={t('tableTitleSpecie')}  field="specie"></Column>
          <Column header={t('tableTitlePublishedDate')}  field="date"></Column>
          <Column header={t('tableTitlePublished')}  body={({id, state}) => 
            <Dropdown value={state} onChange={e => changeState(id, e.value)} optionLabel="name" optionValue="code" options={stateDropDownText} />
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