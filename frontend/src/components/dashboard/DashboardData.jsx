import {useEffect,useState} from "react";
import axios from "axios";

import Topbar from "../layout/Topbar";
import StatCard from "../cards/StatCard";
import LivePreview from "../live/LivePreview";
import EventList from "../events/EventList";
import PeopleChart from "../charts/PeopleChart";

export default function DashboardData(){

    const [data,setData]=useState({

        people_now:0,
        entries:0,
        exits:0,
        pending:0,
        last_events:[]

    });

    async function load(){

        const res=await axios.get(

            `${window.location.protocol}//${window.location.hostname}:8000/events/dashboard`

        );

        setData(res.data);

    }

    useEffect(()=>{

        load();

        const timer=setInterval(load,2000);

        return()=>clearInterval(timer);

    },[]);

    return(

        <>

            <Topbar/>

            <div
                style={{
                    display:"grid",
                    gridTemplateColumns:"repeat(4,1fr)",
                    gap:20,
                    marginBottom:25
                }}
            >

                <StatCard title="Pessoas Agora" value={data.people_now} color="#22c55e"/>

                <StatCard title="Entradas" value={data.entries} color="#2563eb"/>

                <StatCard title="Saídas" value={data.exits} color="#ef4444"/>

                <StatCard title="Pendentes" value={data.pending} color="#f59e0b"/>

            </div>

            <div
                style={{
                    display:"grid",
                    gridTemplateColumns:"2fr 1fr",
                    gap:20,
                    marginBottom:20
                }}
            >

                <LivePreview/>

                <EventList
                    events={data.last_events}
                />

            </div>

            <div
                style={{
                    display:"grid",
                    gridTemplateColumns:"2fr 1fr",
                    gap:20
                }}
            >

                <PeopleChart/>

                <div
                    style={{
                        background:"#1e293b",
                        borderRadius:18,
                        padding:20
                    }}
                >

                    <h2>

                        Status IA

                    </h2>

                    <br/>

                    🟢 IA Online

                    <br/><br/>

                    🧠 YOLO11n

                    <br/><br/>

                    🏪 34 Filiais

                    <br/><br/>

                    🎥 16 Câmeras

                    <br/><br/>

                    📈 Precisão

                    <h1>

                        96%

                    </h1>

                </div>

            </div>

        </>

    );

}
