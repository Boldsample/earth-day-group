import React, {useState} from 'react'
import "./styles.sass"
import { TextInput, MultiSelectInput, CalendarInput } from "@ui/forms"
import { Calendar } from 'primereact/calendar';
import { useForm } from "react-hook-form"

const ContentBox = () => {
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
      name: "",
      phone: "",
      email: "",
      picture: "",
      username: "",
      password: "",
      role: "admin",
      password_confirmation: "",
    },
  })
  const modules = [
    { name: 'Users', code: 'RM' },
    { name: 'Companies', code: 'LDN' },
    { name: 'Foundations/NGOs', code: 'NY' },

];
const onSubmit = async (data) => {
  console.log(data)
}

  const getFormErrorMessage = (fieldName) => errors[fieldName] && <small className="p-error">{errors[fieldName]?.message}</small>
  return (
      <div className='p-fileupload p-fileupload-advanced p-component'>
          <div className='p-fileupload p-fileupload-buttonbar'>
              <button className='green-earth'>Launch Ad</button>
              <button className='red-state'>Cancel</button>
          </div>
          <div className='p-fileupload-content'>
          <form onSubmit={handleSubmit(onSubmit)} className="form__width75">
              <div className="registerInput__container-x2">
                <TextInput
                  width="100%"
                  // disabled={ID}
                  control={control}
                  isRequired={true}
                  labelName="Ad Name"
                  nameInput="username"
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
                  nameInput="website"
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
                  nameInput="unit"
                  control={control}
                  showLabel={true}
                  isRequired={true}
                  optionLabel="name"
                  optionValue="code"
                  placeHolderText="Select Modules"
                  getFormErrorMessage={getFormErrorMessage}
                  rules={{
                    required: "*El campo es requerido.",
                  }} />
                    <CalendarInput
                    nameInput="role"
                    control={control}
                    isRequired={true}
                    labelName="Select Ad Duration"
                    rules={{
                      required: true,
                    }} />
                </div>
          </form>
          </div>
      </div>

  )
}

export default ContentBox