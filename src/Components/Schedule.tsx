import './Schedule.css'

export default function Schedule() {

    const events = [
        {
            name: "CS1332 - Introduction to General Psychology",
            location: "Klaus 1332",
            time: 1758132269000
        },
        {
            name: "CS1332 - Introduction to General Psychology",
            location: "Klaus 1332",
            time: 1758132269000
        },
        {
            name: "CS1332 - Introduction to General Psychology",
            location: "Klaus 1332",
            time: 1758132269000
        },
        {
            name: "CS1332 - Introduction to General Psychology",
            location: "Klaus 1332",
            time: 1758132269000
        },
        {
            name: "CS1332 - Introduction to General Psychology",
            location: "Klaus 1332",
            time: 1758132269000
        }
    ]

    return (
        <section className="scheduleContainer">
            <div className="containerHeading">
                <img src="images/calendar-regular-full.svg" alt="Calendar" width="40"/>
                <h2 className="heading">Today's Schedule</h2>
            </div>

            <div className="eventsContainer">
                {events.map((event) => {
                    const dt = new Date(event.time);
                    const time = `${dt.getHours() % 12}:${dt.getMinutes().toString().padStart(2, '0')}`;
                    const meridiem = dt.getHours() >= 12 ? 'PM' : 'AM';
                    return <div className="event" key={event.name}>
                        <div className="timeContainer">
                            <time dateTime={`${time} ${meridiem}`}>
                                <b>{time}</b> 
                                <br/>
                                <span>{meridiem}</span>
                            </time>
                        </div>
                        <div className="eventInformation">
                            <div>{event.name}</div>
                            <div>{event.location}</div>
                        </div>
                    </div>
                    }    
                )}
            </div>
        </section>
    )
}