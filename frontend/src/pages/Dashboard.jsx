import { useState, useEffect } from "react"
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import axios from "axios"


export const Dashboard = () => {
    const [value, setValue] = useState(0) 
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/account/balance", {
                    headers: {
                        Authorization: `Bearer ${token}` // Replace with your actual token
                    }
                });
                console.log("Full API Response:", response.data); // Log the entire response
            // Check if 'balance' exists directly or within a nested object
            const balance = response.data.balnce || response.data.data.balnce;
            console.log("Extracted balance:", balance); // Ensure correct balance extraction
            setValue(balance);
            console.log("Value after setting:", balance); // Verify state update
            } catch (error) {
                console.error("Error fetching balance:", error.response ? error.response.data : error.message);
                // Handle the error appropriately
            }
        };

        fetchBalance();
    }, []);
    return <div>
        <Appbar />
        <div className="m-8">
            <Balance value={value} />
            <Users />
        </div>
    </div>
}