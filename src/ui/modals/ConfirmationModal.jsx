import { PasswordInput } from '@ui/forms';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './styles.sass' 
// import { faTrashCan} from '@fortawesome/free-solid-svg-icons'

const ConfirmationModal = ({title, text, handleConfirmation, type, visible, action, icon}) => {
  const [tGlobal] = useTranslation('translation', {keyPrefix: 'global'})
  const [t] = useTranslation('translation', { keyPrefix: 'settings.deleteAccount'})
  const footerContent = <div>
      <Button className='red-state' label={tGlobal('confirmDelete')} icon="pi pi-check" onClick={() => action(true)} autoFocus />
      <Button label={t('dialogCancelDeleteBtnText')} icon="pi pi-times" onClick={() => action(false)} className="p-button-text" />
  </div>
  const headerContent = <div>
    {/* <div className="icon trash text-red-state"><FontAwesomeIcon icon={icon} style={{fontSize: "60px"}} /></div> */}
  </div>

  return <Dialog header={headerContent} visible={visible} style={{ width: '50vw', height: '50vh', textAlign: 'center' }} onHide={() => action(false)} footer={footerContent} contentClassName='dialog-content'>
    <div className="icon trash text-red-state"><FontAwesomeIcon icon={icon} fontSize={35}  /></div>
    <div>
      <h4>{title}</h4>
      <p>{t('dialogText2')}</p>
    </div>
     {/* <PasswordInput
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
          }} /> */}
  </Dialog>
}

export default ConfirmationModal