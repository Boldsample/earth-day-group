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

import { Dropdown } from 'primereact/dropdown'
import { setHeader } from '@store/slices/globalSlice'
import { getReport, getReports } from '@services/reportServices'
import TableSkeleton from '@ui/skeletons/tableSkeleton/TableSkeleton'
import ReportInfo from './ReportInfo'
import { ProfileProvider } from '..'

const Reports = () => {
  const dispatch = useDispatch()
  const [detail, setDetail] = useState({})
  const [reset, setReset] = useState(false)
  const [profile, setProfile] = useState(null)
  const [reports, setReports] = useState({data: []})
  const [page, setPage] = useState({page: 0, rows: 6})
  const user = useSelector((state) => state.users.userData)
  const [filters, setFilters] = useState({type: "", keyword: ''})

  const hidePopup = () => setDetail({...detail, show: false})
  const updateFilters = (name, value) => setFilters(prev => ({...prev, [name]: value}))
  const updateReport = async id => {
  }
  const getReportDetail = async id => {
    const _report = await getReport(id)
    setDetail({..._report, show: true})
  }
  const callReports = async () =>{
    let _filter = {}
    if(filters?.type != '')
      _filter['type'] = `r.type='${filters.type}'`
    if(filters?.keyword != '')
      _filter['keyword'] = `(r.description LIKE '%${filters.keyword}%' OR u.name LIKE '%${filters.keyword}%')`
    const _reports = await getReports(_filter, page)
    setReports(_reports)
  }
  const renderHeader = () => {
    return <div className="filters">
      <Dropdown value={filters?.role} onChange={e => updateFilters('type', e.value.code)} optionLabel="name" placeholder="Select a type" options={[
        {name: "All", code: ""},
        {name: "Users", code: "user"},
        {name: "Offers", code: "offer"},
        {name: "Products", code: "product"},
        {name: "Pets", code: "pet"},
      ]} />
      <InputText value={filters?.keyword} onChange={e => updateFilters('keyword', e.target.value)} placeholder="Keyword Search" />
      <Button className="small dark-blue" type="button" onClick={callReports}><FontAwesomeIcon icon={faPaperPlane} /></Button>
      <Button className="small red-state" type="button" onClick={() => {
        setReset(true)
        setFilters({type: '', keyword: ''})
      }}><FontAwesomeIcon icon={faTrash} /></Button>
    </div>
  }

  useEffect(() => {
    callReports()
    setReset(false)
  }, [page, reset])
  useEffect(() => {
    dispatch(setHeader('user'))
  }, [user])
  
  return <div className="layout">
    <img className="layout__background" src="/assets/full-width.svg" />
    <div className={'main__content fullwidth'}>
      <h1 className="text-defaultCase mb-1">Reports</h1>
      <ProfileProvider profile={profile} setProfile={setProfile}>
        <ReportInfo show={detail.show} report={detail} onHide={hidePopup}  />
        {typeof reports?.total == 'undefined' && reports?.data?.length == 0 && 
          <TableSkeleton />
        || <>
          <DataTable paginator stripedRows lazy
            dataKey="id" 
            page={page.page} 
            rows={page.rows} 
            value={reports?.data} 
            header={renderHeader} 
            totalRecords={reports?.total} 
            onPage={({page, rows}) => setPage({page, rows})}>
            <Column header="Type" field="type"></Column>
            <Column header="Reported" field="name"></Column>
            <Column header="Subject" field="subject"></Column>
            <Column header="Status" body={({id, status}) => 
              <Dropdown value={status} options={['Pending', 'In process', 'Resolved']} onChange={() => updateReport(id)} />
            }></Column>
            <Column header="Asign to" field="admin"></Column>
            <Column className="actions" header={null} body={({id, username, aid}) => <>
              <Button className="small dark-blue" onClick={() => getReportDetail(id)}><FontAwesomeIcon icon={faSearch} /></Button>
              {(!aid || aid == user?.id) && 
                <Link className="button small green-earth" to={`/chat/${username}/${id}/`}><FontAwesomeIcon icon={faPaperPlane} /></Link>
              }
            </>}></Column>
          </DataTable>
          {reports?.total == 0 && 
            <div className="mt-2">
              <p>There's no reports for this filter options.</p>
            </div>
          }
        </>}
      </ProfileProvider>
    </div>
  </div>
}

export default Reports