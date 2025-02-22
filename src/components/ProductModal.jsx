import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;


function ProductModal({ modalMode, tempProduct, isProductModalOpen, setIsProductModalOpen, getProducts }) {

    const [modalData, setModalData] = useState(tempProduct);
    const productModalRef = useRef(null);

    const handleCloseProductModal = () => {
        const modalInstance = Modal.getInstance(productModalRef.current);
        modalInstance.hide();
        setIsProductModalOpen(false);
    }


    const handleImageChange = (e, index) => {
        const { value } = e.target;
        const newImagesUrl = [...modalData.imagesUrl];
        newImagesUrl[index] = value;
        setModalData({
            ...modalData,
            imagesUrl: newImagesUrl
        })
    }

    const handleAddImage = () => {
        const newImagesUrl = [...modalData.imagesUrl, ""];
        setModalData({
            ...modalData,
            imagesUrl: newImagesUrl
        })
    }

    const handleRemoveImage = () => {
        const newImagesUrl = [...modalData.imagesUrl];
        newImagesUrl.pop();

        setModalData({
            ...modalData,
            imagesUrl: newImagesUrl
        })
    }

    const handleModalInputChange = (e) => {
        const { name, value, checked, type } = e.target;
        setModalData({
            ...modalData,
            [name]: type === 'checkbox' ? checked : value
        })
    }

    const createProduct = async () => {
        try {
            await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/product`, {
                data: {
                    ...modalData,
                    origin_price: Number(modalData.origin_price),
                    price: Number(modalData.price),
                    is_enabled: modalData.is_enabled ? 1 : 0
                }
            })
        } catch (error) {
            console.log(error)
            alert('新增產品失敗')
        }
    }

    const updateProduct = async () => {
        try {
            await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${modalData.id}`, {
                data: {
                    ...modalData,
                    origin_price: Number(modalData.origin_price),
                    price: Number(modalData.price),
                    is_enabled: modalData.is_enabled ? 1 : 0
                }
            })
        } catch (error) {
            console.log(error)
            alert('更新產品失敗')
        }
    }

    const handleUpadteProduct = async () => {
        const apiCall = modalMode === 'create' ? createProduct : updateProduct;

        try {
            await apiCall();
            getProducts();
            handleCloseProductModal();
        } catch (error) {
            console.log(error)
            alert('更新產品失敗')
        }
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file-to-upload', file);
        try {
            const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/upload`, formData);
            const uploadImageUrl = res.data.imageUrl;
            setModalData({
                ...tempProduct,
                imageUrl: uploadImageUrl
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        new Modal(productModalRef.current, { backdrop: 'static' });
        productModalRef.current.addEventListener('hidden.bs.modal', () => {
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        });
    }, [])

    useEffect(() => {
        if (isProductModalOpen) {
            const modalInstance = Modal.getInstance(productModalRef.current);
            modalInstance.show();
        }
    }, [isProductModalOpen])

    useEffect(() => {
        setModalData({
            ...tempProduct
        })
    }, [tempProduct])

    return (
        <div ref={productModalRef} className="modal fade" id="productModal">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="productModalLabel">{modalMode === 'create' ? '新增產品' : '編輯產品'}</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseProductModal}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="mb-5">
                                        <label htmlFor="fileInput" className="form-label"> 圖片上傳 </label>
                                        <input
                                            type="file"
                                            accept=".jpg,.jpeg,.png"
                                            className="form-control"
                                            id="fileInput"
                                            onChange={(e) => {
                                                handleFileChange(e);
                                            }}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="imageUrl" className="form-label">主圖連結</label>
                                        <input type="url" className="form-control" id="imageUrl" name="imageUrl" placeholder="請輸入主圖連結" value={modalData.imageUrl} onChange={handleModalInputChange} />
                                        <img
                                            src={modalData.imageUrl}
                                            alt={modalData.title}
                                            className="img-fluid"
                                        />
                                    </div>
                                    <div className="border border-2 border-dashed rounded-3 p-3">
                                        {modalData.imagesUrl?.map((image, index) => (
                                            <div key={index} className="mb-2">
                                                <label htmlFor={`imagesUrl-${index + 1}`} className="form-label">副圖 {index + 1}</label>
                                                <input
                                                    value={image}
                                                    onChange={(e) => handleImageChange(e, index)}
                                                    id={`imagesUrl-${index + 1}`}
                                                    type="text"
                                                    placeholder={`圖片網址 ${index + 1}`}
                                                    className="form-control mb-2"
                                                />
                                                {image && (
                                                    <img
                                                        src={image}
                                                        alt={`副圖 ${index + 1}`}
                                                        className="img-fluid mb-2"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                        <div className="btn-group w-100">
                                            {modalData.imagesUrl.length < 5 && modalData.imagesUrl[modalData.imagesUrl.length - 1] !== "" && (<button type="button" className="btn btn-outline-primary btn-sm w-100" onClick={handleAddImage}>新增圖片</button>)}
                                            {modalData.imagesUrl.length > 1 && (<button type="button" className="btn btn-outline-danger btn-sm w-100" onClick={handleRemoveImage}>取消圖片</button>)}
                                        </div>

                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="title" className="form-label">標題</label>
                                        <input type="text" className="form-control" id="title" name="title" placeholder="請輸入產品標題" value={modalData.title} onChange={handleModalInputChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="category" className="form-label">分類</label>
                                        <input type="text" className="form-control" id="category" name="category" placeholder="請輸入產品分類" value={modalData.category} onChange={handleModalInputChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="unit" className="form-label">單位</label>
                                        <input type="text" className="form-control" id="unit" name="unit" placeholder="請輸入單位" value={modalData.unit} onChange={handleModalInputChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="origin_price" className="form-label">原價</label>
                                        <input type="number" className="form-control" id="origin_price" name="origin_price" placeholder="請輸入原價" value={modalData.origin_price} onChange={handleModalInputChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="price" className="form-label">售價</label>
                                        <input type="number" className="form-control" id="price" name="price" placeholder="請輸入售價" value={modalData.price} onChange={handleModalInputChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">產品描述</label>
                                        <textarea className="form-control" id="description" name="description" rows="3" placeholder="請輸入產品描述" value={modalData.description} onChange={handleModalInputChange}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="content" className="form-label">說明內容</label>
                                        <textarea className="form-control" id="content" name="content" rows="3" placeholder="請輸入說明內容" value={modalData.content} onChange={handleModalInputChange}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" id="is_enabled" name="is_enabled" checked={modalData.is_enabled} onChange={handleModalInputChange} />
                                            <label className="form-check-label" htmlFor="is_enabled">是否啟用</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleCloseProductModal}>取消</button>
                        <button type="button" className="btn btn-primary" onClick={handleUpadteProduct}>確認</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductModal;