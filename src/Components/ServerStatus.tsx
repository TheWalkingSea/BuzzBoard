import './ServerStatus.css'

type Status = "offline" | "online" | "error";

type serverItem = {
    name: string,
    status: Status
}

export default function ServerStatus() {

    const serverStatus: serverItem[] = [
        {
            name: "Smile dsdadaProjss",
            status: 'offline'
        },{
            name: "PSdsadsasdadsadadasasdsadasdWR",
            status: 'online'
        },{
            name: "PSWC",
            status: 'error'
        },{
            name: "Datadsadabase",
            status: 'online'
        },{
            name: "Database",
            status: 'online'
        },{
            name: "Database",
            status: 'online'
        },{
            name: "Database",
            status: 'online'
        },{
            name: "Database",
            status: 'online'
        },{
            name: "Database",
            status: 'online'
        }
    ]

    return (
        <section className="serverStatus">
            <div className="containerHeading">
                <img src="images/server-solid-full.svg" alt="Server icon" width="40"/>
                <h2 className="heading">Server Status</h2>
            </div>

            <div className="statusContainer">
                {serverStatus.map((item) => (
                    <div className="statusItem">
                        <div className={`statusIcon ${item.status}`}></div>
                        <span>{item.name}</span>
                    </div>
                ))}
            </div>
        </section>
    )
}