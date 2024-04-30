import React from 'react'

const CompanyInformation = () => {
  return (
    <div className='companyInformation__grid'>
        <div className="image__container">Image</div>
        <div className="companyInfor__container">
            <h2>Paper Recycle</h2>
            <div className="about__container">
                <h4>About the Organization</h4>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis impedit ex cum quos! Quasi officiis accusantium quam voluptates, soluta a natus, commodi sint quis nobis tenetur repellat minima, veniam laudantium.</p>
            </div>
            <div className="contact__container">
                <p>+56 243 55 43</p>
                <p>Carrera 24D Oeste # 4-176</p>
                <p>www.paperrecycle.com</p>
                <p>Pickup from home: Available</p>
            </div>
            <div className="recycableGoods__container">
                <p>goods</p>
            </div>
        </div>
    </div>
  )
}

export default CompanyInformation