import { Link } from 'react-router-dom'
import { useState, useEffect } from "react";
import axios from "axios"
import validator from "validator";
import './newsletter.css'

const Newsletter = () => {
    const [message, setMessage] = useState("");

    const [messageCheckbox, setMessageCheckbox] = useState("");

    const [activeButton, setActiveButton] = useState(true);

    const validateEmail = (e) => {
        const email = e.target.value;

        if (validator.isEmail(email)) {
            setMessage(null);
            setActiveButton(false)
        } 
        else {
            setMessage("Wpisz poprawny adres e-mail");
            console.log("nie")
            setActiveButton(true)
        }
    };

    const [inputData, setInputdata] = useState("")
    
    const newsletterMail = async () => {
        let inputData = document.getElementById("newsletterInput").value
        if(document.getElementById("checkPrivacy").checked === false || inputData === "") {
            setMessageCheckbox("Zakceptuj politykę prywatności")
        }

        else {
            console.log(inputData)
            setInputdata('')
            document.getElementById("checkPrivacy").checked = false

            setMessageCheckbox(null)

            try {
                const response = await axios.post("http://localhost:3001/restoreMails/",{inputData});
        
                if (response.data.status === "ok") {
                    window.location.reload(false);
                } else {
                    setMessage("Podany adre e-mail już istnieje");
                    setInputdata(inputData)
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <div className='newsletter'>
            <p>Zapisz się do newslettera</p>
            <p>i odbierz kupon <span className='percent'>-5%</span> na zakupy</p>
            <span className='newsletterMessage'>{message}</span>
            <div className='mailAndButton'>
                <input type='mail' placeholder='Wpis swój e-mail' value={inputData} className='newsletterInput' id='newsletterInput' onChange={(e) => {setInputdata(e.target.value); validateEmail(e)}}/>
                <button className="newsletterButton" onClick={newsletterMail} disabled={activeButton}>Zapisz się</button>
            </div>
            <div className='checkAndAccept'>
                <input type='checkbox' className='checkPrivacy' id='checkPrivacy'/>
                <p className='accept'>Akceptuję <Link to="/polityka-prywatnosci">politykę prywatności</Link>*</p>
            </div>
            <span className='message'>{messageCheckbox}</span>
        </div>
    )
}

export default Newsletter