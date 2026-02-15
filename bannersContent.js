import Options from "../../options/options"
import iconTrash from './iconTrash.svg'
import iconPlus from './iconPlus.svg'
import './bannersContent.css'
import { useState, useEffect } from "react";
import axios from "axios"

const BannersContent = () => {
    const [banners, setBanners] = useState([]);
    useEffect(() => {
        const abortController = new AbortController();

        const fetchBanery = async () => {
            try {
                const res = await fetch("http://localhost:3001/banery", {
                    signal: abortController.signal
                })
                const data = await res.json();
                setBanners(data)
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.log('test')
                }
            }
        }

        fetchBanery();

        return () => {
            abortController.abort();
        };
    }, [])

    const [bannersPublic, setBannersPublic] = useState([])
    useEffect(() => {
        const abortController = new AbortController();

        const fetchBanery = async () => {
            try {
                const res = await fetch("http://localhost:3001/baneryPublic", {
                    signal: abortController.signal
                })
                const data = await res.json();
                setBannersPublic(data)
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.log('test')
                }
            }
        }

        fetchBanery();

        return () => {
            abortController.abort();
        };
    }, [])

    const addToDatabase = async (fileName) => {
        try {
            const response = await axios.post("http://localhost:3001/restoreBanner/",{fileName});
    
            if (response.data.status === "ok") {
                window.location.reload(false);
            } else {
                alert("nie dziala");
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    

    const deleteBanners = async (id) => {
        try {
            const res = await fetch(`http://localhost:3001/banery/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                const updatedBanners = banners.filter(baner => baner._id !== id);
                setBanners(updatedBanners);
            } 
            else {
                console.error('blad w usuwaniu baneru');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const [image, setImage] = useState()
    const submitImage = async (e) => {
        e.preventDefault()

        if (!image) {
            alert("Proszę wybrać plik przed wysłaniem!");
            return;
        }

        const formData = new FormData()
        formData.append("image", image)

        const result = await axios.post(
            `http://localhost:3001/upload-image`, 
            formData, 
            {
                headers: { 'Content-Type': "multipart/form-data" }
            }
        );

        window.location.reload(false);
    }

    const onInputChange = (e) => {
        console.log(e.target.files[0])
        setImage(e.target.files[0])
    }

    return (
       <div className='dashboardContainer'>
            <div className='leftColumn'>
                <Options />
            </div>
            <div className='rightColumn rightColumnBanners'>
                <div className="addBanners">
                    <p>Wybierz plik aby dodać nowy baner</p>
                    <form onSubmit={submitImage}>
                        <input type="file" accept="image/*" onChange={onInputChange}></input>
                        <button type="submit" className="bannerSubmit">Dodaj baner</button>
                    </form>
                </div>
                <div className="allBannersContainer">
                    <p>Banery znajdujące się na stronie głównej</p>
                    <div className="allBanners">
                        {banners.map((baner) => {
                            return (
                                <div className="banerContainer" key={baner._id}>
                                    <img src={baner.url} className="banerImg"/>
                                    <div className="banerOverlay">
                                        <div className="banerTrashContainer" onClick={() => deleteBanners(baner._id)}>
                                            <img src={iconTrash}/>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}  
                    </div> 
                </div>
                <div className="publicBannersContainer">
                    <p>Banery, które jeszcze można dodać do strony głównej</p>
                    <div className="publicBanners">
                        {bannersPublic.map((banerPublic) => {
                            return (
                                <div className="banerContainer" key={banerPublic.name}>
                                    <img src={'http://localhost:3001/'+banerPublic.path} alt={`${banerPublic.name}`} className="banerImg"/>
                                    <div className="banerOverlay">
                                        <div className="banerPlusContainer" onClick={() => addToDatabase(banerPublic.name)}>
                                            <img src={iconPlus}/>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>  
                </div>           
            </div>
       </div>
    )
}

export default BannersContent