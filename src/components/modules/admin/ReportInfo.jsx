import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { Galleria } from "primereact/galleria"
import { faFlag, faImage, faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons"
import { Tooltip } from "primereact/tooltip"
import { useTranslation } from 'react-i18next'
import { DropDownInput, TextAreaInput, TextInput } from "@ui/forms"
import { useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { sendMessage } from "@services/chatServices"
import { updateReport } from "@services/reportServices"
import { updateUser } from "@services/userServices"
import { updateOffer } from "@services/offersServices"
import { updatePet } from "@services/petServices"
import { updateProduct } from "@services/productServices"
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { RadioInput } from "@ui/forms"
import { InputSwitch } from "primereact/inputswitch"

const ReportInfo = ({ show, report, onHide, solved, setSolved }) => {
	const stepperRef = useRef(null); 
	const [responseType,  setResponseType] = useState('')
	const navigate = useNavigate()
	const user = useSelector((state) => state.users.userData)
	const [tGlobal] = useTranslation('translation', { keyPrefix: 'global' })
	const [t] = useTranslation('translation', { keyPrefix: 'admin.reportInfo' })
	const [tGlobal2] = useTranslation('translation', {keyPrefix: 'global'})
	const types = { 'user': 'User', 'product': 'Product', 'pet': 'Pet', 'offer': 'Offer' }
	const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
	const {
		setValue,
		watch,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			message: "",
			admin: user?.username,
			user: report?.username,
		},
	})

	useEffect(()=>{
		if(watch('message') != ''){
			const message = watch('message') 

			setValue('custom_message', message);
		}
	}, [watch('message')])

	const radioData = [
		{ name: tGlobal2('yes'), value: 1 },
		{ name: tGlobal2('no'), value: 0 },
	  ]
	  
	const onSubmit = async data => {
		const message = data?.message != 'custom' ? data?.message : data?.custom_message
		if(data?.action == 'solved'){
			await updateReport({admin: user?.id, status: 'Resolved'}, {id: report?.id})
			onHide(true)
		}else if(await sendMessage({ message, incoming: user?.id, outgoing: report?.oid })){
			if(data?.action == 'delete' && report?.type == 'user')
				await updateUser({state: 2}, {id: report?.entity})
			else if(data?.action == 'delete' && report?.type == 'product')
				await updateProduct({state: 2}, {id: report?.entity})
			else if(data?.action == 'delete' && report?.type == 'pet')
				await updatePet({state: 2}, {id: report?.entity})
			else if(data?.action == 'delete' && report?.type == 'offer')
				await updateOffer({state: 2}, {id: report?.entity})
			await updateReport({admin: user?.id, status: 'In Process'}, {id: report?.id})
			navigate(`/chat/${report?.owner}/`)
		}
	}
	
	return <Dialog className="dialog-dimnesions" visible={show} onHide={onHide} draggable={false} header='Gestión de Reporte'>
		<Stepper ref={stepperRef} >
		<StepperPanel header="Resumen del reporte">
			<div className="panel-1">
				{report?.images?.length && 
					<Galleria value={report?.images} numVisible={5}
						item={({picture}) => <img src={picture} />}
						thumbnail={({picture}) => <img src={picture} />} /> || 
					<div className="default-image"><FontAwesomeIcon icon={faImage} /></div>
				}
				<div className="content">
					<h4>{t('mainTitle')}</h4>
					<div className="fullwidth mb-4" style={{fontSize: '0.75rem'}}>{report?.date}</div>
					<p><b>{t('reportedEntity')} {report?.type}:</b> <Link to={`/${report?.type}/${report?.entity}/`}>{report?.name}</Link></p>
					{(report?.type == 'product' || report?.type == 'pet') && 
						<p className="reported-by-styles"><b>{t('ownerTitle')}</b> <Link className="reported-by-styles" to={`/profile/${report?.owner}/`}>{report?.oname} <span className="text-dark-blue"><FontAwesomeIcon icon={faPaperPlane} /></span></Link></p>
					}
					<p><b>{t('subjectTitle')}</b> {report?.subject}</p>
					<p><b>{t('descriptionTitle')}</b> {report?.description}</p>
					<div className="reported-by-styles"><b>{t('reportedByTitle')}</b> <Link className="reported-by-styles" to={`/profile/${report?.username}/`}>{report?.uname} <span className="text-dark-blue"><FontAwesomeIcon icon={faPaperPlane} /></span></Link></div>
					<div className="mt-3 fullwidth">
						<Link className="button small dark-blue in-line-flex" to={`/${report?.type}/${report?.entity}/`}><FontAwesomeIcon icon={faSearch} /> <span>{t('viewBtn')} {report?.type}</span></Link>
						<Button className="button small" label="Gestionar reporte" onClick={() => stepperRef.current.nextCallback()}/>
						

					</div>
				</div> 
			</div>
		</StepperPanel>
		<StepperPanel header="Gestionar reporte">
		<div className="panel-2">
			<div className="flex-column">
				<h4 className="mb-2 text-center">How would you like to handle this report?</h4>
			</div>
			{ report?.status != 'Resolved' && (!report?.aid || report?.aid == user?.id) &&
				<form className="respond" onSubmit={handleSubmit(onSubmit)}>
					{/* <h4 className="mb-1">{t('respondReport')}</h4> */}
					<div className={watch('action') == 'solved' ? 'registerInput__container-x1' : 'registerInput__container-x2'}>
						{/* <DropDownInput
							isEdit={true}
							control={control}
							showLabel={true}
							isRequired={true}
							optionLabel="label"
							optionValue="value"
							nameInput="action"
							options={[
								{ label: `Enviar mensaje}`, value: 'message' },
								{ label: `Eliminar ${types[report?.type]}`, value: 'delete' },
								{ label: `Marcar reporte como resuelto`, value: 'solved' },
							]}
							labelName={'Acción'}
							getFormErrorMessage={getFormErrorMessage}
							placeHolderText={'Seleccione una opción'}
							rules={{
								required: tGlobal(`requiredErrorMessage`),
							}} /> */}
						{watch('action') != 'solved' && 
							<DropDownInput
								isEdit={true}
								control={control}
								showLabel={true}
								isRequired={true}
								optionLabel="label" 
								optionValue="value"
								nameInput="message"
								options={[
									{ label: 'Mensaje apertura', value: t('newCaseMessage') },
									{ label: 'Mensaje seguimiento', value: t('followUpCaseMessage') },
									{ label: 'Mensaje negativo', value: t('negativeClosingCaseMessage') },
									{ label: 'Mensaje positivo', value: t('positiveClosingCaseMessage') },
									{ label: 'Mensaje personalizado', value: t('customCaseMessage') }
								]}
								labelName={'Tipo de mensaje'}
								getFormErrorMessage={getFormErrorMessage}
								placeHolderText={'Seleccione una opción'}
								rules={{
									required: tGlobal(`requiredErrorMessage`),
								}} />		
						}
						{(watch('message') === t('negativeClosingCaseMessage') || watch('message') === t('positiveClosingCaseMessage')) && (
								<div className="p-field">
									<label htmlFor="solvedReport">Mark as resolved</label>
									<InputSwitch
										name="solvedReport"
										checked={solved === 0 ? false : true}
										onChange={() => setSolved(solved === 0 ? 1 : 0)}
									/>
								</div>
							)}
							{watch('message') === t('negativeClosingCaseMessage') &&
								(<div className="p-field">
								<label htmlFor="solvedReport">{`Eliminar ${types[report?.type]}`}</label>
								<InputSwitch
									name="solvedReport"
									checked={solved === 0 ? false : true}
									onChange={() => setSolved(solved === 0 ? 1 : 0)}
								/>
							</div>
							)}
						 {/* <RadioInput
								data={radioData}
								showLabel={true}
								control={control}
								isRequired={true}
								labelName={`Eliminar ${types[report?.type]}?`}
								nameInput="pick_up_from_home"
								rules={{
									required: true,
								}} /> */}
					</div>
					{watch('action') != 'solved' && watch('message') != '' && 
						<div className="registerInput__container-x1">
							<TextAreaInput
								control={control}
								isRequired={true}
								nameInput="custom_message"
								labelName={'Mensaje personalizado'}
								getFormErrorMessage={getFormErrorMessage}
								placeHolderText={'Ingrese el mensaje que desea enviar'}
								rules={{
									maxLength: {
										value: 500,
										message: tGlobal(`inputMaxLengthErrorMessage`, {maxLength: 500}),
									},
									required: tGlobal(`requiredErrorMessage`),
								}} />
						</div>
					}
					<div className="p-field">
						<Button className="dark-blue" label={watch('action') == 'solved' ? 'Resolver reporte' : 'Enviar mensaje'+(report?.aid == 0 ? ' y asignarme como agente' : '')} type="submit" />
						{report?.aid == user?.id && 
							<Link className="button green-earth" to={`/chat/${report?.owner}`}>Ir al chat</Link>
						}
						{/* <Button label="Mark as resolved "/> */}
					</div>
				</form>
			}
			{responseType == 'manual' && 
				<div className="registerInput__container-x1">
				<TextAreaInput
					control={control}
					isRequired={true}
					nameInput="custom_message"
					labelName={'Mensaje personalizado'}
					getFormErrorMessage={getFormErrorMessage}
					placeHolderText={'Ingrese el mensaje que desea enviar'}
					rules={{
						maxLength: {
							value: 500,
							message: tGlobal(`inputMaxLengthErrorMessage`, {maxLength: 500}),
						},
						required: tGlobal(`requiredErrorMessage`),
					}} />
			</div>
			}
			<Tooltip target=".hasTooltip" position="top" />
		</div>
		</StepperPanel>
		</Stepper>
	</Dialog>
}

export default ReportInfo