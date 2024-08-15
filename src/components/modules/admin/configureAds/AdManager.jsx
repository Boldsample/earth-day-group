import React, {useState} from 'react'
import "./styles.sass"
import { TextInput, MultiSelectInput, CalendarInput } from "@ui/forms"
import { Calendar } from 'primereact/calendar';
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

const AdManager = () => {
    const [visible, setVisible] = useState(false);
    const user = useSelector((state) => state.users.userData)
    const [bannerImg, setBannerImg] = useState(null)
    const [date, setDate] = useState(null);
    const {
        watch,
        reset,
        control,
        setValue,
        setFocus,
        setError,
        getValues,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
        ad_name: "",
        ad_url: "",
        ad_target: "",
        ad_duration: "",
        },
    })
    const modules = [
        { name: 'Users' },
        { name: 'Companies' },
        { name: 'Foundations/NGOs'},
    ];

    const customBase64Uploader = async (event) => {
        // convert file to base64 encoded
        const file = event.files[0];
        const reader = new FileReader();
        let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url
  
        reader.readAsDataURL(blob);
  
        reader.onloadend = function () {
            const base64data = reader.result;
            setBannerImg(base64data)
            console.log(base64data)
        };
    };

    const onSubmit = async (data) => {
    console.log(data)
    }

    const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>

  return (
    <>
    <Dialog header="Header" visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>
        <p className="m-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
    </Dialog>
    <form onSubmit={handleSubmit(onSubmit)}>
    <div className='fullwidth mt-3'>
            <div className="flex flex-start mb-1">
              <h4 className='title__noWidth'>Home Menu Banner</h4>
              <FontAwesomeIcon className='ml-1' color='var(--dark-blue)' icon={faCircleInfo} fontSize="25px" />
            </div>
              <p>This banner appears as a rectangular menu button on every user's home screen.</p>
            {bannerImg == null ? 
              <div>
              <FileUpload name="banner_image" customUpload uploadHandler={customBase64Uploader} url={'/api/upload'} accept="image/*" maxFileSize={1000000} emptyTemplate={<p className="m-0">Drag and drop the image here to upload.</p>} />
              </div>
          :
          <div className='p-fileupload p-fileupload-advanced p-component mt-3'>
          <div className='p-fileupload p-fileupload-buttonbar'>
              <button type='submit' onClick={handleSubmit(onSubmit)} form='ad_form ' className='green-earth'>Create Ad</button>
              <button className='red-state'>Cancel</button>
          </div>
          <div className='p-fileupload-content'>
          <div className="form__width75">
              <div className="registerInput__container-x2">
                <TextInput
                  width="100%"
                  // disabled={ID}
                  control={control}
                  isRequired={true}
                  labelName="Ad Name"
                  nameInput="ad_name"
                  placeHolderText="Pepsi Summer Campaign*"
                  getFormErrorMessage={getFormErrorMessage}
                  rules={{
                    maxLength: {
                      value: 50,
                      message: "The field exceeds 50 characters.",
                    },
                    required: "*The field is required.",
                    pattern: {
                      value: /^[a-zA-Z_]+$/,
                      message: "It must have only letters and underscore.",
                    },
                  }} />
                  <TextInput
                  control={control}
                  isRequired={true}
                  labelName="Ad URL"
                  nameInput="ad_url"
                  placeHolderText="www.pepsi.com/landing"
                  getFormErrorMessage={getFormErrorMessage}
                  rules={{
                    maxLength: {
                      value: 100,
                      message: "The field exceeds 50 characters.",
                    },
                    pattern: {
                      value: /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?(\/[a-zA-Z0-9-_?=&]+)?$/,
                      message: "Please enter a valid URL",
                    },
                  }} />
              </div>
              <div className="registerInput__container-x2">
                <MultiSelectInput
                  className=""
                  isEdit={true}
                  options={modules}
                  labelName="Who can view this Ad?"
                  nameInput="ad_target"
                  control={control}
                  showLabel={true}
                  isRequired={true}
                  optionLabel="name"
                  optionValue="name"
                  placeHolderText="Select Modules"
                  getFormErrorMessage={getFormErrorMessage}
                  rules={{
                    required: "*El campo es requerido.",
                  }} />
                    <CalendarInput
                    nameInput="ad_duration"
                    control={control}
                    isRequired={true}
                    labelName="Select Ad Duration"
                    rules={{
                      required: true,
                    }} />
                </div>
                {/* <button type='submit' className='green-earth'>Create Ad</button> */}
          </div>
          </div>
          </div>
        }
        </div>
      </form>
    </>
  )
}

export default AdManager