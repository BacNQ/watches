import { image } from "@nextui-org/react";
import { Empty } from "antd";

const ProductEmpty = () => {
    return (
          <div className="detail-empty bg-white p-[65px] rounded-[7px] mb-[45px]">
            <Empty
                image="/static/svg/box-empty.svg"
                style={{ image: { height: '60px' } }}
                description={<h2 className="bold">Sản phẩm không tồn tại</h2>}
            >
                <p>Vui lòng chọn những sản phẩm khác để đặt mua</p>
            </Empty>
          </div>
    )
}
export default ProductEmpty;