import Options from "../../options/options"
import { useState, useEffect } from "react";
import iconTrash from '../bannersContent/iconTrash.svg'
import "./newsletterContent.css"

const NewsletterContent = () => {
    const [mails, setMails] = useState([]);
    useEffect(() => {
        const abortController = new AbortController();

        const fetchMails = async () => {
            try {
                const res = await fetch("http://localhost:3001/newsletter", {
                    signal: abortController.signal
                })
                const data = await res.json();
                setMails(data)
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.log('test')
                }
            }
        }

        fetchMails();

        return () => {
            abortController.abort();
        };
    }, [])

    const deleteMail = async (id) => {
        try {
            const res = await fetch(`http://localhost:3001/mails/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                const updatedMails = mails.filter(mails => mails._id !== id);
                setMails(updatedMails);
            } 
            else {
                console.error('blad w usuwaniu maila');
            }
        } catch (error) {
            console.error(error);
        }
    };


    return (
       <div className='dashboardContainer'>
            <div className='leftColumn'>
                <Options />
            </div>
            <div className='rightColumn rightColumnNewsletter'>
                {mails.map((mail) => {
                    return (
                        <div className="mailContainer" key={mail._id}>
                            <p>E-mail: <b>{mail.mail}</b></p>
                            <div className="mailTrashContainer" onClick={() => deleteMail(mail._id)}>
                                <img src={iconTrash}/>
                            </div>
                        </div>
                    )
                })}  
            </div>
       </div>
    )
}

export default NewsletterContent