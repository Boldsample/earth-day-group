import './styles.sass'
import { Toast } from 'primereact/toast'
import { useForm } from 'react-hook-form'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { useTranslation } from 'react-i18next'
import { FileUpload } from 'primereact/fileupload'
import React, {useState, useEffect, useRef} from 'react'
import { ProgressSpinner } from 'primereact/progressspinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CardSkeleton from '@ui/skeletons/cardSkeleton/CardSkeleton'
import { TextInput, MultiSelectInput, CalendarInput } from '@ui/forms'
import { addAd, addImages, getAd, updateAd } from '@services/adsServices'
import { faCircleInfo, faCircleCheck, faRectangleAd, faBullseye, faClock, faLink } from '@fortawesome/free-solid-svg-icons'

const AdManager = ({type, adSpecs, bannerTitle, bannerDescription}) => {
    const toast = useRef(null)
    const [ad, setAd] = useState(null)
    const [update, setUpdate] = useState(null)
    const [visible, setVisible] = useState(false)
    const [sending, setSending] = useState(false)
    const [loading, setLoading] = useState(false)
    const [firstRender, setFirstRender] = useState(false)
    const [t] = useTranslation('translation', { keyPrefix: 'admin.adManager' })
    const [tGlobal] = useTranslation('translation', {keyPrefix: 'global.formErrors'})

    const {
        watch,
        reset,
        control,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            link: "",
            type: type,
            target: "",
            image: null,
            ad_duration: ""
        },
    })

    const customBase64Uploader = async (event) => {
        setLoading(true)
        const file = event.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            setLoading(false)
            setValue("image", reader.result)
        }
    }
    const cancel = async () =>{
        if(ad?.id){
            reset({
                name: "",
                link: "",
                type: type,
                target: "",
                image: null,
                ad_duration: ""
            })
            await updateAd({state: 3}, {id: ad?.id})
            setUpdate(new Date())
        }else
            setValue('image', null)
    }

    const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
    const onSubmit = async (data) => {
        let response
        setSending(true)
        const image = data?.image
        data.start_date = data?.ad_duration[0]?.toISOString()
        data.end_date = data?.ad_duration[1]?.toISOString()
        delete data?.ad_duration
        delete data?.image
        response = await addAd(data)
        if(response?.id){
            await addImages([{type:'ads', entity: response?.id, picture: image}])
            setSending(false)
            setUpdate(new Date())
            console.log('Test')
            toast.current.show({severity:'success', summary: t('adSuccessToastTitle'), detail:t('adSuccessToastMsg'), life: 3000});
        }else{
            setSending(false)
            console.log('Test2')
            toast.current.show({severity:'error', summary: t('adFailedToastTitle'), detail:t('adFailedToastMsg'), life: 3000});
        }
    }
    
    useEffect(() => {
        setFirstRender(true);
        getAd(type).then(data => {
            if(data?.state < 3){
                setLoading(true)
                setAd(data);
            }else{
                setAd(null);
                setLoading(false)
            }
            setFirstRender(false);
        });
    }, [update]);
    
    return <>
        <Dialog
            visible={visible}
            style={{ width: '50vw' }}
            header={t('dialogMainTitle')}
            onHide={() => {
                if (!visible) return
                setVisible(false)
            }} >
            <img src={adSpecs?.image} alt="" width="70%" />
            <div>
                <div className='mb-2 mt-2'>
                    <h5 className="mb-1">{adSpecs?.title1}</h5>
                    <p className='pop-up-text-small'>{adSpecs.description}</p>
                </div>
                <div className='mb-2'>
                    <h5 className='mb-1'>{adSpecs?.title2}</h5>
                    <ul className='pop-up-text-small'>
                        {adSpecs.designRecommendations.map(requirement => 
                            <li key={requirement}>{requirement}</li>
                        )}
                    </ul>
                </div>
                <div className='mb-2'>
                    <h5 className='mb-1'>{adSpecs?.title3}</h5>
                    <ul className='pop-up-text-small'>
                        {adSpecs.techRequirements.map((requirement) => 
                            <li key={requirement}>{requirement}</li>
                        )}
                    </ul>
                </div>
                <div>
                    <h5 className='mb-1'>{adSpecs?.title4}</h5>
                    <ul className='pop-up-text-small'>
                        {adSpecs.placesShown.map((sections) => 
                            <li key={sections}>{sections}</li>
                        )}
                    </ul>
                </div>
            </div>
        </Dialog>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Toast ref={toast} />
            <div className='fullwidth mt-3'>
                <div className="flex flex-start mb-1">
                    <h4 className='title__noWidth'>{bannerTitle}</h4>
                    <button type="button" className='info__btn' onClick={() => setVisible(true)}><FontAwesomeIcon color='var(--dark-blue)' icon={faCircleInfo} fontSize="25px" /></button>
                </div>
                <p>{bannerDescription}</p>
                { firstRender ? (
                    <CardSkeleton className="chatCard__skeleton" />
                ) : !ad?.id && watch('image') == null && !loading ? <div>
                    <FileUpload
                        customUpload
                        accept="image/*"
                        name="banner_image"
                        maxFileSize={1300000}
                        uploadLabel={t('uploadBtnText')}
                        cancelLabel={t('cancelBtnText')}
                        chooseLabel={t('chooseBtnText')}
                        uploadHandler={customBase64Uploader}
                        ptOptions={{className: 'green-earth'}}
                        chooseOptions={{className: 'button dark-blue'}}
                        cancelOptions={{className: 'red-state'}}
                        uploadOptions={{className: 'green-earth'}}
                        emptyTemplate={<p className="m-0">{t('uploadImgPlaceHolderText')}</p>} />
                </div> : <div className='p-fileupload p-fileupload-advanced p-component mt-3'>
                    <div className='p-fileupload p-fileupload-buttonbar space-between position-relative'>
                        <div>
                            {!ad?.id && 
                                <Button loading={sending} type="submit" className="green-earth" onClick={handleSubmit(onSubmit)} form="ad_form">{t('createAdBtnText')}</Button>
                            }
                            {ad?.state == 2  && 
                                <Button loading={sending} type="submit" className="green-earth" onClick={cancel} form="ad_form">{t('createAdBtnText')}</Button>
                            }
                            {ad?.state == 1 && 
                                <Button type="button" onClick={cancel} className="red-state">{ad?.id ? t('cancelCampaignBtnText') : t('cancelBtnText')}</Button>
                            }
                        </div>
                        {ad?.id && <div className={'btn-str' + ( ad?.state == 1 ?  ' ad-offline' : '')}>
                            <span className='btn-str__text'>{ad?.state == 1 ? t('liveAdText') : t('offline')}</span>
                        </div>}
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
                                            nameInput="name"
                                            control={control}
                                            isRequired={true}
                                            labelName={t('adNameInputTitle')}
                                            getFormErrorMessage={getFormErrorMessage}
                                            placeHolderText={t('adNameInputPlaceholder')}
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
                                            nameInput="link"
                                            control={control}
                                            isRequired={true}
                                            labelName={t('adUrlInputTitle')}
                                            getFormErrorMessage={getFormErrorMessage}
                                            placeHolderText={t('adUrlInputPlaceholder')}
                                            rules={{
                                                maxLength: {
                                                    value: 3000,
                                                    message: tGlobal(`inputMaxLengthErrorMessage`, { maxLength: 3000 }),
                                                },
                                                required: tGlobal(`requiredErrorMessage`),
                                                pattern: {
                                                    value: /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?(\/[a-zA-Z0-9-_?=&]+)?$/,
                                                    message: tGlobal('invalidWebAddressErrorMessage'),
                                                },
                                            }}
                                        />
                                    </div>
                                    <div className="registerInput__container-x2 mt-0">
                                        <MultiSelectInput
                                            className=""
                                            isEdit={true}
                                            options={t('modules', { returnObjects: true })}
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
                                            control={control}
                                            isRequired={true}
                                            nameInput="ad_duration"
                                            labelName={t('adDateInputTitle')}
                                            getFormErrorMessage={getFormErrorMessage}
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
                </div>}
            </div>
        </form>
    </>
}

export default AdManager