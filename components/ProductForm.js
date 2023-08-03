import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import Image from "next/image";

const ProductForm = ({
    _id,
    title: existingTitle,
    desc: existingDesc,
    price: existingPrice,
    images: existingImages,
    category: assignedCategory,
    properties: assignedProperties,
}) => {
    const [title, setTitle] = useState(existingTitle || "");
    const [category, setCategory] = useState(assignedCategory || "");
    const [productProperties, setProductProperties] = useState(
        assignedProperties || {}
    );
    const [desc, setDesc] = useState(existingDesc || "");
    const [price, setPrice] = useState(existingPrice || "");
    const [images, setImages] = useState(existingImages || []);

    const [isUploading, setIsUploading] = useState(false);

    const [goToProducts, setGoToProducts] = useState(false);

    const router = useRouter();

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get("/api/categories").then((result) => {
            setCategories(result.data);
        });
    }, []);

    async function saveProduct(e) {
        e.preventDefault();
        const formData = {
            title,
            desc,
            price,
            images,
            category,
            properties: productProperties,
        };
        if (_id) {
            await axios.put("/api/products", { ...formData, _id });
        } else {
            await axios.post("/api/products", formData);
        }
        setGoToProducts(true);
    }

    if (goToProducts) {
        router.push("/products");
    }

    async function handleUploadImage(e) {
        // console.log(e);
        const files = e.target?.files;

        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            // files.forEach((file) => data.append("file", file));
            for (const file of files) {
                data.append("file", file);
            }
            const res = await axios.post("/api/upload", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // console.log(res.data);
            setImages((oldImages) => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
    }

    function updateImagesOrder(images) {
        setImages(images);
    }

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({ _id }) => _id === category);
        console.log({ catInfo });
        if (catInfo) {
            propertiesToFill.push(...catInfo.properties);
            while (catInfo?.parent?._id) {
                const parentCatInfo = categories.find(
                    ({ _id }) => _id === catInfo?.parent?._id
                );
                if (parentCatInfo) {
                    propertiesToFill.push(...parentCatInfo.properties);
                    catInfo = parentCatInfo;
                }
            }
        }
    }

    function setProductProp(propName, value) {
        setProductProperties((prev) => {
            const newProductProps = { ...prev };
            newProductProps[propName] = value;
            return newProductProps;
        });
    }

    return (
        <form onSubmit={saveProduct}>
            <div className="flex flex-col">
                <label>Product Name </label>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <label>Category</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border-2 border-gray-300 py-1 mb-2 px-3 rounded-md w-[50%]">
                    <option value>No Category</option>
                    {categories.length > 0 &&
                        categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                </select>
                <div className="flex gap-2 mb-2 mt-1">
                    {propertiesToFill.length > 0 &&
                        propertiesToFill.map((p) => (
                            <div className="flex gap-2" key={p.name}>
                                <div className="text-[14px] font-medium mt-1">
                                    {p.name}
                                </div>
                                <select
                                    value={productProperties[p.name]}
                                    onChange={(e) =>
                                        setProductProp(p.name, e.target.value)
                                    }
                                    className="border-2 px-4 border-gray-300 rounded-md text-sm">
                                    {p.values.map((val) => (
                                        <option key={val} value={val}>
                                            {val}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                </div>
                <label>Images</label>
                <div className="mb-2 flex gap-2 flex-wrap">
                    <ReactSortable
                        list={images}
                        setList={updateImagesOrder}
                        className="flex flex-wrap gap-2">
                        {!!images?.length &&
                            images.map((link) => (
                                <div
                                    key={link}
                                    className="w-36 h-36 rounded-md shadow-lg">
                                    <img
                                        src={link}
                                        alt=""
                                        className=" object-cover rounded-lg"
                                    />
                                </div>
                            ))}
                    </ReactSortable>
                    {isUploading && (
                        <div className="w-28 h-36 border flex justify-center items-center text-gray-400 rounded-lg border-gray-300 shadow-md hover:cursor-pointer">
                            <Spinner />
                        </div>
                    )}

                    <label className="w-28 h-36 border flex flex-col justify-center items-center text-gray-400 rounded-lg border-gray-300 shadow-md hover:cursor-pointer">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                            />
                        </svg>
                        <span className="text-sm">upload</span>
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleUploadImage}
                        />
                    </label>
                    {/* {!images?.length && (
                        <p className="lowercase text-sm mt-1">
                            No images uploaded
                        </p>
                    )} */}
                </div>

                <label>Product Description </label>
                <textarea
                    placeholder="Description"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                />
                <label>Price </label>
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>
            <button type="submit" className="btn-primary flex gap-2">
                Add
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                </svg>
            </button>
        </form>
    );
};

export default ProductForm;
