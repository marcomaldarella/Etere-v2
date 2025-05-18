"use client"

import Link from "next/link"

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link href="/" className="navbar-logo">
                    Portfolio
                </Link>
                <ul className="navbar-menu">
                    <li className="navbar-item">
                        <Link href="/" className="navbar-link">
                            Home
                        </Link>
                    </li>
                    <li className="navbar-item">
                        <Link href="/projects" className="navbar-link">
                            Projects
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
