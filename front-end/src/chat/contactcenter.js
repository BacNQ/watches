import React from 'react';
import { useQuery } from "../hook/query";
import { useState, useEffect } from 'react';
import './chat.scss'

const ContactCenter = () => {
  const [open, setOpen] = useState(false);
  const { asPathname } = useQuery();
  const [show, setShow] = useState(true);

  const openZalo = React.useCallback(() => {
    const zaloNumber = '0353827279';
    window.open(`https://zalo.me/${zaloNumber}`);
  }, []);

  const openHotline = React.useCallback(() => {
    window.open(`tel:0353827279`);
  }, []);

  const openFacebook = React.useCallback(() => {
    window.open('https://www.facebook.com/nguyenqui.bac/');
  }, []);

  const openEmail = React.useCallback(() => {
    window.open(`bnq.watches@gmail.com`);
  }, []);

  return (
    <>
      <ul className='list-social'>
        {show && (
          <>
            <li className='item-social'>
              <a onClick={() => openFacebook()} className='bold' target="_blank" rel="noreferrer">
                <img className='icon-social' src='/static/social/icon_facebook.png' alt='B&Q Watches' />
              </a>
            </li>
            <li className='item-social'>
              <a onClick={() => openZalo()} className='bold' target="_blank" rel="noreferrer">
                <img className='icon-social' src='/static/social/icon_zalo.png' alt='B&Q Watches' />
              </a>
            </li>
            <li className='item-social'>
              <a className='bold' onClick={() => openHotline()}>
                <img className='icon-social' src='/static/social/phone_2.png' alt='B&Q Watches' />
              </a>
            </li>
          </>
        )}
      </ul>
    </>
  );
}

export default ContactCenter;
