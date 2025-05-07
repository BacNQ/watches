import EmtpySvg from '../../assets/svg/empty.svg'
import Image from "next/image";


const ProductEmpty = () => {
    return (
        <div className="mx-auto px-10 py-4 bg-white w-full">
        <div className="flex flex-col justify-center py-12 items-center">
          <div className="flex justify-center items-center">
            <Image
              src={EmtpySvg}
              height={125}
              width={125}
              alt="B&Q Watches"
            />
          </div>
          <br/>
          <h1 className="text-gray-700 font-medium text-2xl text-center mb-3 bold">Không tìm thấy sản phẩm</h1>
          <p className="text-gray-500 text-center mb-6">Vui lòng nhập hoặc chọn điều kiện tìm kiếm khác.</p>
        </div>
      </div>
    )
}
export default ProductEmpty;
