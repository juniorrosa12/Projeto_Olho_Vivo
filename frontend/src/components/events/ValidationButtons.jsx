import {approve,reject} from "../../api/validation";

export default function ValidationButtons({id,onReload}){

    return(

        <div style={{display:"flex",gap:10}}>

            <button
                onClick={async()=>{

                    await approve(id);

                    onReload();

                }}
            >
                👍 Aprovar
            </button>

            <button
                onClick={async()=>{

                    await reject(id);

                    onReload();

                }}
            >
                👎 Rejeitar
            </button>

        </div>

    )

}
