import './style.scss';
import React from 'react';
import Image from 'next/image';
// import { Icons } from '../../../assets'

const EmptyV = ({title, description, icon, children }) => {
    return (
        <div className='box-empty'>
            <div className='empty-image'>
                <Image src={"/static/svg/box-empty.svg"} height={60} width={60} alt='B&Q Watches'/>
            </div>
            <div className='empty-label'><h4 className='bold label-emtpy'>{title}</h4></div>
            <div className='empty-description'><span>{description}</span></div>
            <div className='emtpy-content'>
                {children}
            </div>
        </div>
    )
}

export default EmptyV