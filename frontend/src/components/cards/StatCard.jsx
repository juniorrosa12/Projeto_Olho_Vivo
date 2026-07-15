export default function StatCard({

    title,

    value,

    color="#2563eb"

}){

    return(

        <div
            style={{

                background:"#1e293b",

                borderRadius:18,

                padding:24,

                borderTop:`5px solid ${color}`,

                minHeight:140

            }}
        >

            <div
                style={{
                    color:"#94a3b8",
                    fontSize:18
                }}
            >

                {title}

            </div>

            <div
                style={{

                    fontSize:42,

                    marginTop:20,

                    fontWeight:"bold"

                }}
            >

                {value}

            </div>

        </div>

    )

}
