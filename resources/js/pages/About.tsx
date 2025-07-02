import { useEffect } from "react";
import { toast } from "react-toastify";

const About = ({ nesto }: any) => {

	useEffect(() => {
		toast('About page');
	},[1]);

	return (
		<>
			<p>{nesto}</p>
		</>

	)
}


export default About;