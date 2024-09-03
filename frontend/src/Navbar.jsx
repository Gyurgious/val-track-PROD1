
import React from "react";
import "./Navbar.css"
import {NavLink} from "react-router-dom";


export const Navbar = () => {

    return (
        <nav>
            <div className="homeIcon">
                <NavLink to="/" className="title">
                    VLR.GG
                </NavLink>
            </div>
           
            <ul>
                <li>
                    <NavLink to="/overview" activeClassName="active">Overview</NavLink>
                </li>

                <li>
                    <NavLink to="/Performance">Performance</NavLink>
                </li>
                <li>
                    <NavLink to="/Maps"> Maps</NavLink>
                </li>
            </ul>
        </nav>

    );
}


export default Navbar;