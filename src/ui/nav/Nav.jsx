import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { Tooltip } from "primereact/tooltip"

import sectionsJSON from "@json/sections.json"

import "./nav.sass"

const Nav = () => {
  const userRole = useSelector((state) => state?.users?.userData?.role);
  const sections = sectionsJSON[userRole];

  return <div className="nav__container">
    {sections?.map((section, key) => {
      return <Link key={key} to={section.path}>
        <Tooltip target=".custom-target-icon" />
        <img data-pr-tooltip={section.label} data-pr-position="right" data-pr-at="right+5 top" data-pr-my="left center-2" className="custom-target-icon" key={section.label} src={section.icon} />
      </Link>
    })}
  </div>
}

export default Nav