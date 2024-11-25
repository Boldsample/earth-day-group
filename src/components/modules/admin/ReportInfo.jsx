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
import { getOffer, updateOffer } from "@services/offersServices"
import { updatePet } from "@services/petServices"
import { updateProduct } from "@services/productServices"
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { InputSwitch } from "primereact/inputswitch"
import { Message } from 'primereact/message';
import { Tag } from 'primereact/tag'
import OfferInfo from "../offers/OfferInfo"

const ReportInfo = ({ show, report, onHide }) => {
	const navigate = useNavigate()
	const stepperRef = useRef(null)
	const [detail, setDetail] = useState({})
	const user = useSelector((state) => state.users.userData)
	const [t] = useTranslation('translation', { keyPrefix: 'admin.reportInfo' })
	const [tStatus] = useTranslation('translation', { keyPrefix: 'admin.report' })
	const types = { 'user': 'User', 'product': 'Product', 'pet': 'Pet', 'offer': 'Offer' }
	const [tErrorMessages] = useTranslation('translation', {keyPrefix: 'global.formErrors'})
	const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
	const {
		watch,
		control,
		setValue,
		setError,
		clearErrors,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			message: "",
			deleteElement: false,
			reportResolved: false,
			admin: user?.username,
			user: report?.username,
		},
	})
	const hidePopup = () => setDetail({...detail, show: false})
	const getUserDetail = async id => {
		const _offer = await getOffer(id)
		setDetail({..._offer, show: true})
	}
	
	useEffect(()=>{
		clearErrors()
		report?.aid == null ?  setValue('message', 'newCaseMessage') : setValue('message', 'customCaseMessage');
	}, [report, onHide])

	useEffect(()=>{
		setValue('reportResolved', false);
		setValue('deleteElement', false);
	
		if(watch('message') ==  'negativeClosingCaseMessage'){
			setValue('reportResolved', true)
			setValue('deleteElement', true)
		}
		if(watch('message') ==  'positiveClosingCaseMessage')
			setValue('reportResolved', true)
		if(watch('message') ==  "customCaseMessage")
			setValue('custom_message', "")
		else
			setValue('custom_message', t(watch('message'), {userName: report?.oname, reported:t(report?.type), reason:t(report?.subject )}))
		clearErrors()
		
	}, [watch('message')])

	const onSubmit = async data => {
		const message = data?.message === data?.custom_message ? data?.message : data?.custom_message
		if(data?.reportResolved == true){
			await updateReport({admin: user?.id, status: 'success'}, {id: report?.id})
			onHide(true)
		}else if(await sendMessage({ message, incoming: user?.id, outgoing: report?.oid, type: 'report', offer: report?.id })){
			if(data?.deleteElement && report?.type == 'user')
				await updateUser({state: 2}, {id: report?.entity})
			else if(data?.deleteElement && report?.type == 'product')
				await updateProduct({state: 2}, {id: report?.entity})
			else if(data?.deleteElement && report?.type == 'pet')
				await updatePet({state: 2}, {id: report?.entity})
			else if(data?.deleteElement && report?.type == 'offer')
				await updateOffer({state: 2}, {id: report?.entity})
			await updateReport({admin: user?.id, status: 'info'}, {id: report?.id})
			navigate(`/chat/${report?.owner}/`)
		}
	}
	return <>
		<OfferInfo type="full" show={detail.show} offer={detail} onHide={hidePopup}  />
		<Dialog className="dialog-dimnesions" visible={show} onHide={onHide} draggable={false} header={t("manageReportMainTitle")} >
		  <Stepper ref={stepperRef}>
			<StepperPanel header={t("reportSummaryTitle")}>
				{/* {report?.status == 'success' && report?.aid !== user?.id && !report?.aid || report?.aid !== user?.id &&
					<Message className="mb-2" severity={report?.status == 'success' ? "success": "warn"} text={report?.status == 'success' ? t("reportResolvedWarningMessage", {admin: report.admin}) : t("reportInProgressdWarningMessage" , {admin: report.admin})} />
				} */}
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
					<h4>{t('mainTitle') + String(report?.id).padStart(5, '0')}</h4>
					<div className="fullwidth mb-4" style={{ fontSize: '0.75rem' }}>
						{report?.date}
					</div>
					{report?.status == 'success' && report?.aid !== user?.id && !report?.aid || report?.aid !== user?.id &&
					<Message className="mb-1" severity={report?.status == 'success' ? "success": "warn"} text={report?.status == 'success' ? t("reportResolvedWarningMessage", {admin: report.admin}) : t("reportInProgressdWarningMessage" , {admin: report.admin})} />
				}
					{report?.type === 'offer' && <p>
						<b>{t('reported'+report?.type)}:</b> <Link onClick={e => {e.preventDefault(); getUserDetail(report?.entity);}}>{report?.name}</Link>
					</p>}
					{report?.type !== 'offer' && <p>
						<b>{t('reported'+report?.type)}:</b> <Link to={`/${report?.type == 'user' ? 'profile' : report?.type}/${report?.type == 'user' ? report?.owner : report?.entity}/`}>{report?.name}</Link>
					</p>}
					{report?.type !== 'user' && <p className="reported-by-styles">
						<b>{t('ownerTitle')}</b> <Link className="reported-by-styles" to={`/profile/${report?.owner}/`}>{report?.oname}</Link>
					</p>}
					<p>
						<b>{t('statusTitle')}</b> <Tag value={tStatus(report?.status)} severity={report?.status} />
					</p>
					<p>
						<b>{t('subjectTitle')}</b> {t(report?.subject)}
					</p>
					<p>
						<b>{t('descriptionTitle')}</b> {report?.description}
					</p>
					<div className="reported-by-styles">
						<b>{t('reportedByTitle')}</b> <Link className="reported-by-styles" to={`/profile/${report?.username}/`}>{report?.uname}</Link>
					</div>
					
					<div className="mt-3 fullwidth">
						{report?.type === 'offer' && 
							<Link className="button small dark-blue in-line-flex" onClick={e => {e.preventDefault(); getUserDetail(report?.entity);}}><FontAwesomeIcon icon={faSearch} /> <span>{t('viewBtn')} {t(report?.type)}</span></Link>
						}
						{report?.type !== 'offer' && 
							<Link className="button small dark-blue in-line-flex" to={`/${report?.type == 'user' ? 'profile' : report?.type}/${report?.type == 'user' ? report?.owner : report?.entity}/`}><FontAwesomeIcon icon={faSearch} /> <span>{t('viewBtn')} {t(report?.type)}</span></Link>
						}
						{
						report?.status === "success" && report?.aid === user?.id ? (
							<Link className="button green-earth small" to={`/chat/${report?.owner}`}>
							<FontAwesomeIcon icon={faComments} /> <span>{t("goToChatBtn")}</span>
							</Link>
						) : report?.aid === null ? (
							<Button
							icon={<FontAwesomeIcon icon={faFileImport} />}
							className="button small"
							label={t("handleReportBtn")}
							onClick={() => stepperRef.current.nextCallback()}
							/>
						) : report?.aid === user?.id ? (
							<Button
							icon={<FontAwesomeIcon icon={faFileImport} />}
							className="button small"
							label={t("handleReportBtn")}
							onClick={() => stepperRef.current.nextCallback()}
							/>
						) : null
						}
					</div>
				</div>
			  </div>
			</StepperPanel>
			{report?.status !== 'success' && (!report?.aid || report?.aid === user?.id) && (
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
							required: tErrorMessages('requiredErrorMessage'),
							}}
						/>
						{(watch('message') === 'customCaseMessage') && (
							<div className="switches-container">
							<div className="labels-container">
								<label htmlFor="solvedReport">{t( "resolveReportInputTitle")}</label>
								{watch('message') !== 'positiveClosingCaseMessage' && (
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
									checked={watch('message') === 'negativeClosingCaseMessage' || watch('message') === 'positiveClosingCaseMessage' ? true : field.value}
									onChange={(e) => {
										if (watch('message') === 'negativeClosingCaseMessage' || watch('message') === 'positiveClosingCaseMessage') {
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
										checked={watch('message') === 'negativeClosingCaseMessage' ? true : field.value}
										onChange={(e) => {
										if (watch('message') === 'negativeClosingCaseMessage') {
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
							control={control}
							isRequired={true}
							nameInput="custom_message"
							getFormErrorMessage={getFormErrorMessage}
							labelName={t("messagePreviewTextAreaTitle")}
							placeHolderText={t( "messagePreviewTextAreaPlaceHolder")}
							rowCount={watch('message') == "customCaseMessage" ? 8 : 18}
							rules={{
							maxLength: {
								value: 1000,
								message: tErrorMessages(`inputMaxLengthErrorMessage`, { maxLength: 1000 }),
							},
							required: tErrorMessages('requiredErrorMessage'),
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
	</>;
}

export default ReportInfo