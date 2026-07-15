export default function Topbar(){

    return(

        <div
            style={{
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center",
                marginBottom:30
            }}
        >

            <div>

                <h1 style={{margin:0}}>
                    Projeto Olho Vivo
                </h1>

                <span style={{color:"#94a3b8"}}>

                    Centro de Inteligência Operacional

                </span>

            </div>

            <div
                style={{
                    display:"flex",
                    gap:15
                }}
            >

                <div
                    style={{
                        background:"#14532d",
                        padding:"10px 20px",
                        borderRadius:10
                    }}
                >

                    🟢 IA ONLINE

                </div>

                <div
                    style={{
                        background:"#1e293b",
                        padding:"10px 20px",
                        borderRadius:10
                    }}
                >

                    YOLO11

                </div>

            </div>

        </div>

    )

}
