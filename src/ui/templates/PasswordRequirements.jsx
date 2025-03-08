import React from 'react'
import { Divider } from 'primereact/divider';
import { useTranslation } from 'react-i18next';
const PasswordRequirements = () => {
    const [tGlobal2] = useTranslation('translation', {keyPrefix: 'global'})
  return (
    <>
        <Divider />
            <p>{tGlobal2('passwordRequirementTitle')}</p>
            <ul className="pl-2 ml-2 mt-0">
                <li>{tGlobal2('passwordRequirement1')}</li>
                <li>{tGlobal2('passwordRequirement2')}</li>
                <li>{tGlobal2('passwordRequirement3')}</li>
                <li>{tGlobal2('passwordRequirement4')}</li>
                <li>{tGlobal2('passwordRequirement5')}</li>
            </ul> 
    </>
  )
}

export default PasswordRequirements