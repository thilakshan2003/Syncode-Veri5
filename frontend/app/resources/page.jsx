import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import ResourceCard from '@/components/ResourceCard';
import { ResourceGridSkeleton } from '@/components/ResourceSkeleton';
import Link from 'next/link';
import { Search, Bell, User } from 'lucide-react';

const categories = [
    { name: "All Resources", value: "" },
    { name: "Safe Sex", value: "SAFE_SEX" },
    { name: "Consent", value: "CONSENT" },
    { name: "Mental Health", value: "MENTAL_HEALTH" },
    { name: "Sexual Wellbeing", value: "SEXUAL_WELLBEING" }
];

async function getResources(category) {
    try {
        const query = category ? `?category=${encodeURIComponent(category)}` : '';
        // Use backend URL for server-side fetch
        const baseUrl = 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/resources${query}`, { 
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            console.error('Response not OK:', response.status, response.statusText);
            throw new Error(`Failed to fetch resources: ${response.status}`);
        }
        
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error("Error fetching resources:", error);
        return [];
    }
}

export default async function ResourcesPage({ searchParams }) {
    // Await searchParams in Next.js 15
    const params = await searchParams;
    const activeCategory = params.category || "";

    return (
        <main className="min-h-screen bg-background pb-20 transition-colors duration-300">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <div className="sticky top-24 space-y-2">
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4 px-5">Categories</h3>
                            {categories.map((cat) => (
                                <Link
                                    key={cat.value}
                                    href={cat.value ? `/resources?category=${cat.value}` : '/resources'}
                                    className={`block w-full text-left px-5 py-3 rounded-full text-sm font-bold transition-all
                                ${activeCategory === cat.value
                                            ? 'bg-veri5-teal text-white shadow-md'
                                            : 'bg-card text-muted-foreground hover:bg-muted'}`}
                                >
                                    {cat.name}
                                </Link>
                            ))}

                            <div className="mt-8 bg-card border border-border rounded-3xl p-6 text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-veri5-teal/10 rounded-full blur-2xl"></div>
                                <div className="relative z-10">
                                    <h4 className="font-bold mb-2 text-foreground">Need Help?</h4>
                                    <p className="text-xs text-muted-foreground mb-4 opacity-90">Access professional counseling and support services.</p>
                                    <Link href="/consultation" className="block w-full py-2 bg-veri5-teal text-white rounded-xl text-xs font-bold hover:bg-teal-600 transition-colors">Book Consultation</Link>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-grow">
                        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-extrabold text-foreground">Veri5 Resource Library</h1>
                                <p className="text-muted-foreground text-sm mt-1">Professional healthcare guides for university students.</p>
                            </div>
                            <div className="flex items-center gap-4 text-muted-foreground">
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                                    <input
                                        type="text"
                                        placeholder="Search guides..."
                                        className="pl-10 pr-4 py-2 bg-card border border-border rounded-full text-xs focus:outline-none focus:border-veri5-teal w-48 md:w-64"
                                    />
                                </div>
                            </div>
                        </div>

                        <Suspense fallback={<ResourceGridSkeleton />}>
                            <ResourceGrid category={activeCategory} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </main>
    );
}

async function ResourceGrid({ category }) {
    const resources = await getResources(category);

    if (resources.length === 0) {
        return (
            <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
                <p className="text-muted-foreground font-medium">No resources found for this category.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res) => (
                <ResourceCard key={res.id} {...res} />
            ))}
        </div>
    );
}