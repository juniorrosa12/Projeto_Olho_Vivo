import Sidebar from "../components/layout/Sidebar";

export default function MainLayout({children}){

    return(

        <div
            style={{
                display:"flex",
                height:"100vh",
                background:"#0f172a"
            }}
        >

            <Sidebar/>

            <div
                style={{
                    flex:1,
                    overflow:"auto",
                    padding:30
                }}
            >

                {children}

            </div>

        </div>

    )

}
