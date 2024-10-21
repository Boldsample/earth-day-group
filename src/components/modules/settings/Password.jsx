import { useForm } from 'react-hook-form'
import { PasswordInput } from '@ui/forms'
import { Button } from 'primereact/button'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { resetState } from '@store/slices/usersSlice'
import { logoutUser, updateUser } from '@services/userServices'
import { setHeader, setHeaderTitle, updateThankyou } from '@store/slices/globalSlice'

import "./styles.sass"

const Password = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [sending, setSending] = useState(false)
  const user = useSelector((state) => state.users.userData)
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
      password_confirmation: "",
    },
  })
  
  const getFormErrorMessage = fieldName => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
  const onSubmit = async (data) => {
    setSending(true)
    delete data.password_confirmation
    const response = await updateUser({ ...data }, {id: user.id})
    setSending(false)
    if(response.id){
      dispatch(updateThankyou({
        title: "Updated successfully!",
        link: "/settings/",
        background: "image-1.svg",
        button_label: "Go back to settings",
        content: "Your password has updated successfully!",
      }))
      navigate('/thankyou/')
    }else{
      setFocus(response.field)
      setError(response.field, { type: "manual", message: response.message })
      return
    }
  }

  const logout = async (e) => {
    if(await logoutUser())
      dispatch(resetState())
      navigate('/login/')
  };

	useEffect(() => {
		dispatch(setHeader('settings'))
		dispatch(setHeaderTitle('Change Password'))
	}, [])

	return <div className="layout" style={{background: 'white'}}>
		<div className="main__content centerwidth">
      <form onSubmit={handleSubmit(onSubmit)} className="fullwidth">
        <div className="password-container">
        <PasswordInput
            width="100%"
            maxLength={20}
            label="Password"
            showLabel={true}
            control={control}
            nameInput="password"
            isRequired={!user?.id}
            placeHolderText="Enter your password"
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: user?.id ? undefined : {
                value: 20,
                message: "El campo supera los 20 caracteres",
              },
              required: user?.id ? undefined : "*El campo es requerido.",
              pattern: user?.id ? undefined : {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                message:
                  "Must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
              },
            }} />
          <PasswordInput
            width="100%"
            maxLength={20}
            label="Password"
            showLabel={true}
            control={control}
            nameInput="password"
            isRequired={!user?.id}
            placeHolderText="Enter new password"
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: user?.id ? undefined : {
                value: 20,
                message: "El campo supera los 20 caracteres",
              },
              required: user?.id ? undefined : "*El campo es requerido.",
              pattern: user?.id ? undefined : {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                message:
                  "Must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
              },
            }} />
          <PasswordInput
            width="100%"
            label="&nbsp;"
            maxLength={20}
            feedback={false}
            showLabel={true}
            control={control}
            className="noLabel"
            isRequired={!user?.id}
            nameInput="password_confirmation"
            placeHolderText="Confirm new Password"
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              required: user?.id ? undefined : "*El campo es requerido.",
              validate: value => value === getValues().password || "The password doesn't match",
            }} />
        </div>
        <div className="p-field" style={{ marginBottom: "1.5rem" }}>
          <Button className="dark-blue fullwidth" label={user.id ? "Save" : "Sign up"} type="submit" loading={sending} />
        </div>
      </form>
		</div>
	</div>
}

export default Password