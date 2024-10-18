import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { Galleria } from "primereact/galleria"
import { faFlag, faImage, faSearch, faFileImport, faArrowLeft, faComments } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons"
import { Tooltip } from "primereact/tooltip"
import { useTranslation } from 'react-i18next'
import { DropDownInput, TextAreaInput } from "@ui/forms"
import { useSelector } from "react-redux"
import { useForm, Controller } from "react-hook-form"
import { sendMessage } from "@services/chatServices"
import { updateReport } from "@services/reportServices"
import { updateUser } from "@services/userServices"
import { updateOffer } from "@services/offersServices"
import { updatePet } from "@services/petServices"
import { updateProduct } from "@services/productServices"
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { InputSwitch } from "primereact/inputswitch"
import { Message } from 'primereact/message';
import { Tag } from 'primereact/tag'

const ReportInfo = ({ show, report, onHide }) => {
	const stepperRef = useRef(null); 
	const navigate = useNavigate()
	const user = useSelector((state) => state.users.userData)
	const [tGlobal] = useTranslation('translation', { keyPrefix: 'global' })
	const [t] = useTranslation('translation', { keyPrefix: 'admin.reportInfo' })
	const [tStatus] = useTranslation('translation', { keyPrefix: 'admin.report' })
	const [tGlobal2] = useTranslation('translation', {keyPrefix: 'global'})
	const types = { 'user': 'User', 'product': 'Product', 'pet': 'Pet', 'offer': 'Offer' }
	const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
	const {
		setValue,
		watch,
		control,
		handleSubmit,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm({
		defaultValues: {
			message: "",
			admin: user?.username,
			user: report?.username,
			deleteElement: false,
			reportResolved: false
		},
	})
	const message = watch('message')

	const states = { 'In Process': 'info', 'Pending': 'danger', 'Resolved': 'success' }

	useEffect(()=>{
		report?.admin === "Without answer" ?  setValue('message', t('newCaseMessage')) : setValue('message', t('customCaseMessage'));
	}, [report, onHide])
	
	useEffect(()=>{
		const clearAllInputErrorMessages = clearErrors()
		setValue('reportResolved', false);
		setValue('deleteElement', false);
	
		if(message ==  t('negativeClosingCaseMessage')){
			setValue('reportResolved', true);
			setValue('deleteElement', true);
		}
		if( message ==  t('positiveClosingCaseMessage')){
			setValue('reportResolved', true);
		}
		if(message ==  "admin.reportInfo.customCaseMessage"){
			setValue('custom_message', "");
		}else{
			setValue('custom_message', t(message, {userName: report?.oname, reported:t(report?.type), reason:t(report?.subject )}));
		}
		clearAllInputErrorMessages
		
	}, [watch('message')])
console.log(report)
	const onSubmit = async data => {
		// const message = data?.message != 'custom' ? data?.message : data?.custom_message
		console.log(data)
		const message = data?.message === data?.custom_message ? data?.message : data?.custom_message
		if(data?.reportResolved == true){
			await updateReport({admin: user?.id, status: 'Resolved'}, {id: report?.id})
			onHide(true)
		}else if(await sendMessage({ message, incoming: user?.id, outgoing: report?.oid })){
			if(data?.deleteElement && report?.type == 'user')
				await updateUser({state: 2}, {id: report?.entity})
			else if(data?.deleteElement && report?.type == 'product')
				await updateProduct({state: 2}, {id: report?.entity})
			else if(data?.deleteElement && report?.type == 'pet')
				await updatePet({state: 2}, {id: report?.entity})
			else if(data?.deleteElement && report?.type == 'offer')
				await updateOffer({state: 2}, {id: report?.entity})
			await updateReport({admin: user?.id, status: 'In Process'}, {id: report?.id})
			navigate(`/chat/${report?.owner}/`)
		}
	}
	return (
		<Dialog className="dialog-dimnesions" visible={show} onHide={onHide} draggable={false} header={t("manageReportMainTitle")}>
		  <Stepper ref={stepperRef}>
			<StepperPanel header={t("reportSummaryTitle")}>
			  <div className="panel-1">
				{report?.images?.length ? (
				  <Galleria
					value={report?.images}
					numVisible={5}
					item={({ picture }) => <img src={picture} />}
					thumbnail={({ picture }) => <img src={picture} />}
				  />
				) : (
				  <div className="default-image">
					<FontAwesomeIcon icon={faImage} />
				  </div>
				)}
				<div className="content">
				  <h4>{t('mainTitle')}</h4>
				  <div className="fullwidth mb-4" style={{ fontSize: '0.75rem' }}>
					{report?.date}
				  </div>
				  <p>
					<b>{t('reportedEntity')} {report?.type}:</b> <Link to={`/${report?.type}/${report?.entity}/`}>{report?.name}</Link>
				  </p>
				  {(report?.type === 'product' || report?.type === 'pet') && (
					<p className="reported-by-styles">
					  <b>{t('ownerTitle')}</b> <Link className="reported-by-styles" to={`/profile/${report?.owner}/`}>{report?.oname} <span className="text-dark-blue"><FontAwesomeIcon icon={faPaperPlane} /></span></Link>
					</p>
				  )}
				  <p>
					<b>{t('statusTitle')}</b> <Tag value={tStatus(report?.status)} severity={states[report?.status]} />
				  </p>
				  <p>
					<b>{t('subjectTitle')}</b> {t(report?.subject)}
				  </p>
				  <p>
					<b>{t('descriptionTitle')}</b> {report?.description}
				  </p>
				  <div className="reported-by-styles">
					<b>{t('reportedByTitle')}</b> <Link className="reported-by-styles" to={`/profile/${report?.username}/`}>{report?.uname} <span className="text-dark-blue"><FontAwesomeIcon icon={faPaperPlane} /></span></Link>
				  </div>
				  
				  <div className="mt-3 fullwidth">
					<Link className="button small dark-blue in-line-flex" to={`/${report?.type}/${report?.entity}/`}>
					  <FontAwesomeIcon icon={faSearch} /> <span>{t('viewBtn')} {report?.type}</span>
					</Link>
					<Button icon={<FontAwesomeIcon icon={faFileImport}/>} className="button small" label={t("handleReportBtn")} onClick={() => stepperRef.current.nextCallback()}  />
				  </div>
				</div>
			  </div>
			</StepperPanel>
			{report?.status !== 'Resolved' && (!report?.aid || report?.aid === user?.id) && (
				<StepperPanel header={t("manageReportTitle")}>
				<div className="panel-2">
					<div className="flex-column">
					<h4 className="mb-2 text-center">{t("handleReportTitle")}</h4>
					</div>
					<form className="respond" onSubmit={handleSubmit(onSubmit)}>
						<div className={watch('action') === 'solved' ? 'registerInput__container-x1' : 'registerInput__container-x2'}>
						<DropDownInput
							isEdit={true}
							control={control}
							showLabel={true}
							isRequired={true}
							optionLabel="label"
							optionValue="value"
							nameInput="message"
							options={[
							{ label: t("reportNotificationOptionLabel"), value: 'newCaseMessage' },
							{ label: t("reportFollowUpOptionLabel"), value: 'followUpCaseMessage' },
							{ label: t("closeReportInfringementOptionLabel"), value: 'negativeClosingCaseMessage' },
							{ label: t("closeReportComplianceOptionLabel"), value: 'positiveClosingCaseMessage' },
							{ label: t( "customMessageOptionLabel"), value: 'customCaseMessage' }
							]}
							
							labelName={t("messageTypeInput")}
							getFormErrorMessage={getFormErrorMessage}
							placeHolderText={t("messageTypeInputPlaceHolder")}
							rules={{
							required: tGlobal(`requiredErrorMessage`),
							}}
						/>
						{(watch('message') === t('customCaseMessage')) && (
							<div className="switches-container">
							<div className="labels-container">
								<label htmlFor="solvedReport">{t( "resolveReportInputTitle")}</label>
								{watch('message') !== t('positiveClosingCaseMessage') && (
								<label htmlFor="delete">{t("deleteItemInputTitle", {item: types[report?.type]})}</label>
								)}
							</div>
							<div className="inputSwitches-container">
								<Controller
								name="reportResolved"
								control={control}
								render={({ field }) => (
									<InputSwitch
									id={field.name}
									inputId="solvedReport"
									checked={watch('message') === t('negativeClosingCaseMessage') || watch('message') === t('positiveClosingCaseMessage') ? true : field.value}
									onChange={(e) => {
										if (watch('message') === t('negativeClosingCaseMessage') || watch('message') === t('positiveClosingCaseMessage')) {
										setError("reportResolved", { type: "custom", message: "Cannot uncheck if you are going to send a negative message" });
										}
										field.onChange(e.value);
									}}
									/>
								)}
								/>
								{watch('message') !== t('positiveClosingCaseMessage') && (
								<Controller
									name="deleteElement"
									control={control}
									render={({ field }) => (
									<InputSwitch
										id={field.name}
										inputId="delete"
										// checked={field.value}
										checked={watch('message') === t('negativeClosingCaseMessage') ? true : field.value}
										onChange={(e) => {
										if (watch('message') === t('negativeClosingCaseMessage')) {
											setError("reportResolved", { type: "custom", message: "Cannot uncheck if you are going to send a close case message. Try with a custom message type." });
										}
										field.onChange(e.value);
										}}
									/>
									)}
								/>
								)}
							</div>
							{errors.reportResolved && <small className="p-error ml-3">{errors.reportResolved.message}</small>}
							</div>
						)}
						</div>
						<div className="registerInput__container-x1">
						<TextAreaInput
							rowCount={message ==  "admin.reportInfo.customCaseMessage" ? 8 : 18}
							control={control}
							isRequired={true}
							nameInput="custom_message"
							labelName={t("messagePreviewTextAreaTitle")}
							getFormErrorMessage={getFormErrorMessage}
							placeHolderText={t( "messagePreviewTextAreaPlaceHolder")}
							rules={{
							maxLength: {
								value: 1000,
								message: tGlobal(`inputMaxLengthErrorMessage`, { maxLength: 1000 }),
							},
							required: tGlobal(`requiredErrorMessage`),
							}}
						/>
						{(watch('message') === 'negativeClosingCaseMessage' || watch('message') === 'positiveClosingCaseMessage') &&
						<Message severity="warn" text={watch('message') !== 'negativeClosingCaseMessage' ? t("positiveClosingCaseWarningMessage") : t("negativeClosingCaseWarningMessage", {item: report?.type})} />
						}
						</div>
						<div className="p-field">
						<Button icon={<FontAwesomeIcon icon={faArrowLeft}/>}  label={t("backToReportSummaryBtn")} onClick={() => stepperRef.current.prevCallback()}/>
						<Button icon={<FontAwesomeIcon icon={faPaperPlane}/>} className="dark-blue" label={t("sendMessageBtn")} type="submit" />
						{report?.aid === user?.id && (
							<Link className="button green-earth" to={`/chat/${report?.owner}`}>
							<FontAwesomeIcon icon={faComments} /> <span>{t("goToChatBtn")}</span>
						  </Link>
							// <Link className="button green-earth" to={`/chat/${report?.owner}`}>Ir al chat</Link>
						)}
						</div>
					</form>
					<Tooltip target=".hasTooltip" position="top" />
				</div>
				</StepperPanel>
				)}
		  </Stepper>
		</Dialog>
	  );
}

export default ReportInfo