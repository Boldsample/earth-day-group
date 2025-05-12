import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import TermEs from './legal/terms-es'
import TermEn from './legal/terms-en'
import { setHeader, setHeaderTitle } from '@store/slices/globalSlice'

import "./styles.sass"

const Terms = () => {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation('translation')

  useEffect(() => {
    dispatch(setHeader('settings'))
    dispatch(setHeaderTitle('termsAndConditionsBtnText'))
  }, [])
  console.log(i18n)
  return <div className="layout">
    <img className="layout__background hide__mobile" src="/assets/register/image-2.svg" />
    <div className="main__content">
      <div className="about">
		{i18n?.language === 'es' ? <TermEs /> : <TermEn />}
      </div>
    </div>
  </div>
}

export default Terms