import {useEffect,useState} from "react";
import axios from "axios";

const API=`${window.location.protocol}//${window.location.hostname}:8000`;

export default function LiveEvents(){

    const[events,setEvents]=useState([]);

    async function load(){

        const r=await axios.get(`${API}/events?limit=10`);

        setEvents(r.data);

    }

    useEffect(()=>{

        load();

        const t=setInterval(load,2000);

        return()=>clearInterval(t);

    },[]);

    return(

        <table>

            <thead>

                <tr>

                    <th>ID</th>

                    <th>Evento</th>

                    <th>Track</th>

                    <th>Filial</th>

                    <th>Câmera</th>

                </tr>

            </thead>

            <tbody>

                {events.map(e=>(

                    <tr key={e.id}>

                        <td>{e.id}</td>

                        <td>{e.event_type}</td>

                        <td>{e.track_id}</td>

                        <td>{e.filial_id}</td>

                        <td>{e.camera_id}</td>

                    </tr>

                ))}

            </tbody>

        </table>

    );

}
