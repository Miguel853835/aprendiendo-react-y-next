import { useState } from 'react'
import './App.css'
import { TwitterFollowCard } from './TwitterFollowCard.jsx'
const users = [
    {
        name: "Miguel Ángel Durán",
        userName: "midudev",
        isFollowing: true
    },
    {
        name: "Pablo H.",
        userName: "pheralb",
        isFollowing: false
    },
    {
        name: "Paco Hdez",
        userName: "PacoHdezs",
        isFollowing: true
    },
     {
        name: "Tomas",
        userName: "TMChein",
        isFollowing: false
    }
]   
export function App(){
    /* const [isFollowing, setIsFollowing] = useState(false)
    console.log("render with isFollowing:", isFollowing)
    const [name, setName] = useState("midudev") // Crea una variable de estado llamada name y una función setName para actualizarla y que React repinte el componente.
    console.log("render with name:", name) */
    return(
        <section className="App">
            {
                users.map(user => {
                    const {userName, name, isFollowing } = user
                    return (
                        <TwitterFollowCard
                        key = {userName}
                        userName = {userName}
                        initialIsFollowing = {isFollowing}
                        >
                        {name}
                        </TwitterFollowCard>
                    )
                })
            }
            {/* <TwitterFollowCard 
                initialIsFollowing={isFollowing}
                userName={name} 
                //name="Miguel Ángel Durán"

            >
                Miguel Ángel Durán
            </TwitterFollowCard>

            <button onClick = {() => setIsFollowing(!isFollowing)}>
                Cambiar estado de App
            </button>
            
            <button onClick={() => setName("pedromichel")}>
                Cambiar nombre
            </button> */}
            
        </section>
    )
}


//const format = (userName) => `@${userName}` // Se puede hacer la función dentro del componente, pero no es lo ideal porque se volverá a crear cada vez que se renderice el componente. Lo ideal es crear la función fuera del componente para que solo se cree una vez y se reutilice en cada renderizado.
//const formattedUserName = (<span>@midudev</span>) // Se puede crear la variable dentro del componente, pero no es lo ideal porque se volverá a crear cada vez que se renderice el componente. Lo ideal es crear la variable fuera del componente para que solo se cree una vez y se reutilice en cada renderizado.
//const midudev = {isFollowing: true, userName: "midudev"} // Se puede crear el objeto dentro del componente, pero no es lo ideal porque se volverá a crear cada vez que se renderice el componente. Lo ideal es crear el objeto fuera del componente para que solo se cree una vez y se reutilice en cada renderizado.

// Dentro del TwitterFollowCard
//{...midudev}  el rest operator pasa las propiedades del objeto como props al componente, NO recomendable porque hace que el componente sea menos explícito y más difícil de entender. Es mejor pasar las props de forma explícita para que sea más claro qué props se están pasando al componente.
//formattedUserName={format("midudev")} /Pasa a la prop formattedUserName el resultado de ejecutar la función format con el texto "midudev"/ 
