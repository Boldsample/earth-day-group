import React from 'react'
import './footer.sass'
import { Link } from 'react-router-dom'
import { TextInput } from '@ui/forms'
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInstagram, faTiktok, faFacebook } from "@fortawesome/free-brands-svg-icons"

const Footer = () => {
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
            <h6 className='white__title'>Subscribe Here</h6>
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
            <Link><FontAwesomeIcon icon={faInstagram} className='footer__icon'/></Link>
            <Link><FontAwesomeIcon icon={faFacebook} className='footer__icon'/></Link>
            <Link><FontAwesomeIcon icon={faTiktok} className='footer__icon'/></Link>
        </div>
    </div>
  )
}

export default Footer