import { useEffect } from 'react'
import { Link } from "react-router-dom"
import { useDispatch } from 'react-redux'

import Card from "@ui/cards/Card"
import userRoles from '@json/roles.json'
import { setHeader } from '@store/slices/globalSlice'

const RegisterRole = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setHeader('register'))
  }, [])
  
  return <div className="layout">
    <img className="layout__background hide__mobile" src="/assets/register/image-1.svg" />
    <div className="main__content absoluteleft width58">
      <h2 className="text-center mb-3">Register as:</h2>
      <div className="card__grid">
        {userRoles.length > 0 ? userRoles.map((role, key) => 
          <Link key={key} to={role.link}>
            <Card
              icon={role.icon}
              title={role.title}
              cardStyle={role.className}
              description={role.description}
            />
          </Link>)
        : "No roles found."}
      </div>
    </div>
  </div>
}

export default RegisterRole