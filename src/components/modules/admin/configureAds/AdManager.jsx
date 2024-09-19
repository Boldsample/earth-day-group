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
import { useTranslation } from 'react-i18next'
import CardSkeleton from '@ui/skeletons/cardSkeleton/CardSkeleton';

const AdManager = ({type, adSpecs, bannerTitle, bannerDescription}) => {
    const [visible, setVisible] = useState(false);
    const [sending, setSending] = useState(false);
    const [update, setUpdate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [firstRender, setFirstRender] = useState(false);
    const [ad, setAd] = useState(null);
    const user = useSelector((state) => state.users.userData)
    const [date, setDate] = useState(null);
    const toast = useRef(null);
    const [t] = useTranslation('translation', { keyPrefix: 'admin.adManager' })
    const appModules = t('modules', { returnObjects: true });
    const [tGlobal] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
   
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
    
    const customBase64Uploader = async (event) => {
        setLoading(true)

        const file = event.files[0];
        const reader = new FileReader();
  
        reader.readAsDataURL(file);
  
        reader.onloadend = function () {
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
    setFirstRender(true)
    getAd(type).then(data => {
      setAd(data)
      setFirstRender(false)
    })
    
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
      toast.current.show({severity:'success', summary: t('adSuccessToastTitle'), detail:t('adSuccessToastMsg'), life: 20000});
    }else{
      setSending(false)
      toast.current.show({severity:'error', summary: t('adFailedToastTitle'), detail:t('adFailedToastMsg'), life: 20000});
    }
  }

  const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>

  return (
    <>
    <Dialog
        header={t('dialogMainTitle')}
        visible={visible}
        style={{ width: '50vw' }}
        onHide={() => {
            if (!visible) return;
            setVisible(false);
        }}
    >
        <img src={adSpecs?.image} alt="" width="70%" />
        <div>
            <div className='mb-2 mt-2'>
                <h5 className="mb-1">{adSpecs?.title1}</h5>
                <p className='pop-up-text-small'>{adSpecs.description}</p>
            </div>
            <div className='mb-2'>
                <h5 className='mb-1'>{adSpecs?.title2}</h5>
                <ul className='pop-up-text-small'>
                    {adSpecs.designRecommendations.map((requirement) => (
                        <li key={requirement}>{requirement}</li>
                    ))}
                </ul>
            </div>
            <div className='mb-2'>
                <h5 className='mb-1'>{adSpecs?.title3}</h5>
                <ul className='pop-up-text-small'>
                    {adSpecs.techRequirements.map((requirement) => (
                        <li key={requirement}>{requirement}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h5 className='mb-1'>{adSpecs?.title4}</h5>
                <ul className='pop-up-text-small'>
                    {adSpecs.placesShown.map((sections) => (
                        <li key={sections}>{sections}</li>
                    ))}
                </ul>
            </div>
        </div>
    </Dialog>
    <form onSubmit={handleSubmit(onSubmit)}>
        <Toast ref={toast} />
        <div className='fullwidth mt-3'>
            <div className="flex flex-start mb-1">
                <h4 className='title__noWidth'>{bannerTitle}</h4>
                <button className='info__btn' onClick={() => setVisible(true)}>
                    <FontAwesomeIcon color='var(--dark-blue)' icon={faCircleInfo} fontSize="25px" />
                </button>
            </div>
            <p>{bannerDescription}</p>
            { firstRender ? (
                <CardSkeleton className="chatCard__skeleton" />
            ) : !ad?.id && watch('image') == null && !loading ? (
                <div>
                    <FileUpload
                        name="banner_image"
                        uploadLabel={t('uploadBtnText')}
                        cancelLabel={t('cancelBtnText')}
                        chooseLabel={t('chooseBtnText')}
                        customUpload
                        uploadHandler={customBase64Uploader}
                        accept="image/*"
                        maxFileSize={1300000}
                        emptyTemplate={<p className="m-0">{t('uploadImgPlaceHolderText')}</p>}
                    />
                </div>
            ) : (
                <div className='p-fileupload p-fileupload-advanced p-component mt-3'>
                    <div className='p-fileupload p-fileupload-buttonbar space-between position-relative'>
                        <div>
                            {ad?.id ? "" : (
                                <Button loading={sending} type='submit' onClick={handleSubmit(onSubmit)} form='ad_form' className='green-earth'>
                                    {t('createAdBtnText')}
                                </Button>
                            )}
                            <button type='button' onClick={cancel} className='red-state'>
                                {ad?.id ? t('cancelCampaignBtnText') : t('cancelBtnText')}
                            </button>
                        </div>
                        {ad?.id && (
                            <div className='btn-str'>
                                <span className='btn-str__text'>{t('liveAdText')}</span>
                            </div>
                        )}
                    </div>
                    <div className='p-fileupload-content'>
                        {ad?.id ? (
                            <div className="form__container">
                                <div className='width-50'>
                                    <div className="flex">
                                        <FontAwesomeIcon color='var(--dark-blue)' icon={faRectangleAd} fontSize="15px" />
                                        <h5><span>{t('adTitle')}</span> {ad.name}</h5>
                                    </div>
                                    <div className="flex">
                                        <FontAwesomeIcon color='var(--dark-blue' icon={faBullseye} fontSize="15px" />
                                        <h5><span>{t('targetTitle')}</span> {ad.target}</h5>
                                    </div>
                                    <div className="flex">
                                        <FontAwesomeIcon color='var(--dark-blue)' icon={faClock} fontSize="15px" />
                                        <h5><span>{t('durationTitle')}</span> {ad.start_date} to {ad.end_date}</h5>
                                    </div>
                                    <div className="flex">
                                        <FontAwesomeIcon color='var(--dark-blue)' icon={faLink} fontSize="15px" />
                                        <h5><span>{t('linkTitle')}</span> {ad.link}</h5>
                                    </div>
                                </div>
                                <div className='title-uploader-container width-50 ad-summary-image'>
                                    <img src={ad.picture} alt="Banner preview" height="200px" />
                                </div>
                            </div>
                        ) : (
                            <div className='form__container'>
                                <div className="form__width75">
                                    <div className="registerInput__container-x2 mt-0">
                                        <TextInput
                                            width="100%"
                                            control={control}
                                            isRequired={true}
                                            labelName={t('adNameInputTitle')}
                                            nameInput="name"
                                            placeHolderText={t('adNameInputPlaceholder')}
                                            getFormErrorMessage={getFormErrorMessage}
                                            rules={{
                                                maxLength: {
                                                    value: 70,
                                                    message: tGlobal(`inputMaxLengthErrorMessage`, { maxLength: 70 }),
                                                },
                                                required: tGlobal(`requiredErrorMessage`),
                                                pattern: {
                                                    value: /^\S/,
                                                    message: tGlobal('patternErrorMessage'),
                                                },
                                            }}
                                        />
                                        <TextInput
                                            control={control}
                                            isRequired={true}
                                            labelName={t('adUrlInputTitle')}
                                            nameInput="link"
                                            placeHolderText={t('adUrlInputPlaceholder')}
                                            getFormErrorMessage={getFormErrorMessage}
                                            rules={{
                                                maxLength: {
                                                    value: 3000,
                                                    message: tGlobal(`inputMaxLengthErrorMessage`, { maxLength: 3000 }),
                                                },
                                                required: tGlobal(`requiredErrorMessage`),
                                                pattern: {
                                                    value: /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?(\/[a-zA-Z0-9-_?=&]+)?$/,
                                                    message: tGlobal('validEmailAddressErrorMessage'),
                                                },
                                            }}
                                        />
                                    </div>
                                    <div className="registerInput__container-x2 mt-0">
                                        <MultiSelectInput
                                            className=""
                                            isEdit={true}
                                            options={appModules}
                                            labelName={t('adMultiSelectInputTitle')}
                                            nameInput="target"
                                            control={control}
                                            showLabel={true}
                                            isRequired={true}
                                            optionLabel="name"
                                            optionValue="value"
                                            placeHolderText={t('adMultiSelectInputPlaceholder')}
                                            getFormErrorMessage={getFormErrorMessage}
                                            rules={{
                                                required: tGlobal(`requiredErrorMessage`),
                                            }}
                                        />
                                        <CalendarInput
                                            nameInput="ad_duration"
                                            control={control}
                                            isRequired={true}
                                            getFormErrorMessage={getFormErrorMessage}
                                            labelName={t('adDateInputTitle')}
                                            placeHolderText={t('adDateInputPlaceholder')}
                                            rules={{
                                                required: tGlobal(`requiredErrorMessage`),
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="preview-container">
                                    <div className='image__preview-container' style={loading === true ? { justifyContent: 'center' } : { justifyContent: 'end' }}>
                                        {loading === true  ? (
                                            <ProgressSpinner
                                                style={{ width: '50px', height: '50px' }}
                                                strokeWidth="8"
                                                fill="var(--surface-ground)"
                                                animationDuration=".5s"
                                            />
                                        ) : (
                                            <>
                                                <div className='title-uploader-container'>
                                                    <h6 className='text-center'>{t('bannerPreviewImagetext')}</h6>
                                                    <FontAwesomeIcon className={`confirmation-check ${loading === false ? 'showCheck' : ''}`} color='var(--green-earth)' icon={faCircleCheck} fontSize="15px" />
                                                </div>
                                                <img src={watch('image')} alt="Banner preview" height="70%" />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    </form>
</>

  )
}

export default AdManager