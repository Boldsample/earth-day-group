import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { Tooltip } from 'primereact/tooltip';

const InfoTooltip = () => {
  return (
    <>
    <Tooltip target=".info__btn" />
    <button
        data-pr-tooltip="No notifications"
        data-pr-position="right"
        data-pr-at="right+5 top"
        data-pr-my="left center-2"
        className='info__btn' 
        onClick={() => setVisible(true)}><FontAwesomeIcon color='var(--dark-blue)' 
        icon={faCircleInfo} fontSize="25px" />
    </button>
    </>
  )
}

export default InfoTooltip