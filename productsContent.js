import Options from "../../options/options"
import { useState, useEffect } from "react";
import axios from "axios"
import './productsContent.css'
import Select from 'react-select';
import iconTrash from '../bannersContent/iconTrash.svg'

const ProductsContent = () => {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        const abortController = new AbortController();

        const fetchProducts = async () => {
            try {
                const res = await fetch("http://localhost:3001/produkt", {
                    signal: abortController.signal
                })
                const data = await res.json();
                setProducts(data)
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.log('test')
                }
            }
        }

        fetchProducts();

        return () => {
            abortController.abort();
        };
    }, [])

    const [multipleImages, setMultipleImages] = useState([])
    const otherPictures = (e) => {
        const imagesData = [...e.target.files]

        setMultipleImages(imagesData)

        if (imagesData.length > 4) {
            alert("Możesz wybrać maksymalnie 4 zdjęcia")
            e.target.value = null
            setMultipleImages([])
            return
        }
    }

    const [functions, setFunctions] = useState([]);
    useEffect(() => {
        const abortController = new AbortController();

        const fetchFunctions = async () => {
            try {
                const res = await fetch("http://localhost:3001/funkcje", {
                    signal: abortController.signal
                })
                const data = await res.json();
                setFunctions(data)

            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.log('test')
                }
            }
        }

        fetchFunctions();

        return () => {
            abortController.abort();
        };
    }, [])

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const abortController = new AbortController();

        const fetchCategories = async () => {
            try {
                const res = await fetch("http://localhost:3001/kategorie", {
                    signal: abortController.signal
                })
                const data = await res.json();
                setCategories(data)

            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.log('test')
                }
            }
        }

        fetchCategories();

        return () => {
            abortController.abort();
        };
    }, [])

    const [selectedOptions, setSelectedOptions] = useState([])
    const changeOptions = (optionValue) => {
        setSelectedOptions(optionValue)
    }

    const [selectedCategory, setSelectedCategory] = useState([])
    const changeCategory = (optionValueCategories) => {
        setSelectedCategory(optionValueCategories)
    }


    const [singleImage, setSingleImage] = useState([])
    const onSingleImageChange = (e) => {
        setSingleImage(e.target.files[0])
    }


    const addProductToDatabase = async (e) => {
        const selectedOptionsOnlyValue = selectedOptions.map(option => option.value)
        const productName = document.getElementById("productName").value
        const productPrice = document.getElementById("productPrice").value
        const productPromoPrice = document.getElementById("productPromoPrice").value
        const productQuantity = document.getElementById("productQuantity").value
        const productDescription = document.getElementById("productDescription").value
        const productShortDescription = document.getElementById("productShortDescription").value
        const productLink = productName.replaceAll(" ", "-")

        if (selectedOptionsOnlyValue.length === 0 || selectedCategory.value === undefined || multipleImages.length === 0 || !singleImage || !singleImage.name || productName === "" || productPrice === "" || productDescription === "" || productShortDescription === "") {
            console.log("Proszę uzupełnić wszystkie wymagane pola")
            return
        }

        const formData = new FormData()
        formData.append("guid", crypto.randomUUID())
        formData.append("name", productName)
        formData.append("image", singleImage)
        formData.append("price", productPrice)
        formData.append("promoPrice", productPromoPrice)
        formData.append("quantity", productQuantity)
        formData.append("description", productDescription)
        formData.append("shortDescription", productShortDescription)
        formData.append("selectedOptions", selectedOptionsOnlyValue)
        formData.append("selectedCategory", selectedCategory.value)
        formData.append("link", productLink)

        Array.from(multipleImages).forEach(image => {
            formData.append("multipleImages", image)
        })

        const result = await axios.post(
            `http://localhost:3001/upload-product`, 
            formData, 
            {
                headers: { 'Content-Type': "multipart/form-data" }
            }
        );

        // window.location.reload(false);
    }

    const deleteProduct = async (id) => {
        try {
            const res = await fetch(`http://localhost:3001/produkt/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                const uploadedProducts = products.filter(product => product._id !== id);
                setCategories(uploadedProducts);
            } 
            else {
                console.error('blad w usuwaniu produktu');
            }
        } catch (error) {
            console.error(error);
        }

        window.location.reload(false);
    }


    return (
       <div className='dashboardContainer'>
            <div className='leftColumn'>
                <Options />
            </div>
            <div className='rightColumn rightColumnProducts'>
                <div className="addProductPictures">
                    <div className="formToAddPictures">
                        <form>
                            <div className="mainPicture">
                                <p>Wybierz plik aby dodać główne zdjęcie produktu</p>
                                <input type="file" accept="image/*" id="singleImage" onChange={onSingleImageChange}></input>
                            </div>

                            <div className="otherPictures">
                                <p>Wybierz 4 pliki aby dodać pozostałe zdjęcia</p>
                                <input type="file" accept="image/*" id="multipleImage" multiple onChange={(e) => otherPictures(e)}></input>
                            </div>

                            <div className="inputProductName">
                                <p>Podaj nazwę produktu</p>
                                <input type="text" id="productName"></input>
                            </div>

                            <div className="inputProductPrice">
                                <p>Podaj cenę produktu</p>
                                <input type="number" id="productPrice"></input>
                            </div>

                            <div className="inputProductPromotionPrice">
                                <p>Podaj cenę promocyjną produktu</p>
                                <input type="text" id="productPromoPrice"></input>
                            </div>

                            <div className="inputProductQuantity">
                                <p>Podaj ilość</p>
                                <input type="text" id="productQuantity"></input>
                            </div>

                            <div className="inputProductDescription">
                                <p>Podaj opis produktu</p>
                                <textarea id="productDescription"></textarea>
                            </div>
                            
                            <div className="inputProductShortDescription">
                                <p>Podaj krótki opis produktu</p>
                                <textarea id="productShortDescription"></textarea>
                            </div>
    
                            <Select
                                placeholder="Wyszukaj funkcje"
                                noOptionsMessage={({ inputValue }) => `Brak wyników dla "${inputValue}"`}
                                className="selectFunkcje"
                                options={functions.map(x => {return{label: x.funkcja, value: x.funkcja}})}
                                isMulti
                                onChange={changeOptions}
                            />

                            <Select
                                placeholder="Wyszukaj kategorie"
                                noOptionsMessage={({ inputValue }) => `Brak wyników dla "${inputValue}"`}
                                className="selectKategorie"
                                options={categories.map(x => {return{label: x.nazwaKategorii, value: x.nazwaKategorii}})}
                                onChange={changeCategory}
                            />

                            <button type="button" className="productSubmit" onClick={() => addProductToDatabase()} >Dodaj produkt</button>
                        </form>
                    </div>
                </div>
                
                <div className="allProducts">
                    {products.map((product) => {
                        return (
                            <div className="productContainerDashboard" key={product._id}>
                                <div className="productInfo">
                                    <div className="productInfo1">
                                        <div className="productLeftColumn">
                                            <figure className="productMainImg">
                                                <img src={product.glowne_zdjecie}/>
                                                <figcaption>Główne zdjęcie</figcaption>
                                            </figure>
                                        </div>
                                        <div className="productRightColumn">
                                            <div className="productPictures">
                                                <figure>
                                                    <img src={product.zdjecia[0]}/>
                                                    <figcaption>Zdjęcie nr 1</figcaption>
                                                </figure>
                                                
                                                <figure>
                                                    <img src={product.zdjecia[1]}/>
                                                    <figcaption>Zdjęcie nr 2</figcaption>
                                                </figure>
                                                
                                                <figure>
                                                    <img src={product.zdjecia[2]}/>
                                                    <figcaption>Zdjęcie nr 3</figcaption>
                                                </figure>
                                                
                                                <figure>
                                                    <img src={product.zdjecia[3]}/>
                                                    <figcaption>Zdjęcie nr 4</figcaption>
                                                </figure>
                                            </div>
                                            <p className="productName">Nazwa produktu: <b>{product.nazwa}</b></p>
                                            <div className="productPricesAndQuantity">
                                                <p className="productPriceRegular">Cena: <b>{product.cena}</b></p>
                                                <p className="productPricePromotion">Cena promocyjna: <b>{product.cena_prom}</b></p>
                                                <p className="productQuanity">Ilość w magazynie: <b>{product.ilosc}</b></p>
                                            </div>

                                            <div className="productFunctionsAndCategories">
                                                <div className="productFunction"> Funkcje produktu: 
                                                    <ul>
                                                        {product.funkcje.map((funkcja) => 
                                                            <li key={funkcja}>{funkcja}</li>
                                                        )}
                                                    </ul>
                                                </div>
                                                <p className="productCategories">Kategoria: <b>{product.kategoria}</b></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="productInfo2">
                                        <div className="productDescriptions">
                                            <p className="productDescription"><span>Opis:</span><b>{product.opis}</b></p>
                                            <p className="productShortDescription"><span>Krótki opis:</span><b>{product.krotki_opis}</b></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="productTrashContainer" onClick={() => deleteProduct(product._id)}>
                                    <img src={iconTrash}/>
                                </div>
                            </div>
                        )
                    })}  
                </div>
            </div>
       </div>
    )
}

export default ProductsContent