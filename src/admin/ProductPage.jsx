import { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../components/Pagination';
import ProductModal from "../components/ProductModal";
import DeleteProductModal from '../components/DeleteProductModal';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalState = {
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: [""]
};

function ProductPage() {

    const [products, setProducts] = useState([])
    const [modalMode, setModalMode] = useState(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] = useState(false);

    const [tempProduct, setTempProduct] = useState(defaultModalState)

    const getProducts = async (page = 1) => {
        try {
            const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`)
            setProducts(res.data.products)
            setPageInfo(res.data.pagination)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getProducts();
    }, [])

    const handleOpenDelProductModal = (product) => {
        setTempProduct(product);
        setIsDeleteProductModalOpen(true);
    }

    const handleOpenProductModal = (mode, product) => {
        setModalMode(mode);
        switch (mode) {
            case 'create':
                setTempProduct(defaultModalState);
                break;
            case 'edit':
                setTempProduct(product);
                break;
            default:
                break;
        }
        setIsProductModalOpen(true);
    }

    const [pageInfo, setPageInfo] = useState({});

    const handlePageChange = (page) => {
        getProducts(page);
    }

    return (
        <>
            <div className="container mt-4">
                <div className="row mb-3">
                    <div className="col">
                        <h2>產品列表</h2>
                    </div>
                    <div className="col text-end">
                        <button className="btn btn-primary" onClick={() => { handleOpenProductModal('create') }}>
                            <i className="bi bi-plus"></i>新增產品
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>分類</th>
                                    <th>產品名稱</th>
                                    <th>原價</th>
                                    <th>售價</th>
                                    <th>是否啟用</th>
                                    <th>編輯</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.category}</td>
                                        <td>{product.title}</td>
                                        <td>${product.origin_price}</td>
                                        <td>${product.price}</td>
                                        <td>
                                            <span className={`badge ${product.is_enabled ? 'bg-success' : 'bg-secondary'}`}>
                                                {product.is_enabled ? '啟用' : '停用'}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-warning me-1" onClick={() => { handleOpenProductModal('edit', product) }}>
                                                <i className="bi bi-pencil"></i> 編輯
                                            </button>
                                            <button className="btn btn-sm btn-danger" onClick={() => { handleOpenDelProductModal(product) }}>
                                                <i className="bi bi-trash"></i> 刪除
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
                </div>
            </div>

            <ProductModal modalMode={modalMode} tempProduct={tempProduct} isProductModalOpen={isProductModalOpen} setIsProductModalOpen={setIsProductModalOpen} getProducts={getProducts} />
            <DeleteProductModal tempProduct={tempProduct} isDeleteProductModalOpen={isDeleteProductModalOpen} setIsDeleteProductModalOpen={setIsDeleteProductModalOpen}  getProducts={getProducts} />
        </>
    );
}

export default ProductPage;