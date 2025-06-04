/* Server Component – NO “use client” qui */
import StickyCards from "../../components/StickyCards/StickyCards";

export const metadata = { title: "StickyCards Demo" };

export default function StickyDemoPage() {
    /* puoi passare qui un array personalizzato se vuoi */
    return <StickyCards />;          // usa fallbackData interno
}
