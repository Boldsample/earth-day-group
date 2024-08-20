import React, {useState, useEffect, useRef} from 'react'
import "./styles.sass"
import { TextInput, MultiSelectInput, CalendarInput } from "@ui/forms"
import { Calendar } from 'primereact/calendar';
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faCircleCheck, faRectangleAd, faBullseye, faClock, faLink } from '@fortawesome/free-solid-svg-icons'
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { addAd, addImages, getAd, updateAd } from '@services/adsServices';
import { Button } from 'primereact/button';
        

const AdManager = ({type}) => {
    const [visible, setVisible] = useState(false);
    const [sending, setSending] = useState(false);
    const [update, setUpdate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ad, setAd] = useState({});
    const user = useSelector((state) => state.users.userData)
    const [date, setDate] = useState(null);
    const toast = useRef(null);
   
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
        type: type,
        name: "",
        target: "",
        ad_duration: "",
        link: "",
        image: null
      },
    })

    const modules = [
        { name: 'Users', value: 'user' },
        { name: 'Companies', value: 'company' },
        { name: 'Social Organizations/Shelters', value: 'ngo, shelter, social'},
    ];
    
    const customBase64Uploader = async (event) => {
        setLoading(true)

        const file = event.files[0];
        const reader = new FileReader();
  
        reader.readAsDataURL(file);
  
        reader.onloadend = function () {
          console.log("hi")
          setTimeout(() => {
            setLoading(false)
            setValue("image", reader.result)
           
                }, "1000");
           
        };
    };

  const cancel = async () =>{
    if(ad?.id){
      reset({
        type: type,
        name: "",
        target: "",
        ad_duration: "",
        link: "",
        image: null
      })
      await updateAd({state:2}, {id:ad.id})
      setUpdate(new Date())
    }else{
      setValue('image', null)
    }
  }

  
  useEffect(() => {
    getAd(type).then(data => setAd(data))
    
  }, [update]);

  const onSubmit = async (data) => {
    let response 
    setSending(true)
    const image = data.image
    data.start_date = data.ad_duration[0].toISOString()
    data.end_date = data.ad_duration[1].toISOString()
    delete data.ad_duration
    delete data.image
    
    response = await addAd(data)
    if(response.id){
      await addImages([{type:'ads', entity:response.id, picture: image}])
      setSending(false)
      setUpdate(new Date())
      toast.current.show({severity:'success', summary: 'Success', detail:'Ad was created succesfully', life: 20000});
    }else{
      setSending(false)
      toast.current.show({severity:'error', summary: 'Error', detail:'Ad failed', life: 20000});
    }
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
      <Toast ref={toast} />
    <div className='fullwidth mt-3'>
            <div className="flex flex-start mb-1">
              <h4 className='title__noWidth'>Home Menu Banner</h4>
              <button className='info__btn' onClick={() => setVisible(true)}><FontAwesomeIcon color='var(--dark-blue)' icon={faCircleInfo} fontSize="25px" /></button>
            </div>
              <p>This banner appears as a rectangular menu button on every user's home screen.</p>

            {!ad?.id && watch('image') == null && !loading  ? 
              <div>
              <FileUpload name="banner_image" customUpload uploadHandler={customBase64Uploader} accept="image/*" maxFileSize={1300000} emptyTemplate={<p className="m-0">Drag and drop the image here to upload.</p>} />
              </div>
          :
          <div className='p-fileupload p-fileupload-advanced p-component mt-3'>
          <div className='p-fileupload p-fileupload-buttonbar space-between'>
              <div>
                {ad?.id ? "" :  <Button loading={sending} type='submit' onClick={handleSubmit(onSubmit)}form='ad_form ' className='green-earth'>Create Ad</Button>}
                <button type='button' onClick={cancel} className='red-state'>{ad?.id ? 'Cancel Campaign' : 'Cancel'}</button>
              </div>
            {ad?.id && 
              <div className="live-container">
                <div className="live-circle"></div>
                <div className="live-text">LIVE</div>
              </div>
            }
          </div>
          <div className='p-fileupload-content'>
            {ad?.id ? 
            <div className="form__container">
              <div className='width-50'>
              <div className="flex">
                <FontAwesomeIcon  color='var(--dark-blue)' icon={faRectangleAd} fontSize="15px" />
                <h5><span>Ad Name:</span> {ad.name}</h5>
              </div>
              <div className="flex">
                <FontAwesomeIcon  color='var(--dark-blue' icon={faBullseye} fontSize="15px" />
                <h5><span>Ad Target:</span> {ad.target}</h5>
              </div>
              <div className="flex">
                <FontAwesomeIcon  color='var(--dark-blue)' icon={faClock} fontSize="15px" />
                <h5> <span>Ad Duration: </span> {ad.start_date} to {ad.end_date}</h5>
              </div>
              <div className="flex">
                <FontAwesomeIcon  color='var(--dark-blue)' icon={faLink} fontSize="15px" />
                <h5><span>Ad Link:</span> {ad.link}</h5>  
              </div>
              </div>
              <div className=' title-uploader-container width-50 ad-summary-image'>
                <img src={ad.picture} alt="Banner preview" height="200px" />
            </div>
            </div>
            :
            <div className='form__container'>
            <div className="form__width75">
            <div className="registerInput__container-x2 mt-0">
              <TextInput
                width="100%"
                // disabled={ID}
                control={control}
                isRequired={true}
                labelName="Ad Name"
                nameInput="name"
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
                nameInput="link"
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
            <div className="registerInput__container-x2 mt-0">
              <MultiSelectInput
                className=""
                isEdit={true}
                options={modules}
                labelName="Who can view this Ad?"
                nameInput="target"
                control={control}
                showLabel={true}
                isRequired={true}
                optionLabel="name"
                optionValue="value"
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
        <div className="preview-container">
        <div className='image__preview-container' style={loading === true ? {justifyContent: 'center'} : {justifyContent: 'end'}}> 
          {loading === true ? 
            <ProgressSpinner 
              style={{width: '50px', height: '50px'}} 
              strokeWidth="8" 
              fill="var(--surface-ground)" 
              animationDuration=".5s" 
            /> 
              : 
              <>
            <div className=' title-uploader-container'>
              <h6 className='text-center'>Uploaded Image</h6>
              <FontAwesomeIcon className={`confirmation-check ${loading === false ? 'showCheck' : ''}`} color='var(--green-earth)' icon={faCircleCheck} fontSize="15px" />
            </div>
            <img src={watch('image')} alt="Banner preview" height="70%" />
              </>
            }
          </div>
        </div>

            </div>
            }
          
          </div>
          </div>
        }
        </div>
      </form>
    </>
  )
}

export default AdManager