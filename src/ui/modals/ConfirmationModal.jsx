import { PasswordInput } from '@ui/forms';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './styles.sass' 
// import { faTrashCan} from '@fortawesome/free-solid-svg-icons'

const ConfirmationModal = ({title, text, handleConfirmation, type, visible, setVisible, icon}) => {
    console.log(visible, setVisible)
    const [t] = useTranslation('translation', { keyPrefix: 'settings.deleteAccount'})
    const [tGlobal] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
    const footerContent = (
        <div>
            <Button className='red-state' label={t('dialogDeleteAccountBtnText')} icon="pi pi-check" onClick={() => setVisible(false)} autoFocus />
            <Button label={t('dialogCancelDeleteBtnText')} icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
        </div>
    );
    
    const headerContent = (
      <div>
       {/* <div className="icon trash text-red-state"><FontAwesomeIcon icon={icon} style={{fontSize: "60px"}} /></div> */}
      </div>
    );
  return (
    <Dialog header={headerContent} visible={visible} style={{ width: '50vw', height: '50vh', textAlign: 'center' }} onHide={() => {if (!visible) return; setVisible(false); }} footer={footerContent} contentClassName='dialog-content'>
    <div className="icon trash text-red-state"><FontAwesomeIcon icon={icon} fontSize={35}  /></div>
    <div>
    <h4>¿Eliminar cuenta?</h4>
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
  )
}

export default ConfirmationModal