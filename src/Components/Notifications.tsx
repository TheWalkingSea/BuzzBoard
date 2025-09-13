import './Notifications.css';


const ICON_MAPPING = {
    email: 'images/envelope-regular-full.svg'
}

type Notification = {
  type: keyof typeof ICON_MAPPING;
  name: string;
  description: string;
  time: number; // milliseconds since epoch
};


export default function Notifications() {

    const notifications: Notification[] = [
        {
            type: "email",
            name: "Dr. Super Smart",
            description: "Research Opportunities hehe",
            time: 1758132269000
        },
        {
            type: "email",
            name: "Dr. Super Smart",
            description: "Research Opportunities hehe",
            time: 1758132269000
        },
        {
            type: "email",
            name: "Dr. Super Smart",
            description: "Research Opportunities hehe",
            time: 1758132269000
        },
        {
            type: "email",
            name: "Dr. Super Smart",
            description: "Research Opportunities hehe",
            time: 1758132269000
        },
        {
            type: "email",
            name: "Dr. Super Smart",
            description: "Research Opportunities hehe",
            time: 1758132269000
        },
    ]

    return (
        <section>
            <div className="containerHeading">
                <img src="images/bell-solid-full.svg" alt="Bell Icon" width="40"/>
                <h2 className="heading">Notifications</h2>
            </div>

            <div className="notificationContainer">
                {notifications.map((notification) => (
                    <>
                        <div className="notification">
                            <img src={ICON_MAPPING[notification.type]} alt={notification.type} width="40" />
                            <div className="name">{notification.name}</div>
                        </div>
                        <div className="notificationInfo">
                            <div>{notification.description}</div>
                            <div>{notification.time}</div>
                        </div>
                    </>
                ))}
            </div>
        </section>
    )
}