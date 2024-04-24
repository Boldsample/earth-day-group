import React, {useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  NumberInput,
  TextAreaInput,
  DropDownInput,
  CheckBoxInput,
  UploadPhotoInput,
} from "@ui/forms";
import materials from "@json/recyclableMaterials.json";
import { Button } from "primereact/button";
import RecycleMaterialCard from "../../../ui/cards/recycleMaterialCard/RecycleMaterialCard";

const FormTwo = ({ recyclableMaterials, setRecyclableMaterials }) => {
  const userData = useSelector((state) => state.users.userData)
  const [uploadedImages, setUploadedImages] = useState([]);
  const {
    reset,
    watch,
    control,
    setValue,
    setError,
    getValues,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      materials: "",
      unit: "",
      unitPrice: null,
    },
  });

  const units = [
    { unit: "Kilo", code: "Kg" },
    { unit: "Pound", code: "Lb" },
  ];

  console.log(userData, "userDataHere")

  const handleMaterials = () => {
    clearErrors(["unitPrice"]);
    const _recyclableMaterials = [...recyclableMaterials];
    const inputValue = getValues(["materials", "unit", "unitPrice"]);
    // if (!inputValue[0] || !inputValue[1] || !inputValue[2]) {
    //   setError("unitPrice", {
    //     type: "manual",
    //     message: "Should select a Material, a Unit and fill a price.",
    //   });
    //   return false;
    // }
    const selectedMaterial = {
      type: inputValue[0],
      unit: inputValue[1],
      price: inputValue[2],
      color: inputValue[0].toLowerCase() + "Category",
    };
    const duplicateIndex = _recyclableMaterials.findIndex((material) => {
      return material.type == inputValue[0];
    });
    if (duplicateIndex != -1) {
      _recyclableMaterials[duplicateIndex].unit = inputValue[1];
      _recyclableMaterials[duplicateIndex].price = inputValue[2];
      setRecyclableMaterials([..._recyclableMaterials]);
    } else {
      setRecyclableMaterials([...recyclableMaterials, selectedMaterial]);
    }
    setValue("materials", "");
    setValue("unit", "");
    setValue("unitPrice", "");
  };

  const removeMaterial = (clickedMaterial) => {
    const filteredMaterials = recyclableMaterials.filter(
      (material) => material.type !== clickedMaterial
    );
    setRecyclableMaterials(filteredMaterials);
  };

  const getFormErrorMessage = (fieldName) =>
    errors[fieldName] && (
      <small className="p-error">{errors[fieldName]?.message}</small>
    );

  const onSubmit = async (data) => {
    console.log(recyclableMaterials);
    handleMaterials();
    // if (await createUser({ ...user, ...data })) {
    //   dispatch(getUserData());
    //   dispatch(
    //     updateThankyou({
    //       title: "Congrats!",
    //       link: "/dashboard/",
    //       background: "image-1.svg",
    //       button_label: "Go to dashboard",
    //       content:
    //         "You’re all signed up! We send you a verification link send your provide email. Please verify your identity.",
    //     })
    //   );
    // }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h5>This form is optional and can be completed later. If you prefer to skip it, click "Sign Up."</h5>
        <h4>Recyclable Material</h4>
        <div className="registerInput__container-x2">
          <DropDownInput
            control={control}
            showLabel={false}
            labelName="Material"
            nameInput="materials"
            isEdit={true}
            isRequired={true}
            // value={selectedCity} onChange={(e) => setSelectedCity(e.value)}
            options={materials}
            optionLabel="material"
            optionValue="material"
            placeHolderText="Select Material"
            className=""
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              required: "*El campo es requerido.",
            }}
          />
          <DropDownInput
            control={control}
            showLabel={false}
            labelName="Unit"
            nameInput="unit"
            isEdit={true}
            isRequired={true}
            // value={selectedCity} onChange={(e) => setSelectedCity(e.value)}
            options={units}
            optionLabel="unit"
            optionValue="code"
            placeHolderText="Select Unit"
            className=""
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              required: "*El campo es requerido.",
            }}
          />
        </div>
        <div className="registerInput__container-x2">
          <NumberInput
            width="100%"
            showLabel={false}
            isRequired={true}
            control={control}
            label="Unit Price"
            nameInput="unitPrice"
            placeHolderText="Add Price per unit"
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 20,
                message: "El campo supera los 20 caracteres",
              },
              required: "*El campo es requerido.",
              pattern: {
                value: /^\S/,
                message: "No debe tener espacios al inicio",
              },
            }}
          />
          <Button
            className="dark-blue fullwidth"
            label="Add"
            name="add"
            type="submit"
            // onClick={handleMaterials}
          />
        </div>
      </form>
      <div className="materialsCard__grid">
        {recyclableMaterials.map((material, key) => {
          return (
            <RecycleMaterialCard
              key={key}
              material={material.type}
              unit={material.unit}
              price={material.price}
              color={material.color}
              removeMaterial={removeMaterial}
            />
          );
        })}
      </div>
      <UploadPhotoInput type="imageUpload" title="Add Images" setUploadedImages={setUploadedImages} uploadedImages={uploadedImages} />
      {/* <TextAreaInput
        label="Bio"
        nameInput="bio"
        showLabel={true}
        control={control}
        isRequired={false}
        placeHolderText="Tell us about your company"
        getFormErrorMessage={getFormErrorMessage}
        rules={{
          maxLength: {
            value: 50,
            message: "El campo supera los 50 caracteres",
          },
          required: "*El campo es requerido.",
          pattern: {
            value: /^\S/,
            message: "No debe tener espacios al inicio",
          },
        }}
      /> */}
      <div className="p-field" style={{ marginBottom: "24px" }}>
        <Button
          onSubmit={onSubmit}
          className="dark-blue fullwidth"
          label="Sign up"
          type="submit"
          name="submit"
        />
      </div>
    </>
  );
};

export default FormTwo;
