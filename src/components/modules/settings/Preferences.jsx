import { useEffect } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faLanguage } from '@fortawesome/free-solid-svg-icons'

import "./styles.sass"
import { setCurrency, setHeader, setHeaderTitle } from '@store/slices/globalSlice'

const Preferences = () => {
  let preferences = []
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation('translation')
  const user = useSelector((state) => state.users.userData)
  const currency = useSelector((state) => state.global.currency)

  preferences.push({
    label: t(`global.language`),
    template: <div className="menuDropdown">
      <label className='mr-2' ><FontAwesomeIcon className="mr-1" icon={faLanguage} />{t(`global.language`)}</label>
      <Dropdown
        optionLabel="label"
        optionValue="value"
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.value)}
        options={[
          { label: 'Español', value: 'es' },
          { label: 'English', value: 'en' },
        ]}
      />
    </div>
  })
  if(user?.role != 'shelter' && user?.role != 'admin')
    preferences.push({
      label: t(`global.currency`),
      template: <div className="menuDropdown">
        <label className='mr-2'><FontAwesomeIcon className="mr-1" icon={faCoins} />{t(`global.currency`)}</label>
        <Dropdown
          value={currency}
          optionLabel="label"
          optionValue="value"
          onChange={(e) => dispatch(setCurrency(e.value))}
          options={[
            { label: 'USD', value: 'usd' },
            { label: 'COP', value: 'cop' },
          ]}
        />
      </div>
    })

	useEffect(() => {
		dispatch(setHeader('settings'))
		dispatch(setHeaderTitle('changePreferences'))
	}, [])

	return <div className="layout" style={{background: 'white'}}>
		<div className="main__content centerwidth">
      <div className="fullwidth">
        <div className="settings__card">
          <p className='mb-3'>{t('global.preferencesDescription')}</p>
          <div className="flex flex-row" style={{flexWrap: 'wrap'}}>
            <div className="menuDropdown">
              <label className='mr-2'><FontAwesomeIcon className="mr-1" icon={faLanguage} />{t(`global.language`)}</label>
              <Dropdown
                optionLabel="label"
                optionValue="value"
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.value)}
                options={[
                  { label: 'Español', value: 'es' },
                  { label: 'English', value: 'en' },
                ]}
              />
            </div>
            <div className="menuDropdown">
              <label className='mr-2'><FontAwesomeIcon className="mr-1" icon={faCoins} />{t(`global.currency`)}</label>
              <Dropdown
                value={currency}
                optionLabel="label"
                optionValue="value"
                onChange={(e) => dispatch(setCurrency(e.value))}
                options={[
                  { label: 'USD', value: 'usd' },
                  { label: 'COP', value: 'cop' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default Preferences