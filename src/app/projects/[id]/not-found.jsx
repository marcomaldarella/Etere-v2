import Link from 'next/link';
import './not-found.css';

export default function NotFound() {
    return (
        <div className="not-found">
            <h2>Project Not Found</h2>
            <p>Could not find the requested project.</p>
            <Link href="/projects">Return to Projects</Link>
        </div>
    );
} 