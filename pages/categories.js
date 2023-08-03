import Layout from "@/components/Layout";
import axios from "axios";
import { set } from "mongoose";
import React, { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

const Categories = ({ swal }) => {
    const [name, setName] = useState("");
    const [parentCategory, setParentCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [editedCategory, setEditedCategory] = useState(null);
    const [properties, setProperties] = useState([]);

    function fetchCategories() {
        axios.get("/api/categories").then((result) => {
            setCategories(result.data);
        });
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    async function saveCategory(e) {
        e.preventDefault();
        const data = {
            name,
            parentCategory,
            properties: properties.map((p) => ({
                name: p.name,
                values: p.values.split(","),
            })),
        };

        if (editedCategory) {
            data._id = editedCategory._id;
            await axios.put("/api/categories/", data);
            setEditedCategory(null);
        } else {
            await axios.post("/api/categories", data);
        }

        setName("");
        setParentCategory("");
        setProperties([]);
        fetchCategories();
    }

    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(
            category.properties.map(({ name, values }) => ({
                name,
                values: values.join(","),
            }))
        );
    }

    function deleteCategory(category) {
        swal.fire({
            title: "Are you sure?",
            text: `Do you really want to delete ${category.name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, keep it",
            reverseButtons: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        }).then(async (result) => {
            // when confirmed and promise resolved...
            console.log(result);
            // console.log(result.isConfirmed);

            if (result.isConfirmed) {
                const { _id } = category;
                await axios.delete("/api/categories?_id=" + _id);
                fetchCategories();
            }
        });
    }

    function addProperty() {
        setProperties((prev) => {
            return [...prev, { name: "", values: "" }];
        });
    }

    // handle property name change

    function handlePropertyNameChange(index, property, newName) {
        // console.log({ index, property, newName });
        setProperties((prev) => {
            const newProperties = [...prev];
            newProperties[index].name = newName;
            return newProperties;
        });
    }
    function handlePropertyValuesChange(index, property, newValues) {
        // console.log({ index, property, newName });
        setProperties((prev) => {
            const newProperties = [...prev];
            newProperties[index].values = newValues;
            return newProperties;
        });
    }

    function removeProperty(indexToRemove) {
        setProperties((prev) => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }

    return (
        <Layout>
            <h1 className="text-3xl font-bold mb-4 capitalize text-gray-800 drop-shadow">
                Categories
            </h1>
            <label>
                {editedCategory
                    ? `Edit Category ${editedCategory.name}`
                    : "Add Category Name"}
            </label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-2 mt-2">
                    <input
                        type="text"
                        placeholder="Category Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <select
                        className="border-2 border-gray-300 py-1 mb-2 px-3 rounded-md"
                        value={parentCategory}
                        onChange={(e) => setParentCategory(e.target.value)}>
                        <option value>No Parent Category</option>
                        {categories.length > 0 &&
                            categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label className="block">Properties</label>
                    <button
                        onClick={addProperty}
                        type="button"
                        className=" bg-violet-400 py-2 px-3 text-[14px] font-bold shadow-md mb-2 text-gray-50 rounded-lg hover:bg-violet-500">
                        Add New Property
                    </button>
                    {properties.length > 0 &&
                        properties.map((property, index) => (
                            <div className="flex gap-1" key={index}>
                                <input
                                    type="text"
                                    value={property.name}
                                    placeholder="Property Name (eg: color)"
                                    onChange={(e) =>
                                        handlePropertyNameChange(
                                            index,
                                            property,
                                            e.target.value
                                        )
                                    }
                                />
                                <input
                                    type="text"
                                    value={property.values}
                                    placeholder="Values, comma separated"
                                    onChange={(e) =>
                                        handlePropertyValuesChange(
                                            index,
                                            property,
                                            e.target.value
                                        )
                                    }
                                />
                                <button
                                    onClick={() => removeProperty(index)}
                                    type="button"
                                    className="border-2 mb-2 px-4 flex text-sm font-bold items-center justify-center rounded-md border-gray-300 bg-[#fdefef] shadow-md">
                                    <svg
                                        className="w-6 h-6"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M3 6.52401C3 6.12901 3.327 5.81001 3.73 5.81001H8.518C8.524 4.96801 8.616 3.81501 9.45 3.01701C10.137 2.36178 11.0506 1.9974 12 2.00001C12.9494 1.9974 13.863 2.36178 14.55 3.01701C15.384 3.81501 15.476 4.96801 15.482 5.81001H20.27C20.673 5.81001 21 6.13001 21 6.52401C20.999 6.61883 20.9792 6.71251 20.942 6.79971C20.9047 6.88691 20.8507 6.96591 20.7829 7.03222C20.7151 7.09852 20.6349 7.15082 20.5469 7.18613C20.4589 7.22144 20.3648 7.23907 20.27 7.23801H3.73C3.63518 7.23907 3.54109 7.22144 3.45309 7.18613C3.36509 7.15082 3.2849 7.09852 3.21711 7.03222C3.14933 6.96591 3.09526 6.88691 3.05801 6.79971C3.02076 6.71251 3.00104 6.61883 3 6.52401Z"
                                            className="fill-[#ee2222]"
                                        />
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M11.596 22H12.404C15.187 22 16.578 22 17.484 21.114C18.388 20.228 18.48 18.774 18.665 15.868L18.932 11.681C19.032 10.104 19.082 9.315 18.629 8.815C18.175 8.315 17.409 8.315 15.876 8.315H8.12401C6.59101 8.315 5.82401 8.315 5.37101 8.815C4.91701 9.315 4.96701 10.104 5.06801 11.681L5.33501 15.869C5.52001 18.775 5.61201 20.229 6.51701 21.114C7.42201 22 8.81301 22 11.596 22ZM10.246 12.188C10.206 11.755 9.83801 11.438 9.42601 11.481C9.01301 11.525 8.71301 11.911 8.75401 12.346L9.25401 17.609C9.29401 18.043 9.66201 18.359 10.074 18.316C10.487 18.272 10.787 17.886 10.746 17.452L10.246 12.188ZM14.575 11.481C14.987 11.525 15.288 11.911 15.246 12.346L14.746 17.609C14.706 18.043 14.337 18.359 13.926 18.316C13.513 18.272 13.213 17.886 13.254 17.452L13.754 12.188C13.794 11.755 14.164 11.438 14.575 11.481Z"
                                            className="fill-[#ff2f2fc7] hover:fill-[#ee2222]"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ))}
                </div>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="bg-amber-400 text-white py-2 px-4 rounded-lg font-medium mb-2 hover:bg-amber-500 shadow-md">
                        Add Category
                    </button>

                    {editedCategory && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditedCategory(null);
                                setName("");
                                setParentCategory("");
                                setProperties([]);
                            }}
                            className="bg-red-500 text-white py-2 px-4 rounded-lg font-medium mb-2 hover:bg-red-600 shadow-md">
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {!editedCategory && (
                <table className="basic mt-4 border-collapse">
                    <thead>
                        <tr className="font-bold">
                            <td>Category Name</td>
                            <td>Parent Category</td>
                            <td>Operations</td>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 &&
                            categories.map((category) => (
                                <tr key={category._id}>
                                    <td>{category.name}</td>
                                    <td>{category?.parent?.name}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    editCategory(category)
                                                }
                                                className="flex gap-2 bg-violet-400 w-20 px-4 py-2 justify-center items-center rounded-lg font-medium hover:bg-violet-500 text-white shadow-md">
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    deleteCategory(category)
                                                }
                                                className="flex gap-2 bg-red-500 w-22 px-4 py-2 justify-center items-center rounded-lg font-medium hover:bg-red-600 text-white shadow-md">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            )}
        </Layout>
    );
};

export default withSwal(({ swal, ref }) => <Categories swal={swal} />);

// export default Categories;
