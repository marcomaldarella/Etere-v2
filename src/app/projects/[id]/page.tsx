import ProjectClient from "./project-client"
import content from "../../../data/content.json"

export const dynamicParams = false

export async function generateStaticParams() {
    return content.projects.map((project) => ({
        id: project.id,
    }))
}

export default function Page({ params }) {
    const project = content.projects.find((p) => p.id === params.id)

    if (!project) {
        return null
    }

    return <ProjectClient project={project} />
}