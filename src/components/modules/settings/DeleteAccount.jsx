import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { PasswordInput } from '@ui/forms';
import { useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan} from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

const DeleteAccount = () => {
  const [t] = useTranslation('translation', { keyPrefix: 'settings.deleteAccount'})
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
const [visible, setVisible] = useState(false);
const {
    control,
    setFocus,
    setError,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
    },
  })

  const getFormErrorMessage = fieldName => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>

const footerContent = (
    <div>
        <Button className='red-state' label={t('dialogDeleteAccountBtnText')} icon="pi pi-check" onClick={() => setVisible(false)} autoFocus />
        <Button label={t('dialogCancelDeleteBtnText')} icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
    </div>
);

const headerContent = (
  <div>
   {/* <div className="icon trash text-red-state"><FontAwesomeIcon icon={faTrashCan} style={{fontSize: "60px"}} /></div> */}
  </div>
);




  return (
    <div className="layout" style={{background: 'white'}}>
    <div className="main__content centerwidth alignttop">
    <div className="settings__card">
        <h4 className='mb-2 text-green-earth'>{t('mainTitle')}</h4>
        <p className='text-left mb-2'>{t('secondaryTitle')}</p>
        <ul className='text-left ml-1'>
            <li className='mb-1'><b className='text-green-earth'>{t('listItem1Title')}</b> {t('listItem1')}</li>
            <li  className='mb-1'><b className='text-green-earth'>{t('listItem2Title')}</b> {t('listItem2')}</li>
            <li  className='mb-1'><b className='text-green-earth'>{t('listItem3Title')}</b> {t('listItem3')}</li>
            <li  className='mb-1'><b className='text-green-earth'>{t('listItem4Title')}</b> {t('listItem4')}.</li>
        </ul>
        <p className='text-left mt-2'>{t('deleteConfirmationText')}</p>
        {/* <Link  to={'/settings/edit/'} className="button red-state">Delete your account</Link> */}
       <Button
            className='red-state'
            label={t('deleteAccountBtn')}
            onClick={()=> setVisible(true)}
       />
       <Dialog header={headerContent} visible={visible} style={{ width: '50vw', textAlign: 'center' }} onHide={() => {if (!visible) return; setVisible(false); }} footer={footerContent}>
      <div className="icon trash"><FontAwesomeIcon icon={faTrashCan} style={{fontSize: "60px", paddingBottom: "20px"}} /></div>
       <p style={{fontSize:'20px', fontWeight: '500'}}> {t('dialogText1')} <br /> {t('dialogText2')}</p>
       <PasswordInput
            width="50%"
            maxLength={20}
            label={t('passwordInputLabel')}
            showLabel={false}
            control={control}
            nameInput="password"
            isRequired={true}
            placeHolderText={t('passwordInputPlaceHolderText')}
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              required:  tGlobal(`requiredErrorMessage`),
            }} />
            </Dialog>
    </div>
    </div>
  </div>
  )
}

export default DeleteAccount