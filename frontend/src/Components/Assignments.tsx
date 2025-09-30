import { useContext } from 'react';
import { get_relative_timestamp } from '../utils/Dates';
import { useTimer } from '../utils/Hooks';
import ServerContext from '../utils/ServerContext';
import './Assignments.css';

type Assignment = {
    name: string,
    due_at: number,
    is_quiz_assignment: boolean;
    course_name: string
};

function fetchAssignmentData(serverURI: string): Promise<Array<Assignment>> {
    return fetch(serverURI + '/getAssignments')
    .then((response) => {
        if (response.status != 200) {
            return new Promise<Array<Assignment>>((resolve) => {
                setTimeout(() => {
                    fetchAssignmentData(serverURI).then((resolve));
                })
            })
        }
        return response.json();
    })
}


export default function Assignments() {

    // const [assignments, setAssignments] = useState();

    const serverURI = useContext(ServerContext);

    const assignments = useTimer([], () => fetchAssignmentData(serverURI), 5*120);

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
                            <div className='descriptionColor'>{assignment.course_name}</div>
                            <div className='descriptionColor'>{get_relative_timestamp(assignment.due_at * 1000)}</div>
                        </div>
                    ))}
                </div>
        </section>
    )
}