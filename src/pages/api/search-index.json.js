import { buildSearchIndex } from "@/lib/search";

export const prerender = false;

export const GET = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const lang = url.searchParams.get("lang") || "id";
        const index = await buildSearchIndex(lang);
        return new Response(JSON.stringify(index), {
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "public, max-age=300",
            },
        });
    } catch {
        return new Response(JSON.stringify([]), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};