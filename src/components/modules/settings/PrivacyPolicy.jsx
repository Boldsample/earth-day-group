import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import PolicyEs from './legal/policy-es'
import PolicyEn from './legal/policy-en'
import { setHeader, setHeaderTitle } from '@store/slices/globalSlice'

import "./styles.sass"

const PrivacyPolicy = () => {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation('translation')

  useEffect(() => {
	dispatch(setHeader('settings'))
	dispatch(setHeaderTitle('privacyPolicyBtnText'))
  }, [])
  console.log(i18n)
  return <div className="layout">
	<img className="layout__background hide__mobile" src="/assets/register/image-2.svg" />
	<div className="main__content">
	  <div className="about">
		{i18n?.language === 'es' ? <PolicyEs /> : <PolicyEn />}
	  </div>
	</div>
  </div>
}

export default PrivacyPolicy