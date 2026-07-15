import { NavLink } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import VideocamIcon from "@mui/icons-material/Videocam";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import EventIcon from "@mui/icons-material/Event";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import PsychologyIcon from "@mui/icons-material/Psychology";
import StoreIcon from "@mui/icons-material/Store";
import SettingsIcon from "@mui/icons-material/Settings";

const items = [
    {
        icon:<DashboardIcon/>,
        text:"Dashboard",
        url:"/dashboard"
    },
    {
        icon:<VideocamIcon/>,
        text:"Detecção",
        url:"/detection"
    },
    {
        icon:<LocalFireDepartmentIcon/>,
        text:"Heatmap",
        url:"/heatmap"
    },
    {
        icon:<EventIcon/>,
        text:"Eventos",
        url:"/events"
    },
    {
        icon:<TaskAltIcon/>,
        text:"Validação",
        url:"/validation"
    },
    {
        icon:<PsychologyIcon/>,
        text:"IA",
        url:"/ai"
    },
    {
        icon:<StoreIcon/>,
        text:"Filiais",
        url:"/branches"
    },
    {
        icon:<SettingsIcon/>,
        text:"Config",
        url:"/settings"
    }
];

export default function Sidebar(){

    return(

        <div
            style={{
                width:260,
                background:"#111827",
                display:"flex",
                flexDirection:"column",
                padding:24,
                borderRight:"1px solid #1f2937"
            }}
        >

            <h2 style={{marginBottom:10}}>
                👁 Olho Vivo
            </h2>

            <span
                style={{
                    color:"#22c55e",
                    marginBottom:35,
                    fontSize:14
                }}
            >
                IA ONLINE
            </span>

            {
                items.map(item=>(

                    <NavLink
                        key={item.url}
                        to={item.url}
                        style={({isActive})=>({

                            display:"flex",
                            alignItems:"center",
                            gap:12,

                            padding:14,

                            marginBottom:8,

                            borderRadius:12,

                            background:isActive ? "#2563eb":"transparent",

                            color:"#FFF",

                            textDecoration:"none"

                        })}
                    >

                        {item.icon}

                        {item.text}

                    </NavLink>

                ))
            }

        </div>

    )

}
