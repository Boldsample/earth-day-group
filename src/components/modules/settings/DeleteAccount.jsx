import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { PasswordInput } from '@ui/forms';
import { useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan} from '@fortawesome/free-solid-svg-icons'


const DeleteAccount = () => {
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
        <Button className='red-state' label="Delete my account" icon="pi pi-check" onClick={() => setVisible(false)} autoFocus />
        <Button label="Cancel" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
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
        <h4 className='mb-2 text-green-earth'>Disclaimer: Account Deletion</h4>
        <p className='text-left mb-2'>By deleting your account, you agree to the following:</p>
        <ul className='text-left ml-1'>
            <li className='mb-1'><b className='text-green-earth'>Permanent Deletion:</b> Your account and all associated data will be permanently removed and cannot be recovered.</li>
            <li  className='mb-1'><b className='text-green-earth'>Loss of Access:</b> You will lose access to all services, content, and features linked to your account.</li>
            <li  className='mb-1'><b className='text-green-earth'>Data Responsibility:</b> Ensure you back up any data you want to keep, as we are not liable for any loss of data.</li>
            <li  className='mb-1'><b className='text-green-earth'>Outstanding Transactions:</b> Resolve any pending transactions or issues before deletion.</li>
        </ul>
        <p className='text-left mt-2'>By proceeding, you accept these terms and understand the permanent consequences.</p>
        {/* <Link  to={'/settings/edit/'} className="button red-state">Delete your account</Link> */}
       <Button
            className='red-state'
            label='Delete your account'
            onClick={()=> setVisible(true)}
       />
       <Dialog header={headerContent} visible={visible} style={{ width: '50vw', textAlign: 'center' }} onHide={() => {if (!visible) return; setVisible(false); }} footer={footerContent}>
      <div className="icon trash text-red-state"><FontAwesomeIcon icon={faTrashCan} style={{fontSize: "60px", paddingBottom: "20px"}} /></div>
       <p style={{fontSize:'20px', fontWeight: '500'}}>Do you really wish to delete your account? <br /> This process cannot be undone.</p>
       <PasswordInput
            width="50%"
            maxLength={20}
            label="Password"
            showLabel={false}
            control={control}
            nameInput="password"
            isRequired={true}
            placeHolderText="Enter your password"
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength : {
                value: 20,
                message: "El campo supera los 20 caracteres",
              },
              required:  "*El campo es requerido.",
              pattern:  {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                message:
                  "Must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
              },
            }} />
            </Dialog>
    </div>
    </div>
  </div>
  )
}

export default DeleteAccount