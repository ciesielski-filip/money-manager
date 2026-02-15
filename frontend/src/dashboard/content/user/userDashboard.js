import { useState, useEffect } from "react";
import axios from "axios";

function UserDashborad() {
    const [userName, setUserName] = useState();
    const addUserToDatabase = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post("http://localhost:5001/create-user", { userName });

            if (response.data.status === "ok") {
                window.location.reload(false)
            }
            else {
                alert("nie działa")
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    const onInputChange = (e) => {
        console.log(e.target.value)
        setUserName(e.target.value)
    }

    const [users, setUsers] = useState([]);
    useEffect(() => {
        const abortController = new AbortController()

        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:5001/users", {
                    signal: abortController.signal
                })
                const data = await response.json();
                setUsers(data)
            }
            catch (error) {
                if (error.name !== 'AbortError') {
                    console.log('test')
                }
            }
        }

        fetchUsers();

        return () => {
            abortController.abort()
        }
    }, [])

    return (
        <div className='user-dashborad-container'>
            <form onSubmit={addUserToDatabase}>
                <input type='text' onChange={onInputChange} />
                <button type='submit'>Dodaj</button>
            </form>
            {users.map((user) => {
                return (
                    <li key={user._id}>{user.name}</li>
                )
            })}
        </div>
    )
}

export default UserDashborad