import { useEffect, useState } from "react";
import axios from "axios";

const API=`${window.location.protocol}//${window.location.hostname}:8000`;

export default function StatsGrid(){

    const[data,setData]=useState(null);

    async function load(){

        const r=await axios.get(`${API}/events/dashboard`);

        setData(r.data);

    }

    useEffect(()=>{

        load();

        const t=setInterval(load,2000);

        return()=>clearInterval(t);

    },[]);

    if(!data) return null;

    return(

        <div className="stats-grid">

            <div className="card">
                <h2>{data.people_now}</h2>
                <span>Pessoas Agora</span>
            </div>

            <div className="card">
                <h2>{data.entries}</h2>
                <span>Entradas</span>
            </div>

            <div className="card">
                <h2>{data.exits}</h2>
                <span>Saídas</span>
            </div>

            <div className="card">
                <h2>{data.pending}</h2>
                <span>Pendentes</span>
            </div>

        </div>

    );

}
