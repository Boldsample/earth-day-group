import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { Tooltip } from 'primereact/tooltip';
import { Badge } from 'primereact/badge';
import "./styles.sass"

const InfoTooltip = ({toolTipMessage, delay}) => {
  return (
    <>
    <Tooltip target=".info__btn" showDelay={delay}/>
    <Badge
        value={<FontAwesomeIcon color='var(--dark-blue)' icon={faCircleInfo} fontSize="25px" />}
        data-pr-tooltip={toolTipMessage}
        data-pr-position="right"
        data-pr-at="right+5 top"
        data-pr-my="left center-2"
        className='info__btn' 
      >
    </Badge>
    </>
  )
}

export default InfoTooltip