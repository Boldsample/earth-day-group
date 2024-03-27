import React from 'react'
import TextInput from "@ui/forms/textInput/TextInput";
import { InputText } from 'primereact/inputtext';
import { useForm } from "react-hook-form";
import  modules  from './modules';
import { Link } from 'react-router-dom';
import CategoryCard from "@ui/cards/categoryCard/CategoryCard";
import './dashboard.sass'

const Dashboard = () => {
    
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
      searchWord: ""
    },
  });
console.log(modules)
  const getFormErrorMessage = (fieldName) => {
    return (
      errors[fieldName] && (
        <small className="p-error">{errors[fieldName]?.message}</small>
      )
    );
  };

  return (
    <div className="layout">
      <div className="main__content -dashboard-container">
        <div className="category__search">
        <h4>Discover:</h4>
          <TextInput 
            showIcon={true}
            iconName="pi pi-search"
              isRequired={false}
              labelName="Search"
              isEdit={true}
              getFormErrorMessage={getFormErrorMessage}
              control={control}
              inputName="searchWord"
              placeHolderText="Search"
              width="100%"
              showLabel={false}
            />
        </div>
        <div className="category__grid -dashboard">
            {modules.map((module, key)=>{
                return <Link to={module.link}>
                <CategoryCard
                  hoverBackgroundColor={module.hoverBackgroundColor}
                  hoverIconColor={module.hoverIconColor}
                  backgroundColor={module.backgroundColor}
                  iconBackgroundColor={module.iconBackgroundColor}
                  height={module.height}
                  fontColor={module.fontColor}
                  title={module.title}
                  description={module.description}
                  icon={module.icon}
                  className={'-dashboard-card'}
                />
                </Link>
            })}
        </div>    
      </div>
    </div>
  );
}

export default Dashboard