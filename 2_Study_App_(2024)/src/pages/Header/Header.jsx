import './Header.scss'
import Geolocation from './Geolocation'
export default function Header() {

    return (
        <header id='headerTag'>
            <h1>"Про Л/р №1 по ОВР"</h1>
            <Geolocation />
        </header>
    )
}