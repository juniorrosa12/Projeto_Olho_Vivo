export default function LivePreview(){

    const img=`${window.location.protocol}//${window.location.hostname}:8000/static/output/latest.jpg?t=${Date.now()}`;

    return(

        <div
            style={{
                background:"#1e293b",
                borderRadius:18,
                padding:20,
                height:"100%"
            }}
        >

            <h2 style={{marginBottom:15}}>
                Detecção IA
            </h2>

            <img
                src={img}
                style={{
                    width:"100%",
                    borderRadius:12
                }}
            />

        </div>

    )

}
