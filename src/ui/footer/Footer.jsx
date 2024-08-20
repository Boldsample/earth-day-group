import { Link } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { Button } from "primereact/button"
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInstagram, faTiktok, faFacebook, faTwitter } from "@fortawesome/free-brands-svg-icons"

import { TextInput } from '@ui/forms'

import './footer.sass'

const Footer = () => {
  const [t, i18n] = useTranslation('global')
    const {
        watch,
        control,
        setValue,
        setError,
        getValues,
        handleSubmit,
        formState: { errors },
      } = useForm({
        defaultValues: {
          email: "",
    
        },
      })
    
  const getFormErrorMessage = (fieldName) =>
    errors[fieldName] && (
      <small className="p-error">{errors[fieldName]?.message}</small>
    );

  return (
    <div className='footer__grid'>
        <Link to="/"><img src="/assets/earth-day-group.png" alt="Earth Day Group" /></Link>
        <p className='contactInfo__text'>Earth Day Group LLC <br />Fort Laudardale,Florida <br />United States <br />infor@earthdaygroup.com</p>
        <form action="">
            <h5 className='white__title'>Subscribe Here</h5>
            <div className="registerInput__container-x2">
                <TextInput
                    className="footer__input"
                    isRequired={true}
                    label="E-mail"
                    isEdit={true}
                    getFormErrorMessage={getFormErrorMessage}
                    control={control}
                    nameInput="email"
                    placeHolderText="E-mail*"
                    width="100%"
                    showLabel={false}
                    rules={{
                        maxLength: {
                        value: 60,
                        message: "El campo supera los 60 caracteres",
                        },
                        required: "*El campo es requerido.",
                        pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Please enter a valid e-mail address",
                        },
                    }}
                    />
                     <Button
                        className="dark-blue fullwidth subscribe__btn"
                        label="Send"
                        type="submit"
                        name="submit"
                    />
            </div>
        </form>
        <div className="socialMedia__container">
            <Link to={i18n.language == 'es' ? 'https://www.instagram.com/earthdaygroup' : 'https://www.instagram.com/earthdaygroup_usa'} target="_blank"><FontAwesomeIcon icon={faInstagram} className='footer__icon'/></Link>
            <Link to="https://www.facebook.com/earthdaygroup" target="_blank"><FontAwesomeIcon icon={faFacebook} className='footer__icon'/></Link>
            <Link to="https://www.tiktok.com/@earthdaygroup" target="_blank"><FontAwesomeIcon icon={faTiktok} className='footer__icon'/></Link>
            <Link to="https://x.com/EarthDayGroup2" target="_blank"><FontAwesomeIcon icon={faTwitter} className='footer__icon'/></Link>
        </div>
    </div>
  )
}

export default Footer