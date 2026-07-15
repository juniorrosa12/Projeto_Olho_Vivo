import {useEffect,useState} from "react";
import axios from "axios";

const API=`${window.location.protocol}//${window.location.hostname}:8000`;

export default function Validation(){

    const[event,setEvent]=useState(null);

    async function load(){

        const r=await axios.get(`${API}/validation/next`);

        setEvent(r.data);

    }

    async function approve(){

        await axios.post(`${API}/validation/${event.id}/approve`);

        load();

    }

    async function reject(){

        await axios.post(`${API}/validation/${event.id}/reject`);

        load();

    }

    useEffect(()=>{

        load();

    },[]);

    if(!event){

        return <h2>Nenhum evento pendente.</h2>;

    }

    return(

        <div style={{padding:20}}>

            <h1>Central de Validação</h1>

            <h2>{event.event_type}</h2>

            <p>Filial: {event.filial_id}</p>

            <p>Câmera: {event.camera_id}</p>

            <p>Track: {event.track_id}</p>

            <p>Confiança: {(event.confidence*100).toFixed(1)}%</p>

            <img

                src={`${API}${event.snapshot}?t=${Date.now()}`}

                width="800"

            />

            <br/><br/>

            <button onClick={approve}>

                👍 Aprovar

            </button>

            <button

                onClick={reject}

                style={{marginLeft:20}}

            >

                👎 Rejeitar

            </button>

        </div>

    );

}
