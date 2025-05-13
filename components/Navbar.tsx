import React, { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
    const [isVisible, setIsVisible] = useState(true);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/">
                                <img src="/images/logos/eterestudio-01.svg" alt="Etere Studio Logo" className="h-10" />
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link href="/" className="text-white hover:bg-gray-700 transition-colors duration-300 px-3 py-2 rounded">
                                Home
                            </Link>
                            <Link href="/projects" className="text-white hover:bg-gray-700 transition-colors duration-300 px-3 py-2 rounded">
                                Projects
                            </Link>
                            <Link href="/about" className="text-white hover:bg-gray-700 transition-colors duration-300 px-3 py-2 rounded">
                                About
                            </Link>
                            <Link href="/contact" className="text-white hover:bg-gray-700 transition-colors duration-300 px-3 py-2 rounded">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 