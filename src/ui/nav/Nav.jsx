import { ReactSVG } from "react-svg"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { Tooltip } from "primereact/tooltip"

import sectionsJSON from "@json/sections.json"

const Nav = () => {
  const userRole = useSelector((state) => state?.users?.userData?.role);
  const sections = sectionsJSON[userRole];

  return <div className="nav__container">
    <div className="box">
      {sections?.map((section, key) => {
        return <Link key={key} to={section.path} className="navLink" data-pr-tooltip={section.label} data-pr-position="right" data-pr-at="right+5 center-1" data-pr-my="left center-2">
          <Tooltip target=".navLink" />
          <ReactSVG src={section.icon} />
        </Link>
      })}
    </div>
  </div>
}

export default Nav