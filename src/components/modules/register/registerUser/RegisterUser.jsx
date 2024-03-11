import React from "react";
import "./registerUser.sass";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import TextInput from "../../../ui/textInput/TextInput";
import { useForm, FormProvider } from "react-hook-form";

const RegisterUser = () => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "", // Make sure all fields are initialized
      email: "",
      // Initialize all other fields used in the form
    },
  });

  const getFormErrorMessage = () => {
    return errors && <small className="p-error">{errors?.message}</small>;
  };
  console.log(getValues());

  const onSubmit = (data) => console.log(data);

  return (
    <div className="layout">
      <div className="main__content">
        <h5 id="hello">Profile Picture</h5>
        <p>Click to upload</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="registerInput__container-x2">
            <TextInput
              isEdit={true}
              getFormErrorMessage={getFormErrorMessage}
              control={control}
              inputName="name"
              placeHolderText="Complete Name*"
              width="100%"
              showLabel={false}
              rules={{
                maxLength: {
                  value: 2,
                  message: "El campo supera los 100 caracteres",
                },
                required: "El campo es requerido.",
                pattern: {
                  value: /^\S/,
                  message: "No debe tener espacios al inicio",
                },
              }}
            />
            <TextInput
              getFormErrorMessage={getFormErrorMessage}
              isEdit={true}
              control={control}
              inputName="email"
              placeHolderText="E-mail*"
              width="100%"
              showLabel={false}
            />
            {/* <InputText
            id="name"
            placeholder="Complete Name*"
            // value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputText
            id="email"
            placeholder="E-mail*"
            // value={email}
            onChange={(e) => setEmail(e.target.value)}
          /> */}
          </div>
          <div className="registerInput__container-x2">
            <InputText
              id="username"
              placeholder="Username*"
              // value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputText
              id="location"
              placeholder="Location*"
              // value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <label className="registerInput__container-x1" htmlFor="bio">
            Bio
            <InputText
              id="bio"
              placeholder="Tell us about yourself"
              // value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="registerInput__container-x1" htmlFor="phoneNumber">
            Phone Number
            <InputText
              id="phoneNumber"
              placeholder="++01 0000 000*"
              // value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <div className="registerInput__container-x2">
            <label htmlFor="password">
              Password
              <InputText
                className="p-inputtext"
                id="password"
                placeholder="Enter Password"
                // value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <InputText
              id="password"
              placeholder="Confirm Password"
              // value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="p-field" style={{ marginBottom: "24px" }}>
            <Button label="Sign up" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
