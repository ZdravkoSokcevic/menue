import { useEffect } from "react"
import { toast } from "react-toastify"


const Home = () => {
	useEffect(() => {
		console.log('Home page:' + Date.now());
		toast('Home page');
	}, [])
	return (
	    <div className="container">
	        <div className="row justify-content-center">
	            <div className="col-md-8">
	                <div className="card">
	                    <div className="card-header">Example Component Zdravko sokcevic</div>

	                    <div className="card-body">I'm an example component!</div>
	                </div>
	            </div>
	        </div>
	    </div>
	)
}


export default Home