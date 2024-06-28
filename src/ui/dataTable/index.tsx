import '../../../../index.css'
import React, { useState, useEffect } from 'react'
import { FilterMatchMode, FilterOperator, FilterService } from 'primereact/api'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import './datatable.css'
import { InputText } from 'primereact/inputtext'
import { useTranslation } from 'react-i18next'
import { Dialog } from 'primereact/dialog'
import SelectInputTwo from '../../atoms/SelectInput/selectInputTwo'
import ArrowRight from '../../atoms/icons/ArrowRight'
import { showToast } from '../../../../services/toastNotification'
import API from '../../../../services/API'
import { getCompanies, setCompanies } from '../../../../store/slices/company/companySlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../../../store'

function TableRow({ data, rowsLength, paginatorValue }: any) {
  const [t, i18n] = useTranslation('global')
  const [array, setArray] = useState([{}])
  const col_array: any = []
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })
  const [globalFilterValue, setGlobalFilterValue] = useState('')
  const [displayPosition, setDisplayPosition] = useState(false)
  const [position, setPosition] = useState<any>('center')
  const dialogFuncMap: any = {
    displayPosition: setDisplayPosition,
  }
  const dispatch = useDispatch<AppDispatch>()

  //Edition States
  const [Editdescription, setEditDescription] = useState<any>('')
  const [oldEditdescription, setOldEditDescription] = useState<any>('')
  const [companyTypeEdit, setCompanyTypeEdit] = useState<any>('')
  const [themeType, setThemeType] = useState<any>('')
  const [backgroundImageEdit, setbackgroundImageEdit] = useState<any>('')
  const [logoMenu, setLogoMenu] = useState<any>('')
  const [logoImage, setLogoImage] = useState<any>('')
  const [colorMenu, setColorMenu] = useState<any>('')
  const [list, setList] = useState<[{ [key: string]: any }]>([{}])
  const companyList: any = JSON.parse(localStorage.getItem('companyType')!)

  useEffect(() => {
    for (const key in data[0]) {
      const unknowData: any = new Object()
      unknowData.field = key
      unknowData.header = key
      col_array.push(unknowData)
    }
    setArray(col_array)
    setList(companyList)
  }, [])

  const dynamicColumns = array.map((col: any, i: any) => {
    return <Column key={i} field={col.field} header={col.header} style={{ width: '40%' }} />
  })

  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value
    const _filters = { ...filters }
    _filters['global'].value = value
    setFilters(_filters)
    setGlobalFilterValue(value)
  }

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between align-items-center">
        {/*<h5 className="m-0">{t('Config.Datatable.customerTitle')}</h5>*/}
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            className={'input-sm'}
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            // placeholder={t('Datatable.Search')}
          />
        </span>
      </div>
    )
  }

  const header = renderHeader()

  const onClick = (name: any, position: any, data?: any) => {
    let companyId = ''
    const res = list.map((e: any, i: any) => {
      if (e['TEMP_NOMBRE'] == data.companyType) {
        companyId = i + 1
      }
    })
    setEditDescription(data.description)
    setOldEditDescription(data.description)
    setCompanyTypeEdit(companyId)
    // setCompanyTypeEdit(data.companyType);
    // setThemeType(data.themeType);
    setbackgroundImageEdit(data.backgroundImage)
    setLogoMenu(data.menuImage)
    setLogoImage(data.logoImage)
    setColorMenu(data.colorMenu)
    dialogFuncMap[`${name}`](true)

    if (position) {
      setPosition(position)
    }
  }

  const onHide = (name: any) => {
    dialogFuncMap[`${name}`](false)
  }

  const handleSubmit = () => {
    if (
      Editdescription === '' ||
      companyTypeEdit === '' ||
      colorMenu === '' ||
      backgroundImageEdit === '' ||
      logoImage === '' ||
      logoMenu === ''
    ) {
      showToast('Por favor diligencie todos los campos', 'warning')
      return
    }
    insertOrUpdateCompany()
  }

  const insertOrUpdateCompany = async () => {
    const payload: any = {
      oldDescription: oldEditdescription,
      description: Editdescription,
      backgroundLogin: backgroundImageEdit,
      logoLogin: logoImage,
      logoMenu: logoMenu,
      navbarColor: colorMenu,
      companyType: companyTypeEdit,
      type: 1,
    }

    const headers: any = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'x-helppeople-token': localStorage.getItem('token')!,
    }
    // withCredentials: false;

    const response: any = await API.post('services/InsertOrUpdateCompany', payload, { headers })
    if (response.data.Status == 'Ok') {
      onHide('displayPosition')
      showToast('Update Exitoso', 'success')
      get_companies()
    }
  }

  const renderFooter = (name: any) => {
    return (
      <div>
        <button
          className="relative inline-flex items-center px-8 py-1 overflow-hidden text-white bg-indigo-600 rounded group active:bg-indigo-500 focus:outline-none focus:ring cursor-pointer"
          type={'button'}
          onClick={handleSubmit}>
          <span className="absolute right-0 transition-transform translate-x-full group-hover:-translate-x-4">
            <ArrowRight />
          </span>
          <span className="text-sm font-medium transition-all group-hover:mr-4">
            {t('Config.edit')}
          </span>
        </button>
        {/*<Button label="No" icon="pi pi-times" onClick={() => onHide(name)}*/}
        {/*        className="p-button-text p-button-sm"/>*/}
        {/*<Button label="Yes" icon="pi pi-check" onClick={() => onHide(name)} className="p-button-sm"/>*/}
      </div>
    )
  }

  const get_companies = () => {
    dispatch(getCompanies()).then((e: any) => {
      dispatch(setCompanies(e.payload.Values))
      localStorage.setItem('companies', JSON.stringify(e.payload.Values))
    })
  }

  return (
    <div>
      {/*<div className="grid flex-column">*/}
      {/*    <div className="col">*/}
      {/*        <Button label="Top" icon="pi pi-arrow-down" onClick={() => onClick('displayPosition', 'top')}*/}
      {/*                className="p-button-warning"/>*/}
      {/*    </div>*/}
      {/*</div>*/}

      <Dialog
        header={t('Config.editRegister')}
        visible={displayPosition}
        position={position}
        modal
        style={{ width: '25vw' }}
        footer={renderFooter('displayPosition')}
        onHide={() => onHide('displayPosition')}
        draggable={false}
        resizable={false}>
        <section className={'mt-4'}>
          <div>
            <label className="label">
              <span className="label-text text-sm font-bold">
                {t('Config.desc')} <span className="text-red-600 font-bold text-sm">*</span>
              </span>
            </label>
            <textarea
              className={'textarea'}
              value={Editdescription}
              onChange={(e: any) => setEditDescription(e.target.value)}></textarea>
          </div>

          <SelectInputTwo
            handelChange={(e: any) => {
              setCompanyTypeEdit(e.target.value)
            }}
            options={list}
            // label={t('Config.companyType')}
            textField={'TEMP_NOMBRE'}
            defaultValue={companyTypeEdit}
            valueField={'TEMP_COD'}
          />

          <div>
            <label className="label">
              <span className="label-text text-sm font-bold">
                {t('Config.color')} <span className="text-red-600 font-bold text-sm">*</span>
              </span>
            </label>

            <input
              className={'input__color'}
              type={'color'}
              value={colorMenu}
              onChange={(e: any) => setColorMenu(e.target.value)}
            />
          </div>

          <div className="mt-6 div__file">
            <label className={'input__file__label'} htmlFor={'backgroundLoginEdit'}>
              {backgroundImageEdit == '' || backgroundImageEdit == null
                ? t('Config.backgroundLogin')
                : backgroundImageEdit}
            </label>
            <input
              className={'input__file'}
              id={'backgroundLoginEdit'}
              type={'file'}
              onChange={(e: any) => {
                let res = e.target.value
                res = res.split('\\')![2]
                setbackgroundImageEdit(res)
              }}
            />
          </div>

          <div className="mt-6 div__file">
            <label className={'input__file__label'} htmlFor={'logoLoginEdit'}>
              {logoImage == '' || logoImage == null ? t('Config.logoMenu') : logoImage}
            </label>
            <input
              className={'input__file'}
              id={'logoLoginEdit'}
              type={'file'}
              onChange={(e: any) => {
                let res = e.target.value
                res = res.split('\\')![2]
                setLogoImage(res)
              }}
            />
          </div>

          <div className="mt-6 div__file">
            <label className={'input__file__label'} htmlFor={'logoMenuEdit'}>
              {logoMenu == '' || logoMenu == null ? t('Config.backgroundLogo') : logoMenu}
            </label>
            <input
              className={'input__file'}
              id={'logoMenuEdit'}
              type={'file'}
              onChange={(e: any) => {
                let res = e.target.value
                res = res.split('\\')![2]
                setLogoMenu(res)
              }}
            />
          </div>
        </section>
      </Dialog>
      <div className="card">
        <DataTable
          // value={JSON.parse(localStorage.getItem('companies')!)}
          size="small"
          className={'tableRow__columns'}
          value={data}
          header={header}
          responsiveLayout="scroll"
          paginator={paginatorValue}
          rows={rowsLength}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          rowsPerPageOptions={[15, 25, 50]}
          dataKey="id"
          rowHover
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={[
            'description',
            'companyType',
            // t('Config.backgroundLogo'),
            // 'themeType',
            'backgroundImage',
            'menuImage',
            'logoImage',
            'colorMenu',
          ]}
          onSelectionChange={(e: any) => onClick('displayPosition', 'top', e.value)}
          emptyMessage="No customers found."
          selectionMode="single"
          // onRowSelect={onRowSelect}
          // onRowUnselect={onRowUnselect}
          // onSelectionChange={e => setSelectedProduct(e.value)}
          resizableColumns
          columnResizeMode="fit"
          showGridlines
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
          {dynamicColumns}
        </DataTable>
      </div>
    </div>
  )
}

export { TableRow }
