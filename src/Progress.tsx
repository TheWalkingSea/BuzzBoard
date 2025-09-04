import './Progress.css'

export default function Progress () {

    return (
        <>
        <section className="progress">
            <div className="containerHeading">
                <img src="images/spinner-solid-full.svg" alt="Spinner" width="40"/>
                <h2 className="heading">Semester Progress</h2>
            </div>

            <div className="progress-circle">
                <div className="inner-circle"></div>
                <span className="percentage">70%</span>
            </div>
        </section>
        
        </>
    )
}