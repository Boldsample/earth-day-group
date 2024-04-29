import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { updateUser, getUserData } from "@store/slices/usersSlice";
import { createUser } from "@services/userServices";
import { setHeader } from "@store/slices/globalSlice"
import { updateThankyou } from "@store/slices/globalSlice";
import {
  NumberInput,
  DropDownInput,
  UploadPhotoInput,
  SwitchInput,
} from "@ui/forms";
import materials from "@json/recyclableMaterials.json";
import { Button } from "primereact/button";
import RecycleMaterialCard from "../../../ui/cards/recycleMaterialCard/RecycleMaterialCard";

const CompanyDetailedForm = ({
  recyclableMaterials,
  setRecyclableMaterials,
  uploadedImages,
  setUploadedImages,
  pickUpFromHome,
  setPickUpFromHome
}) => {
  const numberInput = useRef(null);
  const user = useSelector((state) => state.users.userData);
  const dispatch = useDispatch();

  const {
    reset,
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      materials: "",
      unit: "",
      unit_price: "",
    },
  });

  useEffect(() => {
    dispatch(setHeader('register'))
  }, [recyclableMaterials]);

  const units = [
    { unit: "Kilo", code: "Kg" },
    { unit: "Pound", code: "Lb" },
  ];

  function removeFocusFromNumberInput() {
    numberInput.current.getInput().blur();
  }

  const createMaterial = () => {
    const _recyclableMaterials = [...recyclableMaterials];
    const inputValue = getValues(["materials", "unit", "unit_price"]);

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
      const updatedMaterials = _recyclableMaterials.map((material, index) => {
        if (index === duplicateIndex) {
          return {
            ...material,
            unit: inputValue[1],
            price: inputValue[2],
          };
        }
        return material;
      });
      setRecyclableMaterials(updatedMaterials);
    } else {
      setRecyclableMaterials([...recyclableMaterials, selectedMaterial]);
    }

    reset();
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

  const handleRecyclableMaterial = async (data) => {
    createMaterial();
    removeFocusFromNumberInput();
  };

  const onSubmit = async () => {
    if (
      await createUser({
        ...user,
        recyclable_materials: recyclableMaterials,
        uploaded_images: uploadedImages,
        pick_up_from_home: pickUpFromHome
      })
    ) {
      dispatch(getUserData());
      dispatch(
        updateThankyou({
          title: "Congrats!",
          link: "/dashboard/",
          background: "image-1.svg",
          button_label: "Go to dashboard",
          content:
            "You’re all signed up! We sent you a verification link send your provide email. Please verify your identity.",
        })
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleRecyclableMaterial)}>
        <h5 className="recycableMaterialForm__title">
          This form is optional and can be completed later. If you prefer to
          skip it, click "Sign Up."
        </h5>
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
            inputRef={numberInput}
            disabled={false}
            width="100%"
            showLabel={false}
            isRequired={true}
            control={control}
            label="Unit Price"
            nameInput="unit_price"
            placeHolderText="Add Price per unit"
            getFormErrorMessage={getFormErrorMessage}
            rules={{
              maxLength: {
                value: 3,
                message: "El campo supera los 3 caracteres",
              },
              required: "*El campo es requerido.",
              pattern: {
                value: /^\S/,
                message: "No debe tener espacios al inicio",
              },
            }}
          />
          <Button
            className="green-earth fullwidth text-left"
            label="Add"
            name="add"
            type="submit"
            style={{ paddingLeft: "22px" }}
          />
        </div>
      </form>
      <div className="materialsCard__grid">
        {recyclableMaterials.map((material) => {
          return (
            <RecycleMaterialCard
              key={material.type}
              material={material.type}
              unit={material.unit}
              price={material.price}
              color={material.color}
              removeMaterial={removeMaterial}
            />
          );
        })}
      </div>
      <UploadPhotoInput
        type="imageUpload"
        title="Add Images"
        setUploadedImages={setUploadedImages}
        uploadedImages={uploadedImages}
      />
      <div className="registerInput__container-x2">
        <SwitchInput
          label={"Pick up from home?"}
          nameInput={"home_pick_up"}
          // control={control}
          checked={pickUpFromHome}
          setChecked={setPickUpFromHome}
          isRequired={false}
          isEdit={true}
          value={1}
        />
      </div>
      <div className="p-field" style={{ marginBottom: "24px" }}>
        <Button
          onClick={onSubmit}
          className="dark-blue fullwidth"
          label="Sign up"
          name="submit"
        />
      </div>
    </>
  );
};

export default CompanyDetailedForm;
