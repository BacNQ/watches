import 'react-image-lightbox/style.css';
import Lightbox from 'react-image-lightbox';

const ImgLightbox = (props) => {
  const { images, open, setOpen, index, setIndex } = props;
  let leng = images?.length;
  return (
        <div>
          {open && (
            <Lightbox
              mainSrc={images[index]}
              nextSrc={images[(index + 1) % leng]}
              prevSrc={images[(index + leng - 1) % leng]}
              onCloseRequest={() => setOpen(false)}
              onMovePrevRequest={() => setIndex((index + leng - 1) % leng)}
              onMoveNextRequest={() => setIndex((index + 1) % leng)}
            />
          )}
        </div>
  )
}

export default ImgLightbox