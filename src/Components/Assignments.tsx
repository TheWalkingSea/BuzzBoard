import './Assignments.css';


export default function Assignments() {

    // const [assignments, setAssignments] = useState();

    const assignments = [
        {
            name: "RC20 - Hashmaps",
            course: "CS1332",
            due: 1758132269000
        },
        {
            name: "RC20 - Hashmaps",
            course: "CS1332",
            due: 1758132269000
        },
        {
            name: "RC20 - Hashmaps",
            course: "CS1332",
            due: 1758132269000
        },
        {
            name: "RC20 - Hashmaps",
            course: "CS1332",
            due: 1758132269000
        }
    ]

    return (
        <section className="assignments">
            <div className="containerHeading">
                <img src="images/list-check-solid-full.svg" alt="Assignments List" width="40"/>
                <h2 className="heading">Assignments</h2>
            </div>
                <div className="assignmentContainer">
                    {assignments.map((assignment) => (
                        <div className="assignment" key={assignment.name}>
                            <div className="name">{assignment.name}</div>
                            <div>{assignment.course}</div>
                            <div>{assignment.due}</div>
                        </div>
                    ))}
                </div>
        </section>
    )
}