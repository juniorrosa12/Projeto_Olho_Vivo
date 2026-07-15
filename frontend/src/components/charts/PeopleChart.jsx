import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function PeopleChart(){

    const data=[
        {h:"08",v:4},
        {h:"09",v:9},
        {h:"10",v:13},
        {h:"11",v:16},
        {h:"12",v:20},
        {h:"13",v:17},
        {h:"14",v:25},
        {h:"15",v:22},
        {h:"16",v:18},
        {h:"17",v:15}
    ];

    return(

        <div
            style={{
                background:"#1e293b",
                padding:20,
                borderRadius:18
            }}
        >

            <h2 style={{marginBottom:20}}>
                Fluxo de Pessoas
            </h2>

            <ResponsiveContainer
                width="100%"
                height={300}
            >

                <LineChart data={data}>

                    <CartesianGrid stroke="#334155"/>

                    <XAxis dataKey="h"/>

                    <YAxis/>

                    <Tooltip/>

                    <Line
                        type="monotone"
                        dataKey="v"
                        stroke="#3b82f6"
                        strokeWidth={3}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    );

}
