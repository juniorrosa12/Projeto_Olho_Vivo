import { useEffect, useState } from "react";
import axios from "axios";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

const API=`${window.location.protocol}//${window.location.hostname}:8000`;

export default function Timeline(){

    const [data,setData]=useState([]);

    async function load(){

        const r=await axios.get(`${API}/statistics/hour`);

        setData(
            r.data.map(i=>({
                hora:String(i.hour).padStart(2,"0"),
                entradas:i.entries,
                saidas:i.exits
            }))
        );

    }

    useEffect(()=>{

        load();

        const t=setInterval(load,5000);

        return ()=>clearInterval(t);

    },[]);

    return(

        <div
            style={{
                background:"#1f2937",
                borderRadius:12,
                padding:20,
                marginTop:20
            }}
        >

            <h2
                style={{
                    color:"#fff",
                    marginBottom:20
                }}
            >
                Fluxo de Pessoas
            </h2>

            <ResponsiveContainer width="100%" height={320}>

                <LineChart data={data}>

                    <CartesianGrid stroke="#374151"/>

                    <XAxis dataKey="hora"/>

                    <YAxis/>

                    <Tooltip/>

                    <Line
                        type="monotone"
                        dataKey="entradas"
                        stroke="#3b82f6"
                        strokeWidth={3}
                    />

                    <Line
                        type="monotone"
                        dataKey="saidas"
                        stroke="#ef4444"
                        strokeWidth={3}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    );

}
