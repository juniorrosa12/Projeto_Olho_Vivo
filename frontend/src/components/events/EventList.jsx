export default function EventList({events}){

    return(

        <div
            style={{
                background:"#1e293b",
                borderRadius:18,
                padding:20,
                height:"100%"
            }}
        >

            <h2 style={{marginBottom:20}}>
                Últimos Eventos
            </h2>

            {

                events.map(event=>(

                    <div
                        key={event.id}
                        style={{
                            display:"flex",
                            justifyContent:"space-between",
                            padding:"12px 0",
                            borderBottom:"1px solid #334155"
                        }}
                    >

                        <div>

                            <strong>

                                {event.event_type}

                            </strong>

                            <br/>

                            #{event.track_id}

                        </div>

                        <div>

                            {new Date(event.event_time).toLocaleTimeString()}

                        </div>

                    </div>

                ))

            }

        </div>

    )

}
